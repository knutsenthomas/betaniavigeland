import { getDbClient } from './db.js';

export default async function handler(req, res) {
  // Allow CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  let dbClient = null;
  try {
    dbClient = await getDbClient();

    // 1. Handle GET: Fetch settings
    if (req.method === 'GET') {
      const result = await dbClient.query("SELECT data FROM site_settings WHERE id = 'default'");
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Settings not found' });
      }
      return res.status(200).json({ success: true, data: result.rows[0].data });
    }

    // 2. Handle POST: Update settings
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

      const { data } = req.body;
      if (!data || typeof data !== 'object') {
        return res.status(400).json({ error: 'Mangler gyldig data objekt' });
      }

      await dbClient.query(
        "UPDATE site_settings SET data = $1, updated_at = CURRENT_TIMESTAMP WHERE id = 'default'",
        [JSON.stringify(data)]
      );

      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error("Settings API Error:", err);
    return res.status(500).json({ error: 'Internal Server Error', message: err.message });
  } finally {
    if (dbClient) {
      dbClient.release();
    }
  }
}
