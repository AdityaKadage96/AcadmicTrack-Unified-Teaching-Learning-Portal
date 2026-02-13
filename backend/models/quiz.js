import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
  courseId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Course",
    required:true
  },

  lectureId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Lecture",
    required:true
  },

  questions:[
    {
      question:String,
      options:[String],
      answer:String
    }
  ]

},{timestamps:true})

export default mongoose.model("Quiz",quizSchema)
