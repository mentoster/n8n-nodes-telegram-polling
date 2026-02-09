## ADDED Requirements

### Requirement: Log retries with context

Retries MUST be logged with enough context to diagnose the underlying condition.

#### Scenario: Retry after a failure

- **WHEN** a polling attempt fails and a retry is scheduled
- **THEN** the node MUST log the failure category and the next retry delay

### Requirement: Avoid log spam

Logging MUST avoid excessive noise during persistent failure states.

#### Scenario: Persistent retry streak

- **WHEN** the node is retrying repeatedly for an extended period
- **THEN** the node MUST rate-limit or coalesce logs to avoid spamming
