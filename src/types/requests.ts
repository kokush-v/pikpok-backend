import { ParsedUrlQuery } from "querystring";
import { UserPatchType } from "./zod/user.shema";

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

export interface PostComment {
	text: string;
}

export interface PostCommentDeleteParams extends GetPostParam {
	commentId: string;
}

export interface RoomReqQuery {
	sender: string;
	receiver: string;
}

export interface ChatParams {
	chatId: string;
}

export interface SearchQuery {
	q: string;
	type: "posts" | "users";
}
