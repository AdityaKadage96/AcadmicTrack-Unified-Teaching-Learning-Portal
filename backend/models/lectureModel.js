// import mongoose from "mongoose";

// const lectureSchema = new mongoose.Schema({
//     lectureTitle:{
//         type:String,
//         required:true
//     },
//     videoUrl:{
//         type:String
//     },
//     isPreviewFree:{
//         type:Boolean
//     },
    
// },{timestamps:true})


// const Lecture = mongoose.model("Lecture" , lectureSchema)

// export default Lecture


//-----------------------version 2----------------------

// import mongoose from "mongoose";

// const lectureSchema = new mongoose.Schema(
// {
//     lectureTitle:{
//         type:String,
//         required:true,
//         trim:true
//     },

//     videoUrl:{
//         type:String,
//         default:""
//     },

//     isPreviewFree:{
//         type:Boolean,
//         default:false
//     },

//     // ⭐ CRITICAL FIELD (DO NOT REMOVE)
//     course:{
//         type: mongoose.Schema.Types.ObjectId,
//         ref:"Course",
//         required:true,
//         index:true
//     }

// },
// {timestamps:true}
// );

// const Lecture = mongoose.model("Lecture", lectureSchema);

// export default Lecture;


//--------------------------------version 3--------------------------

import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema(
{
    lectureTitle:{
        type:String,
        required:true,
        trim:true
    },

    videoUrl:{
        type:String,
        default:""
    },

    isPreviewFree:{
        type:Boolean,
        default:false
    },

    // ⭐ THIS IS THE MOST IMPORTANT FIX
    course:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Course",
        required:true
    }

},
{timestamps:true}
);

// ⭐ Prevent OverwriteModelError
const Lecture = mongoose.models.Lecture || mongoose.model("Lecture", lectureSchema);

export default Lecture;
