const test = require('node:test');

require('../../dist-test/nodes/telegramPollingFilters.js');

test('fixture: only filters imported', () => {
	// Intentionally empty. This file exists to validate that our coverage
	// configuration fails when a scoped node module is not imported.
});
