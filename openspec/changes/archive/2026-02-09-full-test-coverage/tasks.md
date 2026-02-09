## 1. Test + Coverage Tooling

- [x] 1.1 Add a coverage-enabled test command that runs the Node test runner with coverage enabled
- [x] 1.2 Configure coverage to include all scoped source modules (fail on unexecuted files)
- [x] 1.3 Configure coverage to exclude generated output (`dist/`, `dist-test/`) and other non-runtime files
- [x] 1.4 Add coverage reporting outputs suitable for local development and CI

## 2. Test Harness and Mocking

- [x] 2.1 Introduce a minimal Telegram client interface for tests (getUpdates scriptable responses)
- [x] 2.2 Add deterministic fakes for the Telegram client (records calls, returns scripted results)
- [x] 2.3 Add deterministic fakes for abort/shutdown signaling used by the poll loop
- [x] 2.4 Ensure unit tests run offline (no network access required)

## 3. Refactor for Testability (No Behavior Change)

- [x] 3.1 Extract pure helper(s) for building `getUpdates` parameters from node inputs
- [x] 3.2 Extract pure helper(s) for advancing offset (`last_update_id + 1`) and batching behavior
- [x] 3.3 Wrap Telegram API calls behind a narrow seam so tests can inject the fake client

## 4. Expand Unit Test Coverage

- [x] 4.1 Add tests for polling iteration: empty updates (emit nothing)
- [x] 4.2 Add tests for polling iteration: updates returned (emit one item per update)
- [x] 4.3 Add tests for allowed_updates selection behavior (explicit list vs `*` behavior)
- [x] 4.4 Add tests for restrict-by chat/user behavior for supported update shapes
- [x] 4.5 Add tests for abort/shutdown behavior (stop without emitting more items)

## 5. Enforce 100% Coverage Gate

- [x] 5.1 Verify 100% statements/branches/functions/lines for scoped source modules
- [x] 5.2 Add a regression test ensuring unimported scoped modules fail coverage (all-files mode works)
- [x] 5.3 Update documentation (README) with the new test/coverage commands and scope rules
