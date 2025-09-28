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
