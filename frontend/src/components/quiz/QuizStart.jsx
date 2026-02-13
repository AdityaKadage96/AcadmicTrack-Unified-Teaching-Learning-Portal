const QuizStart = ({ onStart }) => {
  return (
    <div className="quiz-start">
      <h2>🧠 AI Generated Quiz</h2>
      <p>Test your understanding of this lecture</p>
      <button onClick={onStart}>Start Quiz</button>
    </div>
  );
};

export default QuizStart;
