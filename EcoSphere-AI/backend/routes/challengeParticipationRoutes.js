import { Router } from "express";
import {
  joinChallenge,
  submitProof,
  getMyParticipations,
  getAllParticipations,
  approveParticipation,
  rejectParticipation,
} from "../controllers/challengeParticipationController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import {
  joinChallengeValidator,
  submitProofValidator,
} from "../validators/challengeParticipationValidator.js";
import handleValidation from "../utils/validationHandler.js";

const router = Router();

router.post(
  "/join",
  protect,
  joinChallengeValidator,
  handleValidation,
  joinChallenge
);

router.post(
  "/submit-proof",
  protect,
  submitProofValidator,
  handleValidation,
  submitProof
);

router.get(
  "/my",
  protect,
  getMyParticipations
);

router.get(
  "/",
  protect,
  authorize("Admin"),
  getAllParticipations
);

router.put(
  "/:id/approve",
  protect,
  authorize("Admin", "DepartmentHead"),
  approveParticipation
);

router.put(
  "/:id/reject",
  protect,
  authorize("Admin", "DepartmentHead"),
  rejectParticipation
);

export default router;
