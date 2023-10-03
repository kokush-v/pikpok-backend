import { sign, verify } from "jsonwebtoken";
import { UserModel } from "@prisma/client";
import { NextFunction, Response } from "express";
import { User } from "../types/requests";

const secret: string = process.env.JWT_SECRET || "secret";

export const generateToken = (user: UserModel) => {
	const token = sign({ username: user.userName, id: user.id }, secret);

	return token;
};

export const validateAuthToken = (req: any, res: Response, next: NextFunction) => {
	if (req.method === "OPTIONS") {
		next();
	}

	try {
		const token = req.cookies["access-token"];
		if (!token) {
			return res.status(403).json({ message: "Pikpoker isn`t authenticated" });
		}
		const decodedData = verify(token, secret);
		req.user = decodedData as User;
		next();
	} catch (e) {
		console.log(e);
		return res.status(403).json({ message: "Pikpoker isn`t authenticated" });
	}
};
