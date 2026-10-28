import express from "express";
import 'dotenv/config';
import Groq from "groq-sdk";

const app = express();

app.use(express.json());        // permite ler JSON no corpo das requisições
app.use(express.static("public"));  // serve os arquivos da pasta public

const PORT = process.env.PORT || 3000;
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function getGroqChatCompletion() {
  return groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: "Explain the importance of fast language models",
      },
    ],
    model: "openai/gpt-oss-20b",
  });
}

app.post("/api/chat", async (req, res) => {
  const { message } = req.body;

  // 1 ─ validação: nunca confie no que chega do cliente
  if (!message) {
    return res.status(400).json({ error: "Mensagem não fornecida!" });
  }

  try {
    // 2 ─ chama o modelo (await, porque a resposta demora)
    const responseGroq = await getGroqChatCompletion(message);

    // 3 ─ log no terminal, útil para depurar
    console.log("Resposta da API Groq:", responseGroq.choices[0]?.message.content);

    // 4 ─ devolve apenas o texto ao navegador
    res.json({ response: responseGroq.choices[0]?.message?.content || "" });

  } catch (error) {
    // 5 ─ qualquer falha na API cai aqui
    console.error("Erro ao chamar a API da Groq:", error.message);
    return res.status(500).json({ error: "Erro ao consultar a API da Groq." });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
