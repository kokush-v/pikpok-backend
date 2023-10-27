import { Express } from "express";
import { userActions } from "./actions/user.actions";
import { validateLogin, validateRegistration } from "./middleware/validator";
import { validateToken } from "./middleware/jwt";

export const routes = (app: Express) => {
	app.post("/registration", validateRegistration, userActions.api.reg);
	app.post("/login", validateLogin, userActions.api.login);
	app.get("/user", validateToken, userActions.api.get);
};
