// import Quiz from "../models/quizModel.js";
// import Course from "../models/courseModel.js";
// import Lecture from "../models/lectureModel.js";
// import { generateQuizFromAI } from "../utils/aiQuizGenerator.js";
// import { parseAIResponse } from "../utils/parseAIResponse.js";

// export const generateQuiz = async (req, res) => {
//   try {

//     const { courseId, lectureId } = req.body;

//     const course = await Course.findById(courseId);
//     const lecture = await Lecture.findById(lectureId);

//     if (!course || !lecture) {
//       return res.status(404).json({
//         message: "Course or Lecture not found"
//       });
//     }

//     // ⭐ Prevent duplicate quizzes
//     const existingQuiz = await Quiz.findOne({ lecture: lectureId });

//     if (existingQuiz) {
//       return res.json({
//         success: true,
//         quiz: existingQuiz,
//         message: "Quiz already exists"
//       });
//     }

//     const topic = `${course.title} - ${lecture.lectureTitle}`;

//     const aiResponse = await generateQuizFromAI({ topic });

//     const questions = parseAIResponse(aiResponse);

//     const quiz = await Quiz.create({
//       course: courseId,
//       lecture: lectureId,
//       createdBy: req.user._id,
//       questions
//     });

//     res.status(201).json({
//       success: true,
//       quiz
//     });

//   } catch (error) {

//     console.error("Quiz Generation Error:", error);

//     res.status(500).json({
//       message: "Failed to generate quiz"
//     });
//   }
// };

//-------------------------version 2---------------------------------

// import Quiz from "../models/quizModel.js";
// import Course from "../models/courseModel.js";
// import Lecture from "../models/lectureModel.js";
// import { generateQuizFromAI } from "../utils/aiQuizGenerator.js";
// import { parseAIResponse } from "../utils/parseAIResponse.js";


// // ✅ GENERATE QUIZ (Educator Button)
// export const generateQuiz = async (req, res) => {
//   try {

//     const { courseId, lectureId } = req.body;

//     const course = await Course.findById(courseId);
//     const lecture = await Lecture.findById(lectureId);

//     if (!course || !lecture) {
//       return res.status(404).json({
//         message: "Course or Lecture not found"
//       });
//     }

//     // Prevent duplicate quizzes
//     const existingQuiz = await Quiz.findOne({ lecture: lectureId });

//     if (existingQuiz) {
//       return res.json({
//         success: true,
//         quiz: existingQuiz,
//         message: "Quiz already exists"
//       });
//     }

//     const topic = `${course.title} - ${lecture.lectureTitle}`;

//     const aiResponse = await generateQuizFromAI({ topic });

//     const questions = parseAIResponse(aiResponse);

//     const quiz = await Quiz.create({
//       course: courseId,
//       lecture: lectureId,
//       createdBy: req.user._id,
//       questions
//     });

//     res.status(201).json({
//       success: true,
//       quiz
//     });

//   } catch (error) {

//     console.error("Quiz Generation Error:", error);

//     res.status(500).json({
//       message: "Failed to generate quiz"
//     });
//   }
// };



// // ✅ GET QUIZ (Student Clicks "Take Quiz")
// export const getQuizByLecture = async (req, res) => {
//   try {

//     let quiz = await Quiz.findOne({
//       lecture: req.params.lectureId
//     });

//     // ⭐ AUTO GENERATE if educator forgot
//     if (!quiz) {

//       const lecture = await Lecture.findById(req.params.lectureId);

//       if (!lecture) {
//         return res.status(404).json({
//           message: "Lecture not found"
//         });
//       }

//       const course = await Course.findById(lecture.course);

//       const topic = `${course.title} - ${lecture.lectureTitle}`;

//       const aiResponse = await generateQuizFromAI({ topic });

//       const questions = parseAIResponse(aiResponse);

//       quiz = await Quiz.create({
//         course: course._id,
//         lecture: lecture._id,
//         createdBy: course.creator,
//         questions
//       });
//     }

//     res.json({ quiz });

//   } catch (error) {

//     console.error("Get Quiz Error:", error);

//     res.status(500).json({
//       message: "Failed to fetch quiz"
//     });
//   }
// };


///-----------------------version 3--------------------------------

import Quiz from "../models/quizModel.js";
import Course from "../models/courseModel.js";
import Lecture from "../models/lectureModel.js";
import { generateQuizFromAI } from "../utils/aiQuizGenerator.js";
import { parseAIResponse } from "../utils/parseAIResponse.js";



/* =====================================================
   ✅ GENERATE QUIZ (Educator clicks Generate)
===================================================== */

export const generateQuiz = async (req, res) => {
  try {

    const { courseId, lectureId } = req.body;

    // ⭐ Fetch lecture WITH course
    const lecture = await Lecture
      .findById(lectureId)
      .populate("course");

    if (!lecture) {
      return res.status(404).json({
        message: "Lecture not found"
      });
    }

    if (!lecture.course) {
      return res.status(400).json({
        message: "Lecture is missing course reference. Recreate lecture."
      });
    }

    // ⭐ Prevent duplicate
    const existingQuiz = await Quiz.findOne({
      lecture: lectureId
    });

    if (existingQuiz) {
      return res.json({
        success: true,
        quiz: existingQuiz,
        message: "Quiz already exists"
      });
    }

    const topic =
      `${lecture.course.title} - ${lecture.lectureTitle}`;

    const aiResponse = await generateQuizFromAI({ topic });

    const questions = parseAIResponse(aiResponse);

    const quiz = await Quiz.create({
      course: lecture.course._id,
      lecture: lecture._id,
      createdBy: req.user._id,
      questions
    });

    res.status(201).json({
      success: true,
      quiz
    });

  } catch (error) {

    console.error("Quiz Generation Error:", error);

    res.status(500).json({
      message: "Failed to generate quiz"
    });
  }
};



/* =====================================================
   ✅ GET QUIZ (Student clicks Take Quiz)
===================================================== */

export const getQuizByLecture = async (req, res) => {
  try {

    const lecture = await Lecture
      .findById(req.params.lectureId)
      .populate("course");

    if (!lecture) {
      return res.status(404).json({
        message: "Lecture not found"
      });
    }

    if (!lecture.course) {
      return res.status(400).json({
        message:
          "Lecture has no course reference. Delete and recreate it."
      });
    }

    let quiz = await Quiz.findOne({
      lecture: lecture._id
    });

    // ⭐ AUTO CREATE if not exists
    if (!quiz) {

      const topic =
        `${lecture.course.title} - ${lecture.lectureTitle}`;

      const aiResponse = await generateQuizFromAI({ topic });

      const questions = parseAIResponse(aiResponse);

      quiz = await Quiz.create({
        course: lecture.course._id,
        lecture: lecture._id,
        createdBy: lecture.course.creator,
        questions
      });
    }

    res.json({ quiz });

  } catch (error) {

    console.error("Get Quiz Error:", error);

    res.status(500).json({
      message: "Failed to fetch quiz"
    });
  }
};
