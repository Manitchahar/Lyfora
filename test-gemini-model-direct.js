/**
 * Direct test of the exact model used in edge function
 */

import * as dotenv from 'dotenv';
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = "gemini-flash-lite-latest";

console.log('🧪 Testing Gemini Model Directly\n');
console.log(`Model: ${GEMINI_MODEL}`);
console.log(`API Key: ${GEMINI_API_KEY ? '✅ Set' : '❌ Missing'}\n`);

if (!GEMINI_API_KEY) {
  console.error('❌ GEMINI_API_KEY not found');
  process.exit(1);
}

async function testModel() {
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
    
    console.log('Sending request...\n');
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          role: "user",
          parts: [{ 
            text: "You're an energetic gym coach. Keep it short and motivating (2-3 sentences). Give practical workout advice with proper form tips. Be encouraging but remind users to start gradually and listen to their bodies.\n\nUser question: I want to lift heavy" 
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topP: 0.9,
          maxOutputTokens: 512,
          thinkingConfig: {
            thinkingBudget: 0
          }
        }
      })
    });

    console.log(`Status: ${response.status} ${response.statusText}\n`);

    const data = await response.json();
    
    if (!response.ok) {
      console.error('❌ API Error:');
      console.error(JSON.stringify(data, null, 2));
      return;
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    const finishReason = data.candidates?.[0]?.finishReason;

    console.log('Response Data:');
    console.log(`- Finish Reason: ${finishReason}`);
    console.log(`- Model Version: ${data.modelVersion || 'N/A'}`);
    console.log(`- Has Text: ${!!text}\n`);

    if (text) {
      console.log('✅ SUCCESS! Got real AI response:\n');
      console.log(text);
    } else {
      console.log('❌ No text in response');
      console.log('\nFull response:');
      console.log(JSON.stringify(data, null, 2));
    }

  } catch (error) {
    console.error('❌ Request failed:', error.message);
  }
}

testModel();
