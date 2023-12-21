import { TypeOf, object, z } from "zod";
import { messageSchema } from "./message.schema";

export const chatSchema = object({
	chatId: z.string(),
	messages: z.array(messageSchema),
});

export interface Chat extends TypeOf<typeof chatSchema> {}
