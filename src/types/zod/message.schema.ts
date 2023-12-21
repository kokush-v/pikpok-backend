import { TypeOf, object, z } from "zod";

export const messageSchema = object({
	messageId: z.string(),
	text: z.string(),
	userId: z.string(),
});

export interface Message extends TypeOf<typeof messageSchema> {}
