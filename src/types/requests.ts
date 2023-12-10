export interface ReqUser {
	id: string;
	username: string;
}

export interface UserEmail {
	email: string;
}

export interface UserPassword {
	password: string;
}

export interface UserLogin extends UserEmail, UserPassword {}

export interface UserRegistration extends ReqUser, UserLogin {}

export interface UserFile {
	user: ReqUser | undefined;
	file: Express.Multer.File | undefined;
}

export interface GetUserParam {
	userId: string;
}

export interface GetSubscribeParams {
	followId: string;
}
