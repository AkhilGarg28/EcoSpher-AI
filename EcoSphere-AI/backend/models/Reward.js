import mongoose from "mongoose";

const rewardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Reward title is required"],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Reward description is required"],
      trim: true,
    },
    pointsRequired: {
      type: Number,
      required: [true, "Points required are required"],
      min: [0, "Points required cannot be negative"],
    },
    stock: {
      type: Number,
      required: [true, "Stock count is required"],
      min: [0, "Stock cannot be negative"],
    },
    image: {
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

const Reward = mongoose.model("Reward", rewardSchema);

export default Reward;
