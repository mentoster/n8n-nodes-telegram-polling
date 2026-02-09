import assert from 'node:assert/strict';
import test from 'node:test';

import type { Update } from 'typegram';

import {
	extractChatId,
	extractUserId,
	matchesRestrictions,
	parseIdList,
} from '../nodes/telegramPollingFilters';

const makeUpdate = (partial: Record<string, unknown>): Update =>
	({ update_id: 1, ...partial } as unknown as Update);

test('parseIdList returns empty set for empty input', () => {
	assert.deepEqual([...parseIdList('')], []);
});

test('parseIdList splits on whitespace and commas and removes duplicates', () => {
	const ids = parseIdList('  123, 456  123\n789\t ');
	assert.deepEqual([...ids].sort(), ['123', '456', '789']);
});

test('extractChatId extracts from message.chat.id', () => {
	const update = makeUpdate({
		message: { chat: { id: 100 }, from: { id: 200 } },
	});
	assert.equal(extractChatId(update), '100');
});

test('extractChatId extracts from callback_query.message.chat.id', () => {
	const update = makeUpdate({
		callback_query: {
			from: { id: 200 },
			message: { chat: { id: '300' } },
		},
	});
	assert.equal(extractChatId(update), '300');
});

test('extractChatId returns null when chat id is missing', () => {
	assert.equal(extractChatId(makeUpdate({})), null);
});

test('extractUserId extracts from message.from.id', () => {
	const update = makeUpdate({
		message: { chat: { id: 100 }, from: { id: 200 } },
	});
	assert.equal(extractUserId(update), '200');
});

test('extractUserId extracts from poll_answer.user.id', () => {
	const update = makeUpdate({
		poll_answer: { user: { id: 400 } },
	});
	assert.equal(extractUserId(update), '400');
});

test('extractUserId returns null when user id is missing', () => {
	assert.equal(extractUserId(makeUpdate({})), null);
});

test('matchesRestrictions returns true when no restrictions configured', () => {
	assert.equal(matchesRestrictions(makeUpdate({}), new Set(), new Set()), true);
});

test('matchesRestrictions enforces chat id restriction', () => {
	const restrictChatIds = new Set(['10']);
	assert.equal(
		matchesRestrictions(makeUpdate({ message: { chat: { id: 10 } } }), restrictChatIds, new Set()),
		true,
	);
	assert.equal(
		matchesRestrictions(makeUpdate({ message: { chat: { id: 11 } } }), restrictChatIds, new Set()),
		false,
	);
	assert.equal(matchesRestrictions(makeUpdate({}), restrictChatIds, new Set()), false);
});

test('matchesRestrictions enforces user id restriction', () => {
	const restrictUserIds = new Set(['20']);
	assert.equal(
		matchesRestrictions(makeUpdate({ message: { from: { id: 20 } } }), new Set(), restrictUserIds),
		true,
	);
	assert.equal(
		matchesRestrictions(makeUpdate({ message: { from: { id: 21 } } }), new Set(), restrictUserIds),
		false,
	);
	assert.equal(matchesRestrictions(makeUpdate({}), new Set(), restrictUserIds), false);
});

test('matchesRestrictions enforces both chat and user id restrictions', () => {
	const restrictChatIds = new Set(['10']);
	const restrictUserIds = new Set(['20']);
	assert.equal(
		matchesRestrictions(
			makeUpdate({ message: { chat: { id: 10 }, from: { id: 20 } } }),
			restrictChatIds,
			restrictUserIds,
		),
		true,
	);
	assert.equal(
		matchesRestrictions(
			makeUpdate({ message: { chat: { id: 10 }, from: { id: 21 } } }),
			restrictChatIds,
			restrictUserIds,
		),
		false,
	);
	assert.equal(
		matchesRestrictions(
			makeUpdate({ message: { chat: { id: 11 }, from: { id: 20 } } }),
			restrictChatIds,
			restrictUserIds,
		),
		false,
	);
});
