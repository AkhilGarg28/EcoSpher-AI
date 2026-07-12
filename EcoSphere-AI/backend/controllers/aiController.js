import {
  analyzeSustainability,
  generateESGReport,
} from "../services/aiService.js";
import Participation from "../models/Participation.js";
import Department from "../models/Department.js";
import DepartmentScore from "../models/DepartmentScore.js";
import User from "../models/User.js";

const analyzeActivity = async (req, res) => {
  try {
    const { description, participationId } = req.body;

    if (!description || description.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Description is required",
      });
    }

    const analysis = await analyzeSustainability(description);

    let participation = null;
    if (participationId) {
      participation = await Participation.findById(participationId);
      if (!participation) {
        return res.status(404).json({
          success: false,
          message: "Participation record not found",
        });
      }
      participation.aiAnalysis = analysis;
      await participation.save();
    }

    return res.status(200).json({
      success: true,
      analysis,
      participation,
    });
  } catch (error) {
    console.error("analyzeActivity() error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error during sustainability analysis",
    });
  }
};

const getESGReport = async (req, res) => {
  try {
    const { department, startDate, endDate } = req.body;

    if (!department) {
      return res.status(400).json({
        success: false,
        message: "Department is required",
      });
    }

    const dept = await Department.findOne({
      $or: [{ code: department.toUpperCase().trim() }, { name: department.trim() }],
    });

    if (!dept) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    const scores = await DepartmentScore.find({ department: dept._id });
    const employees = await User.find({
      $or: [{ department: dept.code }, { department: dept.name }],
    });

    const overallStats = {
      employeeCount: dept.employeeCount || employees.length,
      startDate: startDate || null,
      endDate: endDate || null,
      scoreCount: scores.length,
    };

    const report = await generateESGReport(dept.name, scores, overallStats);

    return res.status(200).json({
      success: true,
      report,
    });
  } catch (error) {
    console.error("getESGReport() error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error during ESG report generation",
    });
  }
};

export { analyzeActivity, getESGReport };
