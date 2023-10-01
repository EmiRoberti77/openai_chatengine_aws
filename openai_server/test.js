const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

(async () => {
  const chatCompletion = await openai.chat.completions.create({
    messages: [{ role: 'user', content: 'what is 2 + 2?' }],
    model: 'gpt-3.5-turbo',
  });
  console.log(JSON.stringify(chatCompletion, null, 2));
})();
