# Project Architecture Blueprint

Generated: 2026-01-19 10:55:57Z
Scope: `/home/mentoster/Documents/github/buff/n8n-nodes-telegram-polling`

## 1. Architecture Detection and Analysis
- Primary stack: Node.js + TypeScript, packaged as an n8n community node.
- Framework/platform: n8n node API (`n8n-core`, `n8n-workflow`) with Telegram API access via `typegram` types and HTTP requests.
- Build tooling: `tsc` for compilation, `gulp` for copying SVG assets.
- Runtime entry: `dist/nodes/TelegramPollingTrigger.node.js` as declared in `package.json`.

Detected architectural pattern(s):
- Plugin-style, single-module architecture focused on one n8n trigger node.
- Layering is minimal: a single node definition that handles configuration, I/O, and polling loop.

## 2. Architectural Overview
This repository implements a single n8n trigger node that polls Telegram updates via `getUpdates` and emits n8n workflow items. The architecture is intentionally compact and aligned to n8n’s node interface contracts, with configuration expressed as node properties and runtime behavior in the trigger’s `trigger()` function.

Guiding principles observed:
- Conform to n8n node APIs and metadata contracts.
- Keep the node self-contained (no external services beyond Telegram).
- Prefer polling as an alternative to webhooks when inbound connectivity is constrained.

Boundaries and enforcement:
- External boundary: Telegram HTTP API.
- Internal boundary: n8n node interface (`INodeType`, `ITriggerFunctions`).
- No formal layer separation beyond node metadata vs runtime logic.

Hybrid patterns:
- No explicit hybrid architecture; plugin node pattern with a single runtime loop.

## 3. Architecture Visualization (Textual)
High-level overview:
- n8n runtime loads this community node package.
- Node registers a trigger definition and listens for updates.
- Trigger polls Telegram API and emits update objects into workflow executions.

Component relationships:
- `TelegramPollingTrigger` depends on n8n core/workflow contracts and Telegram API.
- `gulpfile.js` supports build-time asset copy for `telegram.svg`.
- No internal submodules, services, or repositories.

Data flow:
- Poll request (`getUpdates`) -> Telegram response -> filter by update type -> emit n8n items.

## 4. Core Architectural Components
### TelegramPollingTrigger (nodes/TelegramPollingTrigger.node.ts)
Purpose and responsibility:
- Defines the n8n trigger node metadata and configuration options.
- Starts and manages a long-polling loop against Telegram API.
- Emits Telegram updates as n8n items.

Internal structure:
- `description`: metadata (display name, inputs, properties).
- `trigger()`: obtains credentials, sets polling options, loops with `getUpdates`.
- Uses `AbortController` for cleanup and cancelation.

Interaction patterns:
- Reads credentials via `getCredentials('telegramApi')`.
- Uses `this.helpers.request` to call Telegram API.
- Emits updates via `this.emit`.

Evolution patterns:
- Extend node properties to add filtering or configuration options.
- Add additional nodes under `nodes/` for new Telegram behaviors.

## 5. Architectural Layers and Dependencies
Layer model (implicit):
- Node definition layer: static metadata for the n8n UI.
- Runtime execution layer: trigger function and polling loop.

Dependency rules:
- Node runtime may depend on n8n helpers and external HTTP APIs.
- No internal dependencies beyond node file itself.

Violations/cycles:
- None observed due to single-module structure.

## 6. Data Architecture
Domain model:
- Telegram `Update` objects as received from `getUpdates`.
- n8n item payloads mirror Telegram `Update` objects as JSON.

Data access patterns:
- Direct HTTP requests with `this.helpers.request`.
- No persistence, repositories, or caching.

Validation:
- Input validation relies on n8n parameter constraints (type/minValue).
- No additional runtime validation on Telegram payloads.

## 7. Cross-Cutting Concerns Implementation
Authentication & authorization:
- Telegram API token stored in n8n credentials (`telegramApi`).
- No additional authorization logic within the node.

