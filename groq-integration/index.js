import express from "express";
import 'dotenv/config';
import Groq from "groq-sdk";

const app = express();

app.use(express.json());        // permite ler JSON no corpo das requisições
app.use(express.static("public"));  // serve os arquivos da pasta public

const PORT = process.env.PORT || 3000;
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
