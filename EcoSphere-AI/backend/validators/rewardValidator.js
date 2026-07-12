import { body } from "express-validator";

const createRewardValidator = [
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .trim(),
  body("description")
    .notEmpty()
    .withMessage("Description is required")
    .trim(),
  body("pointsRequired")
    .notEmpty()
    .withMessage("Points required is required")
    .isNumeric()
    .withMessage("Points required must be a number"),
  body("stock")
    .notEmpty()
    .withMessage("Stock count is required")
    .isNumeric()
    .withMessage("Stock must be a number"),
  body("status")
    .optional()
    .isIn(["Active", "Inactive"])
    .withMessage("Status must be either Active or Inactive"),
];

const updateRewardValidator = [
  body("title")
    .optional()
    .notEmpty()
    .withMessage("Title cannot be empty")
    .trim(),
  body("description")
    .optional()
    .notEmpty()
    .withMessage("Description cannot be empty")
    .trim(),
  body("pointsRequired")
    .optional()
    .isNumeric()
    .withMessage("Points required must be a number"),
  body("stock")
    .optional()
    .isNumeric()
    .withMessage("Stock must be a number"),
  body("status")
    .optional()
    .isIn(["Active", "Inactive"])
    .withMessage("Status must be either Active or Inactive"),
];

const redeemRewardValidator = [
  body("rewardId")
    .notEmpty()
    .withMessage("Reward ID is required")
    .isMongoId()
    .withMessage("Invalid Reward ID"),
];

export { createRewardValidator, updateRewardValidator, redeemRewardValidator };
