import { NextFunction, Request, Response } from "express";
import {
	GetPostParam,
	GetUserParam,
	Post,
	PostComment,
	PostCommentDeleteParams,
	PostReq,
	PostReqParams,
	UserFile,
} from "../types/requests";
import { FileUploadResponse, PostResponse, PostsResponse } from "../types/responces";
import {
	createPost,
	deletePostById,
	dislikePost,
	findPostById,
	getPostComments,
	getUserVideoPosts,
	getVideoPosts,
	isLikedPost,
	likePost,
	removeComment,
	sendComment,
} from "../api/controllers/post.controllers";
import { findUserById, findUserByUniqueName } from "../api/controllers/user.controller";
import { CommentSchema } from "../types/zod/post.shema";

const getPosts = async (
	req: Request<PostReqParams>,
	res: Response<PostsResponse>,
	next: NextFunction
) => {
	try {
		const { limit, page } = req.params;

		const posts = await getVideoPosts(limit, page);

		res.status(200).json({
			data: posts,
			status: 200,
		});
	} catch (error: any) {
		res.status(400).json({ data: { error: error.message }, status: 400 });
	}
};

const uploadPost = async (
	req: Request<unknown, unknown, PostReq>,
	res: Response<FileUploadResponse>,
	next: NextFunction
) => {
	try {
		if (!req.user) throw Error("Not authorized");

		const file: UserFile = {
			user: req.user,
			file: req.file,
		};

		const post: Post = {
			description: req.body.description,
			file,
		};

		const response = await createPost(post);

		res.status(200).json({
			data: { fileUrl: response },
			message: "Video was uploaded",
			status: 200,
		});
	} catch (error: any) {
		res.status(400).json({ data: { error: error.message }, status: 400 });
	}
};

const getPostsByUser = async (
	req: Request<GetUserParam>,
	res: Response<PostsResponse>,
	next: NextFunction
) => {
	try {
		const { userNameOrId } = req.params;

		const user = (await findUserById(userNameOrId)) || (await findUserByUniqueName(userNameOrId));

		if (!user) throw Error("User doesn't exist");

		const posts = await getUserVideoPosts(user);

		res.status(200).json({
			data: posts,
			status: 200,
		});
	} catch (error: any) {
		res.status(400).json({ data: { error: error.message }, status: 400 });
	}
};

const getPost = async (
	req: Request<GetPostParam>,
	res: Response<PostResponse>,
	next: NextFunction
) => {
	try {
		const { postId } = req.params;

		const post = await findPostById(postId);

		res.status(200).json({
			data: post,
			status: 200,
		});
	} catch (error: any) {
		res.status(400).json({ data: { error: error.message }, status: 400 });
	}
};

const deletePost = async (req: Request<GetPostParam>, res: Response, next: NextFunction) => {
	try {
		const { postId } = req.params;

		await deletePostById(postId);

		res.status(200).json({
			message: `Post with id:${postId} deleted`,
			status: 200,
		});
	} catch (error: any) {
		res.status(400).json({ data: { error: error.message }, status: 400 });
	}
};

const setLike = async (
	req: Request<GetPostParam>,
	res: Response<PostResponse>,
	next: NextFunction
) => {
	try {
		const { postId } = req.params;
		const user = req.user;
		if (!user) throw Error("Not authorized");

		const post = (await isLikedPost(postId, user.id))
			? await dislikePost(postId, user.id)
			: await likePost(postId, user.id);

		res.status(200).json({
			data: post,
			status: 200,
		});
	} catch (error: any) {
		res.status(400).json({ data: { error: error.message }, status: 400 });
	}
};

const setComment = async (
	req: Request<GetPostParam, unknown, PostComment>,
	res: Response<PostResponse>,
	next: NextFunction
) => {
	try {
		const { postId } = req.params;
		const user = req.user;
		const { text } = req.body;

		if (!user) throw Error("Not authorized");

		const comment: CommentSchema = {
			creatorId: user.id,
			text: text,
			postId,
		};

		const post = await sendComment(postId, comment);
		res.status(200).json({
			data: post,
			status: 200,
		});
	} catch (error: any) {
		res.status(400).json({ data: { error: error.message }, status: 400 });
	}
};

const deleteComment = async (
	req: Request<PostCommentDeleteParams>,
	res: Response<PostResponse>,
	next: NextFunction
) => {
	try {
		const { postId, commentId } = req.params;
		const user = req.user;

		if (!user) throw Error("Not authorized");

		const post = await removeComment(postId, commentId);

		res.status(200).json({
			data: post,
			status: 200,
		});
	} catch (error: any) {
		res.status(400).json({ data: { error: error.message }, status: 400 });
	}
};

const getCommentsByPostId = async (
	req: Request<GetPostParam>,
	res: Response<PostResponse>,
	next: NextFunction
) => {
	try {
		const { postId } = req.params;

		const comments = await getPostComments(postId);

		res.status(200).json({
			data: comments,
			status: 200,
		});
	} catch (error: any) {
		res.status(400).json({ data: { error: error.message }, status: 400 });
	}
};

export const postService = {
	api: {
		getPosts,
		uploadPost,
		getPostsByUser,
		setLike,
		getPost,
		setComment,
		deleteComment,
		getCommentsByPostId,
		deletePost,
	},
};
