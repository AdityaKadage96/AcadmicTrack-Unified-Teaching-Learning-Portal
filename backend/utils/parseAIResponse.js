export const parseAIResponse = (aiText) => {
  try {

    const cleaned = aiText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleaned);

  } catch (err) {

    console.error("Parsing Error:", err);
    throw new Error("Failed to parse AI quiz");
  }
};