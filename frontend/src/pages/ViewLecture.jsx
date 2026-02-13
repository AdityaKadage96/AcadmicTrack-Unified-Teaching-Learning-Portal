// import React, { useState ,useEffect} from 'react';
// import { useSelector } from 'react-redux';
// import { useNavigate, useParams } from 'react-router-dom';
// import { FaPlayCircle } from 'react-icons/fa';
// import { FaArrowLeftLong } from "react-icons/fa6";

// function ViewLecture() {
//   const { courseId } = useParams();
//   const { courseData } = useSelector((state) => state.course);
//   const {userData} = useSelector((state) => state.user)
//   const selectedCourse = courseData?.find((course) => course._id === courseId);

//   // const [selectedLecture, setSelectedLecture] = useState(
//   //   selectedCourse?.lectures?.[0] || null
//   // );

//   const [selectedLecture, setSelectedLecture] = useState(null);

//     useEffect(() => {
//       if (selectedCourse?.lectures?.length > 0) {
//         setSelectedLecture(selectedCourse.lectures[0]);
//       }
//     }, [selectedCourse]);

//     // ⭐ Prevent crash
//   // if (!selectedCourse) {
//   //   return <div className="p-10 text-xl">Loading course...</div>;
//   // }
//         if (!selectedCourse) {
//         return (
//           <div className="flex justify-center items-center h-screen text-2xl">
//             Loading course...
//           </div>
//         );
//       }


//   const navigate = useNavigate()
//   const courseCreator = userData?._id === selectedCourse?.creator ? userData : null;


//   return (
//     <div className="min-h-screen bg-gray-50 p-6 flex flex-col md:flex-row gap-6">
     
//       {/* Left - Video & Course Info */}
//       <div className="w-full md:w-2/3 bg-white rounded-2xl shadow-md p-6 border border-gray-200">
//         {/* Course Details */}
//         <div className="mb-6" >
           
//           <h1 className="text-2xl font-bold flex items-center justify-start gap-[20px]  text-gray-800"><FaArrowLeftLong  className=' text-black w-[22px] h-[22px] cursor-pointer' onClick={()=>navigate("/")}/>{selectedCourse?.title}</h1>
          
//           <div className="mt-2 flex gap-4 text-sm text-gray-500 font-medium">
//             <span>Category: {selectedCourse?.category}</span>
//             <span>Level: {selectedCourse?.level}</span>
//           </div>
//         </div>

//         {/* Video Player */}
//         <div className="aspect-video bg-black rounded-xl overflow-hidden mb-4 border border-gray-300">
//           {selectedLecture?.videoUrl ? (
//             <video
//               src={selectedLecture.videoUrl}
//               controls
//               className="w-full h-full object-cover"
//               crossOrigin="anonymous"
//             />
//           ) : (
//             <div className="flex items-center justify-center h-full text-white">
//               Select a lecture to start watching
//             </div>
//           )}
//         </div>

//         {/* Selected Lecture Info */}
//         <div className="mt-2">
//           <h2 className="text-lg font-semibold text-gray-800">{selectedLecture?.lectureTitle}</h2>

//             {/* ⭐ TAKE QUIZ BUTTON
//         <button
//               onClick={() => navigate(`/quiz/${selectedLecture?._id}`)}
//                 className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-700 transition">
//                           Take Quiz 🧠
//         </button> */}

//             {/* ⭐ QUIZ BUTTON */}
//         <button
//           disabled={!selectedLecture}
//           onClick={() => navigate(`/quiz/${selectedLecture._id}`)}
//           className="mt-4 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-700 disabled:bg-gray-400"
//         >
//           Take Quiz 🧠
//         </button>

          
//         </div>
//       </div>

//       {/* Right - All Lectures + Creator Info */}
//       <div className="w-full md:w-1/3 bg-white rounded-2xl shadow-md p-6 border border-gray-200 h-fit">
//         <h2 className="text-xl font-bold mb-4 text-gray-800">All Lectures</h2>
//         <div className="flex flex-col gap-3 mb-6">
//           {selectedCourse?.lectures?.length > 0 ? (
//             selectedCourse.lectures.map((lecture, index) => (
//               <button
//                 key={index}
//                 onClick={() => setSelectedLecture(lecture)}
//                 className={`flex items-center justify-between p-3 rounded-lg border transition text-left ${
//                   selectedLecture?._id === lecture._id
//                     ? 'bg-gray-200 border-gray-500'
//                     : 'hover:bg-gray-50 border-gray-300'
//                 }`}
//               >
//                 <div>
//                   <h4 className="text-sm font-semibold text-gray-800">{lecture.lectureTitle}</h4>
                  
//                 </div>
//                 <FaPlayCircle className="text-black text-xl" />
//               </button>
//             ))
//           ) : (
//             <p className="text-gray-500">No lectures available.</p>
//           )}
//         </div>

//         {/* Creator Info */}
//         {courseCreator && (
//   <div className="mt-4 border-t pt-4">
//     <h3 className="text-md font-semibold text-gray-700 mb-3">Instructor</h3>
//     <div className="flex items-center gap-4">
//       <img
//         src={courseCreator.photoUrl || '/default-avatar.png'}
//         alt="Instructor"
//         className="w-14 h-14 rounded-full object-cover border"
//       />
//       <div>
//         <h4 className="text-base font-medium text-gray-800">{courseCreator.name}</h4>
//         <p className="text-sm text-gray-600">
//           {courseCreator.description || 'No bio available.'}
//         </p>
//       </div>
//     </div>
//   </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default ViewLecture;



