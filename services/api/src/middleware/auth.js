/**
 * API Key authentication middleware
 * Checks for x-api-key header matching API_SECRET_KEY env var
 */
const requireAuth = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  const secretKey = process.env.API_SECRET_KEY;

  if (!secretKey) {
    console.error('API_SECRET_KEY environment variable is not set');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  if (!apiKey) {
    return res.status(401).json({ error: 'API key is required' });
  }

  if (apiKey !== secretKey) {
    return res.status(401).json({ error: 'Invalid API key' });
  }

  next();
};

module.exports = { requireAuth };
