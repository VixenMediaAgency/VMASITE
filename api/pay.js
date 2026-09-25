export default async function handler(req, res) {
  // We are temporarily hardcoding the key to test
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
        mode: 0, // Change to 1 when you are ready to go live
        description: "Vixen Media Agency Subscription"
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(500).send(`Bank rejected the request. Status: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    // Check how the v2 API returns the payment link/redirect URL 
    // (Typically properties like data.url or data.payment_url depending on the schema)
    const paymentUrl = data.url || data.payment_url || data.redirect_url;

    if (!paymentUrl) {
      return res.status(500).send("API succeeded, but no payment URL was returned in the response.");
    }
    
    // Send the user to the bank's hosted payment page!
    return res.redirect(paymentUrl);
     
  } catch (error) {
    console.error(error);
    return res.status(500).send("Network Error: Could not reach the bank servers.");
  }
}
