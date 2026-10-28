// ── 1. referências aos elementos da página ──
const inputMessage = document.getElementById("inputMessage");
const btnSend      = document.getElementById("btnSend");
const chatArea     = document.getElementById("chatArea");

inputMessage.focus();   // cursor já no campo ao abrir a página

// ── 2. cria e insere uma bolha de mensagem ──
function addMessage(message, sender) {
  const divMessage = document.createElement("div");

  // sender é "user" ou "bot" — define o estilo da bolha
  divMessage.classList.add("message", sender);

  // marked.parse converte o Markdown da resposta em HTML
  divMessage.innerHTML = marked.parse(message);

  chatArea.appendChild(divMessage);
  chatArea.scrollTop = chatArea.scrollHeight;   // rola para o fim
}

// ── 3. envia a mensagem ao backend ──
async function sendMessage() {
  const message = inputMessage.value.trim();

  inputMessage.value = "";    // limpa o campo imediatamente
  inputMessage.focus();

  if (!message) return;        // ignora envio vazio

  addMessage(message, "user");  // mostra o que o usuário escreveu

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();

    if (response.ok) {
      addMessage(data.response, "bot");
    } else {
      addMessage(data.error, "bot");
    }
  } catch (error) {
    addMessage(error.message, "bot");
  }
}

// ── 4. dois gatilhos: clique no botão e tecla Enter ──
btnSend.addEventListener("click", sendMessage);

inputMessage.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    sendMessage();
  }
});