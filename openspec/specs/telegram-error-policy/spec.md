## ADDED Requirements

### Requirement: Retryable vs fatal error classification

The node MUST classify errors into retryable vs fatal categories.

#### Scenario: Unauthorized token

- **WHEN** Telegram responds with 401 or 403
- **THEN** the node MUST treat the error as fatal and MUST stop polling

#### Scenario: Conflict while polling

- **WHEN** Telegram responds with 409 while the node is actively polling
- **THEN** the node MUST treat the error as retryable and MUST retry after a backoff delay

#### Scenario: Rate limiting

- **WHEN** Telegram responds with 429
- **THEN** the node MUST treat the error as retryable and MUST retry after a delay

#### Scenario: Server errors

- **WHEN** Telegram responds with 5xx
- **THEN** the node MUST treat the error as retryable and MUST retry after a backoff delay

### Requirement: Avoid tight retry loops

When retrying, the node MUST avoid tight retry loops that could hammer Telegram.

#### Scenario: Repeated retryable errors

- **WHEN** retryable errors occur repeatedly
- **THEN** the node MUST apply a bounded backoff strategy
