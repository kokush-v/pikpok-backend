import { createServer } from "http";
import { app } from "./server";
import { Server } from "socket.io";
import { saveMessage } from "./api/controllers/chat.controller";
import { Message } from "./types/zod/message.schema";

export const httpServer = createServer(app);
const io = new Server(httpServer, {
	cors: {
		origin: "http://localhost:80",
		methods: ["GET", "POST"],
	},
});

io.on("connection", async (socket) => {
	const { room } = socket.handshake.query as { room: string };

	if (!room) return;

	socket.join(room);

	socket.on("message", async (message: Message) => {
		const msg = await saveMessage(room, message);
		socket.emit("message", msg);
	});

	socket.on("disconnect", () => {});
});
