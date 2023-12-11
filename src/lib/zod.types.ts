import { z } from "zod";

export const userPatchSchema = z.object({
	username: z.string().min(1).max(15).optional(),
	description: z.string().max(50).optional(),
});

export const userPatchSchemaWithId = z
	.object({
		id: z.string().optional(),
	})
	.merge(userPatchSchema);

export type UserPatchType = z.TypeOf<typeof userPatchSchemaWithId>;
