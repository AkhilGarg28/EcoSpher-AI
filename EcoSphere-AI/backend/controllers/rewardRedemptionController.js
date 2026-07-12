import Reward from "../models/Reward.js";
import User from "../models/User.js";
import { deductXP } from "../services/xpService.js";

const redeemReward = async (req, res) => {
  try {
    const { rewardId } = req.body;
    const userId = req.user.id;

    const reward = await Reward.findById(rewardId);
    if (!reward) {
      return res.status(444).json({
        success: false,
        message: "Reward not found",
      });
    }

    if (reward.status !== "Active") {
      return res.status(400).json({
        success: false,
        message: "Reward is currently inactive",
      });
    }

    if (reward.stock <= 0) {
      return res.status(400).json({
        success: false,
        message: "Reward is out of stock",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.xp < reward.pointsRequired) {
      return res.status(400).json({
        success: false,
        message: "Insufficient XP points for this redemption",
      });
    }

    await deductXP(userId, reward.pointsRequired);

    reward.stock -= 1;
    await reward.save();

    const updatedUser = await User.findById(userId);
    updatedUser.rewards.push(reward.title);
    await updatedUser.save();

    return res.status(200).json({
      success: true,
      message: "Reward redeemed successfully",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        xp: updatedUser.xp,
        badges: updatedUser.badges,
        rewards: updatedUser.rewards,
      },
      reward: {
        title: reward.title,
        stock: reward.stock,
      },
    });
  } catch (error) {
    console.error("redeemReward() error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error during reward redemption",
    });
  }
};

export { redeemReward };
