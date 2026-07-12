import Badge from "../models/Badge.js";

const createBadge = async (req, res) => {
  try {
    const { name, description, unlockRule, requiredXP, icon, status } = req.body;

    const existingBadge = await Badge.findOne({ name: name.trim() });
    if (existingBadge) {
      return res.status(409).json({
        success: false,
        message: "Badge name already exists",
      });
    }

    const badge = await Badge.create({
      name: name.trim(),
      description,
      unlockRule,
      requiredXP,
      icon: icon || "",
      status: status || "Active",
    });

    return res.status(201).json({
      success: true,
      message: "Badge created successfully",
      badge,
    });
  } catch (error) {
    console.error("createBadge() error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while creating badge",
    });
  }
};

const getBadges = async (req, res) => {
  try {
    const badges = await Badge.find();
    return res.status(200).json({
      success: true,
      badges,
    });
  } catch (error) {
    console.error("getBadges() error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching badges",
    });
  }
};

const getBadgeById = async (req, res) => {
  try {
    const badge = await Badge.findById(req.params.id);
    if (!badge) {
      return res.status(404).json({
        success: false,
        message: "Badge not found",
      });
    }
    return res.status(200).json({
      success: true,
      badge,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid badge ID",
      });
    }
    console.error("getBadgeById() error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching badge",
    });
  }
};

const updateBadge = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, unlockRule, requiredXP, icon, status } = req.body;

    const badge = await Badge.findById(id);
    if (!badge) {
      return res.status(404).json({
        success: false,
        message: "Badge not found",
      });
    }

    if (name && name.trim() !== badge.name) {
      const existingBadge = await Badge.findOne({ name: name.trim() });
      if (existingBadge) {
        return res.status(409).json({
          success: false,
          message: "Badge name already exists",
        });
      }
      badge.name = name.trim();
    }

    if (description !== undefined) badge.description = description;
    if (unlockRule !== undefined) badge.unlockRule = unlockRule;
    if (requiredXP !== undefined) badge.requiredXP = requiredXP;
    if (icon !== undefined) badge.icon = icon;
    if (status !== undefined) badge.status = status;

    const updatedBadge = await badge.save();

    return res.status(200).json({
      success: true,
      message: "Badge updated successfully",
      badge: updatedBadge,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid badge ID",
      });
    }
    console.error("updateBadge() error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while updating badge",
    });
  }
};

const deleteBadge = async (req, res) => {
  try {
    const { id } = req.params;
    const badge = await Badge.findByIdAndDelete(id);
    if (!badge) {
      return res.status(404).json({
        success: false,
        message: "Badge not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Badge deleted successfully",
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid badge ID",
      });
    }
    console.error("deleteBadge() error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting badge",
    });
  }
};

export { createBadge, getBadges, getBadgeById, updateBadge, deleteBadge };
