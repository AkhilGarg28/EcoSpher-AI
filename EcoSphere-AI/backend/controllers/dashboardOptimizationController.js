import User from "../models/User.js";
import CSRActivity from "../models/CSRActivity.js";
import Challenge from "../models/Challenge.js";
import Participation from "../models/Participation.js";
import ChallengeParticipation from "../models/ChallengeParticipation.js";
import DepartmentScore from "../models/DepartmentScore.js";
import Notification from "../models/Notification.js";
import { calculateOrganizationScore } from "../services/esgScoreService.js";

const getOptimizedAdminDashboard = async (req, res) => {
  try {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    const [
      orgESG,
      rankings,
      recentCSR,
      recentChallenges,
      topEmployees,
      redeemedRewardsData,
      unreadNotificationsCount,
    ] = await Promise.all([
      calculateOrganizationScore(month, year),
      DepartmentScore.find({ month, year })
        .populate("department", "name code")
        .sort({ totalScore: -1 })
        .lean(),
      CSRActivity.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("category", "name")
        .populate("organizer", "name")
        .lean(),
      Challenge.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("category", "name")
        .lean(),
      User.find({ role: "Employee" })
        .sort({ xp: -1 })
        .limit(5)
        .select("name department xp badges")
        .lean(),
      User.find({ role: "Employee", "rewards.0": { $exists: true } })
        .select("name rewards department")
        .lean(),
      Notification.countDocuments({ user: req.user.id, read: false }),
    ]);

    const cards = {
      overallESG: orgESG.overallScore,
      environmentalAverage: orgESG.environmentalAverage,
      socialAverage: orgESG.socialAverage,
      governanceAverage: orgESG.governanceAverage,
      activeDepartments: orgESG.departmentCount,
      unreadNotifications: unreadNotificationsCount,
    };

    const leaderboard = topEmployees.map((employee, index) => ({
      rank: index + 1,
      name: employee.name,
      department: employee.department,
      xp: employee.xp,
      badgeCount: employee.badges.length,
    }));

    const rewardsRedeemed = redeemedRewardsData.map((user) => ({
      name: user.name,
      department: user.department,
      rewardTitle: user.rewards[user.rewards.length - 1],
    }));

    return res.status(200).json({
      success: true,
      cards,
      charts: {
        rankings,
      },
      leaderboard,
      recentActivity: {
        recentCSR,
        recentChallenges,
      },
      rewardsRedeemed,
    });
  } catch (error) {
    console.error("getOptimizedAdminDashboard() error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching optimized admin dashboard",
    });
  }
};

const getOptimizedDepartmentDashboard = async (req, res) => {
  try {
    const { departmentCode } = req.query;
    if (!departmentCode) {
      return res.status(400).json({
        success: false,
        message: "Department code is required",
      });
    }

    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    const [deptScore, employees, recentCSR, unreadNotificationsCount] = await Promise.all([
      DepartmentScore.findOne({ month, year })
        .populate({
          path: "department",
          match: { code: departmentCode.toUpperCase().trim() },
        })
        .lean(),
      User.find({ department: departmentCode.toUpperCase().trim(), role: "Employee" })
        .sort({ xp: -1 })
        .select("name xp badges")
        .lean(),
      CSRActivity.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
      Notification.countDocuments({ user: req.user.id, read: false }),
    ]);

    const cards = {
      departmentScore: deptScore ? deptScore.totalScore : 0,
      environmentalScore: deptScore ? deptScore.environmentalScore : 0,
      socialScore: deptScore ? deptScore.socialScore : 0,
      governanceScore: deptScore ? deptScore.governanceScore : 0,
      employeeCount: employees.length,
      unreadNotifications: unreadNotificationsCount,
    };

    return res.status(200).json({
      success: true,
      cards,
      employees,
      recentCSR,
    });
  } catch (error) {
    console.error("getOptimizedDepartmentDashboard() error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching optimized department dashboard",
    });
  }
};

const getOptimizedEmployeeDashboard = async (req, res) => {
  try {
    const employeeId = req.user.id;

    const [completedCSR, completedChallenges, rank, unreadNotifications] = await Promise.all([
      Participation.countDocuments({ employee: employeeId, approvalStatus: "Approved" }),
      ChallengeParticipation.countDocuments({ employee: employeeId, approval: "Approved" }),
      User.countDocuments({ role: "Employee", xp: { $gt: req.user.xp } }),
      Notification.countDocuments({ user: employeeId, read: false }),
    ]);

    const cards = {
      currentXP: req.user.xp,
      badgeCount: req.user.badges.length,
      rewardCount: req.user.rewards.length,
      completedCSR,
      completedChallenges,
      rank: rank + 1,
      unreadNotifications,
    };

    return res.status(200).json({
      success: true,
      cards,
      badges: req.user.badges,
      rewards: req.user.rewards,
    });
  } catch (error) {
    console.error("getOptimizedEmployeeDashboard() error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching optimized employee dashboard",
    });
  }
};

export {
  getOptimizedAdminDashboard,
  getOptimizedDepartmentDashboard,
  getOptimizedEmployeeDashboard,
};
