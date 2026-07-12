import ComplianceIssue from "../models/ComplianceIssue.js";

const updateOverdueIssues = async () => {
  try {
    await ComplianceIssue.updateMany(
      {
        dueDate: { $lt: new Date() },
        status: { $nin: ["Resolved", "Overdue"] },
      },
      { status: "Overdue" }
    );
  } catch (error) {
    console.error("updateOverdueIssues() error:", error.message);
  }
};

const createComplianceIssue = async (req, res) => {
  try {
    const {
      title,
      description,
      owner,
      severity,
      status,
      dueDate,
      assignedDepartment,
    } = req.body;

    const issue = await ComplianceIssue.create({
      title,
      description,
      owner,
      severity: severity || "Medium",
      status: status || "Open",
      dueDate,
      assignedDepartment,
    });

    return res.status(201).json({
      success: true,
      message: "Compliance issue created successfully",
      issue,
    });
  } catch (error) {
    console.error("createComplianceIssue() error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while creating compliance issue",
    });
  }
};

const getComplianceIssues = async (req, res) => {
  try {
    await updateOverdueIssues();

    const issues = await ComplianceIssue.find()
      .populate("owner", "name email role")
      .populate("assignedDepartment", "name code");

    return res.status(200).json({
      success: true,
      issues,
    });
  } catch (error) {
    console.error("getComplianceIssues() error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching compliance issues",
    });
  }
};

const getComplianceIssueById = async (req, res) => {
  try {
    await updateOverdueIssues();

    const issue = await ComplianceIssue.findById(req.params.id)
      .populate("owner", "name email role")
      .populate("assignedDepartment", "name code");

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Compliance issue not found",
      });
    }

    return res.status(200).json({
      success: true,
      issue,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid compliance issue ID",
      });
    }
    console.error("getComplianceIssueById() error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching compliance issue",
    });
  }
};

const updateComplianceIssue = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      owner,
      severity,
      status,
      dueDate,
      assignedDepartment,
    } = req.body;

    const issue = await ComplianceIssue.findById(id);
    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Compliance issue not found",
      });
    }

    if (title !== undefined) issue.title = title;
    if (description !== undefined) issue.description = description;
    if (owner !== undefined) issue.owner = owner;
    if (severity !== undefined) issue.severity = severity;
    if (status !== undefined) issue.status = status;
    if (dueDate !== undefined) issue.dueDate = dueDate;
    if (assignedDepartment !== undefined) issue.assignedDepartment = assignedDepartment;

    const updatedIssue = await issue.save();

    return res.status(200).json({
      success: true,
      message: "Compliance issue updated successfully",
      issue: updatedIssue,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid compliance issue ID",
      });
    }
    console.error("updateComplianceIssue() error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while updating compliance issue",
    });
  }
};

const deleteComplianceIssue = async (req, res) => {
  try {
    const { id } = req.params;
    const issue = await ComplianceIssue.findByIdAndDelete(id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Compliance issue not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Compliance issue deleted successfully",
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid compliance issue ID",
      });
    }
    console.error("deleteComplianceIssue() error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting compliance issue",
    });
  }
};

export {
  createComplianceIssue,
  getComplianceIssues,
  getComplianceIssueById,
  updateComplianceIssue,
  deleteComplianceIssue,
};
