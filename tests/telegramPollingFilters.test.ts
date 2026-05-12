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

test('extractChatId extracts from edited_message.chat.id', () => {
	const update = makeUpdate({
		edited_message: { chat: { id: 101 } },
	});
	assert.equal(extractChatId(update), '101');
});

test('extractChatId extracts from channel_post.chat.id', () => {
	const update = makeUpdate({
		channel_post: { chat: { id: 102 } },
	});
	assert.equal(extractChatId(update), '102');
});

test('extractChatId extracts from edited_channel_post.chat.id', () => {
	const update = makeUpdate({
		edited_channel_post: { chat: { id: 103 } },
	});
	assert.equal(extractChatId(update), '103');
});

test('extractChatId extracts from chat_member.chat.id', () => {
	const update = makeUpdate({
		chat_member: { chat: { id: 104 } },
	});
	assert.equal(extractChatId(update), '104');
});

test('extractChatId extracts from my_chat_member.chat.id', () => {
	const update = makeUpdate({
		my_chat_member: { chat: { id: 105 } },
	});
	assert.equal(extractChatId(update), '105');
});

test('extractChatId extracts from chat_join_request.chat.id', () => {
	const update = makeUpdate({
		chat_join_request: { chat: { id: 106 } },
	});
	assert.equal(extractChatId(update), '106');
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

test('extractUserId extracts from edited_message.from.id', () => {
	const update = makeUpdate({
		edited_message: { from: { id: 201 } },
	});
	assert.equal(extractUserId(update), '201');
});

test('extractUserId extracts from channel_post.from.id', () => {
	const update = makeUpdate({
		channel_post: { from: { id: 202 } },
	});
	assert.equal(extractUserId(update), '202');
});

test('extractUserId extracts from edited_channel_post.from.id', () => {
	const update = makeUpdate({
		edited_channel_post: { from: { id: 203 } },
	});
	assert.equal(extractUserId(update), '203');
});

test('extractUserId extracts from callback_query.from.id', () => {
	const update = makeUpdate({
		callback_query: { from: { id: 204 } },
	});
	assert.equal(extractUserId(update), '204');
});

test('extractUserId extracts from inline_query.from.id', () => {
	const update = makeUpdate({
		inline_query: { from: { id: 205 } },
	});
	assert.equal(extractUserId(update), '205');
});

test('extractUserId extracts from chosen_inline_result.from.id', () => {
	const update = makeUpdate({
		chosen_inline_result: { from: { id: 206 } },
	});
	assert.equal(extractUserId(update), '206');
});

test('extractUserId extracts from shipping_query.from.id', () => {
	const update = makeUpdate({
		shipping_query: { from: { id: 207 } },
	});
	assert.equal(extractUserId(update), '207');
});

test('extractUserId extracts from pre_checkout_query.from.id', () => {
	const update = makeUpdate({
		pre_checkout_query: { from: { id: 208 } },
	});
	assert.equal(extractUserId(update), '208');
});

test('extractUserId extracts from chat_member.from.id', () => {
	const update = makeUpdate({
		chat_member: { from: { id: 209 } },
	});
	assert.equal(extractUserId(update), '209');
});

test('extractUserId extracts from my_chat_member.from.id', () => {
	const update = makeUpdate({
		my_chat_member: { from: { id: 210 } },
	});
	assert.equal(extractUserId(update), '210');
});

test('extractUserId extracts from chat_join_request.from.id', () => {
	const update = makeUpdate({
		chat_join_request: { from: { id: 211 } },
	});
	assert.equal(extractUserId(update), '211');
});

test('extractUserId returns null when user id is missing', () => {
	assert.equal(extractUserId(makeUpdate({})), null);
});


test('extractChatId supports recent Telegram update shapes', () => {
	assert.equal(extractChatId(makeUpdate({ business_message: { chat: { id: 301 } } })), '301');
	assert.equal(extractChatId(makeUpdate({ edited_business_message: { chat: { id: 302 } } })), '302');
	assert.equal(extractChatId(makeUpdate({ deleted_business_messages: { chat: { id: 303 } } })), '303');
	assert.equal(extractChatId(makeUpdate({ guest_message: { chat: { id: 304 } } })), '304');
	assert.equal(extractChatId(makeUpdate({ message_reaction: { chat: { id: 305 } } })), '305');
	assert.equal(extractChatId(makeUpdate({ message_reaction_count: { chat: { id: 306 } } })), '306');
	assert.equal(extractChatId(makeUpdate({ chat_boost: { chat: { id: 307 } } })), '307');
	assert.equal(extractChatId(makeUpdate({ removed_chat_boost: { chat: { id: 308 } } })), '308');
});

test('extractUserId supports recent Telegram update shapes', () => {
	assert.equal(extractUserId(makeUpdate({ business_message: { from: { id: 401 } } })), '401');
	assert.equal(extractUserId(makeUpdate({ edited_business_message: { from: { id: 402 } } })), '402');
	assert.equal(extractUserId(makeUpdate({ guest_message: { from: { id: 403 } } })), '403');
	assert.equal(extractUserId(makeUpdate({ message_reaction: { from: { id: 404 } } })), '404');
	assert.equal(extractUserId(makeUpdate({ chat_boost: { boost: { source: { user: { id: 405 } } } } })), '405');
	assert.equal(extractUserId(makeUpdate({ removed_chat_boost: { source: { user: { id: 406 } } } })), '406');
	assert.equal(extractUserId(makeUpdate({ business_connection: { user: { id: 407 } } })), '407');
	assert.equal(extractUserId(makeUpdate({ purchased_paid_media: { from: { id: 408 } } })), '408');
	assert.equal(extractUserId(makeUpdate({ managed_bot: { bot: { id: 409 } } })), '409');
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
