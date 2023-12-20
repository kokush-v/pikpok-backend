import { NextFunction, Request, Response } from "express";
import { sortUserId } from "../common";
import { RoomReqQuery } from "../types/requests";
import { createChatRoom } from "../api/controllers/chat.controller";
import { RoomResponse } from "../types/responces";

const createRoom = async (
	req: Request<any, any, any, RoomReqQuery>,
	res: Response<RoomResponse>,
	next: NextFunction
) => {
	try {
		const { sender, receiver } = req.query;

		if (!sender && !receiver) throw Error("Bad request");

		const room = sortUserId([sender, receiver]).join(":");

		console.log(room);

		await createChatRoom(room);

		res.status(200).json({
			data: room,
			status: 200,
		});
	} catch (error: any) {
		res.status(400).json({ data: { error: error.message }, status: 400 });
	}
};

export const chatService = {
	api: {
		createRoom,
	},
};
