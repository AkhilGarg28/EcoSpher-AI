import { Router } from "express";
import {
  getDepartmentRankings,
  getOrganizationScore,
} from "../controllers/esgController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = Router();

router.get(
  "/departments",
  protect,
  authorize("Admin", "DepartmentHead"),
  getDepartmentRankings
);

router.get(
  "/organization",
  protect,
  authorize("Admin"),
  getOrganizationScore
);

export default router;
