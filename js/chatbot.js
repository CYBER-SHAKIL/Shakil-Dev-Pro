// ---------------- SHAKIL DEV AI ASSISTANT (SERVER API) ----------------
const botHistory = [];

function addBotMessage(text, sender) {
  const messages = document.getElementById('bot-messages');
  if (!messages) return null;
  const emptyState = document.getElementById('bot-empty-state');
  if (emptyState) emptyState.remove();
  const bubble = document.createElement('div');
  bubble.className = `bot-message${sender === 'user' ? ' user' : ''}`;
  bubble.textContent = text;
  messages.appendChild(bubble);
  messages.scrollTop = messages.scrollHeight;
  return bubble;
}

document.getElementById('bot-form')?.addEventListener('submit', async event => {
  event.preventDefault();
  const input = document.getElementById('bot-input');
  const submit = event.currentTarget.querySelector('button[type="submit"]');
  const message = input.value.trim();
  if (!message) return;
  addBotMessage(message, 'user');
  input.value = '';
  if (submit) submit.disabled = true;
  const waiting = addBotMessage('একটু অপেক্ষা করো…', 'bot');
  try {
    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history: botHistory.slice(-8) })
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(payload.error || 'AI request failed');
      error.status = response.status;
      error.code = payload.code;
      throw error;
    }
    const answer = String(payload.reply || '').trim();
    waiting.textContent = answer || 'দুঃখিত, এই মুহূর্তে উত্তর তৈরি করা যায়নি। আবার চেষ্টা করো।';
    botHistory.push({ role: 'user', text: message }, { role: 'model', text: answer });
    if (botHistory.length > 12) botHistory.splice(0, botHistory.length - 12);
  } catch (error) {
    console.error('Shakil AI request failed:', error);
    if (error.status === 503 || error.code === 'AI_NOT_CONFIGURED') {
      waiting.textContent = 'AI সার্ভিস এখনো configure করা হয়নি। সার্ভারের environment settings-এ Gemini API key যোগ করতে হবে।';
    } else if (error.status === 429) {
      waiting.textContent = 'এই মুহূর্তে AI ব্যবহারের সীমা পূর্ণ হয়েছে। কিছুক্ষণ পরে আবার চেষ্টা করো।';
    } else {
      waiting.textContent = 'দুঃখিত, AI এখন উত্তর দিতে পারেনি। কিছুক্ষণ পর আবার চেষ্টা করো।';
    }
  } finally {
    if (submit) submit.disabled = false;
    const messages = document.getElementById('bot-messages');
    if (messages) messages.scrollTop = messages.scrollHeight;
  }
});
