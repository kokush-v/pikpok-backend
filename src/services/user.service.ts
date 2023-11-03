import { NextFunction, Request, Response } from "express";
import { User, UserLogin, UserRegistration, UserFile, GetUserParam } from "../types/requests";
import { UserRegistrationResponse, FileUploadResponse } from "../types/responces";
import { findUser, userLogin, userReg } from "../api/controllers/user.controller";
import { avatarUpload, videoUpload } from "../api/controllers/file.controller";

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

const get = async (
	req: Request<GetUserParam>,
	res: Response<UserRegistrationResponse>,
	next: NextFunction
) => {
	try {
		const { userId } = req.params;

		const user = await findUser(userId);

		res.status(200).json({
			data: user,
			status: 200,
		});
	} catch (error: any) {
		res.status(400).json({ data: { error: error.message }, status: 400 });
	}
};

const getCurrent = async (
	req: Request,
	res: Response<UserRegistrationResponse>,
	next: NextFunction
) => {
	try {
		const user = req.user;

		res.status(200).json({
			data: user,
			status: 200,
		});
	} catch (error: any) {
		res.status(400).json({ data: { error: error.message }, status: 400 });
	}
};

const uploadVideo = async (req: Request, res: Response<FileUploadResponse>, next: NextFunction) => {
	try {
		const file: UserFile = {
			user: req.user,
			file: req.file,
		};

		const response = await videoUpload(file);

		res.status(200).json({
			data: { fileUrl: response },
			message: "Video was uploaded",
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

export const userActions = {
	api: {
		reg,
		login,
		get,
		getCurrent,
		uploadVideo,
		updateAvatar,
	},
};
