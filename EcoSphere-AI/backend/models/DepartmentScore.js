import mongoose from "mongoose";

const departmentScoreSchema = new mongoose.Schema(
  {
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: [true, "Department is required"],
    },
    environmentalScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    socialScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    governanceScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    totalScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    month: {
      type: Number,
      required: [true, "Month is required"],
      min: 1,
      max: 12,
    },
    year: {
      type: Number,
      required: [true, "Year is required"],
      min: 2000,
    },
  },
  {
    timestamps: true,
  }
);

const DepartmentScore = mongoose.model("DepartmentScore", departmentScoreSchema);

export default DepartmentScore;
