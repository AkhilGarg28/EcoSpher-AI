import { GoogleGenerativeAI } from "@google/generative-ai";

const getModel = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined in environment variables");
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
};

const analyzeSustainability = async (description) => {
  try {
    const model = getModel();
    const prompt = `Analyze the following CSR/environmental activity description for sustainability impact:
"${description}"

Return a JSON object containing:
- category: The primary environmental/social category (e.g. Waste Management, Reforestation, Carbon Reduction)
- environmentalImpact: A brief summary of the positive environmental effects
- socialImpact: A brief summary of the positive social effects
- suggestedXP: A suggested XP point reward (as a number between 10 and 200) based on complexity and impact
- summary: A one-sentence summary of the activity
- recommendation: A recommendation for future improvements or scaling the activity

You must return JSON only conforming to this structure:
{
  "category": String,
  "environmentalImpact": String,
  "socialImpact": String,
  "suggestedXP": Number,
  "summary": String,
  "recommendation": String
}`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: "application/json" },
    });

    const responseText = result.response.text();
    return JSON.parse(responseText);
  } catch (error) {
    console.error("analyzeSustainability() error:", error.message);
    throw error;
  }
};

const generateESGReport = async (departmentName, rankings, overallStats) => {
  try {
    const model = getModel();
    const prompt = `Generate a structured ESG report for the department "${departmentName}" using the provided rankings and overall stats:
Rankings: ${JSON.stringify(rankings)}
Overall Stats: ${JSON.stringify(overallStats)}

Return a JSON object containing:
- executiveSummary: A high-level executive summary of the department's ESG standing
- environmentalPerformance: Analysis of the environmental achievements
- socialPerformance: Analysis of social engagement (CSR, challenges, etc.)
- governancePerformance: Analysis of governance and compliance standing
- topEmployees: An array of strings listing top contributing employee names
- topChallenges: An array of strings listing successfully completed challenges
- departmentRanking: A summary of how this department ranks relative to others
- improvementAreas: An array of strings highlighting key improvement areas
- recommendations: An array of strings with actionable recommendations
- futureGoals: An array of strings with future ESG target goals

Return JSON only matching this schema:
{
  "executiveSummary": String,
  "environmentalPerformance": String,
  "socialPerformance": String,
  "governancePerformance": String,
  "topEmployees": [String],
  "topChallenges": [String],
  "departmentRanking": String,
  "improvementAreas": [String],
  "recommendations": [String],
  "futureGoals": [String]
}`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: "application/json" },
    });

    const responseText = result.response.text();
    return JSON.parse(responseText);
  } catch (error) {
    console.error("generateESGReport() error:", error.message);
    throw error;
  }
};

export { analyzeSustainability, generateESGReport };
