// import { useState } from "react";
// import QuizStart from "../components/quiz/QuizStart";
// import QuizPlayer from "../components/quiz/QuizPlayer";
// import QuizResult from "../components/quiz/QuizResult";

// const QuizPage = () => {
//   const [stage, setStage] = useState("start");
//   const [result, setResult] = useState(null);

//   return (
//     <>
//       {stage === "start" && <QuizStart onStart={() => setStage("play")} />}
//       {stage === "play" && (
//         <QuizPlayer onFinish={(res) => {
//           setResult(res);
//           setStage("result");
//         }} />
//       )}
//       {stage === "result" && <QuizResult result={result} />}
//     </>
//   );
// };  

// export default QuizPage;


//---------------------version 2-------------------

import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { serverUrl } from "../App";

function QuizPage() {

  const { lectureId } = useParams();

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {

    const fetchQuiz = async () => {

      const res = await axios.get(
        `${serverUrl}/api/quiz/${lectureId}`,
        { withCredentials: true }
      );

      setQuiz(res.data.quiz);
      setAnswers(new Array(res.data.quiz.questions.length).fill(null));
    };

    fetchQuiz();

  }, []);

  const handleSelect = (qIndex, option) => {

    const updated = [...answers];
    updated[qIndex] = option;
    setAnswers(updated);
  };

  const submitQuiz = async () => {

    const res = await axios.post(
      `${serverUrl}/api/quiz/attempt`,
      {
        quizId: quiz._id,
        answers
      },
      { withCredentials: true }
    );

    alert(`Score: ${res.data.score}`);
  };

  if (!quiz) return <h2>Loading...</h2>;

  return (
    <div className="p-6 max-w-3xl mx-auto">

      <h1 className="text-2xl font-bold mb-6">
        Quiz
      </h1>

      {quiz.questions.map((q, i) => (

        <div key={i} className="mb-6">

          <h3 className="font-semibold">
            {q.questionText}
          </h3>

          {q.options.map((opt, idx) => (

            <label key={idx} className="block">

              <input
                type="radio"
                name={`q-${i}`}
                onChange={() => handleSelect(i, opt)}
              />

              {opt}

            </label>
          ))}
        </div>
      ))}

      <button
        onClick={submitQuiz}
        className="bg-black text-white px-6 py-2 rounded"
      >
        Submit Quiz
      </button>

    </div>
  );
}

export default QuizPage;
