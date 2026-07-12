import { body } from "express-validator";

const createBadgeValidator = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .trim(),
  body("description")
    .notEmpty()
    .withMessage("Description is required")
    .trim(),
  body("unlockRule")
    .notEmpty()
    .withMessage("Unlock rule is required")
    .trim(),
  body("requiredXP")
    .notEmpty()
    .withMessage("Required XP is required")
    .isNumeric()
    .withMessage("Required XP must be a number"),
  body("status")
    .optional()
    .isIn(["Active", "Inactive"])
    .withMessage("Status must be either Active or Inactive"),
];

const updateBadgeValidator = [
  body("name")
    .optional()
    .notEmpty()
    .withMessage("Name cannot be empty")
    .trim(),
  body("description")
    .optional()
    .notEmpty()
    .withMessage("Description cannot be empty")
    .trim(),
  body("unlockRule")
    .optional()
    .notEmpty()
    .withMessage("Unlock rule cannot be empty")
    .trim(),
  body("requiredXP")
    .optional()
    .isNumeric()
    .withMessage("Required XP must be a number"),
  body("status")
    .optional()
    .isIn(["Active", "Inactive"])
    .withMessage("Status must be either Active or Inactive"),
];

export { createBadgeValidator, updateBadgeValidator };
