import Challenge from "../models/Challenge.js";

const createChallenge = async (req, res) => {
  try {
    const {
      title,
      category,
      description,
      xp,
      difficulty,
      evidenceRequired,
      deadline,
      status,
    } = req.body;

    const existingChallenge = await Challenge.findOne({ title: title.trim() });
    if (existingChallenge) {
      return res.status(409).json({
        success: false,
        message: "Challenge with this title already exists",
      });
    }

    const challenge = await Challenge.create({
      title: title.trim(),
      category,
      description,
      xp,
      difficulty,
      evidenceRequired: evidenceRequired || false,
      deadline,
      status: status || "Draft",
      createdBy: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: "Challenge created successfully",
      challenge,
    });
  } catch (error) {
    console.error("createChallenge() error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while creating challenge",
    });
  }
};

const getChallenges = async (req, res) => {
  try {
    const challenges = await Challenge.find()
      .populate("category", "name type")
      .populate("createdBy", "name email");

    return res.status(200).json({
      success: true,
      challenges,
    });
  } catch (error) {
    console.error("getChallenges() error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching challenges",
    });
  }
};

const getChallengeById = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id)
      .populate("category", "name type")
      .populate("createdBy", "name email");

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: "Challenge not found",
      });
    }

    return res.status(200).json({
      success: true,
      challenge,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid challenge ID",
      });
    }
    console.error("getChallengeById() error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching challenge",
    });
  }
};

const updateChallenge = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      category,
      description,
      xp,
      difficulty,
      evidenceRequired,
      deadline,
      status,
    } = req.body;

    const challenge = await Challenge.findById(id);
    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: "Challenge not found",
      });
    }

    if (challenge.status === "Completed") {
      return res.status(400).json({
        success: false,
        message: "Completed challenges cannot be modified",
      });
    }

    if (title && title.trim() !== challenge.title) {
      const existingChallenge = await Challenge.findOne({ title: title.trim() });
      if (existingChallenge) {
        return res.status(409).json({
          success: false,
          message: "Challenge with this title already exists",
        });
      }
      challenge.title = title.trim();
    }

    if (category !== undefined) challenge.category = category;
    if (description !== undefined) challenge.description = description;
    if (xp !== undefined) challenge.xp = xp;
    if (difficulty !== undefined) challenge.difficulty = difficulty;
    if (evidenceRequired !== undefined) challenge.evidenceRequired = evidenceRequired;
    if (deadline !== undefined) challenge.deadline = deadline;
    if (status !== undefined) challenge.status = status;

    const updatedChallenge = await challenge.save();

    return res.status(200).json({
      success: true,
      message: "Challenge updated successfully",
      challenge: updatedChallenge,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid challenge ID",
      });
    }
    console.error("updateChallenge() error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while updating challenge",
    });
  }
};

const deleteChallenge = async (req, res) => {
  try {
    const { id } = req.params;
    const challenge = await Challenge.findById(id);

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: "Challenge not found",
      });
    }

    if (challenge.status === "Completed") {
      return res.status(400).json({
        success: false,
        message: "Completed challenges cannot be deleted",
      });
    }

    await Challenge.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Challenge deleted successfully",
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid challenge ID",
      });
    }
    console.error("deleteChallenge() error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting challenge",
    });
  }
};

export {
  createChallenge,
  getChallenges,
  getChallengeById,
  updateChallenge,
  deleteChallenge,
};
