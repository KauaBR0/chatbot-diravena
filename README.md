# Chatbot de IA com Node.js e Gemini

Este é um projeto de chatbot simples que utiliza o poder do Google Gemini para responder perguntas de usuários com base no conteúdo de um site específico.

O backend é construído com Node.js e Express, e realiza web scraping do site `https://diravena.com/` para criar uma base de conhecimento dinâmica. A interface é uma página web simples com uma janela de chat.

## Tecnologias Utilizadas

  * **Backend:** Node.js, Express.js
  * **IA Generativa:** Google Gemini 1.5 Flash (`@google/generative-ai`)
  * **Web Scraping:** Axios & Cheerio
  * **Frontend:** HTML, CSS, JavaScript (puro)
  * **Variáveis de Ambiente:** Dotenv

## Como Executar Localmente

Siga os passos abaixo para rodar o projeto em sua máquina.

**1. Pré-requisitos:**

  * Ter o [Node.js](https://nodejs.org/en/) instalado.

**2. Clone o Repositório:**

```bash
git clone https://github.com/KauaBR0/chatbot-diravena.git
cd chatbot-diravena
```

**3. Instale as Dependências:**

```bash
npm install
```

**4. Crie o Arquivo de Ambiente:**
Crie um arquivo chamado `.env` na raiz do projeto e adicione sua chave da API do Gemini:

```
GEMINI_API_KEY=SUA_CHAVE_SECRETA_AQUI
```

**5. Inicie o Servidor:**

```bash
npm start
```

**6. Acesse o Chatbot:**
Abra seu navegador e acesse [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000).

-----
