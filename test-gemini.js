// Test script to verify Gemini API key
// Run with: node test-gemini.js

// Load environment variables
require('dotenv').config({ path: '.env.local' });

async function testGeminiAPI() {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error('❌ GEMINI_API_KEY not found in environment variables');
    console.log('Please create a .env.local file with:');
    console.log('GEMINI_API_KEY=your_actual_api_key_here');
    return;
  }

  console.log('🔑 API Key found:', apiKey.substring(0, 10) + '...');
  
  try {
    console.log('🚀 Testing Gemini API...');
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { 
                  text: "Say 'Hello! Gemini API is working correctly.' and nothing else." 
                }
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error:', response.status, errorText);
      return;
    }

    const data = await response.json();
    const result = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (result) {
      console.log('✅ Gemini API is working!');
      console.log('Response:', result);
    } else {
      console.log('⚠️  API responded but no content found');
      console.log('Full response:', JSON.stringify(data, null, 2));
    }
    
  } catch (error) {
    console.error('❌ Error testing Gemini API:', error.message);
  }
}

testGeminiAPI();
