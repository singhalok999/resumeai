const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const getResumeFeedback = async (
  resumeText
) => {

  try {

    const completion =
      await groq.chat.completions.create({

        messages: [
          {
            role: "user",

            content: `
Analyze this resume and return ONLY valid JSON.

{
  "score": 85,
  "role": "Frontend Developer",
  "tips": [
    "Add more projects",
    "Improve ATS keywords"
  ],
  "missingSections": [
    "Certifications"
  ],
  "skills": [
    "React",
    "Node.js",
    "MongoDB"
  ]
}

Resume:
${resumeText}
`,
          },
        ],

        model:
          "llama-3.3-70b-versatile",

        temperature: 0.3,

        max_tokens: 1024,
      });

    const response =
      completion.choices[0]
        ?.message?.content;

    console.log(response);

    const cleaned =
      response
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

    return JSON.parse(cleaned);

  } catch (error) {

    console.log(error);

    throw new Error(
      "AI feedback error"
    );

  }
};

module.exports = {
  getResumeFeedback,
};