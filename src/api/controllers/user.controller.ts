import { PrismaClient } from "@prisma/client";
import { UserRegistration, User, UserLogin } from "../../types/requests";
import { hashPassword } from "../../lib/bcrypt.config";
import bcrypt from "bcrypt";
import { generateToken } from "../../middleware/jwt";

const prisma = new PrismaClient();

export const userReg = async (user: UserRegistration): Promise<User> => {
	const dbUser = await prisma.userModel.findUnique({
		where: { email: user.email },
	});

	if (dbUser) throw new Error("User already exist");

	const result = await prisma.userModel.create({
		data: { ...user, password: await hashPassword(user.password) },
	});
	return result as User;
};

export const userLogin = async ({
	email,
	password,
}: UserLogin): Promise<{ user: User; token: string }> => {
	const dbUser = await prisma.userModel.findUnique({
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
};
