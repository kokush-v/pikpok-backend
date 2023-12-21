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
	socket.on("changeRoom", async (room) => {
		for (const room of socket.rooms) {
			if (room !== socket.id) socket.leave(room);
		}

		socket.join(room);
	});

	socket.on("message", async (message: Message) => {
		const room = Object.keys(socket.rooms).filter((room) => room !== socket.id)[0];
		const msg = await saveMessage(room, message);
		console.log(socket.rooms);
		socket.emit("message", msg);
	});

	socket.on("disconnect", () => {});
});
