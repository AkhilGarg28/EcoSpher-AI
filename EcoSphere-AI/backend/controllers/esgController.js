import {
  calculateOrganizationScore,
  calculateDepartmentScore,
} from "../services/esgScoreService.js";
import DepartmentScore from "../models/DepartmentScore.js";
import Department from "../models/Department.js";

const getDepartmentRankings = async (req, res) => {
  try {
    const now = new Date();
    const month = req.query.month ? Number(req.query.month) : now.getMonth() + 1;
    const year = req.query.year ? Number(req.query.year) : now.getFullYear();

    const departments = await Department.find();
    for (const dept of departments) {
      await calculateDepartmentScore(dept._id, month, year);
    }

    const rankings = await DepartmentScore.find({ month, year })
      .populate("department", "name code employeeCount status")
      .sort({ totalScore: -1 });

    return res.status(200).json({
      success: true,
      month,
      year,
      rankings,
    });
  } catch (error) {
    console.error("getDepartmentRankings() error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching department rankings",
    });
  }
};

const getOrganizationScore = async (req, res) => {
  try {
    const now = new Date();
    const month = req.query.month ? Number(req.query.month) : now.getMonth() + 1;
    const year = req.query.year ? Number(req.query.year) : now.getFullYear();

    const orgScore = await calculateOrganizationScore(month, year);

    return res.status(200).json({
      success: true,
      month,
      year,
      organization: orgScore,
    });
  } catch (error) {
    console.error("getOrganizationScore() error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching organization score",
    });
  }
};

export { getDepartmentRankings, getOrganizationScore };
