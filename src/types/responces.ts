import { User } from "./requests";

export interface Status {
	status: string | number;
	message?: string;
}

export interface UserRegistrationResponse extends Status {
	data: User;
}
