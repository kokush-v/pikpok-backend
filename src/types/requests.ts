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
	user: ReqUser;
	file: Express.Multer.File | undefined;
}

export interface GetUserParam {
	userNameOrId: string;
}

export interface GetPostParam {
	postId: string;
}

export interface PostReq {
	description: string;
}

export interface Post {
	file: UserFile;
	description: string;
}

export interface GetSubscribeParams {
	followId: string;
}

export interface PostReqParams {
	limit: number;
	page: number;
}
