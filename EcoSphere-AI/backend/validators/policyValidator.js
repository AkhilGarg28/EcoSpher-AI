import { body } from "express-validator";

const createPolicyValidator = [
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .trim(),
  body("content")
    .notEmpty()
    .withMessage("Content is required")
    .trim(),
  body("description")
    .optional()
    .trim(),
  body("version")
    .optional()
    .trim(),
  body("status")
    .optional()
    .isIn(["Active", "Archived"])
    .withMessage("Status must be Active or Archived"),
];

const updatePolicyValidator = [
  body("title")
    .optional()
    .notEmpty()
    .withMessage("Title cannot be empty")
    .trim(),
  body("content")
    .optional()
    .notEmpty()
    .withMessage("Content cannot be empty")
    .trim(),
  body("description")
    .optional()
    .trim(),
  body("version")
    .optional()
    .trim(),
  body("status")
    .optional()
    .isIn(["Active", "Archived"])
    .withMessage("Status must be Active or Archived"),
];

export { createPolicyValidator, updatePolicyValidator };
