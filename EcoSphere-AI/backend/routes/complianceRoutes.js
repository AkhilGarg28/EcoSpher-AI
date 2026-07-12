import { Router } from "express";
import {
  createComplianceIssue,
  getComplianceIssues,
  getComplianceIssueById,
  updateComplianceIssue,
  deleteComplianceIssue,
} from "../controllers/complianceController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import {
  createComplianceValidator,
  updateComplianceValidator,
} from "../validators/complianceValidator.js";
import handleValidation from "../utils/validationHandler.js";

const router = Router();

router.post(
  "/",
  protect,
  authorize("Admin"),
  createComplianceValidator,
  handleValidation,
  createComplianceIssue
);

router.get(
  "/",
  protect,
  getComplianceIssues
);

router.get(
  "/:id",
  protect,
  getComplianceIssueById
);

router.put(
  "/:id",
  protect,
  authorize("Admin"),
  updateComplianceValidator,
  handleValidation,
  updateComplianceIssue
);

router.delete(
  "/:id",
  protect,
  authorize("Admin"),
  deleteComplianceIssue
);

export default router;
