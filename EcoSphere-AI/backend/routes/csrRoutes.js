import { Router } from "express";
import {
  createCSR,
  getCSRActivities,
  getCSRById,
  updateCSR,
  deleteCSR,
  submitActivityReport,
  getMySubmissions,
} from "../controllers/csrController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import {
  createCSRValidator,
  updateCSRValidator,
} from "../validators/csrValidator.js";
import handleValidation from "../utils/validationHandler.js";

const router = Router();

router.post(
  "/",
  protect,
  authorize("Admin"),
  createCSRValidator,
  handleValidation,
  createCSR
);

router.get(
  "/",
  protect,
  getCSRActivities
);

router.post(
  "/submit",
  protect,
  submitActivityReport
);

router.get(
  "/my-submissions",
  protect,
  getMySubmissions
);

router.get(
  "/:id",
  protect,
  getCSRById
);

router.put(
  "/:id",
  protect,
  authorize("Admin"),
  updateCSRValidator,
  handleValidation,
  updateCSR
);

router.delete(
  "/:id",
  protect,
  authorize("Admin"),
  deleteCSR
);

export default router;
