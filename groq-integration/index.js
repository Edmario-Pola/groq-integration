import express from "express";
import 'dotenv/config';
import Groq from "groq-sdk";

const app = express();
app.use(express.json());
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// llama-3.3-70b-versatile foi descontinuado pela Groq em 16/08/2026.
// O modelo pode ser trocado pelo .env (GROQ_MODEL) sem mexer no código.
const MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-120b";

// DESAFIO 3 ─ system prompt especializado
const SYSTEM_PROMPT = `Você é um monitor de Algoritmos e Estrutura de Dados.
Responda de forma didática, com exemplos em C, explique o raciocínio passo a passo
e aponte erros conceituais quando houver. Não responda perguntas fora desse escopo.`;

const MAX_MENSAGENS = 20; // 10 trocas
const historico = [];     // DESAFIO 1 ─ histórico global (D8 substitui por Map)

app.post("/api/chat", async (req, res) => {
  const { message } = req.body ?? {};

  if (typeof message !== "string" || !message.trim()) {
    return res.status(400).json({ error: "Mensagem não fornecida!" });
  }

  const pergunta = { role: "user", content: message.trim() };

  try {
    // a pergunta vai só nesta chamada; ainda NÃO entra no histórico
    const responseGroq = await groq.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...historico,
        pergunta,
      ],
    });

    const resposta = responseGroq.choices[0]?.message?.content || "";

    // só grava no histórico se deu certo, sempre em par
    if (resposta) {
      historico.push(pergunta, { role: "assistant", content: resposta });
      while (historico.length > MAX_MENSAGENS) historico.splice(0, 2); // remove um par
    }

    console.log("Resposta da API Groq:", resposta);
    res.json({ response: resposta });
  } catch (error) {
    console.error("Erro ao chamar a API da Groq:", error.message);
    return res.status(500).json({ error: "Erro ao consultar a API da Groq." });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});