import { PrismaClient } from "@prisma/client";
import { UserRegistration, User } from "../../types/requests";
import { hashPassword } from "../../lib/bcrypt.config";

const prisma = new PrismaClient();

export const userReg = async (user: UserRegistration): Promise<User> => {
	try {
		const result = await prisma.userModel.create({
			data: { ...user, password: await hashPassword(user.password) },
		});
		return result as User;
	} catch (error) {
		console.log(error);
		throw error;
	}
};
