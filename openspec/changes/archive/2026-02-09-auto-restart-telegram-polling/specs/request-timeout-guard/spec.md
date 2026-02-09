## ADDED Requirements

### Requirement: Per-request maximum duration

Each `getUpdates` request MUST have a maximum duration to prevent an indefinite hang.

#### Scenario: Request exceeds the maximum duration

- **WHEN** a `getUpdates` request exceeds the maximum allowed duration
- **THEN** the request MUST be treated as failed and the polling loop MUST proceed to a retry

### Requirement: Timeout is retryable

A request timeout MUST be treated as a retryable failure.

#### Scenario: Timeout occurs during long polling

- **WHEN** a request timeout occurs
- **THEN** the node MUST retry after a backoff delay
