# AI Chatbot (Powered by Groq)

A simple, beginner-friendly AI Chatbot web application built with **HTML, CSS, Vanilla JavaScript, Node.js, and Express**, integrated with the **Groq API**.

---

## 🏗️ Architecture

```text
Browser (HTML/CSS/JS)
         │
         │ POST /chat (Messages History)
         ▼
Express Server (Node.js)
         │
         │ Groq SDK Request
         ▼
     Groq API
         │
         │ AI Response
         ▼
Express Server (Node.js)
         │
         │ JSON Response ({ reply })
         ▼
Browser (UI Update)
```

---

## 📋 Requirements

* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* A free [Groq API Key](https://console.groq.com/)

---

## 🚀 Installation

1. **Clone or navigate to the project directory**:

   ```bash
   cd "c:\Users\user\directory\AI Chatbot"
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Configure Environment Variables**:

   Copy `.env.example` to create `.env`:

   ```bash
   cp .env.example .env
   ```

   Open `.env` and replace `your_groq_api_key_here` with your actual Groq API Key:

   ```env
   GROQ_API_KEY=gsk_your_actual_api_key_here
   GROQ_MODEL=llama-3.3-70b-versatile
   PORT=3000
   ```

---

## 💻 Running the Chatbot

Start the Express server:

```bash
npm start
```

Or for development auto-reloading:

```bash
npm run dev
```

Open your browser and visit:

```text
http://localhost:3000
```

---

## 📁 Project Structure

```text
groq-chatbot/
│
├── public/
│   ├── index.html      # UI structure
│   ├── style.css       # Dark minimal CSS styling
│   └── script.js       # Client-side chat logic & history
│
├── server.js           # Express server & Groq API route
├── package.json        # Dependencies & scripts
├── .env                # Secret API keys (not committed)
├── .env.example        # Environment variable template
├── .gitignore          # Git exclusion rules
└── README.md           # Documentation
```

---

## 🔒 Security Note

Your Groq API key exists **only on the backend server** (`server.js`) via environment variables loaded from `.env`. It is never exposed to the frontend browser code.
