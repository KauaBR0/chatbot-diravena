const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config(); 

const app = express();
const PORT = process.env.PORT || 3000;
const URL_ALVO = 'https://diravena.com/';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

let conhecimentoDoSite = ''; 

async function extrairConteudoDoSite() {
  try {
    console.log(`Iniciando extração de conteúdo de: ${URL_ALVO}`);
    const { data } = await axios.get(URL_ALVO);
    const $ = cheerio.load(data);

    // 1. Remove elementos que não são úteis (scripts, styles)
    $('script, style').remove();

    const mainContent = $('main').text();

    let footerInfo = '';
    const footer = $('footer');
    
    footerInfo += '\n\n--- Informações e Links do Rodapé ---\n';

    footer.find('a').each((i, el) => {
        const linkText = $(el).text().trim();
        const linkHref = $(el).attr('href');

        if (linkText && linkHref) {
            // Tenta construir um URL absoluto (caso o link seja relativo como /policies/contact-information)
            try {
                const absoluteUrl = new URL(linkHref, URL_ALVO).href;
                footerInfo += `- O link para "${linkText}" é ${absoluteUrl}\n`;
            } catch (e) {
                // Ignora links malformados
            }
        }
    });
    
    const footerText = footer.text().replace(/\s\s+/g, ' ').trim();
    footerInfo += `\nTexto adicional do rodapé: ${footerText}`;


    const textoBruto = mainContent + '\n' + footerInfo;
    conhecimentoDoSite = textoBruto.replace(/\s\s+/g, ' ').trim(); // Limpa espaços

    console.log('Extração de conteúdo concluída com sucesso!');
    

  } catch (error) {
    console.error('Erro ao extrair conteúdo do site:', error.message);
    conhecimentoDoSite = 'Erro: Não foi possível carregar as informações do site Diravena.';
  }
}


app.use(express.static('public'));
app.use(express.json());

app.post('/perguntar', async (req, res) => {
  const { pergunta } = req.body;

  if (!pergunta) {
    return res.status(400).json({ error: 'Nenhuma pergunta foi fornecida.' });
  }

  if (!conhecimentoDoSite) {
    return res.status(503).json({ error: 'O conhecimento do site ainda não foi carregado. Tente novamente em alguns segundos.' });
  }

  try {
    // Monta o prompt para o Gemini
    const prompt = `
      **Contexto:** Você é um assistente de IA especialista nos produtos e informações do site Diravena. 
      Use estritamente a informação fornecida abaixo para responder à pergunta do usuário.
      Seja direto e prestativo. Se a pergunta for sobre um contato ou rede social, forneça o link diretamente.
      Não invente preços ou produtos. Se a informação não estiver no texto, diga que não encontrou a informação no site.

      **Informação extraída do site Diravena:**
      ---
      ${conhecimentoDoSite}
      ---

      **Pergunta do usuário:** "${pergunta}"
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ resposta: text });

  } catch (error) {
    console.error('Erro ao chamar a API do Gemini:', error);
    res.status(500).json({ error: 'Ocorreu um erro ao processar sua pergunta.' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  // Extrai o conteúdo do site assim que o servidor é iniciado
  extrairConteudoDoSite();
});