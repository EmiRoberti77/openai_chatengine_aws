const express = require('express');
require('dotenv').config();
const OpenAI = require('openai');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

app.post('/chat', async (req, res) => {
  try {
    console.log(req.body);
    const { text } = req.body;
    console.log(text);

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: text }],
      model: 'gpt-3.5-turbo',
    });

    res.status(200).json({
      message: chatCompletion,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
});

app.listen(port, () => {
  console.info(port, 'listening');
});
