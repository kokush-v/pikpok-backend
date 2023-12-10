import { sign, verify } from "jsonwebtoken";
import { UserModel } from "@prisma/client";
import { NextFunction, Response } from "express";
import { ReqUser } from "../types/requests";

const secret: string = process.env.JWT_SECRET || "secret";

export const generateToken = (user: UserModel) => {
	const token = sign(
		{
			username: user.username,
			id: user.id,
			avatarUrl: user.avatarUrl,
			subscribers: user.subscribers,
			subscribtions: user.subscribtions,
		},
		secret
	);

	return token;
};

export const validateAuthToken = (req: any, res: Response, next: NextFunction) => {
	if (req.method === "OPTIONS") {
		next();
	}

	try {
		const token = req.cookies["access-token"];
		if (!token) {
			res.status(403).json({ message: "Pikpoker isn`t authenticated" });
		}
		const decodedData = verify(token, secret);
		req.user = decodedData as ReqUser;
		next();
	} catch (e) {
		console.log(e);
		res.status(403).json({ message: "Pikpoker isn`t authenticated" });
	}
};

export const validateAuthTokenPublic = (req: any, res: Response, next: NextFunction) => {
	if (req.method === "OPTIONS") {
		next();
	}

	try {
		const token = req.cookies["access-token"];
		if (!token) {
			next();
		}
		const decodedData = verify(token, secret);
		req.user = decodedData as ReqUser;
		next();
	} catch (e) {
		console.log(e);
		res.status(403).json({ message: "Pikpoker isn`t authenticated" });
	}
};
