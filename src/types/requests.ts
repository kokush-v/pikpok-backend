export interface User {
	id: string;
	username: string;
}

export interface UserLogin {
	email: string;
	password: string;
}

export interface UserRegistration extends User, UserLogin {}

export interface UserFile {
	user: User | undefined;
	file: Express.Multer.File | undefined;
}

export interface GetUserParam {
	userId: string;
}

export interface GetSubscribeParams {
	followId: string;
}
