import { MongoClient } from "mongodb";
import { Message } from "../../types/zod/message.schema";

const uri = process.env.DATABASE_URL || "";

if (!uri) {
	console.error("DATABASE_URL is not defined in the .env file.");
	process.exit(1);
}

const client = new MongoClient(uri);

export const createChatRoom = async (room: string) => {
	try {
		await client.connect();
		const database = client.db("pikpok_chat");
		await database.createCollection(room);
	} finally {
		await client.close();
	}
};

export const saveMessage = async (room: string, message: Message): Promise<Message | null> => {
	try {
		await client.connect();
		const database = client.db("pikpok_chat");
		const collection = database.collection(room);

		const { insertedId } = await collection.insertOne(message);
		await client.close();

		return { messageId: insertedId.toString(), name: message.name, text: message.text };
	} catch (error) {
		console.log(error);
		await client.close();
		return null;
	}
};
