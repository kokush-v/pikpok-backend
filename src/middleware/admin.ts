import { NextFunction, Response } from "express";
import { ReqUser } from "../types/requests";
import { searchAdmin } from "../api/controllers/role.contoller";

export const isAdmin = async (req: any, res: Response, next: NextFunction) => {
	if (req.method === "OPTIONS") {
		next();
	}
	try {
		const user: ReqUser = req.user;
		const isAdmin = await searchAdmin(user.id);

		if (!isAdmin) throw Error;

		next();
	} catch (e) {
		res.status(403).json({ error: "You are't part of PikPok team" });
	}
};
