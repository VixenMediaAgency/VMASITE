// api/subscribe.js
// Deploy this as a Vercel / Next.js API route at /api/subscribe.
// It's hit via the tier links on the pricing page, e.g.
//   /api/subscribe?tier=scout
//   /api/subscribe?tier=operative
//   /api/subscribe?tier=director
//
// Set FLEECA_API_KEY as an environment variable in your deployment
// (Vercel: Project Settings -> Environment Variables). Don't put the
// key in the source file — anyone with the file can then spend
// against your bank account.

const TIERS = {
  scout:     { amount: 7000,  name: "Scout" },
  operative: { amount: 14000, name: "Operative" },
  director:  { amount: 21000, name: "Director" },
};

export default async function handler(req, res) {
  const tierKey = String(req.query.tier || "").toLowerCase();
  const tier = TIERS[tierKey];

  if (!tier) {
    return res.status(400).send("Unknown subscription tier.");
  }

  const apiKey = process.env.FLEECA_API_KEY;
  if (!apiKey) {
    return res.status(500).send("Server is missing FLEECA_API_KEY.");
  }

  try {
    const response = await fetch("https://banking.gta.world/api/v2/payment", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: tier.amount, // matches exactly what the page shows for this tier
        mode: 0, // switch to 1 when you're ready for live production payments
        description: `Vixen Media Agency Subscription — ${tier.name}`,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(502).send(`Bank rejected: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    if (!data.payment_link) {
      return res.status(502).send("API succeeded, but no payment link was returned.");
    }

    // Send the subscriber straight to the bank's payment page
    return res.redirect(data.payment_link);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Network error: could not reach the bank servers.");
  }
}
