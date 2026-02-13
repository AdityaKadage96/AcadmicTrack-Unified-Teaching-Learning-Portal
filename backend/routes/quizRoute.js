import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { generateQuiz, getQuizByLecture } from "../controllers/quizController.js";

const router = express.Router();

// ⭐ Educator generates quiz
router.post("/generate", isAuth, generateQuiz);

// ⭐ Student fetches quiz
router.get("/:lectureId", isAuth, getQuizByLecture);

export default router;
