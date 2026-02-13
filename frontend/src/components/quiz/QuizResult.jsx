const QuizResult = ({ result }) => {
  return (
    <div className="quiz-result">
      <h2>🎉 Quiz Completed</h2>
      <p>Your Score: {result.score}</p>
      <p>Total Questions: {result.total}</p>
    </div>
  );
};

export default QuizResult;
