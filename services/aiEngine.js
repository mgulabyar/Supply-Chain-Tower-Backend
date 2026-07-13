const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const getPredictiveInsights = async (inventoryData) => {
  const prompt = `
    As a Senior Supply Chain Analyst, analyze this warehouse snapshot:
    ${JSON.stringify(inventoryData)}
    
    1. Identify items at critical risk of stock-out.
    2. Provide a 'Restock Strategy' including recommended quantities.
    3. Estimate financial impact if not replenished.
    
    Respond in professional English and include a "Quick Summary" for a manager.
  `;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "system", content: "Expert Logistics Consultant" }, { role: "user", content: prompt }],
    response_format: { type: "text" }
  });

  return completion.choices[0].message.content;
};

module.exports = { getPredictiveInsights };