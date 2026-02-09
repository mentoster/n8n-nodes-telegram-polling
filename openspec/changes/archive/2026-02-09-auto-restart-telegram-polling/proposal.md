## Why

The Telegram polling trigger can stop permanently after transient network/Telegram errors or a hung long-poll request, and it only recovers when the workflow is disabled/enabled. The node should be resilient and self-recovering so long-running workflows keep processing updates without manual intervention.

## What Changes

- Make the polling loop resilient to transient failures (network errors, Telegram 5xx/429, and 409 conflicts) by retrying with a bounded, abortable backoff instead of exiting.
- Add a guard to prevent a single `getUpdates` request from hanging forever by enforcing a client-side maximum duration.
- Add predictable logging/observability for retry events and hard-failure conditions.
- Add unit tests that simulate transient errors and verify the loop continues and eventually recovers.

## Capabilities

### New Capabilities

- `polling-autorestart`: Keep the polling loop alive by retrying on transient failures with abortable backoff.
- `request-timeout-guard`: Enforce a maximum duration for a single `getUpdates` request to avoid indefinite hangs.
- `telegram-error-policy`: Define which Telegram/transport errors are retryable (and how) vs. fatal.
- `retry-observability`: Emit consistent logs/metrics-like signals for retries and recovery to aid debugging.

### Modified Capabilities

<!-- None. -->

## Impact

- `nodes/TelegramPollingTrigger.node.ts`: polling loop control flow (error handling, retry, request timeout guard).
- Tests: add deterministic unit tests for the new resilience behavior.
- No breaking API changes expected for existing workflows; behavior changes are runtime resilience and logging.
