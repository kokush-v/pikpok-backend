import { ReqUser, UserEmail } from "./requests";
import { Chat } from "./zod/chat.schema";
import { Message } from "./zod/message.schema";
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

export interface GetCurrentUser extends GetUser {
	chats: string[];
	isAdmin: boolean;
}

export interface UserRegistrationResponse extends Status {
	data: ReqUser | any;
}

export interface GetUserResponse extends Status {
	data: GetUser | any;
}

export interface GetCurrentUserResponse extends Status {
	data: GetCurrentUser | any;
}

export interface GetChatsResponse extends Status {
	data: string[] | any;
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

export interface RoomResponse extends Status {
	data: string | any;
}

export interface ChatResponse extends Status {
	data: Chat | any;
}

export interface SearchResponse extends Status {
	data:
		| {
				users: GetUser[];
				posts: PostSchema[];
		  }
		| any;
}
