/* DOM elements */
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

// Set initial message
chatWindow.innerHTML = `<div class="chat-bubble bot-bubble">👋 Hello! I'm Maeve, your personal L'Oréal help bot. How can I assist you today? 😊</div>`;

// Store message history
let message_history = [];

// Function to send prompt to OpenAI and get response
async function getOpenAIResponse(prompt) {
  // The endpoint for your Cloudflare Worker
  const url = "https://loreal-chatbot.gmkuenzi.workers.dev/";

  // The data we send to the Cloudflare Worker
  const data = {
    model: "gpt-4o", // Use the gpt-4o model
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: prompt },
    ],
  };

  // Use fetch to call your Cloudflare Worker
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  // Parse the JSON response
  const result = await response.json();

  // Return the assistant's reply
  return result.choices[0].message.content;
}

// Function to add a message bubble to the chat window
function addMessageBubble(message, sender) {
  // Create a div for the bubble
  const bubble = document.createElement("div");
  bubble.classList.add("chat-bubble");
  if (sender === "user") {
    bubble.classList.add("user-bubble");
  } else {
    bubble.classList.add("bot-bubble");
  }
  bubble.innerHTML = message;
  chatWindow.appendChild(bubble);
  // Scroll to the bottom
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

/* Handle form submit */
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Get the user's input
  let input = userInput.value;
  if (!input.trim()) return; // Don't send empty messages

  // Add user's message to chat
  addMessageBubble(`<b>You:</b> ${input}`, "user");

  // Clear the input bar
  userInput.value = "";

  // Show "Thinking..." from bot
  const thinkingBubble = document.createElement("div");
  thinkingBubble.classList.add("chat-bubble", "bot-bubble");
  thinkingBubble.innerHTML = "<i>Thinking...</i>";
  chatWindow.appendChild(thinkingBubble);
  chatWindow.scrollTop = chatWindow.scrollHeight;

  // Prepare prompt for OpenAI
  const prompt =
    "User Input: " +
    input +
    " ...You are playing the role of a Loreal help bot (Your name is Maeve). Your responses should be concise and to the point, yet helpful. Be friendly and inviting. You will be asked to answer questions about loreal products and routines. If a question is asked that does not relate to loreal, politely and comically tell the user that you are here to help them with loreal products and routines, and that is all. Here is your previous message history with this user: " +
    message_history +
    "(you do not need to greet them since you started this chat with 👋 Hello! I'm Maeve, your personal L'Oréal help bot. How can I assist you today? 😊)";

  // Get response from OpenAI
  try {
    const reply = await getOpenAIResponse(prompt);
    // Remove "Thinking..." bubble
    chatWindow.removeChild(thinkingBubble);
    // Add bot's reply
    addMessageBubble(`<b>Maeve:</b> ${reply}`, "bot");
    // Save to history
    message_history.push(`<b>You:</b> ${input}<br><b>Maeve:</b> ${reply}`);
  } catch (error) {
    chatWindow.removeChild(thinkingBubble);
    addMessageBubble("Sorry, there was an error connecting to OpenAI.", "bot");
  }
});
