import { Router } from "express";
import {
  createReward,
  getRewards,
  getRewardById,
  updateReward,
  deleteReward,
} from "../controllers/rewardController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import {
  createRewardValidator,
  updateRewardValidator,
} from "../validators/rewardValidator.js";
import handleValidation from "../utils/validationHandler.js";

const router = Router();

router.post(
  "/",
  protect,
  authorize("Admin"),
  createRewardValidator,
  handleValidation,
  createReward
);

router.get(
  "/",
  protect,
  getRewards
);

router.get(
  "/:id",
  protect,
  getRewardById
);

router.put(
  "/:id",
  protect,
  authorize("Admin"),
  updateRewardValidator,
  handleValidation,
  updateReward
);

router.delete(
  "/:id",
  protect,
  authorize("Admin"),
  deleteReward
);

export default router;
