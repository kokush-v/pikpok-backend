import { TypeOf, object, z } from "zod";
import { messageSchema } from "./message.schema";

const chatUser = object({
	name: z.string(),
	avatar: z.string(),
});

export const chatSchema = object({
	chatId: z.string(),
	messages: z.array(messageSchema.extend({ user: chatUser })),
});

export interface Chat extends TypeOf<typeof chatSchema> {}
