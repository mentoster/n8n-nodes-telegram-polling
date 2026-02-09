## Context

This repository provides an n8n community Telegram trigger node that consumes Telegram Bot API updates via long polling (`getUpdates`). The current polling implementation runs an async loop in the background. If the loop encounters an unhandled error, or if a request hangs indefinitely, the trigger stops producing items until the workflow is manually disabled and re-enabled.

The change introduces a resilience strategy so the polling loop self-recovers from transient failures and avoids permanent stalls.

Constraints:

- Must remain compatible with n8n runtime and its `helpers.request` behavior.
- Must not contact the network in unit tests.
- Shutdown must remain clean (abort + exit without leaving unhandled promise rejections).

## Goals / Non-Goals

**Goals:**

- The polling loop continues running across transient Telegram/transport failures without requiring manual workflow toggling.
- A single `getUpdates` call cannot hang forever; it is bounded by a client-side maximum duration.
- Retry behavior is deterministic and testable (injectable backoff/sleep).
- Observability: retries and recovery are visible in logs so users can diagnose conditions like 409 conflicts.

**Non-Goals:**

- Full integration testing against Telegram or a running n8n instance.
- Guaranteeing delivery if Telegram itself is unavailable for extended periods.
- Changing the user-facing node parameters unless strictly necessary (prefer fixed internal defaults).

## Decisions

### 1) Error handling changes: retry instead of exit

Decision: treat the polling loop as long-lived and resilient.

- Replace the current fail-fast behavior (throwing on most errors) with a retry loop that catches errors, classifies them, logs, waits (abortably), then continues.
- Preserve shutdown semantics: if the workflow is stopping, exit promptly.

Alternatives considered:

- Restart the entire workflow execution from within the node: not feasible; n8n owns workflow lifecycle.
- Let n8n retry by failing the trigger execution: trigger code is not naturally restarted without re-activation.

### 2) Retry policy: bounded exponential backoff with jitter

Decision: implement a bounded exponential backoff:

- Base delay (e.g., 250ms), multiplier (e.g., x2), max delay (e.g., 30s), plus small jitter.
- Reset backoff after a successful poll (ok response, regardless of whether updates were returned).
- Backoff waits MUST be abortable (stop quickly when workflow deactivates).

Alternatives considered:

- Fixed delay: simpler but can overload Telegram during outages.
- Unbounded exponential: can lead to extremely long downtime.

### 3) Request timeout guard: cap request duration

Decision: enforce a maximum request duration per `getUpdates` call.

- Implement `withTimeout(signal, ms, fn)` that races the request against a timer and aborts (or fails) when exceeded.
- The max duration should be `telegramTimeoutSeconds + safetyMarginSeconds` (e.g., +10s), with a hard upper bound.
- Treat request-timeout as retryable (it is indistinguishable from network stall).

Alternatives considered:

- Rely solely on Telegram server-side long-poll timeout: does not protect against client/network hangs.

### 4) Telegram error policy: classify retryable vs fatal

Decision: classify errors based on HTTP status (when present) and error shape.

- Retryable:
  - 409 Conflict (common when multiple consumers use same bot token) with backoff + persistent logging.
  - 429 Too Many Requests (respect `retry_after` if available; else backoff).
  - 5xx and transport errors (DNS/ECONNRESET/etc.).
- Fatal (fail fast):
  - 401/403 (bad token / unauthorized) since retrying will not help.
  - Non-HTTP unexpected errors that indicate programming bugs (rethrow after logging).

Alternatives considered:

- Retry everything: risks hiding real bugs and spamming logs.
- Fail fast on 409: matches current behavior but violates goal.

### 5) Observability: consistent, low-noise logging

Decision: log on transitions and rate-limit repeated logs.

- Log first retry of a streak and then periodically (e.g., every N attempts or when backoff hits max).
- Include structured context: status code (if any), attempt count, next delay.
- Keep logs in `debug` by default when possible, but ensure user can see persistent failure conditions.

## Risks / Trade-offs

- [Risk: infinite retry hides persistent misconfiguration] → Mitigation: classify 401/403 as fatal; log loudly on persistent 409/429.
- [Risk: adding timers introduces flakiness] → Mitigation: inject sleep/timer and test with deterministic fakes; keep safety margins.
- [Risk: retry loop becomes tight and spams Telegram] → Mitigation: bounded backoff + jitter; delay also on `ok=false` responses.
- [Risk: behavior changes subtly] → Mitigation: keep update processing logic unchanged; isolate changes to error handling and request bounding.

## Migration Plan

- Implement retry + timeout guard behind internal defaults; ship as non-breaking.
- Add unit tests for transient error recovery and shutdown behavior.
- Document expected causes (409 conflicts, webhook set) in README troubleshooting.

## Open Questions

- Should max retry backoff / max request duration be configurable via node parameters, or fixed defaults?
- Best log level and whether to use `this.logger` if available in the n8n runtime context.
