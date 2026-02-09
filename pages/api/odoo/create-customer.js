export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ ok: false, error: "POST only" });
    }

    const { name, email, phone } = req.body || {};
    if (!name) return res.status(400).json({ ok: false, error: "name required" });

    const ODOO_URL = process.env.ODOO_URL;
    const ODOO_DB = process.env.ODOO_DB;
    const ODOO_USER = process.env.ODOO_USER;
    const ODOO_PASS = process.env.ODOO_PASS;

    const jsonrpc = async (path, payload) => {
      const r = await fetch(`${ODOO_URL}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      return r.json();
    };

    const auth = await jsonrpc("/web/session/authenticate", {
      jsonrpc: "2.0",
      method: "call",
      params: { db: ODOO_DB, login: ODOO_USER, password: ODOO_PASS },
      id: Date.now(),
    });

    const uid = auth?.result?.uid;
    if (!uid) return res.status(401).json({ ok: false, step: "auth", auth });

    const create = await jsonrpc("/web/dataset/call_kw", {
      jsonrpc: "2.0",
      method: "call",
      params: {
        model: "res.partner",
        method: "create",
        args: [{
          name,
          email: email || false,
          phone: phone || false,
          company_type: "person",
        }],
        kwargs: {},
      },
      id: Date.now(),
    });

    return res.status(200).json({ ok: true, partner_id: create?.result || null, uid });
  } catch (e) {
    return res.status(500).json({ ok: false, error: String(e) });
  }
}
