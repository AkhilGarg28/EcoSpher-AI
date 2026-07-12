import Department from "../models/Department.js";
import User from "../models/User.js";
import Participation from "../models/Participation.js";
import ChallengeParticipation from "../models/ChallengeParticipation.js";
import DepartmentScore from "../models/DepartmentScore.js";
import ComplianceIssue from "../models/ComplianceIssue.js";
import PolicyAcknowledgement from "../models/PolicyAcknowledgement.js";

const buildDateFilter = (startDate, endDate) => {
  const filter = {};
  if (startDate) filter.$gte = new Date(startDate);
  if (endDate) filter.$lte = new Date(endDate);
  return Object.keys(filter).length > 0 ? filter : null;
};

const getEmployeeIdsByDepartment = async (department) => {
  if (!department) return null;
  const dept = await Department.findOne({
    $or: [{ code: department.toUpperCase().trim() }, { name: department.trim() }],
  });
  if (!dept) return [];
  const employees = await User.find({
    $or: [{ department: dept.code }, { department: dept.name }],
  });
  return employees.map((emp) => emp._id);
};

const generateEnvironmentalReport = async (filters = {}) => {
  const { department, startDate, endDate } = filters;
  const query = {};

  const dateFilter = buildDateFilter(startDate, endDate);
  if (dateFilter) query.createdAt = dateFilter;

  if (department) {
    const employeeIds = await getEmployeeIdsByDepartment(department);
    query.employee = { $in: employeeIds };
  }

  const challengeParticipations = await ChallengeParticipation.find(query)
    .populate({
      path: "challenge",
      populate: { path: "category" },
    })
    .populate("employee", "name department");

  const environmentalChallenges = challengeParticipations.filter(
    (cp) =>
      cp.challenge &&
      cp.challenge.category &&
      cp.challenge.category.type === "Challenge"
  );

  return {
    totalEnvironmentalChallenges: environmentalChallenges.length,
    completedEnvironmentalChallenges: environmentalChallenges.filter(
      (cp) => cp.approval === "Approved"
    ).length,
    details: environmentalChallenges.map((cp) => ({
      employeeName: cp.employee ? cp.employee.name : "N/A",
      department: cp.employee ? cp.employee.department : "N/A",
      challengeTitle: cp.challenge.title,
      xpAwarded: cp.xpAwarded,
      status: cp.approval,
      date: cp.completionDate || cp.createdAt,
    })),
  };
};

const generateSocialReport = async (filters = {}) => {
  const { department, startDate, endDate, employee } = filters;
  const query = {};

  const dateFilter = buildDateFilter(startDate, endDate);
  if (dateFilter) query.createdAt = dateFilter;

  if (employee) {
    query.employee = employee;
  } else if (department) {
    const employeeIds = await getEmployeeIdsByDepartment(department);
    query.employee = { $in: employeeIds };
  }

  const csrParticipations = await Participation.find(query)
    .populate("activity")
    .populate("employee", "name department");

  return {
    totalCSRActivitiesJoined: csrParticipations.length,
    approvedCSRActivities: csrParticipations.filter(
      (p) => p.approvalStatus === "Approved"
    ).length,
    details: csrParticipations.map((p) => ({
      employeeName: p.employee ? p.employee.name : "N/A",
      department: p.employee ? p.employee.department : "N/A",
      activityTitle: p.activity ? p.activity.title : "N/A",
      status: p.approvalStatus,
      pointsEarned: p.pointsEarned,
      date: p.completionDate || p.createdAt,
    })),
  };
};

