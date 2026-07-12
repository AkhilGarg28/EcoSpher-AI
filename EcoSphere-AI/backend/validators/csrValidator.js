import { body } from "express-validator";

const createCSRValidator = [
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .trim(),
  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .isMongoId()
    .withMessage("Invalid Category ID"),
  body("organizer")
    .notEmpty()
    .withMessage("Organizer is required")
    .isMongoId()
    .withMessage("Invalid Organizer User ID"),
  body("location")
    .notEmpty()
    .withMessage("Location is required")
    .trim(),
  body("startDate")
    .notEmpty()
    .withMessage("Start date is required")
    .isISO8601()
    .withMessage("Start date must be a valid date"),
  body("endDate")
    .notEmpty()
    .withMessage("End date is required")
    .isISO8601()
    .withMessage("End date must be a valid date"),
  body("maximumParticipants")
    .notEmpty()
    .withMessage("Maximum participants count is required")
    .isNumeric()
    .withMessage("Maximum participants must be a number"),
  body("status")
    .optional()
    .isIn(["Draft", "Open", "Completed", "Cancelled"])
    .withMessage("Status must be Draft, Open, Completed, or Cancelled"),
];

const updateCSRValidator = [
  body("title")
    .optional()
    .notEmpty()
    .withMessage("Title cannot be empty")
    .trim(),
  body("category")
    .optional()
    .isMongoId()
    .withMessage("Invalid Category ID"),
  body("organizer")
    .optional()
    .isMongoId()
    .withMessage("Invalid Organizer User ID"),
  body("location")
    .optional()
    .notEmpty()
    .withMessage("Location cannot be empty")
    .trim(),
  body("startDate")
    .optional()
    .isISO8601()
    .withMessage("Start date must be a valid date"),
  body("endDate")
    .optional()
    .isISO8601()
    .withMessage("End date must be a valid date"),
  body("maximumParticipants")
    .optional()
    .isNumeric()
    .withMessage("Maximum participants must be a number"),
  body("status")
    .optional()
    .isIn(["Draft", "Open", "Completed", "Cancelled"])
    .withMessage("Status must be Draft, Open, Completed, or Cancelled"),
];

export { createCSRValidator, updateCSRValidator };
