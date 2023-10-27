import { PrismaClient } from "@prisma/client";
import { UserRegistration, User, UserLogin } from "../../types/requests";
import { hashPassword } from "../../lib/bcrypt.config";
import bcrypt from "bcrypt";
import { generateToken } from "../../middleware/jwt";

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
export const userLogin = async ({
	email,
	password,
}: UserLogin): Promise<{ user: User; token: string }> => {
	try {
		const dbUser = await prisma.userModel.findUniqueOrThrow({
			where: { email: email },
		});

		if (!dbUser) throw new Error("User doesn`t exist");

		const match = await bcrypt.compare(password, dbUser.password);

		if (match) {
			const token = generateToken(dbUser);
			return { user: dbUser, token };
		} else {
			throw new Error("Incorrect password");
		}
	} catch (error) {
		console.log(error);
		throw error;
	}
};
