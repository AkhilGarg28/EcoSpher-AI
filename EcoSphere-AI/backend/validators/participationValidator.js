import { body } from "express-validator";

const joinActivityValidator = [
  body("activity")
    .notEmpty()
    .withMessage("Activity is required")
    .isMongoId()
    .withMessage("Invalid Activity ID"),
];

const submitProofValidator = [
  body("activity")
    .notEmpty()
    .withMessage("Activity is required")
    .isMongoId()
    .withMessage("Invalid Activity ID"),
  body("proof")
    .notEmpty()
    .withMessage("Proof is required")
    .trim(),
];

export { joinActivityValidator, submitProofValidator };
