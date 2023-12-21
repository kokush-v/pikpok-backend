import { PrismaClient } from "@prisma/client";
import { GetUser } from "../../types/responces";
import { PostSchema } from "../../types/zod/post.shema";

const prisma = new PrismaClient();

export const globalSearch = async (
	query: string
): Promise<{
	users: GetUser[];
	posts: PostSchema[];
} | null> => {
	try {
		const users = await prisma.userModel.findMany({
			where: {
				username: {
					startsWith: query,
					mode: "insensitive",
				},
			},
		});

		const posts = await prisma.postModel.findMany({
			where: {
				description: {
					startsWith: query,
					mode: "insensitive",
				},
			},
		});
		return { users, posts };
	} catch (error) {
		return null;
	}
};
