import ChallengeParticipation from "../models/ChallengeParticipation.js";
import Challenge from "../models/Challenge.js";
import User from "../models/User.js";

const joinChallenge = async (req, res) => {
  try {
    const { challenge } = req.body;
    const employeeId = req.user.id;

    const targetChallenge = await Challenge.findById(challenge);
    if (!targetChallenge) {
      return res.status(404).json({
        success: false,
        message: "Challenge not found",
      });
    }

    if (targetChallenge.status === "Archived") {
      return res.status(400).json({
        success: false,
        message: "Archived challenges cannot be joined",
      });
    }

    const existingParticipation = await ChallengeParticipation.findOne({
      employee: employeeId,
      challenge,
    });

    if (existingParticipation) {
      return res.status(409).json({
        success: false,
        message: "You have already joined this challenge",
      });
    }

    const participation = await ChallengeParticipation.create({
      employee: employeeId,
      challenge,
      progress: 0,
      approval: "Pending",
    });

    return res.status(201).json({
      success: true,
      message: "Successfully joined the challenge",
      participation,
    });
  } catch (error) {
    console.error("joinChallenge() error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while joining challenge",
    });
  }
};

const submitProof = async (req, res) => {
  try {
    const { challenge, proof } = req.body;
    const employeeId = req.user.id;

    if (!proof || proof.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Proof submission is mandatory",
      });
    }

    const participation = await ChallengeParticipation.findOne({
      employee: employeeId,
      challenge,
    });

    if (!participation) {
      return res.status(404).json({
        success: false,
        message: "Participation record not found. Please join the challenge first.",
      });
    }

    participation.proof = proof.trim();
    participation.progress = 100;
    participation.completionDate = new Date();
    participation.approval = "Pending";

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
    const participations = await ChallengeParticipation.find({ employee: employeeId })
      .populate({
        path: "challenge",
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
    const participations = await ChallengeParticipation.find()
      .populate("employee", "name email department role")
      .populate({
        path: "challenge",
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
    const participation = await ChallengeParticipation.findById(id).populate("challenge");

    if (!participation) {
      return res.status(404).json({
        success: false,
        message: "Participation record not found",
      });
    }

    if (participation.approval !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending participations can be approved",
      });
    }

    const xpToAward = participation.challenge.xp;

    participation.approval = "Approved";
    participation.xpAwarded = xpToAward;
    participation.reviewedBy = req.user.id;
    participation.completionDate = new Date();

    const updatedParticipation = await participation.save();

    await User.findByIdAndUpdate(participation.employee, {
      $inc: { xp: xpToAward },
    });

    return res.status(200).json({
      success: true,
      message: `Participation approved and ${xpToAward} XP awarded`,
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
    const participation = await ChallengeParticipation.findById(id);

    if (!participation) {
      return res.status(404).json({
        success: false,
        message: "Participation record not found",
      });
    }

    if (participation.approval !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending participations can be rejected",
      });
    }

    participation.approval = "Rejected";
    participation.xpAwarded = 0;
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
  joinChallenge,
  submitProof,
  getMyParticipations,
  getAllParticipations,
  approveParticipation,
  rejectParticipation,
};
