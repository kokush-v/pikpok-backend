import { User } from "../requests";

declare module "express" {
	export interface Request {
		user?: User;
	}
}
