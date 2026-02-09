# nodes/

## OVERVIEW

Implementation of the Telegram long-polling trigger node and its filtering helpers.

## WHERE TO LOOK

| Task                           | Location                               | Notes                                                        |
| ------------------------------ | -------------------------------------- | ------------------------------------------------------------ |
| Polling loop + emitting events | `nodes/TelegramPollingTrigger.node.ts` | calls Telegram `getUpdates`, manages `offset`, emits updates |
| Restrict by chat/user IDs      | `nodes/telegramPollingFilters.ts`      | parses ID sets, extracts ids from different update types     |
| Icon                           | `nodes/telegram.svg`                   | referenced as `file:telegram.svg` in node description        |

## KEY FLOWS

- Polling:
  - Builds request body `{ offset, limit, timeout, allowed_updates }`.
  - `offset` updates to `last_update_id + 1` to avoid re-processing.
  - Uses `AbortController` and a `closeFunction` to stop the long-poll.
- Update filtering:
  - If `updates` contains `*`, it disables `allowed_updates` filtering.
  - Otherwise it filters to updates whose top-level key matches requested update types.
  - Optional restrictions further filter updates by extracted chat/user id.
- Shutdown edge-case:
  - Handles Telegram 409 errors during shutdown (can happen when aborting an in-flight request).

## CONVENTIONS

- Keep data emitted as raw Telegram update JSON (`this.emit([{ json: update }])` shape).
- Avoid expanding the payload with derived fields unless n8n conventions require it.
