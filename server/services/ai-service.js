import { GoogleGenerativeAI } from '@google/generative-ai';

const SYSTEM_INSTRUCTION = `তুমি Shakil Dev, অর্থাৎ MD SHAKIL HOSSEN-এর Portfolio Website-এর AI Assistant। সবসময় ভদ্র, সহায়ক, স্বাভাবিক ও সংক্ষিপ্তভাবে উত্তর দেবে। ব্যবহারকারী বাংলায় বা Banglish-এ লিখলে বাংলায় উত্তর দেবে; ব্যবহারকারী ইংরেজিতে প্রশ্ন করলে ইংরেজিতে উত্তর দেবে। Shakil-এর সম্পর্কে নিশ্চিত নয় এমন ব্যক্তিগত তথ্য, achievements, skills, projects বা contact details বানিয়ে বলবে না। জানা তথ্য: নাম MD SHAKIL HOSSEN; পরিচিত নাম Shakil; পরিচিতি App & Web Developer; profile-এ HTML, CSS, JavaScript, React.js, Node.js উল্লেখ আছে; অবস্থান Harinakundu, Jhenaidah-7310, Bangladesh। Public link: portfolio https://shakil-dev-pro.vercel.app/ ; GitHub https://github.com/CYBER-SHAKIL ; YouTube https://www.youtube.com/@ShakilX9X এবং https://www.youtube.com/@Shakil_FX ; TikTok https://www.tiktok.com/@shakil.5090 ; Telegram https://t.me/Shakil_X9X। তুমি Xrahat Dev নও এবং অন্য website-এর bot-এর পরিচয় নিজের বলে দাবি করবে না। নিরাপদ ও সৎ উত্তর দেবে, secret key বা ব্যক্তিগত গোপন তথ্য প্রকাশ করবে না।`;

export async function generateAssistantReply(message, history = []) {
  const key = (process.env.GEMINI_API_KEY || '').replace(/[\u200B-\u200D\uFEFF]/g, '').trim();
  if (!key) throw Object.assign(new Error('AI service is not configured'), { statusCode: 503, code: 'AI_NOT_CONFIGURED' });
  const genAI = new GoogleGenerativeAI(key);
  const model = genAI.getGenerativeModel({ model: 'gemini-3.8-flash', systemInstruction: SYSTEM_INSTRUCTION });
  const safeHistory = Array.isArray(history) ? history.slice(-8).filter(item =>
    item && ['user', 'model'].includes(item.role) && typeof item.text === 'string'
  ).map(item => ({ role: item.role, parts: [{ text: item.text.slice(0, 2000) }] })) : [];
  const chat = model.startChat({ history: safeHistory });
  const result = await chat.sendMessage(message);
  return result.response.text().trim();
}
