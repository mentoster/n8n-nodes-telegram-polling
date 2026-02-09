## ADDED Requirements

### Requirement: 100% coverage gate

The project MUST enforce 100% statement, branch, function, and line coverage for the runtime-relevant TypeScript source modules.

#### Scenario: Coverage is below 100%

- **WHEN** the test suite is executed and any covered metric is below 100%
- **THEN** the test command MUST exit with a non-zero status code

#### Scenario: Coverage is exactly 100%

- **WHEN** the test suite is executed and all covered metrics are 100%
- **THEN** the test command MUST exit with status code 0

### Requirement: Coverage includes all scoped source modules

The coverage calculation MUST include all runtime-relevant source modules in scope, including files that were not imported during the test run, so uncovered files fail the gate.

#### Scenario: Unimported file in scope

- **WHEN** a scoped source module is not executed by any test
- **THEN** the coverage gate MUST fail

### Requirement: Coverage scope excludes generated output

The coverage calculation MUST exclude generated output directories and files, including build output (for example `dist/` and `dist-test/`).

#### Scenario: Generated file changes

- **WHEN** generated output files change due to compilation
- **THEN** the coverage result MUST be unaffected by the generated output

### Requirement: Coverage reporting is available to developers

The project MUST produce a human-readable coverage report in the test output and SHOULD generate a machine-readable report suitable for CI tooling.

#### Scenario: Developer runs tests locally

- **WHEN** a developer runs the coverage-enabled test command
- **THEN** the console output MUST include a coverage summary
