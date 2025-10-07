import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/proxy/check-customer", async (req, res) => {
  const email = req.query.email;

  if (!email) {
    return res.status(400).json({ error: "Email parameter is required" });
  }

  try {
    const response = await fetch(
      `https://${process.env.SHOPIFY_SHOP_DOMAIN}/admin/api/2024-10/customers/search.json?query=email:${email}`,
      {
        headers: {
          "X-Shopify-Access-Token": process.env.SHOPIFY_ADMIN_TOKEN,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    const exists = data.customers && data.customers.length > 0;

    res.json({ exists });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


app.listen(PORT, () => console.log("Server running on port " + PORT));
