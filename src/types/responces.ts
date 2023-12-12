import { ReqUser, UserEmail } from "./requests";
import { CommentSchema, PostSchema } from "./zod/post.shema";

export interface Status {
	status: string | number;
	message?: string;
}

export interface GetUser extends ReqUser {
	avatarUrl: string;
	subscribers: string[];
	subscribtions: string[];
	description?: string;
	followed?: boolean;
}

export interface UserRegistrationResponse extends Status {
	data: ReqUser | any;
}

export interface GetUserResponse extends Status {
	data: GetUser | any;
}

export interface FileUploadResponse extends Status {
	data:
		| {
				fileUrl: string;
		  }
		| any;
}

export interface SubscribeResponse extends Status {
	data:
		| {
				success: string;
		  }
		| any;
}

export interface PostsResponse extends Status {
	data: PostSchema[] | any;
}

export interface PostResponse extends Status {
	data: PostSchema | any;
}

export interface CommentsResponse extends Status {
	data: CommentSchema;
}
