import cors from "cors";
import express, { Application, Request, Response } from "express";
import cookieParser from "cookie-parser";
import router from "./app/routes";
import globalErrorHandler from "./app/middlewares/globalErrorhandler";
import notFound from "./app/middlewares/notFound";

const app: Application = express();

// parsers
app.use(express.json());
app.use(cookieParser());
// app.use(cors({ origin: [""] }));
app.use(cors({ origin: "*"}));

// application routes
app.use("/api", router);

const test = async (req: Request, res: Response) => {
  Promise.reject();
};

app.get("/", (req: Request, res: Response) => {
  res.status(404).json({
    message: "Welcome to sporting-goods-server",
  });
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
