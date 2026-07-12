import CSRActivity from "../models/CSRActivity.js";

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

export { createCSR, getCSRActivities, getCSRById, updateCSR, deleteCSR };
