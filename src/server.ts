import express, { Express } from "express";
import { routes } from "./routes";
import logger from "morgan";
import { config } from "./config";
import cors from "cors";
import cookieParser from "cookie-parser";
const app: Express = express();
const port = 5462;

app.use(cors(config.cors));
app.use(cookieParser());
app.use(express.json());
app.use(logger("dev"));
routes(app);

app.listen(port, () => {
	console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
