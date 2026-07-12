import mongoose from "mongoose";

const badgeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Badge name is required"],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Badge description is required"],
      trim: true,
    },
    unlockRule: {
      type: String,
      required: [true, "Unlock rule is required"],
      trim: true,
    },
    requiredXP: {
      type: Number,
      required: [true, "Required XP is required"],
      min: [0, "Required XP cannot be negative"],
    },
    icon: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

const Badge = mongoose.model("Badge", badgeSchema);

export default Badge;