const generateGovernanceReport = async (filters = {}) => {
  const { department, startDate, endDate } = filters;
  const complianceQuery = {};

  const dateFilter = buildDateFilter(startDate, endDate);
  if (dateFilter) complianceQuery.createdAt = dateFilter;

  if (department) {
    const dept = await Department.findOne({
      $or: [{ code: department.toUpperCase().trim() }, { name: department.trim() }],
    });
    if (dept) complianceQuery.assignedDepartment = dept._id;
  }

  const issues = await ComplianceIssue.find(complianceQuery)
    .populate("owner", "name email")
    .populate("assignedDepartment", "name code");

  const acknowledgements = await PolicyAcknowledgement.find()
    .populate("employee", "name department")
    .populate("policy", "title version");

  return {
    totalComplianceIssues: issues.length,
    resolvedIssues: issues.filter((i) => i.status === "Resolved").length,
    openIssues: issues.filter((i) => i.status !== "Resolved").length,
    totalAcknowledgements: acknowledgements.length,
    acceptedAcknowledgements: acknowledgements.filter(
      (a) => a.status === "Accepted"
    ).length,
    issuesDetails: issues.map((i) => ({
      title: i.title,
      severity: i.severity,
      status: i.status,
      dueDate: i.dueDate,
      owner: i.owner ? i.owner.name : "N/A",
      department: i.assignedDepartment ? i.assignedDepartment.name : "N/A",
    })),
  };
};

const generateESGSummary = async (filters = {}) => {
  const env = await generateEnvironmentalReport(filters);
  const social = await generateSocialReport(filters);
  const gov = await generateGovernanceReport(filters);

  return {
    environmental: {
      totalChallenges: env.totalEnvironmentalChallenges,
      completedChallenges: env.completedEnvironmentalChallenges,
    },
    social: {
      totalParticipations: social.totalCSRActivitiesJoined,
      approvedParticipations: social.approvedCSRActivities,
    },
    governance: {
      totalIssues: gov.totalComplianceIssues,
      openIssues: gov.openIssues,
      resolvedIssues: gov.resolvedIssues,
      totalPolicyAcknowledgements: gov.totalAcknowledgements,
      acceptedPolicyAcknowledgements: gov.acceptedAcknowledgements,
    },
  };
};

const buildCustomReport = async (filters = {}) => {
  const { department, startDate, endDate, employee, challenge, category } = filters;
  const query = {};

  const dateFilter = buildDateFilter(startDate, endDate);
  if (dateFilter) query.createdAt = dateFilter;

  if (employee) query.employee = employee;

  if (department) {
    const employeeIds = await getEmployeeIdsByDepartment(department);
    query.employee = { ...query.employee, $in: employeeIds };
  }

  const csrParticipations = await Participation.find(query)
    .populate("activity")
    .populate("employee", "name department");

  const challengeParticipations = await ChallengeParticipation.find(query)
    .populate("challenge")
    .populate("employee", "name department");

  let filteredCSR = csrParticipations;
  if (category) {
    filteredCSR = csrParticipations.filter(
      (p) => p.activity && p.activity.category && p.activity.category.toString() === category
    );
  }

  let filteredChallenges = challengeParticipations;
  if (challenge) {
    filteredChallenges = challengeParticipations.filter(
      (cp) => cp.challenge && cp.challenge._id.toString() === challenge
    );
  }
  if (category) {
    filteredChallenges = filteredChallenges.filter(
      (cp) => cp.challenge && cp.challenge.category && cp.challenge.category.toString() === category
    );
  }

  return {
    csrParticipations: filteredCSR.map((p) => ({
      employeeName: p.employee ? p.employee.name : "N/A",
      department: p.employee ? p.employee.department : "N/A",
      title: p.activity ? p.activity.title : "N/A",
      type: "CSR Activity",
      status: p.approvalStatus,
      pointsEarned: p.pointsEarned,
      date: p.completionDate || p.createdAt,
    })),
    challengeParticipations: filteredChallenges.map((cp) => ({
      employeeName: cp.employee ? cp.employee.name : "N/A",
      department: cp.employee ? cp.employee.department : "N/A",
      title: cp.challenge ? cp.challenge.title : "N/A",
      type: "Challenge",
      status: cp.approval,
      pointsEarned: cp.xpAwarded,
      date: cp.completionDate || cp.createdAt,
    })),
  };
};

export {
  generateEnvironmentalReport,
  generateSocialReport,
  generateGovernanceReport,
  generateESGSummary,
  buildCustomReport,
};
