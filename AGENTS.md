# PROJECT KNOWLEDGE BASE

## OVERVIEW

Fork of `bergi9/n8n-nodes-telegram-polling`.

Community n8n node package that adds a Telegram trigger using the Bot API `getUpdates` long polling method (useful when webhooks are not feasible).

## STRUCTURE

```
./
├── nodes/                 # n8n node implementation (trigger + helpers + icon)
├── credentials/           # n8n credential types (currently incomplete; see credentials/AGENTS.md)
├── dist/                  # build output published to npm (generated)
├── gulpfile.js            # copies node/credential icons into dist/
├── tsconfig.json          # TypeScript -> dist/ compilation settings
├── tslint.json            # TSLint ruleset (legacy, still used)
├── .eslintrc.js           # eslint-plugin-n8n-nodes-base rules for nodes/ + package.json
└── package.json           # npm + n8n metadata (n8n.nodes points to dist/*)
```

## WHERE TO LOOK

| Task                                   | Location                               | Notes                                                        |
| -------------------------------------- | -------------------------------------- | ------------------------------------------------------------ |
| Change trigger behavior / polling loop | `nodes/TelegramPollingTrigger.node.ts` | `getUpdates` loop, offset handling, abort-on-close           |
| Change chat/user restriction logic     | `nodes/telegramPollingFilters.ts`      | parses ID lists + extracts ids from different update shapes  |
| Update icon                            | `nodes/telegram.svg`                   | copied to `dist/` via gulp                                   |
| Fix/add credentials type               | `credentials/`                         | should define `telegramApi` credential type used by the node |
| Build outputs / what gets published    | `package.json`, `dist/`                | only `dist/` + `index.js` are published                      |

## CONVENTIONS

- Build/publish artifacts live in `dist/`; do not hand-edit `dist/` (always rebuild).
- TypeScript is compiled with `strict: true` to `./dist/` (CommonJS).
- Linting uses `tslint` plus `eslint-plugin-n8n-nodes-base`:
  - Node TS sources are under `nodes/**/*.ts`.
  - `package.json` is linted with the community package preset.

## ANTI-PATTERNS (THIS PROJECT)

- Editing `dist/` directly (it is generated and overwritten by `npm run build`).
- Publishing without rebuilding (publish runs `prepublishOnly`, but local manual tarballs should also be built).

## COMMANDS

```bash
# install deps
npm install

# build TypeScript + copy icons
npm run build

# lint TS + package metadata
npm run lint

# inspect npm tarball contents
npm pack --dry-run
```

## NOTES

- n8n loads the node via `package.json` -> `n8n.nodes = ["dist/nodes/TelegramPollingTrigger.node.js"]`.
- `index.js` is only a minimal package entrypoint placeholder; runtime functionality is in `dist/nodes/*`.
- Repo contains a large `package-lock.json` which dominates line-count-based "complexity" metrics.
