import User from "../models/User.js";
import Department from "../models/Department.js";
import CSRActivity from "../models/CSRActivity.js";
import Challenge from "../models/Challenge.js";
import Reward from "../models/Reward.js";
import Badge from "../models/Badge.js";
import Category from "../models/Category.js";

const setupSearchIndexes = async () => {
  try {
    await Promise.all([
      User.collection.createIndex({ name: "text", email: "text", department: "text" }),
      Department.collection.createIndex({ name: "text", code: "text" }),
      CSRActivity.collection.createIndex({ title: "text", location: "text", description: "text" }),
      Challenge.collection.createIndex({ title: "text", description: "text" }),
      Reward.collection.createIndex({ title: "text", description: "text" }),
      Badge.collection.createIndex({ name: "text", description: "text" }),
      Category.collection.createIndex({ name: "text" }),
    ]);
  } catch (error) {
    console.error("setupSearchIndexes() error:", error.message);
  }
};

setupSearchIndexes();

const globalSearch = async (req, res) => {
  try {
    const query = req.query.q || req.query.query || "";
    const type = req.query.type || "all";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    if (!query || query.trim() === "") {
      return res.status(200).json({
        success: true,
        results: {},
      });
    }

    const regex = new RegExp(query.trim(), "i");
    const results = {};

    const searchTasks = [];

    if (type === "all" || type === "employee") {
      searchTasks.push(
        User.find({
          role: "Employee",
          $or: [{ name: regex }, { email: regex }, { department: regex }],
        })
          .select("name email department xp badges")
          .skip(skip)
          .limit(limit)
          .lean()
          .then((resData) => {
            results.employees = resData;
          })
      );
    }

    if (type === "all" || type === "department") {
      searchTasks.push(
        Department.find({
          $or: [{ name: regex }, { code: regex }],
        })
          .skip(skip)
          .limit(limit)
          .lean()
          .then((resData) => {
            results.departments = resData;
          })
      );
    }

    if (type === "all" || type === "csr") {
      searchTasks.push(
        CSRActivity.find({
          $or: [{ title: regex }, { location: regex }, { description: regex }],
        })
          .populate("category", "name")
          .skip(skip)
          .limit(limit)
          .lean()
          .then((resData) => {
            results.csrActivities = resData;
          })
      );
    }

    if (type === "all" || type === "challenge") {
      searchTasks.push(
        Challenge.find({
          $or: [{ title: regex }, { description: regex }],
        })
          .populate("category", "name")
          .skip(skip)
          .limit(limit)
          .lean()
          .then((resData) => {
            results.challenges = resData;
          })
      );
    }

    if (type === "all" || type === "reward") {
      searchTasks.push(
        Reward.find({
          $or: [{ title: regex }, { description: regex }],
        })
          .skip(skip)
          .limit(limit)
          .lean()
          .then((resData) => {
            results.rewards = resData;
          })
      );
    }

    if (type === "all" || type === "badge") {
      searchTasks.push(
        Badge.find({
          $or: [{ name: regex }, { description: regex }],
        })
          .skip(skip)
          .limit(limit)
          .lean()
          .then((resData) => {
            results.badges = resData;
          })
      );
    }

    if (type === "all" || type === "category") {
      searchTasks.push(
        Category.find({
          name: regex,
        })
          .skip(skip)
          .limit(limit)
          .lean()
          .then((resData) => {
            results.categories = resData;
          })
      );
    }

    await Promise.all(searchTasks);

    return res.status(200).json({
      success: true,
      query: query.trim(),
      type,
      page,
      limit,
      results,
    });
  } catch (error) {
    console.error("globalSearch() error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error during global search operation",
    });
  }
};

export { globalSearch };
