import { Router } from "express";
import { analyzeActivity, getESGReport } from "../controllers/aiController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { body } from "express-validator";
import handleValidation from "../utils/validationHandler.js";

const router = Router();

router.post(
  "/analyze",
  protect,
  authorize("Admin", "DepartmentHead"),
  [
    body("description")
      .notEmpty()
      .withMessage("Description is required")
      .trim(),
    body("participationId")
      .optional()
      .isMongoId()
      .withMessage("Invalid Participation ID"),
  ],
  handleValidation,
  analyzeActivity
);

router.post(
  "/report",
  protect,
  authorize("Admin", "DepartmentHead"),
  [
    body("department")
      .notEmpty()
      .withMessage("Department is required")
      .trim(),
    body("startDate")
      .optional()
      .isISO8601()
      .withMessage("Start date must be a valid date"),
    body("endDate")
      .optional()
      .isISO8601()
      .withMessage("End date must be a valid date"),
  ],
  handleValidation,
  getESGReport
);

export default router;
