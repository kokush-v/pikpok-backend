import { NextFunction, Request, Response } from "express";
import { sortUserId } from "../common";
import { ChatParams, RoomReqQuery } from "../types/requests";
import { createChatRoom, getChatById } from "../api/controllers/chat.controller";
import { ChatResponse, RoomResponse } from "../types/responces";
import { Chat } from "../types/zod/chat.schema";

const createRoom = async (
	req: Request<any, any, any, RoomReqQuery>,
	res: Response<RoomResponse>,
	next: NextFunction
) => {
	try {
		const { sender, receiver } = req.query;

		if (!sender && !receiver) throw Error("Bad request");

		const room = await createChatRoom(sender, receiver);

		res.status(200).json({
			data: room,
			status: 200,
		});
	} catch (error: any) {
		res.status(400).json({ data: { error: error.message }, status: 400 });
	}
};

const findChat = async (
	req: Request<ChatParams, any, any, any>,
	res: Response<ChatResponse>,
	next: NextFunction
) => {
	try {
		const { chatId } = req.params;

		const messages = await getChatById(chatId);

		const data: Chat = { chatId: chatId, messages };

		res.status(200).json({
			data,
			status: 200,
		});
	} catch (error: any) {
		res.status(400).json({ data: { error: error.message }, status: 400 });
	}
};

export const chatService = {
	api: {
		createRoom,
		findChat,
	},
};
