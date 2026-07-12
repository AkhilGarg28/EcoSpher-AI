import { Router } from "express";
import {
  createPolicy,
  getPolicies,
  getPolicyById,
  updatePolicy,
  deletePolicy,
  acknowledgePolicy,
  getPolicyAcknowledgements,
  getMyAcknowledgements,
} from "../controllers/policyController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import {
  createPolicyValidator,
  updatePolicyValidator,
} from "../validators/policyValidator.js";
import handleValidation from "../utils/validationHandler.js";

const router = Router();

router.post(
  "/",
  protect,
  authorize("Admin"),
  createPolicyValidator,
  handleValidation,
  createPolicy
);

router.get(
  "/",
  protect,
  getPolicies
);

router.get(
  "/acknowledgements",
  protect,
  authorize("Admin"),
  getPolicyAcknowledgements
);

router.get(
  "/my-acknowledgements",
  protect,
  getMyAcknowledgements
);

router.get(
  "/:id",
  protect,
  getPolicyById
);

router.put(
  "/:id",
  protect,
  authorize("Admin"),
  updatePolicyValidator,
  handleValidation,
  updatePolicy
);

router.delete(
  "/:id",
  protect,
  authorize("Admin"),
  deletePolicy
);

router.post(
  "/:id/acknowledge",
  protect,
  acknowledgePolicy
);

export default router;
