export const submitQuiz = async (quizId, answers) => {
  const res = await fetch("/api/quizzes/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ quizId, answers })
  });

  return res.json();
};
