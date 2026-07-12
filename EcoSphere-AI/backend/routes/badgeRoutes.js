import { Router } from "express";
import {
  createBadge,
  getBadges,
  getBadgeById,
  updateBadge,
  deleteBadge,
} from "../controllers/badgeController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import {
  createBadgeValidator,
  updateBadgeValidator,
} from "../validators/badgeValidator.js";
import handleValidation from "../utils/validationHandler.js";

const router = Router();

router.post(
  "/",
  protect,
  authorize("Admin"),
  createBadgeValidator,
  handleValidation,
  createBadge
);

router.get(
  "/",
  protect,
  getBadges
);

router.get(
  "/:id",
  protect,
  getBadgeById
);

router.put(
  "/:id",
  protect,
  authorize("Admin"),
  updateBadgeValidator,
  handleValidation,
  updateBadge
);

router.delete(
  "/:id",
  protect,
  authorize("Admin"),
  deleteBadge
);

export default router;
