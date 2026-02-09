# credentials/

## OVERVIEW

n8n credential type definitions used by nodes in this package.

## CURRENT STATE

- Node `telegramPollingTrigger` declares it requires credentials named `telegramApi`.
- This directory currently only contains an empty dotfile `credentials/.credentials.ts`.

## EXPECTED SHAPE (n8n community node packages)

- A credential file usually looks like `credentials/TelegramApi.credentials.ts` and exports a class implementing `ICredentialType`.
- The credential `name` must match what the node references (`telegramApi`).
- It typically defines an `accessToken` field that the node reads from `this.getCredentials("telegramApi")`.

## WHERE TO LOOK

| Task                             | Location       | Notes                                                                        |
| -------------------------------- | -------------- | ---------------------------------------------------------------------------- |
| Add/fix Telegram API credentials | `credentials/` | ensure it compiles to `dist/credentials/*.js` and is included in npm tarball |
