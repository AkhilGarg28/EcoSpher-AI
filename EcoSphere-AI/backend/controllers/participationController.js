import Participation from "../models/Participation.js";
import CSRActivity from "../models/CSRActivity.js";
import User from "../models/User.js";

const joinActivity = async (req, res) => {
  try {
    const { activity } = req.body;
    const employeeId = req.user.id;

    const csrActivity = await CSRActivity.findById(activity);
    if (!csrActivity) {
      return res.status(404).json({
        success: false,
        message: "CSR Activity not found",
      });
    }

    if (csrActivity.status !== "Open") {
      return res.status(400).json({
        success: false,
        message: "CSR Activity is not open for registration",
      });
    }

    const existingParticipation = await Participation.findOne({
      employee: employeeId,
      activity,
    });

    if (existingParticipation) {
      return res.status(409).json({
        success: false,
        message: "You have already joined this activity",
      });
    }

    const activeParticipationsCount = await Participation.countDocuments({
      activity,
      approvalStatus: { $ne: "Rejected" },
    });

    if (activeParticipationsCount >= csrActivity.maximumParticipants) {
      return res.status(400).json({
        success: false,
        message: "Maximum participants limit reached for this activity",
      });
    }

    const participation = await Participation.create({
      employee: employeeId,
      activity,
      approvalStatus: "Pending",
    });

    return res.status(201).json({
      success: true,
      message: "Successfully joined the CSR activity",
      participation,
    });
  } catch (error) {
    console.error("joinActivity() error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while joining activity",
    });
  }
};

const submitProof = async (req, res) => {
  try {
    const { activity, proof } = req.body;
    const employeeId = req.user.id;

    if (!proof || proof.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Proof submission is mandatory",
      });
    }

    const participation = await Participation.findOne({
      employee: employeeId,
      activity,
    });

    if (!participation) {
      return res.status(404).json({
        success: false,
        message: "Participation record not found. Please join the activity first.",
      });
    }

    participation.proof = proof.trim();
    participation.completionDate = new Date();
    participation.approvalStatus = "Pending";

    const updatedParticipation = await participation.save();

    return res.status(200).json({
      success: true,
      message: "Proof submitted successfully",
      participation: updatedParticipation,
    });
  } catch (error) {
    console.error("submitProof() error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while submitting proof",
    });
  }
};

const getMyParticipations = async (req, res) => {
  try {
    const employeeId = req.user.id;
    const participations = await Participation.find({ employee: employeeId })
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
      participations,
    });
  } catch (error) {
    console.error("getMyParticipations() error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching your participations",
    });
  }
};

const getAllParticipations = async (req, res) => {
  try {
    const participations = await Participation.find()
      .populate("employee", "name email department role")
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
      participations,
    });
  } catch (error) {
    console.error("getAllParticipations() error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching participations",
    });
  }
};

const approveParticipation = async (req, res) => {
  try {
    const { id } = req.params;
    const participation = await Participation.findById(id);

    if (!participation) {
      return res.status(404).json({
        success: false,
        message: "Participation record not found",
      });
    }

    if (participation.approvalStatus !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending participations can be approved",
      });
    }

    participation.approvalStatus = "Approved";
    participation.pointsEarned = 50;
    participation.reviewedBy = req.user.id;
    participation.completionDate = new Date();

    const updatedParticipation = await participation.save();

    await User.findByIdAndUpdate(participation.employee, {
      $inc: { xp: 50 },
    });

    return res.status(200).json({
      success: true,
      message: "Participation approved and 50 XP awarded",
      participation: updatedParticipation,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid participation ID",
      });
    }
    console.error("approveParticipation() error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error during approval workflow",
    });
  }
};

const rejectParticipation = async (req, res) => {
  try {
    const { id } = req.params;
    const participation = await Participation.findById(id);

    if (!participation) {
      return res.status(404).json({
        success: false,
        message: "Participation record not found",
      });
    }

    if (participation.approvalStatus !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending participations can be rejected",
      });
    }

    participation.approvalStatus = "Rejected";
    participation.pointsEarned = 0;
    participation.reviewedBy = req.user.id;
    participation.completionDate = new Date();

    const updatedParticipation = await participation.save();

    return res.status(200).json({
      success: true,
      message: "Participation rejected successfully",
      participation: updatedParticipation,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid participation ID",
      });
    }
    console.error("rejectParticipation() error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error during rejection workflow",
    });
  }
};

export {
  joinActivity,
  submitProof,
  getMyParticipations,
  getAllParticipations,
  approveParticipation,
  rejectParticipation,
};
