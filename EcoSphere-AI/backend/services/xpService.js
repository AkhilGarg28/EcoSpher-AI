import User from "../models/User.js";
import { checkAndUnlockBadges } from "./badgeService.js";

const awardXP = async (userId, amount) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    user.xp += Number(amount);
    await user.save();

    await checkAndUnlockBadges(userId);

    return user.xp;
  } catch (error) {
    console.error("awardXP() error:", error.message);
    throw error;
  }
};

const deductXP = async (userId, amount) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    user.xp = Math.max(0, user.xp - Number(amount));
    await user.save();

    await checkAndUnlockBadges(userId);

    return user.xp;
  } catch (error) {
    console.error("deductXP() error:", error.message);
    throw error;
  }
};

const getUserXP = async (userId) => {
  try {
    const user = await User.findById(userId).select("xp");
    if (!user) throw new Error("User not found");
    return user.xp;
  } catch (error) {
    console.error("getUserXP() error:", error.message);
    throw error;
  }
};

const updateXP = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");
    await checkAndUnlockBadges(userId);
    return user.xp;
  } catch (error) {
    console.error("updateXP() error:", error.message);
    throw error;
  }
};

export { awardXP, deductXP, getUserXP, updateXP };
