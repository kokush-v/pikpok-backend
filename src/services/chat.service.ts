import { NextFunction, Request, Response } from "express";
import { sortUserId } from "../common";
import { RoomReqParams } from "../types/requests";

export const createRoom = async (
	req: Request<RoomReqParams>,
	res: Response,
	next: NextFunction
) => {
	try {
		const { sender, receiver } = req.params;
		const room = sortUserId([sender, receiver]).join(":");

		res.status(200).json({
			data: room,
			status: 200,
		});
	} catch (error: any) {
		res.status(400).json({ data: { error: error.message }, status: 400 });
	}
};
