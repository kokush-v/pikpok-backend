import { NextFunction, Request, Response } from "express";
import { UserRegistration } from "../types/requests";
import { UserRegistrationResponse } from "../types/responces";
import { userReg } from "../api/controllers/user.actions";

const reg = async (
	req: Request<unknown, unknown, UserRegistration>,
	res: Response<UserRegistrationResponse>,
	next: NextFunction
) => {
	try {
		const user = req.body;
		const response = await userReg(user);

		res.status(200).json({
			data: response,
			message: "User was added",
			status: 200,
		});
	} catch (error: any) {
		res.status(400).json({ data: error, status: 400 });
	}
};

export const userActions = {
	api: {
		reg,
	},
};
