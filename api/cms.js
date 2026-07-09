import { getDbClient } from './db.js';

export default async function handler(req, res) {
  // Allow CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  let dbClient = null;
  try {
    dbClient = await getDbClient();

    // 1. Handle GET: Fetch all texts
    if (req.method === 'GET') {
      const result = await dbClient.query('SELECT key, value FROM cms_content');
      const contentMap = {};
      result.rows.forEach(row => {
        contentMap[row.key] = row.value;
      });
      return res.status(200).json({ success: true, data: contentMap });
    }

    // 2. Handle POST: Update/Insert key-value text
    if (req.method === 'POST') {
      // Authenticate
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Uautorisert: Mangler token' });
      }
      const token = authHeader.split(' ')[1];
      const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
      const expectedToken = Buffer.from(adminPassword).toString('base64');

      if (token !== expectedToken) {
        return res.status(401).json({ error: 'Uautorisert: Ugyldig token' });
      }

      const { key, value } = req.body;
      if (!key || typeof value !== 'string') {
        return res.status(400).json({ error: 'Mangler key eller value' });
      }

      await dbClient.query(
        `INSERT INTO cms_content (key, value, updated_at) 
         VALUES ($1, $2, CURRENT_TIMESTAMP) 
         ON CONFLICT (key) 
         DO UPDATE SET value = $2, updated_at = CURRENT_TIMESTAMP`,
        [key, value]
      );

      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error("CMS API Error:", err);
    return res.status(500).json({ error: 'Internal Server Error', message: err.message });
  } finally {
    if (dbClient) {
      dbClient.release();
    }
  }
}
