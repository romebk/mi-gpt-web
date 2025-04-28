// api/gpt.js
const { Configuration, OpenAIApi } = require("openai");

module.exports = async (req, res) => {
  // Configurar CORS para evitar problemas de origen cruzado
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Para responder a las solicitudes OPTIONS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed, only POST' });
  }

  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'No hay mensaje para procesar' });
    }

    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 500
    });

    const message = completion.data.choices[0].message.content;
    return res.status(200).json({ message });
  } catch (error) {
    console.error('Error en la API de OpenAI:', error);
    return res.status(500).json({ 
      error: 'Error al procesar la solicitud',
      details: error.message 
    });
  }
};
