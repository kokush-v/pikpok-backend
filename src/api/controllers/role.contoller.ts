import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const searchAdmin = async (userId: string): Promise<boolean> => {
	try {
		await prisma.adminsModel.findUniqueOrThrow({ where: { userId } });

		return true;
	} catch (error) {
		return false;
	}
};
