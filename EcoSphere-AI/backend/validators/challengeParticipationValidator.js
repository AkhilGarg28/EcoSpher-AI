import { body } from "express-validator";

const joinChallengeValidator = [
  body("challenge")
    .notEmpty()
    .withMessage("Challenge ID is required")
    .isMongoId()
    .withMessage("Invalid Challenge ID"),
];

const submitProofValidator = [
  body("challenge")
    .notEmpty()
    .withMessage("Challenge ID is required")
    .isMongoId()
    .withMessage("Invalid Challenge ID"),
  body("proof")
    .notEmpty()
    .withMessage("Proof is required")
    .trim(),
];

export { joinChallengeValidator, submitProofValidator };
