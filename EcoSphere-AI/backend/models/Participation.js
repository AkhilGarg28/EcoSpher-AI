import mongoose from "mongoose";

const participationSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Employee is required"],
    },
    activity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CSRActivity",
      required: [true, "Activity is required"],
    },
    proof: {
      type: String,
      default: "",
    },
    approvalStatus: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    pointsEarned: {
      type: Number,
      default: 0,
    },
    completionDate: {
      type: Date,
      default: null,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Participation = mongoose.model("Participation", participationSchema);

export default Participation;
