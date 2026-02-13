const QuizQuestion = ({ question, selected, onSelect }) => {
  return (
    <div className="quiz-question">
      <h3>{question.questionText}</h3>

      {question.options.map((opt, index) => (
        <label key={index} className="option">
          <input
            type="radio"
            checked={selected === opt}
            onChange={() => onSelect(opt)}
          />
          {opt}
        </label>
      ))}
    </div>
  );
};

export default QuizQuestion;
