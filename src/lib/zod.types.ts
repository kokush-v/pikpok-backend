import { z } from "zod";

export const userPatchSchema = z.object({
	username: z.string().optional(),
});

export const userPatchSchemaWithId = z
	.object({
		id: z.string().optional(),
	})
	.merge(userPatchSchema);

export type UserPatchType = z.TypeOf<typeof userPatchSchemaWithId>;
