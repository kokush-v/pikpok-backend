import { z } from "zod";

export const postSchema = z.object({
	id: z.string(),
	creatorId: z.string(),
	url: z.string(),
	description: z.string(),
	likes: z.string().array(),
	comments: z.string().array(),
	shares: z.number().nullable().default(0),
});

export type PostType = z.TypeOf<typeof postSchema>;
export interface PostSchema extends PostType {}

export const postCommentSchema = z.object({
	id: z.string().optional(),
	creatorId: z.string(),
	text: z.string().trim(),
});

export type CommentType = z.TypeOf<typeof postCommentSchema>;
export interface CommentSchema extends CommentType {}
