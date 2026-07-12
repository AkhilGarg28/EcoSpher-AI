import Reward from "../models/Reward.js";

const createReward = async (req, res) => {
  try {
    const { title, description, pointsRequired, stock, image, status } = req.body;

    const existingReward = await Reward.findOne({ title: title.trim() });
    if (existingReward) {
      return res.status(409).json({
        success: false,
        message: "Reward title already exists",
      });
    }

    const reward = await Reward.create({
      title: title.trim(),
      description,
      pointsRequired,
      stock,
      image: image || "",
      status: status || "Active",
    });

    return res.status(201).json({
      success: true,
      message: "Reward created successfully",
      reward,
    });
  } catch (error) {
    console.error("createReward() error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while creating reward",
    });
  }
};

const getRewards = async (req, res) => {
  try {
    const rewards = await Reward.find();
    return res.status(200).json({
      success: true,
      rewards,
    });
  } catch (error) {
    console.error("getRewards() error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching rewards",
    });
  }
};

const getRewardById = async (req, res) => {
  try {
    const reward = await Reward.findById(req.params.id);
    if (!reward) {
      return res.status(404).json({
        success: false,
        message: "Reward not found",
      });
    }
    return res.status(200).json({
      success: true,
      reward,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid reward ID",
      });
    }
    console.error("getRewardById() error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching reward",
    });
  }
};

const updateReward = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, pointsRequired, stock, image, status } = req.body;

    const reward = await Reward.findById(id);
    if (!reward) {
      return res.status(404).json({
        success: false,
        message: "Reward not found",
      });
    }

    if (title && title.trim() !== reward.title) {
      const existingReward = await Reward.findOne({ title: title.trim() });
      if (existingReward) {
        return res.status(409).json({
          success: false,
          message: "Reward title already exists",
        });
      }
      reward.title = title.trim();
    }

    if (description !== undefined) reward.description = description;
    if (pointsRequired !== undefined) reward.pointsRequired = pointsRequired;
    if (stock !== undefined) reward.stock = stock;
    if (image !== undefined) reward.image = image;
    if (status !== undefined) reward.status = status;

    const updatedReward = await reward.save();

    return res.status(200).json({
      success: true,
      message: "Reward updated successfully",
      reward: updatedReward,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid reward ID",
      });
    }
    console.error("updateReward() error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while updating reward",
    });
  }
};

const deleteReward = async (req, res) => {
  try {
    const { id } = req.params;
    const reward = await Reward.findByIdAndDelete(id);
    if (!reward) {
      return res.status(404).json({
        success: false,
        message: "Reward not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Reward deleted successfully",
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid reward ID",
      });
    }
    console.error("deleteReward() error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting reward",
    });
  }
};

export { createReward, getRewards, getRewardById, updateReward, deleteReward };
