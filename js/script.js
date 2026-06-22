import { API_KEY } from "./apikey.js";

const msgInput = document.querySelector(".msg-input");
const chatBody = document.querySelector(".bodyy");
const sendMsgBtn = document.querySelector(".chat-form .controls button");

const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${API_KEY}`;

const userData = {
  message: null,
};

const createMsgEl = (content, ...classes) => {
  const div = document.createElement("div");
  div.classList.add("message", ...classes);
  div.innerHTML = content;
  return div;
};

const generateBotResponse = async (incomingMsgDiv) => {
    const messageEl = incomingMsgDiv.querySelector('.text')

  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: userData.message }],
        },
      ],
    }),
  };

  try {
    const resp = await fetch(API_URL, requestOptions);
    const data = await resp.json();
    if (!resp.ok) throw new Error(data.error.message);

    const apiResponseText = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, '$1').trim();
    messageEl.innerText = apiResponseText;
  } catch (err) {
    messageEl.innerText = err.message;
  } finally {
    incomingMsgDiv.classList.remove('thinking');
    chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: 'smooth'});
  }
};

const handleMsg = (e) => {
  e.preventDefault;

  userData.message = msgInput.value.trim();
  msgInput.value = "";

  const content = `<div class="text"></div>`;
  const outgoingMsgDiv = createMsgEl(content, "user-msg");
  outgoingMsgDiv.querySelector(".text").textContent = userData.message;
  chatBody.append(outgoingMsgDiv);
  chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: 'smooth'});

  setTimeout(() => {
    const content = `<img id="chatbot-icon" src="./images/icon-ai.png" alt="">
                <div class="text">
                    <div class="thinking-indicator">
                        <div class="dot"></div>
                        <div class="dot"></div>
                        <div class="dot"></div>
                    </div>
                </div>`;

    const incomingMsgDiv = createMsgEl(content, "bot-msg", "thinking");
    chatBody.append(incomingMsgDiv);
    chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: 'smooth'});
    generateBotResponse(incomingMsgDiv);
  }, 600);
};

msgInput.addEventListener("keydown", (e) => {
  const userMsg = e.target.value.trim();
  if (e.key === "Enter" && userMsg) {
    handleMsg(e);
  }
});

sendMsgBtn.addEventListener("click", (e) => handleMsg(e));
