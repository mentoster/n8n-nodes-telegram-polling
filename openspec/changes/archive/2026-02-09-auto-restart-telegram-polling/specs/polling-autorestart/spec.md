## ADDED Requirements

### Requirement: Polling loop continues after transient failures

The polling loop MUST continue running after transient failures instead of stopping permanently.

#### Scenario: Transport error occurs

- **WHEN** a transport/network error occurs during a polling iteration
- **THEN** the node MUST retry polling after a backoff delay

#### Scenario: Telegram returns a retryable HTTP error

- **WHEN** Telegram responds with a retryable HTTP status code (for example 409, 429, or 5xx)
- **THEN** the node MUST retry polling after a backoff delay

### Requirement: Backoff is bounded and abortable

Retry delays MUST be bounded and MUST be abortable so shutdown is responsive.

#### Scenario: Workflow is deactivated during backoff

- **WHEN** the workflow is deactivated while the node is waiting to retry
- **THEN** the node MUST stop waiting and exit promptly

### Requirement: Backoff resets after successful polls

The retry backoff MUST reset after a successful poll so recovery is fast.

#### Scenario: Recovery after a retry streak

- **WHEN** a retry streak is followed by a successful poll
- **THEN** subsequent polls MUST use the normal polling cadence rather than continuing an elevated backoff
