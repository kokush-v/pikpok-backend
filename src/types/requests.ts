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
