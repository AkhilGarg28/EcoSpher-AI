import User from "../models/User.js";

const getLeaderboard = async (req, res) => {
  try {
    const topEmployees = await User.find({ role: "Employee" })
      .sort({ xp: -1 })
      .select("name department xp badges");

    const leaderboard = topEmployees.map((employee, index) => ({
      rank: index + 1,
      name: employee.name,
      department: employee.department,
      xp: employee.xp,
      badgeCount: employee.badges.length,
    }));

    return res.status(200).json({
      success: true,
      leaderboard,
    });
  } catch (error) {
    console.error("getLeaderboard() error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching leaderboard",
    });
  }
};

export { getLeaderboard };
