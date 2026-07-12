import { Router } from "express";
import {
  createChallenge,
  getChallenges,
  getChallengeById,
  updateChallenge,
  deleteChallenge,
} from "../controllers/challengeController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import {
  createChallengeValidator,
  updateChallengeValidator,
} from "../validators/challengeValidator.js";
import handleValidation from "../utils/validationHandler.js";

const router = Router();

router.post(
  "/",
  protect,
  authorize("Admin"),
  createChallengeValidator,
  handleValidation,
  createChallenge
);

router.get(
  "/",
  protect,
  getChallenges
);

router.get(
  "/:id",
  protect,
  getChallengeById
);

router.put(
  "/:id",
  protect,
  authorize("Admin"),
  updateChallengeValidator,
  handleValidation,
  updateChallenge
);

router.delete(
  "/:id",
  protect,
  authorize("Admin"),
  deleteChallenge
);

export default router;
