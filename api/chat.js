/**
 * Handler da API de chat que atua como proxy para a API do Groq
 * 
 * Esta função serverless processa requisições de chat do frontend,
 * configurando CORS apropriado e fazendo proxy das requisições para
 * a API do Groq de forma segura (sem expor a API key no frontend).
 * 
 * @param {Object} req - Objeto de requisição HTTP
 * @param {Object} res - Objeto de resposta HTTP
 * @returns {Promise<void>} Resposta JSON com dados do chat ou erro
 */
export default async function handler(req, res) {
  // Configuração de CORS para permitir acesso do GitHub Pages e Vercel
  const origin = req.headers.origin;
  if (origin && (origin.includes('lukasdevjobs1.github.io') || origin.includes('lukasdevjobs1') && origin.includes('vercel.app'))) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Responde a requisições OPTIONS (preflight CORS)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Aceita apenas requisições POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Obtém a chave da API do Groq das variáveis de ambiente
  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  
  // Logs de debug para troubleshooting
  console.log('Environment variables:', Object.keys(process.env));
  console.log('GROQ_API_KEY exists:', !!GROQ_API_KEY);
  
  // Verifica se a API key está configurada
  if (!GROQ_API_KEY) {
    return res.status(500).json({ 
      error: 'API key not configured',
      debug: {
        envKeys: Object.keys(process.env).filter(k => k.includes('GROQ')),
        hasGroqKey: !!process.env.GROQ_API_KEY
      }
    });
  }

  try {
    // Faz proxy da requisição para a API do Groq
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });

    // Retorna a resposta da API do Groq
    const data = await response.json();
    return res.status(200).json(data);

  } catch (error) {
    // Trata erros de comunicação com a API
    return res.status(500).json({ error: error.message });
  }
}
