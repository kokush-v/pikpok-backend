import express, { Express } from "express";
import { routes } from "./routes";
import logger from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import { corsConfig } from "./configs/cors.config";

const app: Express = express();
const port = 5462;

app.use(cors(corsConfig));
app.use(cookieParser());
app.use(express.json());
app.use(logger("dev"));
routes(app);

app.listen(port, () => {
	console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
