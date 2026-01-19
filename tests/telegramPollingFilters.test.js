const assert = require('assert');

const {
	parseIdList,
	extractChatId,
	extractUserId,
	matchesRestrictions,
} = require('../dist/nodes/telegramPollingFilters');

const test = (name, fn) => {
	try {
		fn();
		console.log(`ok - ${name}`);
	} catch (error) {
		console.error(`not ok - ${name}`);
		throw error;
	}
};

test('parseIdList splits commas and whitespace', () => {
	const ids = parseIdList('123, 456 789');
	assert.deepStrictEqual(Array.from(ids).sort(), ['123', '456', '789']);
});

test('extractChatId reads from message chat', () => {
	const chatId = extractChatId({ message: { chat: { id: -1001 } } });
	assert.strictEqual(chatId, '-1001');
});

test('extractUserId reads from callback_query', () => {
	const userId = extractUserId({ callback_query: { from: { id: 42 } } });
	assert.strictEqual(userId, '42');
});

test('matchesRestrictions rejects missing chat id when restricted', () => {
	const update = { poll: { id: 'poll' } };
	const matches = matchesRestrictions(update, new Set(['1']), new Set());
	assert.strictEqual(matches, false);
});

test('matchesRestrictions accepts matching chat and user ids', () => {
	const update = {
		message: {
			chat: { id: 10 },
			from: { id: 20 },
		},
	};
	const matches = matchesRestrictions(update, new Set(['10']), new Set(['20']));
	assert.strictEqual(matches, true);
});
