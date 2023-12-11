import { NextFunction, Request, Response } from "express";
import { PostReqParams } from "../types/requests";
import { PostResponse } from "../types/responces";
import { getVideoPosts } from "../api/controllers/post.controllers";

const getPosts = async (
	req: Request<PostReqParams>,
	res: Response<PostResponse>,
	next: NextFunction
) => {
	try {
		const { limit, page } = req.params;

		const data = await getVideoPosts(limit, page);

		res.status(200).json({
			data,
			status: 200,
		});
	} catch (error: any) {
		res.status(400).json({ data: { error: error.message }, status: 400 });
	}
};
export const postService = {
	api: {
		getPosts,
	},
};
