import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { RentalServices } from "./rental.service";

const createRental = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;

  const result = await RentalServices.createRentalIntoDB(
    refreshToken,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Rental created successfully",
    data: result,
  });
});

const getAllRentals = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await RentalServices.getAllRentalsFromDB(refreshToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Rentals retrieved successfully",
    data: result,
  });
});

const returnBike = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { refreshToken } = req.cookies;
  const result = await RentalServices.returnBikeInToDB(refreshToken, id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Bike returned successfully",
    data: result,
  });
});

export const RentalControllers = {
  createRental,
  getAllRentals,
  returnBike,
};
