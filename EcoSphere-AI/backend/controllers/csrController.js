import CSRActivity from "../models/CSRActivity.js";
import Category from "../models/Category.js";
import Participation from "../models/Participation.js";

const createCSR = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      organizer,
      location,
      startDate,
      endDate,
      maximumParticipants,
      status,
    } = req.body;

    const existingCSR = await CSRActivity.findOne({ title: title.trim() });
    if (existingCSR) {
      return res.status(409).json({
        success: false,
        message: "CSR activity with this title already exists",
      });
    }

    const activity = await CSRActivity.create({
      title: title.trim(),
      description,
      category,
      organizer,
      location,
      startDate,
      endDate,
      maximumParticipants,
      status: status || "Draft",
      createdBy: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: "CSR activity created successfully",
      activity,
    });
  } catch (error) {
    console.error("createCSR() error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while creating CSR activity",
    });
  }
};

const getCSRActivities = async (req, res) => {
  try {
    const activities = await CSRActivity.find()
      .populate("category", "name type")
      .populate("organizer", "name email")
      .populate("createdBy", "name email");

    return res.status(200).json({
      success: true,
      activities,
    });
  } catch (error) {
    console.error("getCSRActivities() error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching CSR activities",
    });
  }
};

const getCSRById = async (req, res) => {
  try {
    const activity = await CSRActivity.findById(req.params.id)
      .populate("category", "name type")
      .populate("organizer", "name email")
      .populate("createdBy", "name email");

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: "CSR activity not found",
      });
    }

    return res.status(200).json({
      success: true,
      activity,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid CSR activity ID",
      });
    }
    console.error("getCSRById() error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching CSR activity",
    });
  }
};

const updateCSR = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      category,
      organizer,
      location,
      startDate,
      endDate,
      maximumParticipants,
      status,
    } = req.body;

    const activity = await CSRActivity.findById(id);
    if (!activity) {
      return res.status(404).json({
        success: false,
        message: "CSR activity not found",
      });
    }

    if (title && title.trim() !== activity.title) {
      const existingCSR = await CSRActivity.findOne({ title: title.trim() });
      if (existingCSR) {
        return res.status(409).json({
          success: false,
          message: "CSR activity with this title already exists",
        });
      }
      activity.title = title.trim();
    }

    if (description !== undefined) activity.description = description;
    if (category !== undefined) activity.category = category;
    if (organizer !== undefined) activity.organizer = organizer;
    if (location !== undefined) activity.location = location;
    if (startDate !== undefined) activity.startDate = startDate;
    if (endDate !== undefined) activity.endDate = endDate;
    if (maximumParticipants !== undefined) activity.maximumParticipants = maximumParticipants;
    if (status !== undefined) activity.status = status;

    const updatedActivity = await activity.save();

    return res.status(200).json({
      success: true,
      message: "CSR activity updated successfully",
      activity: updatedActivity,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid CSR activity ID",
      });
    }
    console.error("updateCSR() error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while updating CSR activity",
    });
  }
};

const deleteCSR = async (req, res) => {
  try {
    const { id } = req.params;
    const activity = await CSRActivity.findByIdAndDelete(id);

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: "CSR activity not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "CSR activity deleted successfully",
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid CSR activity ID",
      });
    }
    console.error("deleteCSR() error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting CSR activity",
    });
  }
};

const submitActivityReport = async (req, res) => {
  try {
    const { title, description, category, activityDate } = req.body;
    const employeeId = req.user.id;

    if (!title || !description || !category || !activityDate) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    let cat = await Category.findOne({ name: new RegExp(category, "i") });
    if (!cat) {
      cat = await Category.create({
        name: category.charAt(0).toUpperCase() + category.slice(1),
        type: "CSR",
      });
    }

    const activity = await CSRActivity.create({
      title: title.trim(),
      description,
      category: cat._id,
      organizer: employeeId,
      startDate: new Date(activityDate),
      endDate: new Date(activityDate),
      status: "Open",
      createdBy: employeeId,
    });

    const participation = await Participation.create({
      employee: employeeId,
      activity: activity._id,
      approvalStatus: "Pending",
      completionDate: new Date(activityDate),
      proof: "Documented proof uploaded",
    });

    return res.status(201).json({
      success: true,
      message: "ESG activity report submitted successfully",
      activity,
      participation,
    });
  } catch (error) {
    console.error("submitActivityReport() error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error during activity report submission",
    });
  }
};

const getMySubmissions = async (req, res) => {
  try {
    const participations = await Participation.find({ employee: req.user.id })
      .populate({
        path: "activity",
        populate: {
          path: "category",
          select: "name type",
        },
      })
      .populate("reviewedBy", "name email");

    return res.status(200).json({
      success: true,
      submissions: participations,
      participations,
    });
  } catch (error) {
    console.error("getMySubmissions() error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching your submissions",
    });
  }
};

export {
  createCSR,
  getCSRActivities,
  getCSRById,
  updateCSR,
  deleteCSR,
  submitActivityReport,
  getMySubmissions,
};
