import mongoose from "mongoose";

const csrActivitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Organizer is required"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },
    maximumParticipants: {
      type: Number,
      required: [true, "Maximum participants count is required"],
      min: [1, "Maximum participants must be at least 1"],
    },
    status: {
      type: String,
      enum: ["Draft", "Open", "Completed", "Cancelled"],
      default: "Draft",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const CSRActivity = mongoose.model("CSRActivity", csrActivitySchema);

export default CSRActivity;
