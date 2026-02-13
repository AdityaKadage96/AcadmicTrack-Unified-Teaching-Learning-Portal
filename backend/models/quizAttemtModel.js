// import mongoose from "mongoose";

// const quizAttemptSchema = new mongoose.Schema(
//   {
//     quiz: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Quiz",
//       required: true
//     },
//     student: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true
//     },
//     answers: [
//       {
//         questionIndex: Number,
//         selectedAnswer: String
//       }
//     ],
//     score: {
//       type: Number
//     },
//     totalQuestions: {
//       type: Number
//     }
//   },
//   { timestamps: true }
// );

// const QuizAttempt = mongoose.model("QuizAttempt", quizAttemptSchema);
// export default QuizAttempt;


//---- VERSION 2 FORM CHATGPT

import mongoose from "mongoose";

const quizAttemptSchema = new mongoose.Schema(
  {
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    answers: [
      {
        questionIndex: Number,
        selectedAnswer: String
      }
    ],

    score: Number,

    totalQuestions: Number,

    percentage: Number,

    passed: {
      type: Boolean,
      default: false
    },

    timeTaken: Number
  },
  { timestamps: true }
);

// ⭐ prevent duplicate attempts
quizAttemptSchema.index(
  { quiz: 1, student: 1 },
  { unique: true }
);

const QuizAttempt = mongoose.model("QuizAttempt", quizAttemptSchema);
export default QuizAttempt;
