import { PrismaClient } from "@prisma/client";
import { PostSchema, postSchema } from "../../lib/zod.types";

const prisma = new PrismaClient();

export const getVideoPosts = async (limit: number, page: number): Promise<PostSchema[]> => {
	const dbPosts = await prisma.postModel.findMany();

	return dbPosts.map((post) => postSchema.parse(post));
};
