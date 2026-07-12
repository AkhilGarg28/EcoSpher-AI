import { Router } from "express";
import {
  getMostActiveEmployees,
  getMostActiveDepartments,
  getTopCSR,
  getTopChallenges,
  getRewardTrends,
  getXPGrowth,
  getDepartmentESGRanking,
  getMonthlyESGTrend,
} from "../controllers/analyticsController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get(
  "/most-active-employees",
  protect,
  getMostActiveEmployees
);

router.get(
  "/most-active-departments",
  protect,
  getMostActiveDepartments
);

router.get(
  "/top-csr",
  protect,
  getTopCSR
);

router.get(
  "/top-challenges",
  protect,
  getTopChallenges
);

router.get(
  "/reward-trends",
  protect,
  getRewardTrends
);

router.get(
  "/xp-growth",
  protect,
  getXPGrowth
);

router.get(
  "/department-esg-ranking",
  protect,
  getDepartmentESGRanking
);

router.get(
  "/monthly-esg-trend",
  protect,
  getMonthlyESGTrend
);

export default router;
