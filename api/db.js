import { db } from '@vercel/postgres';

let isInitialized = false;

export async function getDbClient() {
  const client = await db.connect();
  
  if (!isInitialized) {
    try {
      // 1. Create cms_content table
      await client.sql`
        CREATE TABLE IF NOT EXISTS cms_content (
          key VARCHAR(255) PRIMARY KEY,
          value TEXT NOT NULL,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `;

      // 2. Create site_settings table
      await client.sql`
        CREATE TABLE IF NOT EXISTS site_settings (
          id VARCHAR(50) PRIMARY KEY,
          data JSONB NOT NULL,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `;

      // 3. Insert default settings if they do not exist
      const checkSettings = await client.sql`
        SELECT id FROM site_settings WHERE id = 'default';
      `;
      
      if (checkSettings.rowCount === 0) {
        const defaultData = {
          show_summer_banner: true,
          summer_banner: {
            badge: "Sommerferie-info",
            title: "Sommerferie i menigheten",
            text1: "Vi har ingen ordinære arrangementer i Betania Vigeland gjennom fellesferien. Første søndagsmøte etter sommerferien er søndag 16. august kl. 18:00. Vi ønsker alle en kjempefin sommer! ☀️",
            text2: "Gjennom hele sommeren oppfordrer vi til å støtte opp under møtene og fellesskapet på Solstrand Camping.",
            links: [
              { label: "Solstrand Camping", sublabel: "Se program for møtene sommeren 2026", url: "https://www.solstrand-camping.no/arrangement-MksEf" },
              { label: "Sommerstevne (New Life)", sublabel: "På Solstrand Camping 8. - 12. juli 2026", url: "https://www.sommerstevnet.no" },
              { label: "Følg med på Facebook", sublabel: "Løpende oppdateringer gjennom sommeren", url: "https://www.facebook.com/BetaniaVigeland" }
            ]
          },
          platform_links: {
            vipps: "106111",
            konto: "3138.07.03737",
            facebook: "https://www.facebook.com/BetaniaVigeland",
            instagram: "",
            youtube: "",
            spotify: "",
            apple_podcasts: "https://podcasts.apple.com/no/podcast/betania-vigeland/id1113038676",
            podbean: "https://betania-vigeland.podbean.com",
            email: "post@betania-vigeland.no",
            address_line1: "Elveveien 6",
            address_line2: "4520 Lindesnes",
            footer_description: "En lokal menighet tilknyttet Pinsebevegelsen i Norge. Vi er et fellesskap som ønsker å peke på Jesus og utgjøre en forskjell i lokalmiljøet."
          },
          calendar_sync: {
            enabled: false,
            calendar_id: "",
            api_key: ""
          }
        };

        await client.query(
          'INSERT INTO site_settings (id, data) VALUES ($1, $2)',
          ['default', JSON.stringify(defaultData)]
        );
        console.log("Initialized default site_settings.");
      }

      isInitialized = true;
    } catch (err) {
      console.error("Database initialization error:", err);
    }
  }
  
  return client;
}
