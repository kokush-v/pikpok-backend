import { Express } from "express";
import { userService } from "./services/user.service";
import { validateLogin, validateRegistration } from "./middleware/validator";
import { validateAuthToken, validateAuthTokenPublic } from "./middleware/jwt";
import { upload } from "./middleware/firebase";
import { postService } from "./services/post.service";
import { chatService } from "./services/chat.service";
import { searchService } from "./services/search.service";
import { isAdmin } from "./middleware/admin";

export const routes = (app: Express) => {
	app.post("/auth/registration", validateRegistration, userService.api.reg);
	app.post("/auth/login", validateLogin, userService.api.login);

	app.patch("/user/patch", validateAuthToken, userService.api.patch);
	app.get("/user", validateAuthToken, userService.api.getCurrent);
	app.get("/user/chats", validateAuthToken, userService.api.getChats);
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
	app.delete("/video/posts/:postId", validateAuthToken, isAdmin, postService.api.deletePost);

	app.put("/chat/create", validateAuthToken, chatService.api.createRoom);
	app.get("/chat/:chatId", validateAuthToken, chatService.api.findChat);
	app.get("/search", validateAuthTokenPublic, searchService.api.search);
};
