import { Router } from "express";
import {
  getEnvironmentalReport,
  getSocialReport,
  getGovernanceReport,
  getESGSummary,
  getCustomReport,
} from "../controllers/reportController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = Router();

router.get(
  "/environmental",
  protect,
  authorize("Admin", "DepartmentHead"),
  getEnvironmentalReport
);

router.get(
  "/social",
  protect,
  authorize("Admin", "DepartmentHead"),
  getSocialReport
);

router.get(
  "/governance",
  protect,
  authorize("Admin", "DepartmentHead"),
  getGovernanceReport
);

router.get(
  "/esg-summary",
  protect,
  authorize("Admin", "DepartmentHead"),
  getESGSummary
);

router.get(
  "/custom",
  protect,
  authorize("Admin", "DepartmentHead"),
  getCustomReport
);

export default router;
