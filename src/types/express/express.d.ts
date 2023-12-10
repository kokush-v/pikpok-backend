import { ReqUser } from "../requests";

declare module "express" {
	export interface Request {
		user?: ReqUser;
	}
}
