const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (_req, res) => res.send("OK"));

app.get("/proxy/check-customer", async (req, res) => {
  try {
    const email = String(req.query.email || "").trim().toLowerCase();
    if (!email) return res.status(400).json({ error: "Missing email" });

    const shop = process.env.SHOPIFY_SHOP_DOMAIN;      // e.g. 776740.myshopify.com
    const token = process.env.SHOPIFY_ADMIN_TOKEN;     // Admin API access token
    if (!shop || !token) return res.status(500).json({ error: "Server not configured" });

    const url = `https://${shop}/admin/api/2024-10/customers/search.json?query=${encodeURIComponent(`email:"${email}"`)}`;
    const r = await fetch(url, { headers: { "X-Shopify-Access-Token": token } });
    if (!r.ok) return res.status(502).json({ error: "Admin API error" });

    const { customers = [] } = await r.json();
    res.json({ exists: customers.length > 0 });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
