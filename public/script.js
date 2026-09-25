// In-memory conversation history
let messages = [
  {
    role: "system",
    content: "You are Relatus AI, a helpful, clear, and accurate AI assistant."
  }
];

// DOM Elements
const contentBody = document.getElementById('content-body');
const welcomeView = document.getElementById('welcome-view');
const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const chatForm = document.getElementById('chat-form');
const createChatBtn = document.getElementById('create-chat-btn');
const charCounter = document.getElementById('char-counter');
const featureCards = document.querySelectorAll('.feature-card');
const themeLightBtn = document.getElementById('theme-light-btn');
const themeDarkBtn = document.getElementById('theme-dark-btn');

// Auto-scroll the main content container to the bottom
function scrollToBottom() {
  contentBody.scrollTop = contentBody.scrollHeight;
}

// Switch from Welcome view to Active Chat view
function showChatView() {
  if (!welcomeView.classList.contains('hidden')) {
    welcomeView.classList.add('hidden');
    chatMessages.classList.remove('hidden');
  }
}

// Reset chat view back to Welcome view
function resetToWelcomeView() {
  // Reset conversation array
  messages = [
    {
      role: "system",
      content: "You are Relatus AI, a helpful, clear, and accurate AI assistant."
    }
  ];
  // Clear chat bubbles
  chatMessages.innerHTML = '';
  // Show welcome view
  chatMessages.classList.add('hidden');
  welcomeView.classList.remove('hidden');
  userInput.value = '';
  updateCharCounter();
}

// Update input character count
function updateCharCounter() {
  charCounter.textContent = userInput.value.length;
}

// Append a message bubble to the chat container
function addMessageToUI(role, text, options = {}) {
  const { isThinking = false, isError = false } = options;

  showChatView();

  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message');

  if (isThinking) {
    messageDiv.classList.add('thinking');
  } else if (isError) {
    messageDiv.classList.add('assistant', 'error');
  } else {
    messageDiv.classList.add(role === 'user' ? 'user' : 'assistant');
  }

  const labelSpan = document.createElement('span');
  labelSpan.classList.add('message-label');
  labelSpan.textContent = role === 'user' ? 'You' : 'AI';

  const bubbleDiv = document.createElement('div');
  bubbleDiv.classList.add('message-bubble');
  bubbleDiv.textContent = text;

  messageDiv.appendChild(labelSpan);
  messageDiv.appendChild(bubbleDiv);

  chatMessages.appendChild(messageDiv);
  scrollToBottom();

  return messageDiv;
}

// Send message handler
async function handleSendMessage() {
  const userText = userInput.value.trim();

  if (!userText) {
    return;
  }

  // 1. Render user message
  addMessageToUI('user', userText);

  // 2. Add to history
  messages.push({
    role: 'user',
    content: userText
  });

  // 3. Clear input
  userInput.value = '';
  updateCharCounter();

  // 4. Disable controls
  userInput.disabled = true;
  sendBtn.disabled = true;

  // 5. Render thinking indicator
  const thinkingElement = addMessageToUI('assistant', 'AI is thinking...', { isThinking: true });

  try {
    // 6. Fetch response from Express server
    const response = await fetch('/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ messages })
    });

    // Remove thinking indicator
    if (thinkingElement.parentNode === chatMessages) {
      chatMessages.removeChild(thinkingElement);
    }

    if (!response.ok) {
      throw new Error(`Server status: ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    // 7. Render AI response
    addMessageToUI('assistant', data.reply);

    // 8. Push AI response to context history
    messages.push({
      role: 'assistant',
      content: data.reply
    });
  } catch (error) {
    console.error('Chat error:', error);
    if (thinkingElement.parentNode === chatMessages) {
      chatMessages.removeChild(thinkingElement);
    }
    addMessageToUI('assistant', 'Sorry, something went wrong. Please try again.', { isError: true });
  } finally {
    // 9. Re-enable input controls
    userInput.disabled = false;
    sendBtn.disabled = false;
    userInput.focus();
    scrollToBottom();
  }
}

// Event Listeners

// Form submission
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  handleSendMessage();
});

// Keydown handler (Enter sends, Shift+Enter adds newline)
userInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    handleSendMessage();
  }
});

// Input character counter
userInput.addEventListener('input', updateCharCounter);

// Feature cards prompt click
featureCards.forEach((card) => {
  card.addEventListener('click', () => {
    const promptText = card.getAttribute('data-prompt');
    if (promptText) {
      userInput.value = promptText;
      updateCharCounter();
      handleSendMessage();
    }
  });
});

// Create Chat button reset
createChatBtn.addEventListener('click', () => {
  resetToWelcomeView();
});

// Theme switcher
themeLightBtn.addEventListener('click', () => {
  document.body.classList.remove('dark-theme');
  themeLightBtn.classList.add('active');
  themeDarkBtn.classList.remove('active');
});

themeDarkBtn.addEventListener('click', () => {
  document.body.classList.add('dark-theme');
  themeDarkBtn.classList.add('active');
  themeLightBtn.classList.remove('active');
});
