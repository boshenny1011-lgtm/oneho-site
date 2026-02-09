export default async function handler(req, res) {
  try {
    const ODOO_URL = process.env.ODOO_URL;
    const ODOO_DB = process.env.ODOO_DB;
    const ODOO_USER = process.env.ODOO_USER;
    const ODOO_PASS = process.env.ODOO_PASS;

    if (!ODOO_URL || !ODOO_DB || !ODOO_USER || !ODOO_PASS) {
      return res.status(500).json({
        ok: false,
        error: "Missing Odoo env vars",
      });
    }

    const response = await fetch(`${ODOO_URL}/jsonrpc`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "call",
        params: {
          service: "common",
          method: "authenticate",
          args: [ODOO_DB, ODOO_USER, ODOO_PASS, {}],
        },
        id: Date.now(),
      }),
    });

    const data = await response.json();

    if (!data.result) {
      return res.status(401).json({
        ok: false,
        error: "Authentication failed",
        raw: data,
      });
    }

    return res.status(200).json({
      ok: true,
      uid: data.result,
      db: ODOO_DB,
      url: ODOO_URL,
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: err.message,
    });
  }
}
