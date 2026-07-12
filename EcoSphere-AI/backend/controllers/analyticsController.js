import User from "../models/User.js";
import Participation from "../models/Participation.js";
import ChallengeParticipation from "../models/ChallengeParticipation.js";
import DepartmentScore from "../models/DepartmentScore.js";

const getMostActiveEmployees = async (req, res) => {
  try {
    const activeEmployees = await Participation.aggregate([
      { $match: { approvalStatus: "Approved" } },
      { $group: { _id: "$employee", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "user" } },
      { $unwind: "$user" },
      { $project: { _id: 0, employeeId: "$_id", name: "$user.name", department: "$user.department", count: 1 } },
    ]);

    return res.status(200).json({
      success: true,
      activeEmployees,
    });
  } catch (error) {
    console.error("getMostActiveEmployees() error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching active employees analytics",
    });
  }
};

const getMostActiveDepartments = async (req, res) => {
  try {
    const activeDepartments = await Participation.aggregate([
      { $match: { approvalStatus: "Approved" } },
      { $lookup: { from: "users", localField: "employee", foreignField: "_id", as: "user" } },
      { $unwind: "$user" },
      { $group: { _id: "$user.department", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    return res.status(200).json({
      success: true,
      activeDepartments,
    });
  } catch (error) {
    console.error("getMostActiveDepartments() error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching active departments analytics",
    });
  }
};

const getTopCSR = async (req, res) => {
  try {
    const topCSR = await Participation.aggregate([
      { $match: { approvalStatus: "Approved" } },
      { $group: { _id: "$activity", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      { $lookup: { from: "csractivities", localField: "_id", foreignField: "_id", as: "activity" } },
      { $unwind: "$activity" },
      { $project: { _id: 0, activityId: "$_id", title: "$activity.title", location: "$activity.location", count: 1 } },
    ]);

    return res.status(200).json({
      success: true,
      topCSR,
    });
  } catch (error) {
    console.error("getTopCSR() error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching top CSR activities analytics",
    });
  }
};

const getTopChallenges = async (req, res) => {
  try {
    const topChallenges = await ChallengeParticipation.aggregate([
      { $match: { approval: "Approved" } },
      { $group: { _id: "$challenge", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      { $lookup: { from: "challenges", localField: "_id", foreignField: "_id", as: "challenge" } },
      { $unwind: "$challenge" },
      { $project: { _id: 0, challengeId: "$_id", title: "$challenge.title", difficulty: "$challenge.difficulty", count: 1 } },
    ]);

    return res.status(200).json({
      success: true,
      topChallenges,
    });
  } catch (error) {
    console.error("getTopChallenges() error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching top challenges analytics",
    });
  }
};

const getRewardTrends = async (req, res) => {
  try {
    const rewardTrends = await User.aggregate([
      { $unwind: "$rewards" },
      { $group: { _id: "$rewards", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    return res.status(200).json({
      success: true,
      rewardTrends,
    });
  } catch (error) {
    console.error("getRewardTrends() error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching reward trends analytics",
    });
  }
};

const getXPGrowth = async (req, res) => {
  try {
    const xpGrowth = await ChallengeParticipation.aggregate([
      { $match: { approval: "Approved" } },
      {
        $group: {
          _id: { month: { $month: "$completionDate" }, year: { $year: "$completionDate" } },
          totalXPAwarded: { $sum: "$xpAwarded" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    return res.status(200).json({
      success: true,
      xpGrowth,
    });
  } catch (error) {
    console.error("getXPGrowth() error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching XP growth trends",
    });
  }
};

const getDepartmentESGRanking = async (req, res) => {
  try {
    const rankings = await DepartmentScore.find()
      .populate("department", "name code")
      .sort({ year: -1, month: -1, totalScore: -1 });

    return res.status(200).json({
      success: true,
      rankings,
    });
  } catch (error) {
    console.error("getDepartmentESGRanking() error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching department ESG rankings",
    });
  }
};

const getMonthlyESGTrend = async (req, res) => {
  try {
    const esgTrend = await DepartmentScore.aggregate([
      {
        $group: {
          _id: { month: "$month", year: "$year" },
          averageESG: { $avg: "$totalScore" },
          averageEnv: { $avg: "$environmentalScore" },
          averageSocial: { $avg: "$socialScore" },
          averageGov: { $avg: "$governanceScore" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    return res.status(200).json({
      success: true,
      esgTrend,
    });
  } catch (error) {
    console.error("getMonthlyESGTrend() error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching monthly ESG trends",
    });
  }
};

export {
  getMostActiveEmployees,
  getMostActiveDepartments,
  getTopCSR,
  getTopChallenges,
  getRewardTrends,
  getXPGrowth,
  getDepartmentESGRanking,
  getMonthlyESGTrend,
};
