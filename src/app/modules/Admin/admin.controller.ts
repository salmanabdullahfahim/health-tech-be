import { NextFunction, Request, RequestHandler, Response } from "express";

import pick from "../../../shared/pick";
import { adminFilterableFields } from "./admin.constant";
import { AdminService } from "./admin.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";

const getAllAdmin: RequestHandler = catchAsync(async (req, res) => {
  const filter = pick(req.query, adminFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await AdminService.getAllFromDB(filter, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All admin retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getAdminById: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await AdminService.getAdminById(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin data fetched by id!",
    data: result,
  });
});

const updateAdmin: RequestHandler = catchAsync(async (req, res) => {
  const result = await AdminService.updateAdmin(req.params.id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Admin updated successfully",
    data: result,
  });
});

const deleteAdmin: RequestHandler = catchAsync(async (req, res) => {
  const result = await AdminService.deleteAdmin(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Admin deleted successfully",
    data: result,
  });
});
const softDeleteAdmin: RequestHandler = catchAsync(async (req, res) => {
  const result = await AdminService.softDeleteAdmin(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Admin soft deleted successfully",
    data: result,
  });
});

export const AdminController = {
  getAllAdmin,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  softDeleteAdmin,
};
