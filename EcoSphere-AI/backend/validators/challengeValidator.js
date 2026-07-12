import { body } from "express-validator";

const createChallengeValidator = [
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .trim(),
  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .isMongoId()
    .withMessage("Invalid Category ID"),
  body("description")
    .optional()
    .trim(),
  body("xp")
    .notEmpty()
    .withMessage("XP is required")
    .isNumeric()
    .withMessage("XP must be a number"),
  body("difficulty")
    .notEmpty()
    .withMessage("Difficulty is required")
    .isIn(["Easy", "Medium", "Hard"])
    .withMessage("Difficulty must be Easy, Medium, or Hard"),
  body("evidenceRequired")
    .optional()
    .isBoolean()
    .withMessage("Evidence required must be a boolean value"),
  body("deadline")
    .notEmpty()
    .withMessage("Deadline is required")
    .isISO8601()
    .withMessage("Deadline must be a valid ISO8601 date"),
  body("status")
    .optional()
    .isIn(["Draft", "Active", "UnderReview", "Completed", "Archived"])
    .withMessage("Status must be Draft, Active, UnderReview, Completed, or Archived"),
];

const updateChallengeValidator = [
  body("title")
    .optional()
    .notEmpty()
    .withMessage("Title cannot be empty")
    .trim(),
  body("category")
    .optional()
    .isMongoId()
    .withMessage("Invalid Category ID"),
  body("description")
    .optional()
    .trim(),
  body("xp")
    .optional()
    .isNumeric()
    .withMessage("XP must be a number"),
  body("difficulty")
    .optional()
    .isIn(["Easy", "Medium", "Hard"])
    .withMessage("Difficulty must be Easy, Medium, or Hard"),
  body("evidenceRequired")
    .optional()
    .isBoolean()
    .withMessage("Evidence required must be a boolean value"),
  body("deadline")
    .optional()
    .isISO8601()
    .withMessage("Deadline must be a valid ISO8601 date"),
  body("status")
    .optional()
    .isIn(["Draft", "Active", "UnderReview", "Completed", "Archived"])
    .withMessage("Status must be Draft, Active, UnderReview, Completed, or Archived"),
];

export { createChallengeValidator, updateChallengeValidator };
