import mongoose from "mongoose";

const complianceIssueSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Owner is required"],
    },
    severity: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Medium",
    },
    status: {
      type: String,
      enum: ["Open", "In Progress", "Resolved", "Overdue"],
      default: "Open",
    },
    dueDate: {
      type: Date,
      required: [true, "Due date is required"],
    },
    assignedDepartment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: [true, "Assigned department is required"],
    },
  },
  {
    timestamps: true,
  }
);

const ComplianceIssue = mongoose.model("ComplianceIssue", complianceIssueSchema);

export default ComplianceIssue;
