import { NextFunction, Request, Response } from "express";
import {
	ReqUser,
	UserLogin,
	UserRegistration,
	UserFile,
	GetUserParam,
	GetSubscribeParams,
	UserPatch,
	PostReq,
	Post,
} from "../types/requests";
import {
	UserRegistrationResponse,
	FileUploadResponse,
	SubscribeResponse,
	GetUserResponse,
	GetCurrentUserResponse,
	GetUser,
	GetCurrentUser,
	GetChatsResponse,
} from "../types/responces";
import {
	findUserById,
	findUserByUniqueName,
	followUserAction,
	isUserFollower,
	unFollowUserAction,
	userLogin,
	userPatch,
	userReg,
} from "../api/controllers/user.controller";
import { avatarUpload, videoUpload } from "../api/controllers/file.controller";
import { createPost } from "../api/controllers/post.controllers";
import { searchAdmin } from "../api/controllers/role.contoller";

const reg = async (
	req: Request<unknown, unknown, UserRegistration>,
	res: Response<UserRegistrationResponse>,
	next: NextFunction
) => {
	try {
		const user = req.body;
		const response = await userReg(user);

		res.status(200).json({
			data: response,
			message: "Pikpoker was added",
			status: 200,
		});
	} catch (error: any) {
		res.status(400).json({ data: { error: error.message }, status: 400 });
	}
};

const login = async (
	req: Request<unknown, unknown, UserLogin>,
	res: Response<UserRegistrationResponse>,
	next: NextFunction
) => {
	try {
		const user = req.body;
		const response = await userLogin(user);

		res.cookie("access-token", response.token, {
			maxAge: 86400000, // 1 day
		});

		res.status(200).json({
			data: response,
			message: "Pikpoker logined",
			status: 200,
		});
	} catch (error: any) {
		res.status(400).json({ data: { error: error.message }, status: 400 });
	}
};

const patch = async (
	req: Request<GetUserParam, unknown, UserPatch>,
	res: Response<GetUserResponse>,
	next: NextFunction
) => {
	try {
		const reqUser = req.user;
		const user = req.body;

		if (!reqUser) throw Error("Not authorize");

		const response = await userPatch({ ...user, id: reqUser.id });

		res.status(200).json({
			data: response,
			message: "Pikpoker edited",
			status: 200,
		});
	} catch (error: any) {
		res.status(400).json({ data: { error: error.message }, status: 400 });
	}
};

const get = async (
	req: Request<GetUserParam>,
	res: Response<GetUserResponse>,
	next: NextFunction
) => {
	try {
		const { userNameOrId } = req.params;
		const reqUser = req.user;
		const data = (await findUserById(userNameOrId)) || (await findUserByUniqueName(userNameOrId));

		if (!data) {
			throw Error("User not exist");
		}
		const { chats, ...user } = data as GetCurrentUser;

		const followed = reqUser && user ? await isUserFollower(reqUser.id, user.id) : false;

		res.status(200).json({
			data: { ...user, followed },
			status: 200,
		});
	} catch (error: any) {
		res.status(400).json({ data: { error: error.message }, status: 400 });
	}
};

const getCurrent = async (
	req: Request,
	res: Response<GetCurrentUserResponse>,
	next: NextFunction
) => {
	try {
		const reqUser = req.user;

		if (!reqUser) throw Error("Not authorize");

		const user = await findUserById(reqUser.id);
		const isAdmin = await searchAdmin(reqUser.id);

		res.status(200).json({
			data: { ...user, isAdmin },
			status: 200,
		});
	} catch (error: any) {
		res.status(400).json({ data: { error: error.message }, status: 400 });
	}
};

const getChats = async (req: Request, res: Response<GetChatsResponse>, next: NextFunction) => {
	try {
		const reqUser = req.user;

		if (!reqUser) throw Error("Not authorize");

		const { chats } = (await findUserById(reqUser.id)) as GetCurrentUser;

		res.status(200).json({
			data: chats,
			status: 200,
		});
	} catch (error: any) {
		res.status(400).json({ data: { error: error.message }, status: 400 });
	}
};

const updateAvatar = async (
	req: Request,
	res: Response<FileUploadResponse>,
	next: NextFunction
) => {
	try {
		if (!req.user) throw Error("Not authorize");

		const file: UserFile = {
			user: req.user,
			file: req.file,
		};

		const response = await avatarUpload(file);

		res.status(200).json({
			data: { fileUrl: response },
			message: "Avatar was changed",
			status: 200,
		});
	} catch (error: any) {
		res.status(400).json({ data: { error: error.message }, status: 400 });
	}
};

const followUser = async (
	req: Request<GetSubscribeParams>,
	res: Response<SubscribeResponse>,
	next: NextFunction
) => {
	try {
		const currentUser = req.user;
		const { followId } = req.params;

		if (currentUser?.id === followId) {
			throw Error("Can't follow yourself");
		}

		if (!currentUser) {
			throw Error("Not authorized");
		}

		const isFollower = await isUserFollower(currentUser.id, followId);
		let message = "User followed";

		if (isFollower) {
			unFollowUserAction(currentUser.id, followId);
			message = "User unfollowed";
		} else {
			followUserAction(currentUser.id, followId);
		}

		res.status(200).json({
			data: {
				success: "OK",
			},
			message,
			status: 200,
		});
	} catch (error: any) {
		res.status(400).json({ data: { error: error.message }, status: 400 });
	}
};

export const userService = {
	api: {
		reg,
		login,
		get,
		patch,
		getCurrent,
		getChats,
		updateAvatar,
		followUser,
	},
};
