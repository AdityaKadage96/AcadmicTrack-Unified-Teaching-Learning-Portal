// import mongoose from "mongoose";

// const quizSchema = new mongoose.Schema(
//   {
//     course: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Course",
//       required: true
//     },
//     lecture: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Lecture"
//     },
//     createdBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true
//     },
//     isAIGenerated: {
//       type: Boolean,
//       default: true
//     },
//     difficulty: {
//       type: String,
//       enum: ["Easy", "Medium", "Hard"],
//       default: "Medium"
//     },
//     questions: [
//       {
//         questionText: String,
//         options: [String],
//         correctAnswer: String
//       }
//     ]
//   },
//   { timestamps: true }
// );

// const Quiz = mongoose.model("Quiz", quizSchema);
// export default Quiz;


//------------version 2 form chatgpt 

import mongoose from "mongoose";

const quizSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true
    },

    lecture: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lecture",
      required: true
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    isAIGenerated: {
      type: Boolean,
      default: true
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Medium"
    },

    duration: {
      type: Number,
      default: 10
    },

    questions: [
      {
        questionText: String,
        options: [String],
        correctAnswer: String,
        explanation: String
      }
    ]
  },
  { timestamps: true }
);

// ⭐ prevent duplicate quiz per lecture
quizSchema.index({ lecture: 1 }, { unique: true });

const Quiz = mongoose.model("Quiz", quizSchema);
export default Quiz;
