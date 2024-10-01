import cors from "cors";
import express, { Application, NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import routers from "./app/routes";
import globalErrorHandler from "./app/middlewares/globalErrorhandler";
import notFound from "./app/middlewares/notFound";
import config from "./app/config";
import httpStatus from "http-status";

const app: Application = express();

app.use(
  cors({
    credentials: true,
    origin: [config.client_url as string],
  })
);
// parsers
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));


// application routes
app.use("/api/v1", routers);

const test = async (req: Request, res: Response) => {
  Promise.reject();
};

app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.OK).json({
    success: true,
    message: 'Welcome to the Lost And Found API',
  });
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
