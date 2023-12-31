import { createServer } from "http";
import { app } from "./server";
import { Server } from "socket.io";
import { saveMessage } from "./api/controllers/chat.controller";
import { Message } from "./types/zod/message.schema";
import { findUserById } from "./api/controllers/user.controller";

export const httpServer = createServer(app);
const io = new Server(httpServer, {
	cors: {
		origin: "http://localhost",
		methods: ["GET", "POST"],
	},
});

io.on("connection", async (socket) => {
	try {
		socket.on("changeRoom", async (room) => {
			for (const room of socket.rooms) {
				if (room !== socket.id) socket.leave(room);
			}

			socket.join(room);
		});

		socket.on("message", async (message: Message) => {
			try {
				const room = Array.from(socket.rooms).filter((room) => room !== socket.id)[0];
				const dbMessage = await saveMessage(room, message);
				const user = await findUserById(message.userId);

				if (!user || !dbMessage) throw Error("Bad request");

				const msg = {
					user: { name: user.username, avatar: user.avatarUrl },
					id: dbMessage.messageId,
					text: dbMessage.text,
				};

				io.to(room).emit("message", msg);
			} catch (error) {
				console.log(error);
			}
		});

		socket.on("disconnect", () => {});
	} catch (error) {
		console.log(error);
	}
});
