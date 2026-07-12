import { Router } from "express";
import {
  getOptimizedAdminDashboard,
  getOptimizedDepartmentDashboard,
  getOptimizedEmployeeDashboard,
} from "../controllers/dashboardOptimizationController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = Router();

router.get(
  "/admin",
  protect,
  authorize("Admin", "DepartmentHead"),
  getOptimizedAdminDashboard
);

router.get(
  "/department",
  protect,
  authorize("Admin", "DepartmentHead"),
  getOptimizedDepartmentDashboard
);

router.get(
  "/employee",
  protect,
  getOptimizedEmployeeDashboard
);

export default router;
