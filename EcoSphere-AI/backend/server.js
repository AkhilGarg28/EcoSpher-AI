import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";
import authRoutes  from "./routes/authRoutes.js";
import departmentRoutes from "./routes/departmentRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import badgeRoutes from "./routes/badgeRoutes.js";
import rewardRoutes from "./routes/rewardRoutes.js";
import csrRoutes from "./routes/csrRoutes.js";
import participationRoutes from "./routes/participationRoutes.js";
import challengeRoutes from "./routes/challengeRoutes.js";
import challengeParticipationRoutes from "./routes/challengeParticipationRoutes.js";
import rewardRedemptionRoutes from "./routes/rewardRedemptionRoutes.js";
import leaderboardRoutes from "./routes/leaderboardRoutes.js";
import esgRoutes from "./routes/esgRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import complianceRoutes from "./routes/complianceRoutes.js";
import policyRoutes from "./routes/policyRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import dashboardOptimizationRoutes from "./routes/dashboardOptimizationRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import rateLimiter from "./middleware/rateLimiter.js";
import sanitizeMiddleware from "./middleware/sanitizeMiddleware.js";
import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/errorHandler.js";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(morgan("dev"));
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(rateLimiter(100, 15 * 60 * 1000));
app.use(sanitizeMiddleware);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🌍 EcoSphere AI Backend Running",
    environment: process.env.NODE_ENV,
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/badges", badgeRoutes);
app.use("/api/rewards", rewardRoutes);
app.use("/api/rewards", rewardRedemptionRoutes);
app.use("/api/csr", csrRoutes);
app.use("/api/participation", participationRoutes);
app.use("/api/challenges", challengeRoutes);
app.use("/api/challenge-participation", challengeParticipationRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/esg", esgRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/compliance", complianceRoutes);
app.use("/api/policies", policyRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/dashboard-opt", dashboardOptimizationRoutes);
app.use("/api/search", searchRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(` Server running on http://localhost:${PORT}`);
      console.log(` Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error(" Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();