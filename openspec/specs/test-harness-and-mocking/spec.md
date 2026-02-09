## ADDED Requirements

### Requirement: Telegram API interactions are mocked

All unit tests MUST run without making network requests by mocking Telegram API interactions.

#### Scenario: Tests run in an offline environment

- **WHEN** unit tests are executed without network access
- **THEN** the test suite MUST pass

### Requirement: Test harness can script Telegram responses

The test harness MUST support scripting Telegram client responses (including empty results, multiple updates, and errors) to cover success and failure paths.

#### Scenario: Scripted error response

- **WHEN** the Telegram client is scripted to return an error
- **THEN** the test harness MUST be able to assert the trigger's behavior for that error path

### Requirement: n8n runtime dependencies are isolated

Unit tests MUST isolate n8n runtime dependencies so that tests do not require a running n8n instance.

#### Scenario: Execute tests in a minimal Node process

- **WHEN** the test suite is executed in a plain Node process
- **THEN** the tests MUST not depend on an n8n server process

### Requirement: No time-based flakiness

Unit tests MUST avoid time-based flakiness and MUST complete deterministically.

#### Scenario: Repeat test execution

- **WHEN** the same test suite is executed multiple times
- **THEN** the results MUST be consistent across runs
