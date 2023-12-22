import { PrismaClient } from "@prisma/client";
import { Post, PostComment } from "../../types/requests";
import { videoUpload } from "./file.controller";
import { removeNullValues } from "../../lib/zod.metods";
import { GetUser } from "../../types/responces";
import { Comment, CommentSchema, PostSchema, postSchema } from "../../types/zod/post.shema";

const prisma = new PrismaClient();

export const createPost = async ({ description, file }: Post): Promise<PostSchema> => {
	try {
		const uploadUrl = await videoUpload(file);

		const dbPost = await prisma.postModel.create({
			data: {
				url: uploadUrl,
				description: description,
				creatorId: file.user.id,
				comments: [],
				likes: [],
				shares: 0,
			},
		});

		return postSchema.parse(removeNullValues(dbPost));
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const getVideoPosts = async (limit: number, page: number): Promise<PostSchema[]> => {
	const dbPosts = await prisma.postModel.findMany();

	return dbPosts.map((post) => postSchema.parse(post));
};

export const getUserVideoPosts = async (user: GetUser): Promise<PostSchema[]> => {
	return await prisma.postModel.findMany({
		where: {
			creatorId: user.id,
		},
	});
};

export const findPostById = async (postId: string): Promise<PostSchema> => {
	return await prisma.postModel.findUniqueOrThrow({
		where: {
			id: postId,
		},
	});
};

export const deletePostById = async (postId: string) => {
	await prisma.postModel.delete({
		where: {
			id: postId,
		},
	});
};

export const likePost = async (postId: string, userId: string): Promise<PostSchema> =>
	await prisma.postModel.update({
		where: {
			id: postId,
		},
		data: {
			likes: {
				push: userId,
			},
		},
	});

export const dislikePost = async (postId: string, userId: string): Promise<PostSchema> =>
	await prisma.postModel.update({
		where: {
			id: postId,
		},
		data: {
			likes: {
				set: await prisma.postModel
					.findUnique({ where: { id: postId } })
					.then((post) => post?.likes.filter((dislikeId) => dislikeId !== userId)),
			},
		},
	});

export const isLikedPost = async (postId: string, userId: string): Promise<Boolean> => {
	const post = await prisma.postModel.findUniqueOrThrow({
		where: { id: postId },
	});

	const isLiked = post?.likes.some((likeId) => likeId === userId);

	return isLiked;
};

export const sendComment = async (postId: string, comment: CommentSchema): Promise<PostSchema> => {
	const dbComment = await prisma.commentModel.create({
		data: comment,
	});

	return await prisma.postModel.update({
		where: {
			id: postId,
		},
		data: {
			comments: {
				push: dbComment.id,
			},
		},
	});
};

export const removeComment = async (postId: string, commentId: string): Promise<PostSchema> => {
	await prisma.commentModel.delete({
		where: {
			id: commentId,
		},
	});

	return await prisma.postModel.update({
		where: {
			id: postId,
		},
		data: {
			comments: {
				set: await prisma.postModel
					.findUnique({ where: { id: postId } })
					.then((post) =>
						post?.comments.filter((deleteCommentId) => deleteCommentId !== commentId)
					),
			},
		},
	});
};

export const getPostComments = async (postId: string): Promise<Comment[]> => {
	return await prisma.commentModel.findMany({
		where: { postId },
		select: {
			id: true,
			creatorId: true,
			text: true,
		},
	});
};
