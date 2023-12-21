import { NextFunction, Request, Response } from "express";
import { SearchQuery } from "../types/requests";
import { SearchResponse } from "../types/responces";
import { globalSearch } from "../api/controllers/search.controller";

const search = async (
	req: Request<any, any, any, SearchQuery>,
	res: Response<SearchResponse>,
	next: NextFunction
) => {
	try {
		const { q } = req.query;

		const data = await globalSearch(q);

		res.status(200).json({
			data,
			status: 200,
		});
	} catch (error: any) {
		res.status(400).json({ data: { error: error.message }, status: 400 });
	}
};

export const searchService = {
	api: {
		search,
	},
};
