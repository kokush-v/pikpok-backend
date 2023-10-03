import { Express } from "express";
import { userActions } from "./routes/user.actions";

export const routes = (app: Express) => {
	app.post("/registration", userActions.api.reg);
};
