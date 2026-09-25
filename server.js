require('dotenv').config();
const express = require('express');
const Groq = require('groq-sdk');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Chat endpoint
app.post('/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    // Validate request structure
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Message cannot be empty.' });
    }

    // Validate last user message is not empty
    const lastMessage = messages[messages.length - 1];
    if (
      !lastMessage ||
      !lastMessage.content ||
      typeof lastMessage.content !== 'string' ||
      lastMessage.content.trim() === ''
    ) {
      return res.status(400).json({ error: 'Message cannot be empty.' });
    }

    // Call Groq API
    const model = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
    const completion = await groq.chat.completions.create({
      messages: messages,
      model: model
    });

    const reply = completion.choices[0]?.message?.content || 'No response generated.';

    return res.json({ reply });
  } catch (error) {
    console.error('Groq API Error:', error.message);
    return res.status(500).json({ error: 'Failed to get a response from the AI.' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
