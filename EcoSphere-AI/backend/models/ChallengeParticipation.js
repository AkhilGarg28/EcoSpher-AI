import mongoose from "mongoose";

const challengeParticipationSchema = new mongoose.Schema(
  {
    challenge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Challenge",
      required: [true, "Challenge is required"],
    },
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Employee is required"],
    },
    progress: {
      type: Number,
      default: 0,
      min: [0, "Progress cannot be negative"],
      max: [100, "Progress cannot exceed 100"],
    },
    proof: {
      type: String,
      default: "",
    },
    approval: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    xpAwarded: {
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

const ChallengeParticipation = mongoose.model(
  "ChallengeParticipation",
  challengeParticipationSchema
);

export default ChallengeParticipation;
