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
		data: {
			...user,
			password: await hashPassword(user.password),
			avatarUrl:
				"https://firebasestorage.googleapis.com/v0/b/pikpok-7e43d.appspot.com/o/avatars%2Fdefault-avatar.jpeg?alt=media&token=16fe35e9-f2b7-4306-ac55-5f3131c33ca6",
		},
		select: {
			id: true,
			username: true,
			email: true,
			avatarUrl: true,
		},
	});

	return result;
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

export const findUser = async (userId: string): Promise<User> => {
	const dbUser = await prisma.userModel.findUnique({
		where: { id: userId },
		select: {
			id: true,
			username: true,
			avatarUrl: true,
			subscribers: true,
			subscribtions: true,
		},
	});

	if (!dbUser) throw new Error("User doesn`t exist");

	return dbUser;
};
