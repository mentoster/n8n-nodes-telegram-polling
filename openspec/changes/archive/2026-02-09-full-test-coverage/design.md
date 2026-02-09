## Context

This repository is an n8n community node package that implements a Telegram trigger using Bot API long polling (`getUpdates`). The code is written in TypeScript and compiled to `dist/` for publishing. A minimal unit test suite exists today (focused on helper logic), but it does not cover all runtime-relevant modules and does not enforce coverage thresholds.

The goal of this change is to make the package safe to refactor by (a) expanding unit tests to cover all meaningful branches and error handling paths, and (b) adding a strict coverage gate (100%) for the source modules.

Key constraints:

- Tests must run offline and deterministically (no real Telegram calls).
- Coverage must apply to source modules, not generated output (`dist/`).
- The repository currently compiles tests via a separate TS config to `dist-test/` and runs Node's test runner on the compiled output.

## Goals / Non-Goals

**Goals:**

- Enforce 100% coverage (statements/branches/functions/lines) for the package's TypeScript source modules that are part of the runtime node package.
- Add unit tests that cover:
  - update type filtering and chat/user restriction logic
  - polling/offset behavior and “no updates” behavior
  - error handling paths that are expected in production (e.g., abort/shutdown conditions)
- Keep the production behavior unchanged; refactors are allowed only to improve testability.

**Non-Goals:**

- Integration tests that talk to Telegram or require an n8n instance.
- Enforcing coverage for generated files (`dist/`, `dist-test/`) or external dependencies.
- Adding new product features beyond testability and coverage enforcement.

## Decisions

1. Coverage engine and thresholds

- Use a coverage tool that can enforce thresholds and produce reports for compiled tests while attributing results back to TypeScript sources via source maps.
- Coverage gate requirements:
  - 100% statements, branches, functions, and lines.
  - Include uncovered files in the calculation ("all files" mode) so dead/unexecuted modules fail the gate.
- Scope the coverage calculation to runtime-relevant source modules (primarily `nodes/**/*.ts` and any runtime credential implementations). Generated output is excluded.

Alternatives considered:

- Node's built-in test coverage: simple, but threshold enforcement and include/exclude behavior can be less flexible depending on Node version and desired reporting.
- nyc/istanbul: powerful but heavier; adds complexity for TypeScript/source-map plumbing.

2. Testability via seams (minimal refactor)

- Prefer adding small, explicit seams rather than broad refactors:
  - Extract pure functions from the trigger node where possible (e.g., mapping inputs to Telegram `getUpdates` params; offset advancement rules; update filtering decisions).
  - Wrap Telegram API calls behind a narrow interface so tests can inject a fake client.
- Keep the n8n node class focused on wiring (reading parameters, emitting items) and delegate logic to testable helpers.

Alternatives considered:

- Attempt to instantiate the full n8n node runtime for tests: higher fidelity but significantly more brittle and slower; tends to require substantial mocking of n8n internals.

3. Deterministic mocking strategy

- Use simple in-process fakes (not network stubs):
  - Fake Telegram client that records `getUpdates` calls and returns scripted responses.
  - Fake abort/shutdown signal to exercise abort-on-close behavior.
- Avoid time-based flakiness by removing real timers from unit tests; when timers are unavoidable, use controllable clocks or deterministic timeout paths.

## Risks / Trade-offs

- [100% coverage strictness increases maintenance cost] → Mitigation: keep test helpers reusable; keep seams minimal and stable; document coverage scope.
- [Risk of changing production behavior during refactor] → Mitigation: specs define behavior; add tests before refactor for each path; restrict refactors to extracted helpers with identical outputs.
- [Coverage attribution mismatch (TS vs compiled JS)] → Mitigation: ensure source maps are generated for test builds and coverage tool is configured to use them; add a small “coverage sanity” test if needed.
- [Hard-to-test n8n runtime behaviors] → Mitigation: limit tests to logic units and contract-level behaviors; isolate side effects behind interfaces.

## Migration Plan

- Add coverage tooling and scripts; ensure local `npm test` and CI behavior match.
- Expand test suite to cover current modules; only then refactor for seams if required.
- Make coverage gate part of the default test command (or a dedicated `test:coverage` that is required in CI).

## Open Questions

- Final scope of "runtime-relevant modules": include/exclude `gulpfile.js` and `index.js` from coverage (default: exclude non-TS tooling and root entry shim).
- Whether to enforce coverage on `credentials/` immediately or only once a real credential implementation exists.
