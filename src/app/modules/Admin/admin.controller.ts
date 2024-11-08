import { Request, Response } from "express";

import pick from "../../../shared/pick";
import { adminFilterableFields } from "./admin.constant";
import { AdminService } from "./admin.service";

const getAllAdmin = async (req: Request, res: Response) => {
  try {
    const filter = pick(req.query, adminFilterableFields);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

    const result = await AdminService.getAllFromDB(filter, options);

    res.status(200).json({
      success: true,
      message: "All admin retrieved successfully",
      meta: result.meta,
      data: result.data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error?.name || "Something went wrong",
      error: error,
    });
  }
};

const getAdminById = async (req: Request, res: Response) => {
  try {
    const result = await AdminService.getAdminById(req.params.id);
    res.status(200).json({
      success: true,
      message: "Admin retrieved successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error?.name || "Something went wrong",
      error: error,
    });
  }
};

const updateAdmin = async (req: Request, res: Response) => {
  try {
    const result = await AdminService.updateAdmin(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: "Admin updated successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error?.name || "Something went wrong",
      error: error,
    });
  }
};

export const AdminController = {
  getAllAdmin,
  getAdminById,
  updateAdmin,
};
