export default async function handler(req, res) {
  // Allow CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { password } = req.body;
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'; // fallback for testing

    if (password === adminPassword) {
      const token = Buffer.from(adminPassword).toString('base64');
      return res.status(200).json({
        success: true,
        token,
        user: {
          name: 'Admin Bruker',
          email: 'thomas@tk-design.no',
          role: 'admin'
        }
      });
    } else {
      return res.status(401).json({ error: 'Feil passord. Vennligst prøv igjen.' });
    }
  } catch (err) {
    console.error("Login endpoint error:", err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
