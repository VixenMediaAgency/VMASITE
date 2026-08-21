export default async function handler(req, res) {
  // WE ARE TEMPORARILY HARDCODING THE KEY TO TEST
  const apiKey = "6a1bc37a64b314b0b75ae9b94970add2d1dd3c387263a5db71a61628e7b554d8"; 

  try {
    const response = await fetch(`https://banking.gta.world/gateway_token/generateToken?price=2700&type=0`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${apiKey}` }
    });

    // Check if the bank actually liked the key
    if (!response.ok) {
        return res.status(500).send(`Bank rejected the key. Status: ${response.status}`);
    }

    const token = await response.text();
    const cleanToken = token.replace(/"/g, '');
    
    // Send the user to the bank!
    res.redirect(`https://banking.gta.world/gateway/${cleanToken}`);
    
  } catch (error) {
    res.status(500).send("Network Error: Could not reach the bank servers.");
  }
}
