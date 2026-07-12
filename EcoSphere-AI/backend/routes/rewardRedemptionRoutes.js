import { Router } from "express";
import { redeemReward } from "../controllers/rewardRedemptionController.js";
import { protect } from "../middleware/authMiddleware.js";
import { redeemRewardValidator } from "../validators/rewardValidator.js";
import handleValidation from "../utils/validationHandler.js";

const router = Router();

router.post(
  "/redeem",
  protect,
  redeemRewardValidator,
  handleValidation,
  redeemReward
);

export default router;
