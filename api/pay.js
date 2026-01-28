export default async function handler(req, res) {
  // WE ARE TEMPORARILY HARDCODING THE KEY TO TEST
  const apiKey = "7c243884-6338-4e3a-9e0c-8d1964253902"; 

  try {
    const response = await fetch(`https://banking.gta.world/gateway_token/generateToken?price=2700&type=0`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${apiKey}` }
    });

    const token = await response.text();
    const cleanToken = token.replace(/"/g, '');
    res.redirect(`https://banking.gta.world/gateway/${cleanToken}`);
    
  } catch (error) {
    res.status(500).send("Bank Connection Failed. The API Key might be expired.");
  }
}
