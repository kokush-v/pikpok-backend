import { PostType, UserPatchType } from "../lib/zod.types";

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

export interface UserPatch extends UserPatchType {}

export interface UserRegistration extends ReqUser, UserLogin {}

export interface UserFile {
	user: ReqUser | undefined;
	file: Express.Multer.File | undefined;
}

export interface GetUserParam {
	userNameOrId: string;
}

export interface PostReq {
	description: string;
}

export interface Post {
	file: UserFile;
	description: string;
}

export interface PostSchema extends PostType {}

export interface GetSubscribeParams {
	followId: string;
}
