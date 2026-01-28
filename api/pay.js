export default async function handler(req, res) {
  // 1. Get your secret key from Vercel's Environment Variables
  const apiKey = process.env.FLEECA_API_KEY; 
  
  // 2. We ask Fleeca for a token (we use 2700 as the price)
  try {
    const response = await fetch(`https://banking.gta.world/gateway_token/generateToken?price=2700&type=0`, {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${apiKey}` 
      }
    });

    // Fleeca returns the token as a string
    const token = await response.text(); 

    // 3. Send the user to the bank! 
    // We remove any extra quotes from the token just in case
    const cleanToken = token.replace(/"/g, '');
    res.redirect(`https://banking.gta.world/gateway/${cleanToken}`);
    
  } catch (error) {
    res.status(500).send("Server Error: Make sure FLEECA_API_KEY is set in Vercel.");
  }
}
