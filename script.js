/* DOM elements */
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

// Set initial message
chatWindow.textContent = "👋 Hello! How can I help you today?";

// Function to send prompt to OpenAI and get response
async function getOpenAIResponse(prompt) {
  // The endpoint for OpenAI's chat completions
  const url = "https://api.openai.com/v1/chat/completions";

  // The data we send to the API
  const data = {
    model: "gpt-4o", // Use the gpt-4o model
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: prompt,},
    ],
  };

  // Use fetch to call the API
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify(data),
  });

  // Parse the JSON response
  const result = await response.json();

  // Return the assistant's reply
  return result.choices[0].message.content;
}

/* Handle form submit */
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Get the user's input
  const prompt = 'User Input: ' + userInput.value + 'You are playing the role of a Loreal help bot. Youre responses should be concise and to the point, yet help. Be friendly and inviting. You will be asked to answer questions about loreal products and routines. If a question is asked that does not relate to loreal, politely and comically tell the user that you are here to help them with loreal products and routines, and that is all.';

  // Show user's message
  chatWindow.innerHTML = `<b>You:</b> ${userInput.value}<br><i>Thinking...</i>`;

  // Get response from OpenAI
  try {
    const reply = await getOpenAIResponse(prompt);
    chatWindow.innerHTML = `<b>You:</b> ${userInput.value}<br><b>Bot:</b> ${reply}`;
  } catch (error) {
    chatWindow.innerHTML = "Sorry, there was an error connecting to OpenAI.";
  }
});
