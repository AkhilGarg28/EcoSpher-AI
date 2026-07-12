import User from "../models/User.js";
import Badge from "../models/Badge.js";

const checkAndUnlockBadges = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) return [];

    const activeBadges = await Badge.find({ status: "Active", requiredXP: { $lte: user.xp } });
    const unlockedBadgeNames = activeBadges.map((b) => b.name);

    const newBadges = unlockedBadgeNames.filter((name) => !user.badges.includes(name));

    if (newBadges.length > 0) {
      user.badges.push(...newBadges);
      await user.save();
    }

    return newBadges;
  } catch (error) {
    console.error("checkAndUnlockBadges() error:", error.message);
    throw error;
  }
};

export { checkAndUnlockBadges };
