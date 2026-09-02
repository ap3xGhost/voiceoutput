const { JSDOM } = require('jsdom');
const { Readability } = require('@mozilla/readability');

module.exports = async (req, res) => {
  const { url } = req.query;

  if (!url) {
    res.status(400).json({ error: 'Missing url parameter.' });
    return;
  }

  let target;
  try {
    target = new URL(url);
    if (!['http:', 'https:'].includes(target.protocol)) {
      throw new Error('Invalid protocol');
    }
  } catch {
    res.status(400).json({ error: "That doesn't look like a valid URL." });
    return;
  }

  try {
    const response = await fetch(target.toString(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; VoiceOutputBot/1.0)'
      },
      redirect: 'follow'
    });

    if (!response.ok) {
      res.status(502).json({ error: `The site responded with ${response.status}.` });
      return;
    }

    const html = await response.text();
    const dom = new JSDOM(html, { url: target.toString() });
    const reader = new Readability(dom.window.document);
    const article = reader.parse();

    if (!article || !article.textContent || !article.textContent.trim()) {
      res.status(422).json({ error: "Couldn't find readable article content on that page." });
      return;
    }

    res.status(200).json({
      title: article.title || '',
      text: article.textContent.trim()
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch or parse that page.' });
  }
};
