// test-ollama-cloud.js
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.OLLAMA_CLOUD_API_KEY;

async function testCloud() {
  console.log('🔑 Using API Key:', apiKey ? 'Loaded' : 'Missing');
  
  try {
    // Direct API call - bypass library issues
    const response = await fetch('https://api.ollama.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama3.2:3b',
        messages: [
          { role: 'user', content: 'Translate "hello" to Spanish' }
        ],
        stream: false
      })
    });
    
    const data = await response.json();
    console.log('📡 Response status:', response.status);
    console.log('📦 Response data:', data);
    
    if (response.ok) {
      console.log('✅ Cloud working! Translation:', data.choices[0].message.content);
    } else {
      console.log('❌ Error:', data.error?.message || 'Unknown error');
      
      // Try without API key (public endpoint)
      console.log('\n🔄 Trying public endpoint...');
      const publicTest = await fetch('https://api.ollama.com/v1/tags');
      console.log('Public endpoint status:', publicTest.status);
    }
    
  } catch (error) {
    console.error('❌ Network error:', error.message);
    
    // Try different endpoints
    const endpoints = [
      'https://api.ollama.ai',
      'https://ollama.com/api',
      'https://ollama-api.fly.dev'
    ];
    
    for (const endpoint of endpoints) {
      try {
        console.log(`\n🔍 Testing ${endpoint}...`);
        const test = await fetch(endpoint);
        console.log(`${endpoint} status:`, test.status);
      } catch (e) {
        console.log(`${endpoint} failed:`, e.message);
      }
    }
  }
}

testCloud();