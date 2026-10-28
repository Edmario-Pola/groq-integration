Groq Integration
API simples em Node.js/Express que recebe uma mensagem e responde usando a API da Groq.

Requisitos
Node.js 18 ou superior
Chave de API da Groq (console.groq.com)

Modelo
O modelo padrão é openai/gpt-oss-120b. O llama-3.3-70b-versatile, usado originalmente, foi descontinuado pela Groq em 16/08/2026 (console.groq.com/docs/deprecations) e passou a retornar erro 404 model_not_found. O modelo pode ser trocado sem alterar o código, definindo GROQ_MODEL no .env.

Instalação

Clone o repositório:
git clone https://github.com/Edmario-Pola/groq-integration.git
cd groq-integration

Instale as dependências:
npm install

Configure as variáveis de ambiente:
cp .env.example .env
Depois edite o .env e coloque sua chave real em GROQ_API_KEY. Opcionalmente, defina GROQ_MODEL para escolher outro modelo.

Inicie o servidor:
node index.js
O servidor sobe em http://localhost:3000. (abra o link)

Uso
Endpoint: POST /api/chat

Corpo da requisição:
{“message”:”O que é um ponteiro em C?”}

Exemplo com curl:
curl -X POST http://localhost:3000/api/chat
-H “Content-Type: application/json”
-d ‘{“message”:”O que é um ponteiro em C?”}’

Estrutura
groq-integration/
├── public/
│ ├── css/index.css
│ ├── js/main.js
│ └── index.html
├── index.js
├── package.json
├── .env.example
├── .gitignore
└── README.md

Segurança
A chave da Groq fica no .env, que está no .gitignore e não é versionado. Nunca commite o .env com a chave real.

Desafio 1 — Memória de conversa
Problema: A API é stateless — o modelo esquece tudo entre mensagens.

Solução: Histórico mantido no servidor (array global historico) e reenviado a cada chamada, limitado a 10 trocas (20 mensagens). A pergunta só é gravada no histórico depois que a Groq responde com sucesso, sempre em par com a resposta, e o corte remove um par por vez com while (historico.length > MAX_MENSAGENS) historico.splice(0, 2). Assim, uma chamada que falha não deixa perguntas órfãs no histórico.

Desafio 3 — Assistente especializado
Problema: O modelo respondia a qualquer tema, sem foco nem didática.

Solução: Adicionado SYSTEM_PROMPT fixo como primeira mensagem do array, definindo o assistente como monitor de Algoritmos e Estrutura de Dados, com respostas didáticas, exemplos em C e recusa de temas fora do escopo.

Prova: “O que é um ponteiro em C?” passou a ter explicação passo a passo com exemplo em C; “Como funciona o quicksort?” passou a trazer complexidade, exemplo em C e comparação com outros algoritmos; “Qual a melhor receita de bolo?” passou a ser recusada com aviso de escopo.