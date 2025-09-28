const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const styles = [
  'science-fiction',
  'cyberpunk',
  'médiéval',
  'heroic fantasy',
  'post-apocalyptique',
  'steampunk',
  'space opera'
];

function choisirStyle() {
  const index = Math.floor(Math.random() * styles.length);
  return styles[index];
}

app.get('/intro', async (req, res) => {
  const style = choisirStyle();
  const prompt = `Style : ${style}. Génère une introduction immersive pour un jeu narratif. Le joueur se réveille dans un monde étrange. L'intro doit être courte (5 lignes), mystérieuse, et poser une ambiance mentale.`;

  try {
    const response = await fetch('https://api-inference.huggingface.co/models/openchat/openchat-3.5', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.HF_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ inputs: prompt })
    });

    const data = await response.json();
    const texte = Array.isArray(data) && data[0]?.generated_text
      ? data[0].generated_text
      : data.generated_text || 'Erreur de génération.';

    res.json({ style, texte });
  } catch (err) {
    console.error('Erreur Hugging Face:', err);
    res.status(500).json({ erreur: 'Erreur serveur' });
  }
});

app.post('/generer-scene', async (req, res) => {
  const { langue, choix } = req.body;
  const style = choisirStyle();

  const prompt = langue === 'fr'
    ? `Style : ${style}. Génère une scène immersive pour un jeu narratif. Le joueur a choisi : "${choix}". La scène doit être courte (5 lignes), mystérieuse, et inclure un lieu, une menace et une ambiance mentale.`
    : `Style: ${style}. Generate an immersive game scene. The player chose: "${choix}". The scene should be short (5 lines), mysterious, and include a location, a threat, and a mental atmosphere.`;

  try {
    const response = await fetch('https://api-inference.huggingface.co/models/openchat/openchat-3.5', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.HF_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ inputs: prompt })
    });

    const data = await response.json();
    const texte = Array.isArray(data) && data[0]?.generated_text
      ? data[0].generated_text
      : data.generated_text || 'Erreur de génération.';

    res.json({ style, texte });
  } catch (err) {
    console.error('Erreur Hugging Face:', err);
    res.status(500).json({ erreur: 'Erreur serveur' });
  }
});

app.listen(3000, () => {
  console.log('✅ Serveur lancé sur http://localhost:3000');
});
