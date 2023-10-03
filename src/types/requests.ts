import { Request } from "express";

export interface User {
	userName: string;
}

export interface UserLogin {
	email: string;
	password: string;
}

export interface UserRegistration extends User, UserLogin {}

export interface AuthenticatedRequest extends Request {
	user: User;
}

export interface Video {
	fieldname: string;
	originalname: string;
	encoding: string;
	mimetype: string;
	buffer: {
		type: string;
		data: Array<number>;
	};
}
