import { PrismaClient } from "@prisma/client";
import { UserRegistration, ReqUser, UserLogin, UserPatch } from "../../types/requests";
import { hashPassword } from "../../lib/bcrypt.config";
import bcrypt from "bcrypt";
import { generateToken } from "../../middleware/jwt";
import { GetUser } from "../../types/responces";
import { userPatchSchema } from "../../types/zod/user.shema";
const prisma = new PrismaClient();

export const userParametersToSearch = {
	id: true,
	username: true,
	avatarUrl: true,
	description: true,
	subscribers: true,
	subscribtions: true,
	chats: true,
};

export const userReg = async (user: UserRegistration): Promise<ReqUser> => {
	const dbUser = await prisma.userModel.findMany({
		where: {
			OR: [
				{
					email: user.email,
				},
				{
					username: user.username,
				},
			],
		},
	});

	if (dbUser.length !== 0) throw new Error("User already exists");

	const result = await prisma.userModel.create({
		data: {
			...user,
			password: await hashPassword(user.password),
			description: "",
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
}: UserLogin): Promise<{ user: ReqUser; token: string }> => {
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

export const userPatch = async (user: UserPatch): Promise<GetUser> => {
	try {
		const exist = await prisma.userModel.findUnique({ where: { username: user.username } });
		if (exist && exist.id !== user.id) throw Error("Username already taken");

		const updateData: UserPatch = {} as UserPatch;

		const parsedUser: UserPatch = userPatchSchema.parse(user);

		for (const key in parsedUser) {
			if (Object.prototype.hasOwnProperty.call(user, key)) {
				updateData[key as keyof UserPatch] = user[key as keyof UserPatch];
			}
		}

		const dbUser = await prisma.userModel.update({
			where: {
				id: user.id,
			},
			data: updateData,
			select: userParametersToSearch,
		});

		return dbUser;
	} catch (error: any) {
		console.log(error);
		throw error;
	}
};

export const findUserById = async (userId: string): Promise<GetUser | null> => {
	try {
		const dbUser = await prisma.userModel.findUnique({
			where: { id: userId },
			select: userParametersToSearch,
		});
		return dbUser;
	} catch (e: any) {
		return null;
	}
};

export const findUserByUniqueName = async (userName: string): Promise<GetUser | null> => {
	try {
		const dbUser = await prisma.userModel.findUnique({
			where: { username: userName.startsWith("@") ? userName.substring(1) : userName },
			select: userParametersToSearch,
		});
		return dbUser;
	} catch (e: any) {
		return null;
	}
};

export const followUserAction = async (userId: string, followId: string) => {
	await prisma.userModel.update({
		where: { id: followId },
		data: {
			subscribers: {
				push: userId,
			},
		},
	});

	await prisma.userModel.update({
		where: { id: userId },
		data: {
			subscribtions: {
				push: followId,
			},
		},
	});
};
export const unFollowUserAction = async (userId: string, followId: string) => {
	await prisma.userModel.update({
		where: {
			id: followId,
		},
		data: {
			subscribers: {
				set: await prisma.userModel
					.findUnique({ where: { id: followId } })
					.then((follow) => follow?.subscribers.filter((unFollowId) => unFollowId !== userId)),
			},
		},
	});

	await prisma.userModel.update({
		where: {
			id: userId,
		},
		data: {
			subscribtions: {
				set: await prisma.userModel
					.findUnique({ where: { id: userId } })
					.then((user) =>
						user?.subscribtions.filter((unSubscribtionId) => unSubscribtionId !== followId)
					),
			},
		},
	});
};

export const isUserFollower = async (userId: string, followId: string): Promise<boolean> => {
	const user = await prisma.userModel.findUniqueOrThrow({
		where: { id: followId },
	});

	const isFollower = user?.subscribers.some((subscriberId) => subscriberId === userId);

	return isFollower;
};
