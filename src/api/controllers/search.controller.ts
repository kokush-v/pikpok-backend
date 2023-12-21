import { PrismaClient } from "@prisma/client";
import { GetUser } from "../../types/responces";
import { PostSchema } from "../../types/zod/post.shema";
import { userParametersToSearch } from "./user.controller";

const prisma = new PrismaClient();

export const globalUserSearch = async (query: string): Promise<GetUser[] | null> => {
	try {
		const users = await prisma.userModel.findMany({
			where: {
				username: {
					contains: query,
					mode: "insensitive",
				},
			},
			select: { ...userParametersToSearch, chats: false },
		});

		return users;
	} catch (error) {
		return null;
	}
};

export const globalPostsSearch = async (query: string): Promise<PostSchema[] | null> => {
	try {
		const posts = await prisma.postModel.findMany({
			where: {
				description: {
					contains: query,
					mode: "insensitive",
				},
			},
		});
		return posts;
	} catch (error) {
		return null;
	}
};
