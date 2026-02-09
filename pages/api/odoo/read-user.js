export default async function handler(req, res) {
  try {
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

    // 1) login
    const auth = await jsonrpc("/web/session/authenticate", {
      jsonrpc: "2.0",
      method: "call",
      params: { db: ODOO_DB, login: ODOO_USER, password: ODOO_PASS },
      id: Date.now(),
    });

    const uid = auth?.result?.uid;
    if (!uid) return res.status(401).json({ ok: false, step: "auth", auth });

    // 2) read current user (res.users)
    const userRead = await jsonrpc("/web/dataset/call_kw", {
      jsonrpc: "2.0",
      method: "call",
      params: {
        model: "res.users",
        method: "read",
        args: [[uid], ["id", "name", "login", "email"]],
        kwargs: {},
      },
      id: Date.now(),
    });

    return res.status(200).json({
      ok: true,
      uid,
      user: userRead?.result?.[0] || null,
    });
  } catch (e) {
    return res.status(500).json({ ok: false, error: String(e) });
  }
}
