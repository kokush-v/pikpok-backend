import { z } from "zod";

export const userPatchSchema = z.object({
	username: z.string().min(1).max(15).optional(),
	description: z.string().trim().max(50).optional(),
});

export const userPatchSchemaWithId = z
	.object({
		id: z.string().optional(),
	})
	.merge(userPatchSchema);

export type UserPatchType = z.TypeOf<typeof userPatchSchemaWithId>;

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
