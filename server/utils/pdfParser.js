const pdf = require("pdf-parse");

const extractTextFromPDF = async (fileBuffer) => {
  try {
    const data = await pdf(fileBuffer);
    return data.text;
  } catch (error) {
    throw new Error("PDF parse karne mein error: " + error.message);
  }
};

module.exports = { extractTextFromPDF };