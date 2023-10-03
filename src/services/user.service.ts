import { NextFunction, Request, Response } from "express";
import { UserLogin, UserRegistration, Video } from "../types/requests";
import { UserRegistrationResponse, VideoUploadResponse } from "../types/responces";
import { userLogin, userReg } from "../api/controllers/user.controller";
import { videoUpload } from "../api/controllers/video.controller";

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
		res.status(400).json({ data: error, status: 400 });
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

const get = async (req: any, res: Response<UserRegistrationResponse>, next: NextFunction) => {
	try {
		const user = req.user;

		res.status(200).json({
			data: user,
			status: 200,
		});
	} catch (error: any) {
		res.status(400).json({ data: error, status: 400 });
	}
};

const uploadVideo = async (
	req: Request,
	res: Response<VideoUploadResponse>,
	next: NextFunction
) => {
	try {
		const file = req.file;

		const response = await videoUpload(file);

		res.status(200).json({
			data: file,
			message: "Pikpoker",
			status: 200,
		});
	} catch (error: any) {
		res.status(400).json({ data: error, status: 400 });
	}
};

export const userActions = {
	api: {
		reg,
		login,
		get,
		uploadVideo,
	},
};
