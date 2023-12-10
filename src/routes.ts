import { Express } from "express";
import { userActions } from "./services/user.service";
import { validateLogin, validateRegistration } from "./middleware/validator";
import { validateAuthToken, validateAuthTokenPublic } from "./middleware/jwt";
import { upload } from "./middleware/firebase";

export const routes = (app: Express) => {
	app.post("/auth/registration", validateRegistration, userActions.api.reg);
	app.post("/auth/login", validateLogin, userActions.api.login);

	app.get("/user", validateAuthToken, userActions.api.getCurrent);
	app.get("/user/:userId", validateAuthTokenPublic, userActions.api.get);
	app.post(
		"/user/:userId/video/post",
		upload.single("file"),
		validateAuthToken,
		userActions.api.uploadVideo
	);
	app.post(
		"/user/:userId/avatar/update",
		upload.single("file"),
		validateAuthToken,
		userActions.api.updateAvatar
	);
	app.get("/user/:followId/follow", validateAuthToken, userActions.api.followUser);
};
