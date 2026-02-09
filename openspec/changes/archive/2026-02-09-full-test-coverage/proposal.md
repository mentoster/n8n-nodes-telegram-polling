## Why

The project currently lacks comprehensive automated verification, which makes refactors risky and allows regressions to slip in unnoticed. Enforcing 100% test coverage for the n8n Telegram polling node package provides a hard quality gate and confidence to evolve the node safely.

## What Changes

- Add a coverage-enabled test workflow that measures coverage for the package's TypeScript sources (excluding generated output) and fails when coverage is below 100%.
- Expand and restructure the unit test suite to cover all runtime-relevant modules in `nodes/` (and any runtime credential code) including success and error paths.
- Establish clear scope rules for what "coverage" applies to (source vs generated output) so the threshold is stable and meaningful.

## Capabilities

### New Capabilities

- `coverage-threshold-100`: Enforce 100% statement/branch/function/line coverage for the package's source modules in CI/local runs.
- `telegram-trigger-unit-tests`: Provide deterministic unit tests for the Telegram polling trigger behavior (poll loop, offset handling, filtering, shutdown/abort handling).
- `test-harness-and-mocking`: Provide a stable mocking strategy for Telegram API calls and n8n runtime dependencies so tests run offline and deterministically.

### Modified Capabilities

<!-- None (no existing OpenSpec capability specs in this repository). -->

## Impact

- Tooling: updates to `package.json` scripts and potentially test build config to run coverage.
- Code: may require minor refactors to improve testability (dependency injection seams) without changing behavior.
- Developer workflow: `npm test` (or an additional script) becomes a strict gate; failures must be fixed before merging/publishing.
