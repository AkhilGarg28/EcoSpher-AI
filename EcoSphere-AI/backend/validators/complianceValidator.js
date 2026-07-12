import { body } from "express-validator";

const createComplianceValidator = [
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .trim(),
  body("description")
    .notEmpty()
    .withMessage("Description is required")
    .trim(),
  body("owner")
    .notEmpty()
    .withMessage("Owner is required")
    .isMongoId()
    .withMessage("Invalid Owner User ID"),
  body("severity")
    .optional()
    .isIn(["Low", "Medium", "High", "Critical"])
    .withMessage("Severity must be Low, Medium, High, or Critical"),
  body("status")
    .optional()
    .isIn(["Open", "In Progress", "Resolved", "Overdue"])
    .withMessage("Status must be Open, In Progress, Resolved, or Overdue"),
  body("dueDate")
    .notEmpty()
    .withMessage("Due date is required")
    .isISO8601()
    .withMessage("Due date must be a valid date"),
  body("assignedDepartment")
    .notEmpty()
    .withMessage("Assigned department is required")
    .isMongoId()
    .withMessage("Invalid Department ID"),
];

const updateComplianceValidator = [
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
  body("owner")
    .optional()
    .isMongoId()
    .withMessage("Invalid Owner User ID"),
  body("severity")
    .optional()
    .isIn(["Low", "Medium", "High", "Critical"])
    .withMessage("Severity must be Low, Medium, High, or Critical"),
  body("status")
    .optional()
    .isIn(["Open", "In Progress", "Resolved", "Overdue"])
    .withMessage("Status must be Open, In Progress, Resolved, or Overdue"),
  body("dueDate")
    .optional()
    .isISO8601()
    .withMessage("Due date must be a valid date"),
  body("assignedDepartment")
    .optional()
    .isMongoId()
    .withMessage("Invalid Department ID"),
];

export { createComplianceValidator, updateComplianceValidator };
