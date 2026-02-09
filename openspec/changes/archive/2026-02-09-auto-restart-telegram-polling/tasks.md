## 1. Request Timeout Guard

- [x] 1.1 Add a per-request timeout wrapper for Telegram `getUpdates`
- [x] 1.2 Ensure timeout failures are treated as retryable
- [x] 1.3 Make timeout wrapper abort-aware so workflow shutdown is responsive

## 2. Retry / Autorestart Loop

- [x] 2.1 Add bounded exponential backoff with jitter for retryable failures
- [x] 2.2 Reset backoff after successful polls
- [x] 2.3 Ensure the polling loop never exits on retryable errors (keeps running)
- [x] 2.4 Ensure the polling loop exits promptly on shutdown

## 3. Telegram Error Policy

- [x] 3.1 Implement error classification for 401/403 (fatal) vs 409/429/5xx/transport (retryable)
- [x] 3.2 For 429, respect `retry_after` when available
- [x] 3.3 Avoid tight retry loops on `ok=false` responses (apply delay/backoff)

## 4. Observability

- [x] 4.1 Add structured, rate-limited logging for retries (status/attempt/delay)
- [x] 4.2 Log persistent 409 conflict warnings with remediation hints (multiple consumers/webhook)

## 5. Tests

- [x] 5.1 Add deterministic unit tests: transient error -> retry -> recovery
- [x] 5.2 Add deterministic unit tests: request hang/timeout -> retry continues
- [x] 5.3 Add deterministic unit tests: fatal auth error (401/403) stops polling
- [x] 5.4 Add deterministic unit tests: 409 while polling is retried (not fatal)
