import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaArrowLeft, FaEdit } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { serverUrl } from '../../App';
import { ClipLoader } from 'react-spinners';
import { useDispatch, useSelector } from 'react-redux';
import { setLectureData } from '../../redux/lectureSlice';

function CreateLecture() {

  const navigate = useNavigate();
  const { courseId } = useParams();

  const [lectureTitle, setLectureTitle] = useState("");
  const [loading, setLoading] = useState(false);

  // ⭐ Track which lecture is generating quiz
  const [generatingQuiz, setGeneratingQuiz] = useState(null);

  const dispatch = useDispatch();
  const { lectureData } = useSelector(state => state.lecture);

  //----------------------------------------------------
  // CREATE LECTURE
  //----------------------------------------------------

  const createLectureHandler = async () => {

    if (!lectureTitle.trim()) {
      toast.error("Lecture title is required");
      return;
    }

    try {

      setLoading(true);

      const result = await axios.post(
        `${serverUrl}/api/course/createlecture/${courseId}`,
        { lectureTitle },
        { withCredentials: true }
      );

      dispatch(setLectureData([...lectureData, result.data.lecture]));

      toast.success("Lecture Created ✅");

      setLectureTitle("");

    } catch (error) {

      console.error(error);

      toast.error(
        error?.response?.data?.message || "Failed to create lecture"
      );

    } finally {
      setLoading(false);
    }
  };

  //----------------------------------------------------
  // GENERATE AI QUIZ
  //----------------------------------------------------

  const generateQuizHandler = async (lectureId) => {

    try {

      setGeneratingQuiz(lectureId);

      const result = await axios.post(
        `${serverUrl}/api/quiz/generate`,
        {
          courseId,
          lectureId
        },
        { withCredentials: true }
      );

      toast.success(
        result?.data?.message || "AI Quiz Generated 🚀"
      );

      console.log("Generated Quiz:", result.data);

    } catch (error) {

      console.error(error);

      toast.error(
        error?.response?.data?.message || "Quiz generation failed"
      );

    } finally {

      setGeneratingQuiz(null);
    }
  };

  //----------------------------------------------------
  // FETCH LECTURES
  //----------------------------------------------------

  useEffect(() => {

    const getLecture = async () => {

      try {

        const result = await axios.get(
          `${serverUrl}/api/course/getcourselecture/${courseId}`,
          { withCredentials: true }
        );

        dispatch(setLectureData(result.data.lectures));

      } catch (error) {

        console.error(error);

        toast.error(
          error?.response?.data?.message || "Failed to fetch lectures"
        );
      }
    };

    getLecture();

  }, [courseId, dispatch]);

  //----------------------------------------------------

  return (

    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">

      <div className="bg-white shadow-xl rounded-xl w-full max-w-2xl p-6">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800 mb-1">
            Let’s Add a Lecture
          </h1>
          <p className="text-sm text-gray-500">
            Enter the title and enhance your course with video lectures.
          </p>
        </div>

        {/* Input */}
        <input
          type="text"
          placeholder="e.g. Introduction to MERN Stack"
          className="w-full border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
          onChange={(e) => setLectureTitle(e.target.value)}
          value={lectureTitle}
        />

        {/* Buttons */}
        <div className="flex gap-4 mb-6">

          <button
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-sm font-medium"
            onClick={() => navigate(`/addcourses/${courseId}`)}
          >
            <FaArrowLeft /> Back to Course
          </button>

          <button
            className="px-5 py-2 rounded-md bg-black text-white hover:bg-gray-600 transition-all text-sm font-medium shadow disabled:bg-gray-400"
            disabled={loading}
            onClick={createLectureHandler}
          >
            {loading
              ? <ClipLoader size={22} color='white' />
              : "+ Create Lecture"}
          </button>

        </div>

        {/* Lecture List */}
        <div className="space-y-2">

          {lectureData?.length > 0 ? (

            lectureData.map((lecture, index) => (

              <div
                key={lecture._id}
                className="bg-gray-100 rounded-md flex justify-between items-center p-3 text-sm font-medium text-gray-700"
              >

                <span>
                  Lecture {index + 1}: {lecture.lectureTitle}
                </span>

                <div className="flex gap-3 items-center">

                  {/* ⭐ AI QUIZ BUTTON */}
                  <button
                    onClick={() => generateQuizHandler(lecture._id)}
                    disabled={generatingQuiz === lecture._id}
                    className="bg-black text-white px-3 py-1 rounded hover:bg-gray-700 text-xs disabled:bg-gray-400"
                  >
                    {generatingQuiz === lecture._id
                      ? "Generating..."
                      : "Generate AI Quiz"}
                  </button>

                  {/* EDIT */}
                  <FaEdit
                    className="text-gray-500 hover:text-gray-700 cursor-pointer"
                    onClick={() =>
                      navigate(`/editlecture/${courseId}/${lecture._id}`)
                    }
                  />

                </div>
              </div>

            ))

          ) : (

            <p className="text-gray-500">
              No lectures created yet.
            </p>

          )}

        </div>

      </div>

    </div>
  );
}

export default CreateLecture;
