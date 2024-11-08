import express from "express";
import { AdminController } from "./admin.controller";

const router = express.Router();

router.get("/", AdminController.getAllAdmin);

router.get("/:id", AdminController.getAdminById);

router.patch("/:id", AdminController.updateAdmin);

router.delete("/:id", AdminController.deleteAdmin);

export const AdminRoutes = router;
