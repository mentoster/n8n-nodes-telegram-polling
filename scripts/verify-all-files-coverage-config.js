const path = require('node:path');
const { spawnSync } = require('node:child_process');

const c8Bin = require.resolve('c8/bin/c8.js');
const fixtureTest = path.join(__dirname, 'coverage-fixtures', 'only-filters.test.js');

const args = [
	c8Bin,
	'--all',
	'--include',
	'dist-test/nodes/**/*.js',
	'--exclude',
	'dist-test/tests/**',
	'--exclude',
	'**/*.d.ts',
	'--check-coverage',
	'--lines',
	'100',
	'--branches',
	'100',
	'--functions',
	'100',
	'--statements',
	'100',
	'node',
	'--test',
	fixtureTest,
];

const result = spawnSync(process.execPath, args, {
	encoding: 'utf8',
	stdio: ['ignore', 'pipe', 'pipe'],
});

// We EXPECT this run to fail, because it does not import the Telegram trigger module.
// If it succeeds, it means our coverage configuration is not enforcing all-files mode.
if (result.status === 0) {
	process.stderr.write(
		'Expected coverage config validation to fail, but it succeeded. ' +
			'Coverage is likely not including all scoped modules (all-files mode may be broken).\n',
	);
	process.stderr.write(result.stdout);
	process.stderr.write(result.stderr);
	process.exit(1);
}
