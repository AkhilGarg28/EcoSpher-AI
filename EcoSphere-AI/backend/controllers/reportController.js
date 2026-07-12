import {
  generateEnvironmentalReport,
  generateSocialReport,
  generateGovernanceReport,
  generateESGSummary,
  buildCustomReport,
} from "../services/reportService.js";

const jsonToCSV = (data) => {
  if (!data || data.length === 0) return "";
  const headers = Object.keys(data[0]);
  const csvRows = [];
  csvRows.push(headers.join(","));
  for (const row of data) {
    const values = headers.map((header) => {
      const val = row[header] !== undefined && row[header] !== null ? row[header] : "";
      const escaped = String(val).replace(/"/g, '\\"');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(","));
  }
  return csvRows.join("\n");
};

const handleExport = (res, data, filename) => {
  const csv = jsonToCSV(data);
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", `attachment; filename=${filename}.csv`);
  return res.status(200).send(csv);
};

const getEnvironmentalReport = async (req, res) => {
  try {
    const { department, startDate, endDate, exportFormat } = req.query;
    const report = await generateEnvironmentalReport({ department, startDate, endDate });

    if (exportFormat === "csv") {
      return handleExport(res, report.details, "environmental_report");
    }

    return res.status(200).json({
      success: true,
      report,
    });
  } catch (error) {
    console.error("getEnvironmentalReport() error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while generating environmental report",
    });
  }
};

const getSocialReport = async (req, res) => {
  try {
    const { department, startDate, endDate, employee, exportFormat } = req.query;
    const report = await generateSocialReport({ department, startDate, endDate, employee });

    if (exportFormat === "csv") {
      return handleExport(res, report.details, "social_report");
    }

    return res.status(200).json({
      success: true,
      report,
    });
  } catch (error) {
    console.error("getSocialReport() error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while generating social report",
    });
  }
};

const getGovernanceReport = async (req, res) => {
  try {
    const { department, startDate, endDate, exportFormat } = req.query;
    const report = await generateGovernanceReport({ department, startDate, endDate });

    if (exportFormat === "csv") {
      return handleExport(res, report.issuesDetails, "governance_report");
    }

    return res.status(200).json({
      success: true,
      report,
    });
  } catch (error) {
    console.error("getGovernanceReport() error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while generating governance report",
    });
  }
};

const getESGSummary = async (req, res) => {
  try {
    const { department, startDate, endDate } = req.query;
    const summary = await generateESGSummary({ department, startDate, endDate });

    return res.status(200).json({
      success: true,
      summary,
    });
  } catch (error) {
    console.error("getESGSummary() error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while generating ESG summary",
    });
  }
};

const getCustomReport = async (req, res) => {
  try {
    const { department, startDate, endDate, employee, challenge, category, exportFormat } = req.query;
    const report = await buildCustomReport({ department, startDate, endDate, employee, challenge, category });

    if (exportFormat === "csv") {
      const combined = [...report.csrParticipations, ...report.challengeParticipations];
      return handleExport(res, combined, "custom_report");
    }

    return res.status(200).json({
      success: true,
      report,
    });
  } catch (error) {
    console.error("getCustomReport() error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while generating custom report",
    });
  }
};

export {
  getEnvironmentalReport,
  getSocialReport,
  getGovernanceReport,
  getESGSummary,
  getCustomReport,
};
