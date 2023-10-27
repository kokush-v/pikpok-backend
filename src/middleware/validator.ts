import { NextFunction, Request, Response } from "express";
import { UserRegistrationResponse } from "../types/responces";
import { UserLogin, UserRegistration } from "../types/requests";
import { body, validationResult } from "express-validator";

export const validateRegistration = (
	req: Request<any, any, UserRegistration>,
	res: Response<UserRegistrationResponse>,
	next: NextFunction
) => {
	const validationRules = [
		body("userName")
			.isLength({ min: 3, max: 20 })
			.withMessage("Username must be at least 3 characters long"),
		body("email").isEmail().withMessage("Email format is incorrect"),
		body("password")
			.isLength({ min: 4, max: 20 })
			.withMessage("Password must contains from 4 to 20 characters"),
	];

	Promise.all(validationRules.map((validation) => validation.run(req))).then(() => {
		const errors = validationResult(req);
		const errorMsgs = errors.array().map((item: any) => ({ where: item.path, err: item.msg }));
		if (errors.isEmpty()) {
			next();
		} else {
			res.status(400).send({ status: 400, message: "Error", data: errorMsgs });
		}
	});
};

export const validateLogin = (
	req: Request<any, any, UserLogin>,
	res: Response<UserRegistrationResponse>,
	next: NextFunction
) => {
	const validationRules = [
		body("email").isEmail().withMessage("Email format is incorrect"),
		body("password")
			.isLength({ min: 4, max: 20 })
			.withMessage("Password must contains from 4 to 20 characters"),
	];

	Promise.all(validationRules.map((validation) => validation.run(req))).then(() => {
		const errors = validationResult(req);
		const errorMsgs = errors.array().map((item: any) => ({ where: item.path, err: item.msg }));
		if (errors.isEmpty()) {
			next();
		} else {
			res.status(400).send({ status: 400, message: "Error", data: errorMsgs });
		}
	});
};
