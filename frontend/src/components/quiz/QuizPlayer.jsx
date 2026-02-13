import { useEffect, useState } from "react";
import QuizQuestion from "./QuizQuestion";
import { submitQuiz } from "../../services/quizAPI";

const QuizPlayer = ({ onFinish }) => {
  const [quiz, setQuiz] = useState(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    // fetch quiz from backend
    fetch("/api/quizzes/lecture/LECTURE_ID")
      .then(res => res.json())
      .then(data => setQuiz(data.quiz));
  }, []);

  const handleSelect = (option) => {
    const updated = [...answers];
    updated[current] = option;
    setAnswers(updated);
  };

  const handleSubmit = async () => {
    const formattedAnswers = answers.map((a, i) => ({
      questionIndex: i,
      selectedAnswer: a
    }));

    const res = await submitQuiz(quiz._id, formattedAnswers);
    onFinish(res);
  };

  if (!quiz) return <p>Loading quiz...</p>;

  return (
    <div className="quiz-player">
      <QuizQuestion
        question={quiz.questions[current]}
        selected={answers[current]}
        onSelect={handleSelect}
      />

      <div className="nav-buttons">
        {current > 0 && (
          <button onClick={() => setCurrent(current - 1)}>Prev</button>
        )}

        {current < quiz.questions.length - 1 ? (
          <button onClick={() => setCurrent(current + 1)}>Next</button>
        ) : (
          <button onClick={handleSubmit}>Submit</button>
        )}
      </div>
    </div>
  );
};

export default QuizPlayer;
