export default async function handler(req, res) {
  const apiKey = "6a1bc37a64b314b0b75ae9b94970add2d1dd3c387263a5db71a61628e7b554d8"; 

  try {
    const response = await fetch("https://banking.gta.world/api/v2/payment", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: 2700,
        mode: 0, // Change to 1 when you're ready for live production payments
        description: "Vixen Media Agency Subscription"
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(500).send(`Bank rejected: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    // Check if the payment link exists in the response
    if (!data.payment_link) {
      return res.status(500).send("API succeeded, but no payment link was returned.");
    }
    
    // Redirect the user straight to the bank's payment page
    return res.redirect(data.payment_link);
     
  } catch (error) {
    console.error(error);
    return res.status(500).send("Network Error: Could not reach the bank servers.");
  }
}
