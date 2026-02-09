## ADDED Requirements

### Requirement: Deterministic unit tests for polling behavior

The project MUST provide deterministic unit tests for the Telegram polling trigger behavior without contacting the Telegram network.

#### Scenario: Poll returns no updates

- **WHEN** the trigger performs a polling iteration and the Telegram client returns an empty update list
- **THEN** the trigger MUST not emit any items

#### Scenario: Poll returns updates

- **WHEN** the trigger performs a polling iteration and the Telegram client returns one or more updates
- **THEN** the trigger MUST emit exactly one item per update

### Requirement: Offset advancement is correct

The trigger MUST advance the update offset to `last_update_id + 1` after processing a batch of updates.

#### Scenario: Batch contains multiple updates

- **WHEN** the trigger receives a batch of updates with a highest `update_id` of N
- **THEN** the next poll MUST request updates with an offset of N+1

### Requirement: Allowed update types are applied

The trigger MUST apply update-type selection rules when requesting updates, including correct behavior when subscribing to all default update types.

#### Scenario: User selects explicit update types

- **WHEN** configured update types are a non-empty set not containing `*`
- **THEN** the trigger MUST request updates with `allowed_updates` matching the configured types

#### Scenario: User selects all default update types

- **WHEN** configured update types contain `*`
- **THEN** the trigger MUST request updates in a way that subscribes to Telegram's default update types

### Requirement: Restrict-by chat/user filters are enforced

The trigger MUST enforce configured chat ID and user ID restrictions consistently for all supported Telegram update shapes.

#### Scenario: Update is from an excluded chat

- **WHEN** the trigger receives an update whose chat identifier is not in the configured allowed chat IDs
- **THEN** the trigger MUST not emit an item for that update

#### Scenario: Update is from an excluded user

- **WHEN** the trigger receives an update whose user identifier is not in the configured allowed user IDs
- **THEN** the trigger MUST not emit an item for that update

### Requirement: Abort/shutdown behavior is covered

The project MUST include unit tests that cover the trigger's shutdown/abort behavior, including expected abort-related errors.

#### Scenario: Poll loop is aborted

- **WHEN** the trigger is instructed to stop while a poll is pending
- **THEN** the trigger MUST stop processing without emitting additional items
