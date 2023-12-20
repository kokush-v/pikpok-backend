import { Express } from "express";
import { userService } from "./services/user.service";
import { validateLogin, validateRegistration } from "./middleware/validator";
import { validateAuthToken, validateAuthTokenPublic } from "./middleware/jwt";
import { upload } from "./middleware/firebase";
import { postService } from "./services/post.service";
import { chatService } from "./services/chat.service";

export const routes = (app: Express) => {
	app.post("/auth/registration", validateRegistration, userService.api.reg);
	app.post("/auth/login", validateLogin, userService.api.login);

	app.patch("/user/:userNameOrId/patch", validateAuthToken, userService.api.patch);
	app.get("/user", validateAuthToken, userService.api.getCurrent);
	app.get("/user/:userNameOrId", validateAuthTokenPublic, userService.api.get);
	app.get("/user/:userNameOrId/posts", validateAuthTokenPublic, postService.api.getPostsByUser);
	app.post(
		"/user/video/post",
		upload.single("file"),
		validateAuthToken,
		postService.api.uploadPost
	);
	app.post(
		"/user/avatar/update",
		upload.single("file"),
		validateAuthToken,
		userService.api.updateAvatar
	);
	app.get("/user/:followId/follow", validateAuthToken, userService.api.followUser);

	app.get("/video/posts", validateAuthTokenPublic, postService.api.getPosts);
	app.get("/video/post/:postId", validateAuthTokenPublic, postService.api.getPost);
	app.get("/video/posts/:postId/like", validateAuthToken, postService.api.setLike);
	app.get(
		"/video/posts/:postId/comments",
		validateAuthTokenPublic,
		postService.api.getCommentsByPostId
	);
	app.post("/video/posts/:postId/comment", validateAuthToken, postService.api.setComment);
	app.delete(
		"/video/posts/:postId/comment/:commentId",
		validateAuthToken,
		postService.api.deleteComment
	);
	app.put("/chat/create", validateAuthToken, chatService.api.createRoom);
};
