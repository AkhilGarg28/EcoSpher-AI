import mongoose from "mongoose";

const policyAcknowledgementSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Employee is required"],
    },
    policy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Policy",
      required: [true, "Policy is required"],
    },
    status: {
      type: String,
      enum: ["Accepted", "Pending"],
      default: "Pending",
    },
    acknowledgementDate: {
      type: Date,
      default: null,
    },
    reminderDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const PolicyAcknowledgement = mongoose.model(
  "PolicyAcknowledgement",
  policyAcknowledgementSchema
);

export default PolicyAcknowledgement;
