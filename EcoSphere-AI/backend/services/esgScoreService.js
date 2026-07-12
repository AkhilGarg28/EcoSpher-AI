import Department from "../models/Department.js";
import User from "../models/User.js";
import Participation from "../models/Participation.js";
import ChallengeParticipation from "../models/ChallengeParticipation.js";
import DepartmentScore from "../models/DepartmentScore.js";

const ENV_WEIGHT = 0.4;
const SOCIAL_WEIGHT = 0.3;
const GOVERNANCE_WEIGHT = 0.3;

const calculateEnvironmentalScore = async (departmentId) => {
  return 75;
};

const calculateSocialScore = async (departmentId) => {
  try {
    const dept = await Department.findById(departmentId);
    if (!dept) return 0;

    const employees = await User.find({
      $or: [{ department: dept.code }, { department: dept.name }],
    });
    const employeeIds = employees.map((emp) => emp._id);

    if (employeeIds.length === 0) return 0;

    const approvedCSR = await Participation.countDocuments({
      employee: { $in: employeeIds },
      approvalStatus: "Approved",
    });

    const completedChallenges = await ChallengeParticipation.countDocuments({
      employee: { $in: employeeIds },
      approval: "Approved",
    });

    const participatingEmployees = await Participation.distinct("employee", {
      employee: { $in: employeeIds },
      approvalStatus: "Approved",
    });

    const participatingChallengeEmployees = await ChallengeParticipation.distinct("employee", {
      employee: { $in: employeeIds },
      approval: "Approved",
    });

    const uniqueParticipants = new Set([
      ...participatingEmployees.map((id) => id.toString()),
      ...participatingChallengeEmployees.map((id) => id.toString()),
    ]).size;

    const totalEmployeeCount = dept.employeeCount || employees.length;
    const participationRate = totalEmployeeCount > 0 ? (uniqueParticipants / totalEmployeeCount) * 100 : 0;

    const socialScore = approvedCSR + completedChallenges + participationRate;

    return Math.min(100, Math.max(0, socialScore));
  } catch (error) {
    console.error("calculateSocialScore() error:", error.message);
    return 0;
  }
};

const calculateGovernanceScore = async (departmentId) => {
  return 80;
};

const calculateDepartmentScore = async (departmentId, month, year) => {
  try {
    const dept = await Department.findById(departmentId);
    if (!dept) throw new Error("Department not found");

    const envScore = await calculateEnvironmentalScore(departmentId);
    const socialScore = await calculateSocialScore(departmentId);
    const govScore = await calculateGovernanceScore(departmentId);

    const totalScore =
      envScore * ENV_WEIGHT +
      socialScore * SOCIAL_WEIGHT +
      govScore * GOVERNANCE_WEIGHT;

    const score = await DepartmentScore.findOneAndUpdate(
      { department: departmentId, month, year },
      {
        environmentalScore: envScore,
        socialScore,
        governanceScore: govScore,
        totalScore,
      },
      { new: true, upsert: true }
    );

    return score;
  } catch (error) {
    console.error("calculateDepartmentScore() error:", error.message);
    throw error;
  }
};

const calculateOrganizationScore = async (month, year) => {
  try {
    const departments = await Department.find();
    if (departments.length === 0) {
      return {
        overallScore: 0,
        environmentalAverage: 0,
        socialAverage: 0,
        governanceAverage: 0,
        departmentCount: 0,
      };
    }

    let totalEnv = 0;
    let totalSocial = 0;
    let totalGov = 0;
    let totalOverall = 0;

    for (const dept of departments) {
      const score = await calculateDepartmentScore(dept._id, month, year);
      totalEnv += score.environmentalScore;
      totalSocial += score.socialScore;
      totalGov += score.governanceScore;
      totalOverall += score.totalScore;
    }

    const count = departments.length;

    return {
      overallScore: totalOverall / count,
      environmentalAverage: totalEnv / count,
      socialAverage: totalSocial / count,
      governanceAverage: totalGov / count,
      departmentCount: count,
    };
  } catch (error) {
    console.error("calculateOrganizationScore() error:", error.message);
    throw error;
  }
};

export {
  calculateEnvironmentalScore,
  calculateSocialScore,
  calculateGovernanceScore,
  calculateDepartmentScore,
  calculateOrganizationScore,
};