Error handling & resilience:
- Poll loop wraps requests in try/catch.
- Special handling for HTTP 409 during cleanup to avoid shutting down n8n.

Logging & monitoring:
- Minimal logging; a debug message on ignored 409s.
- No structured logging or telemetry.

Configuration management:
- Node parameters define `updates`, `limit`, `timeout`.
- Credentials stored in n8n credential store.

## 8. Service Communication Patterns
- Communication via HTTPS requests to Telegram `getUpdates`.
- Synchronous polling loop (long polling with `timeout`).
- No service discovery or versioned APIs within the package.

## 9. Technology-Specific Architectural Patterns
### Node.js/TypeScript Patterns
- n8n node uses metadata-driven configuration and runtime hooks.
- Asynchronous control flow with `async/await` in the polling loop.
- Build pipeline: TypeScript compilation to `dist/` with asset copying.

## 10. Implementation Patterns
Interface design:
- Implements `INodeType` and uses `INodeTypeDescription` for configuration.

Service implementation patterns:
- Poll loop with `offset` tracking to avoid reprocessing updates.
- Filtering allowed update types on the client side after response.

Controller/API patterns:
- Single request entry via `helpers.request`.
- Request parameters follow Telegram API contract.

## 11. Testing Architecture
- No tests present in the repository.
- No test tooling configured beyond linting.

## 12. Deployment Architecture
- Built artifact placed in `dist/`.
- n8n loads node via `package.json` `n8n.nodes` entry.
- Deployment requires installing the package into n8n’s custom nodes environment.

## 13. Extension and Evolution Patterns
Feature addition patterns:
- Add new node parameters by extending `description.properties`.
- Implement new behavior inside `trigger()` or new node files.

Modification patterns:
- Keep backward compatibility by preserving existing parameters and defaults.
- Add new parameters as optional with safe defaults.

Integration patterns:
- External integrations should use `this.helpers.request` for consistency.
- Follow n8n credential patterns for secrets.

## 14. Architectural Pattern Examples
Layer separation example (node metadata vs runtime):
```ts
description: INodeTypeDescription = {
  displayName: 'Telegram Trigger (long polling) Trigger',
  properties: [
    { displayName: 'Updates', name: 'updates', type: 'multiOptions' },
    { displayName: 'Limit', name: 'limit', type: 'number' },
  ],
};
```

Component communication example (polling + emit):
```ts
const response = await this.helpers.request({ method: 'post', uri, body, json: true });
this.emit([updates.map((update) => ({ json: update as IDataObject }))]);
```

## 15. Architectural Decision Records (Inferred)
Decision: Use long polling instead of webhooks.
- Context: Webhooks require public IPv4; environment uses CGNAT/IPv6.
- Consequence: Increased latency and periodic polling overhead, but simpler deployment.

Decision: Single-node package.
- Context: Narrow scope; a single trigger is needed.
- Consequence: Minimal layering, simpler maintenance, limited reuse.

## 16. Architecture Governance
- Architectural consistency is maintained by aligning with n8n node contracts.
- Automated checks: TypeScript compilation and lint scripts in `package.json`.
- Documentation: `README.md` provides usage rationale and scope.

## 17. Blueprint for New Development
Development workflow:
- Start by defining node metadata and properties in a new `nodes/*.node.ts` file.
- Implement `trigger()` or `execute()` depending on node type.
- Add icons under `nodes/` and update build scripts if needed.
- Compile with `npm run build`, then test by loading into n8n.

Implementation templates:
- Use `INodeTypeDescription` for node config.
- Use `this.helpers.request` for external HTTP calls.
- Store secrets in n8n credentials.

Common pitfalls:
- Missing or incorrect `n8n.nodes` entry in `package.json`.
- Forgetting to copy icons into `dist/`.
- Not handling cleanup in long-running triggers.

Recommendations for keeping this updated:
- Regenerate this blueprint after adding new nodes, credentials, or build steps.
- Keep a changelog of architecture-affecting changes in `README.md` or a `docs/` folder.
