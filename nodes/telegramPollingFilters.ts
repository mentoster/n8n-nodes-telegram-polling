import { Update } from 'typegram';

type UpdateLike = Partial<{
	message: { chat?: { id?: number | string }; from?: { id?: number | string } };
	edited_message: { chat?: { id?: number | string }; from?: { id?: number | string } };
	channel_post: { chat?: { id?: number | string }; from?: { id?: number | string } };
	edited_channel_post: { chat?: { id?: number | string }; from?: { id?: number | string } };
	callback_query: {
		from?: { id?: number | string };
		message?: { chat?: { id?: number | string } };
	};
	inline_query: { from?: { id?: number | string } };
	chosen_inline_result: { from?: { id?: number | string } };
	shipping_query: { from?: { id?: number | string } };
	pre_checkout_query: { from?: { id?: number | string } };
	poll_answer: { user?: { id?: number | string } };
	chat_member: { chat?: { id?: number | string }; from?: { id?: number | string } };
	my_chat_member: { chat?: { id?: number | string }; from?: { id?: number | string } };
	chat_join_request: { chat?: { id?: number | string }; from?: { id?: number | string } };
}>;

export const parseIdList = (raw: string): Set<string> => {
	if (!raw) {
		return new Set();
	}

	const entries = raw
		.split(/[\s,]+/)
		.map((entry) => entry.trim())
		.filter(Boolean);

	return new Set(entries);
};

export const extractChatId = (update: Update): string | null => {
	const updateLike = update as unknown as UpdateLike;
	const chatId =
		updateLike.message?.chat?.id ??
		updateLike.edited_message?.chat?.id ??
		updateLike.channel_post?.chat?.id ??
		updateLike.edited_channel_post?.chat?.id ??
		updateLike.callback_query?.message?.chat?.id ??
		updateLike.chat_member?.chat?.id ??
		updateLike.my_chat_member?.chat?.id ??
		updateLike.chat_join_request?.chat?.id;

	if (chatId === undefined) {
		return null;
	}

	return String(chatId);
};

export const extractUserId = (update: Update): string | null => {
	const updateLike = update as unknown as UpdateLike;
	const userId =
		updateLike.message?.from?.id ??
		updateLike.edited_message?.from?.id ??
		updateLike.channel_post?.from?.id ??
		updateLike.edited_channel_post?.from?.id ??
		updateLike.callback_query?.from?.id ??
		updateLike.inline_query?.from?.id ??
		updateLike.chosen_inline_result?.from?.id ??
		updateLike.shipping_query?.from?.id ??
		updateLike.pre_checkout_query?.from?.id ??
		updateLike.poll_answer?.user?.id ??
		updateLike.chat_member?.from?.id ??
		updateLike.my_chat_member?.from?.id ??
		updateLike.chat_join_request?.from?.id;

	if (userId === undefined) {
		return null;
	}

	return String(userId);
};

export const matchesRestrictions = (
	update: Update,
	restrictChatIds: Set<string>,
	restrictUserIds: Set<string>,
): boolean => {
	if (restrictChatIds.size > 0) {
		const chatId = extractChatId(update);
		if (!chatId || !restrictChatIds.has(chatId)) {
			return false;
		}
	}

	if (restrictUserIds.size > 0) {
		const userId = extractUserId(update);
		if (!userId || !restrictUserIds.has(userId)) {
			return false;
		}
	}

	return true;
};
