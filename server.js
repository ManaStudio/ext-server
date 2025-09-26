const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const app = express();
app.use(bodyParser.json());

app.post('/generer-scene', async (req, res) => {
  const { langue, choix } = req.body;

  const prompt = langue === 'fr'
    ? `Génère une scène immersive pour un jeu narratif cyberpunk. Le joueur a choisi : "${choix}". La scène doit être courte (5 lignes), mystérieuse, et inclure un lieu, une menace et une ambiance mentale.`
    : `Generate an immersive cyberpunk game scene. The player chose: "${choix}". The scene should be short (5 lines), mysterious, and include a location, a threat, and a mental atmosphere.`;

  try {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'openchat', prompt })
    });

    const data = await response.json();
    res.json({ texte: data.response });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erreur: 'Erreur serveur' });
  }
});

app.listen(3000, () => {
  console.log('Serveur lancé sur http://localhost:3000');
});