//-----------------------------------------version 2------------------------------------------

import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { FaPlayCircle } from 'react-icons/fa';
import { FaArrowLeftLong } from "react-icons/fa6";
import { serverUrl } from "../App";
import { setSelectedCourseData } from "../redux/courseSlice";

function ViewLecture() {

  const { courseId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { courseData, selectedCourseData } = useSelector((state) => state.course);
  const { userData } = useSelector((state) => state.user);

  const [loading, setLoading] = useState(true);
  const [selectedLecture, setSelectedLecture] = useState(null);

  //------------------------------------------------
  // ✅ Find course from Redux first
  //------------------------------------------------

  const selectedCourse =
    selectedCourseData ||
    courseData?.find((course) => course._id === courseId);

  //------------------------------------------------
  // ✅ Fetch Course if Redux empty
  //------------------------------------------------

  useEffect(() => {

    const fetchCourse = async () => {

      try {

        if (!selectedCourse) {

          const res = await axios.get(
            `${serverUrl}/api/course/getcourse/${courseId}`,
            { withCredentials: true }
          );

          dispatch(setSelectedCourseData(res.data.course));
        }

      } catch (error) {

        console.log("Course fetch error:", error);

      } finally {

        setLoading(false);
      }
    };

    fetchCourse();

  }, [courseId, selectedCourse]);

  //------------------------------------------------
  // ✅ Auto select first lecture
  //------------------------------------------------

  useEffect(() => {

    if (selectedCourse?.lectures?.length > 0) {
      setSelectedLecture(selectedCourse.lectures[0]);
    }

  }, [selectedCourse]);

  //------------------------------------------------
  // ✅ Loading UI
  //------------------------------------------------

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-2xl">
        Loading lectures...
      </div>
    );
  }

  //------------------------------------------------
  // ✅ Safety check
  //------------------------------------------------

  if (!selectedCourse) {
    return (
      <div className="flex justify-center items-center h-screen text-2xl">
        Course not found.
      </div>
    );
  }

  //------------------------------------------------

  const courseCreator =
    userData?._id === selectedCourse?.creator ? userData : null;

  //------------------------------------------------

  return (

    <div className="min-h-screen bg-gray-50 p-6 flex flex-col md:flex-row gap-6">

      {/* LEFT SIDE */}
      <div className="w-full md:w-2/3 bg-white rounded-2xl shadow-md p-6 border">

        {/* HEADER */}
        <h1 className="text-2xl font-bold flex items-center gap-5">

          <FaArrowLeftLong
            className='cursor-pointer'
            onClick={() => navigate("/")}
          />

          {selectedCourse.title}

        </h1>

        <div className="mt-2 flex gap-4 text-sm text-gray-500">

          <span>Category: {selectedCourse.category}</span>
          <span>Level: {selectedCourse.level}</span>

        </div>

        {/* VIDEO */}

        <div className="aspect-video bg-black rounded-xl overflow-hidden my-4">

          {selectedLecture?.videoUrl ? (

            <video
              src={selectedLecture.videoUrl}
              controls
              className="w-full h-full object-cover"
            />

          ) : (

            <div className="flex items-center justify-center h-full text-white">
              Select a lecture to start watching
            </div>

          )}

        </div>

        {/* LECTURE INFO */}

        <h2 className="text-lg font-semibold">
          {selectedLecture?.lectureTitle}
        </h2>

        {/* QUIZ BUTTON */}

        <button
          disabled={!selectedLecture}
          onClick={() => navigate(`/quiz/${selectedLecture._id}`)}
          className="mt-4 bg-black text-white px-4 py-2 rounded hover:bg-gray-700 disabled:bg-gray-400"
        >
          Take Quiz 🧠
        </button>

      </div>

      {/* RIGHT SIDE */}

      <div className="w-full md:w-1/3 bg-white rounded-2xl shadow-md p-6 border h-fit">

        <h2 className="text-xl font-bold mb-4">All Lectures</h2>

        {selectedCourse?.lectures?.length > 0 ? (

          selectedCourse.lectures.map((lecture) => (

            <button
              key={lecture._id}
              onClick={() => setSelectedLecture(lecture)}
              className={`flex items-center justify-between w-full p-3 mb-2 rounded border
              ${selectedLecture?._id === lecture._id
                  ? 'bg-gray-200'
                  : 'hover:bg-gray-50'
                }`}
            >

              <span>{lecture.lectureTitle}</span>

              <FaPlayCircle />

            </button>

          ))

        ) : (

          <p>No lectures available.</p>

        )}

        {/* CREATOR */}

        {courseCreator && (

          <div className="mt-6 border-t pt-4">

            <h3 className="font-semibold mb-2">Instructor</h3>

            <div className="flex gap-3 items-center">

              <img
                src={courseCreator.photoUrl || '/default-avatar.png'}
                className="w-12 h-12 rounded-full"
              />

              <div>

                <p className="font-medium">{courseCreator.name}</p>
                <p className="text-sm text-gray-500">
                  {courseCreator.description || 'No bio available'}
                </p>

              </div>

            </div>

          </div>

        )}

      </div>

    </div>
  );
}

export default ViewLecture;

