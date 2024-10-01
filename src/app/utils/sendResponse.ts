import { Response } from "express";
import httpStatus from "http-status";

type TResponse<T> = {
  statusCode: number;
  success: boolean;
  message: string;
  token?: string;
  data: T;
};

const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  if (data.data === null || data.data === undefined || (Array.isArray(data.data) && data.data.length === 0)) {
    res.status(httpStatus.NOT_FOUND).json({
      success: false,
      message: "No Data Found",
      data: data.data,
    });
  }
};


export default sendResponse;
