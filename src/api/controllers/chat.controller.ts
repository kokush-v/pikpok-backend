import { MongoClient } from "mongodb";
import { Message } from "../../types/zod/message.schema";
import { sortUserId } from "../../common";
import { PrismaClient } from "@prisma/client";

const uri = process.env.DATABASE_URL || "";

if (!uri) {
	console.error("DATABASE_URL is not defined in the .env file.");
	process.exit(1);
}

const client = new MongoClient(uri);
const prisma = new PrismaClient();

export const createChatRoom = async (sender: string, receiver: string) => {
	const room = sortUserId([sender, receiver]).join(":");

	try {
		await client.connect();
		const database = client.db("pikpok_chat");

		const collection = database.collection(room);

		if (collection) {
			await client.close();
			return room;
		}

		await database.createCollection(room);

		await prisma.userModel.updateMany({
			where: { id: sender },
			data: {
				chats: { push: room },
			},
		});

		await prisma.userModel.updateMany({
			where: { id: receiver },
			data: {
				chats: { push: room },
			},
		});
		return room;
	} catch (error) {
		await client.close();
		throw error;
	}
};

export const saveMessage = async (room: string, message: Message): Promise<Message | null> => {
	try {
		await client.connect();
		const database = client.db("pikpok_chat");
		const collection = database.collection(room);

		const { insertedId } = await collection.insertOne(message);
		await client.close();

		return { messageId: insertedId.toString(), userId: message.userId, text: message.text };
	} catch (error) {
		console.log(error);
		await client.close();
		return null;
	}
};

export const getChatById = async (chatId: string): Promise<Message[]> => {
	try {
		await client.connect();
		const database = client.db("pikpok_chat");
		const collection = database.collection<Message>(chatId);
		const messages = await collection
			.find({}, { projection: { id: { $toString: "$_id" }, text: 1, userId: 1 } })
			.toArray();
		await client.close();

		return messages;
	} catch (error) {
		console.log(error);
		await client.close();
		return [];
	}
};
