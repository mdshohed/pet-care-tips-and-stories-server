import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

const notFound = (req: Request, res: Response, next: NextFunction) => {
  const statusCode = 404;
  return res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "Not Found",
    statusCode: statusCode,
  });
};

export default notFound;
