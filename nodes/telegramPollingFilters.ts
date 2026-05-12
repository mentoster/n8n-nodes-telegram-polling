import { Update } from 'typegram';

type TelegramId = number | string;

type ChatRef = { id?: TelegramId };
type UserRef = { id?: TelegramId };
type ChatAndUserRef = { chat?: ChatRef; from?: UserRef };

type UpdateLike = Partial<{
	message: ChatAndUserRef;
	edited_message: ChatAndUserRef;
	channel_post: ChatAndUserRef;
	edited_channel_post: ChatAndUserRef;
	business_message: ChatAndUserRef;
	edited_business_message: ChatAndUserRef;
	deleted_business_messages: { chat?: ChatRef };
	guest_message: ChatAndUserRef;
	callback_query: {
		from?: UserRef;
		message?: { chat?: ChatRef };
	};
	inline_query: { from?: UserRef };
	chosen_inline_result: { from?: UserRef };
	shipping_query: { from?: UserRef };
	pre_checkout_query: { from?: UserRef };
	poll_answer: { user?: UserRef };
	chat_member: ChatAndUserRef;
	my_chat_member: ChatAndUserRef;
	chat_join_request: ChatAndUserRef;
	message_reaction: ChatAndUserRef;
	message_reaction_count: { chat?: ChatRef };
	chat_boost: { chat?: ChatRef; boost?: { source?: { user?: UserRef } } };
	removed_chat_boost: { chat?: ChatRef; source?: { user?: UserRef } };
	business_connection: { user?: UserRef };
	purchased_paid_media: { from?: UserRef };
	managed_bot: { bot?: UserRef };
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
		updateLike.business_message?.chat?.id ??
		updateLike.edited_business_message?.chat?.id ??
		updateLike.deleted_business_messages?.chat?.id ??
		updateLike.guest_message?.chat?.id ??
		updateLike.message_reaction?.chat?.id ??
		updateLike.message_reaction_count?.chat?.id ??
		updateLike.chat_boost?.chat?.id ??
		updateLike.removed_chat_boost?.chat?.id ??
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
		updateLike.business_message?.from?.id ??
		updateLike.edited_business_message?.from?.id ??
		updateLike.guest_message?.from?.id ??
		updateLike.message_reaction?.from?.id ??
		updateLike.chat_boost?.boost?.source?.user?.id ??
		updateLike.removed_chat_boost?.source?.user?.id ??
		updateLike.business_connection?.user?.id ??
		updateLike.purchased_paid_media?.from?.id ??
		updateLike.managed_bot?.bot?.id ??
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
