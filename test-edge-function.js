/**
 * Test the Supabase Edge Function with Gemini model
 * Run: node test-edge-function.js
 */

import * as dotenv from 'dotenv';
dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Missing Supabase configuration in .env file');
  console.error('Required: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

console.log('🧪 Testing Supabase Edge Function with Gemini\n');
console.log('=' .repeat(60));

const PERSONAS = [
  { id: 'health-coach', name: 'Dr. Wellness' },
  { id: 'gym-coach', name: 'Coach Max' },
  { id: 'nutrition-coach', name: 'Coach Nourish' }
];

async function testPersona(persona, message) {
  try {
    console.log(`\n🤖 Testing ${persona.name}...`);
    
    const response = await fetch(
      `${SUPABASE_URL}/functions/v1/persona-chat`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          personaId: persona.id
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Failed (${response.status}): ${errorText}`);
      return false;
    }

    const data = await response.json();
    
    if (data.response) {
      console.log(`✅ Success!`);
      console.log(`Response: ${data.response.substring(0, 150)}...`);
      return true;
    } else {
      console.error(`❌ No response in data:`, data);
      return false;
    }
    
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    return false;
  }
}

async function runTests() {
  console.log('\n📋 Configuration');
  console.log('-'.repeat(60));
  console.log(`Supabase URL: ${SUPABASE_URL}`);
  console.log(`Edge Function: ${SUPABASE_URL}/functions/v1/persona-chat`);
  
  let successCount = 0;
  let totalTests = PERSONAS.length;

  for (const persona of PERSONAS) {
    const message = `Give me one quick ${persona.name.includes('Wellness') ? 'wellness' : 'fitness'} tip`;
    const success = await testPersona(persona, message);
    if (success) successCount++;
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('\n' + '='.repeat(60));
  console.log(`✨ Test Results: ${successCount}/${totalTests} passed`);
  console.log('='.repeat(60));

  if (successCount === totalTests) {
    console.log('\n✅ All personas are working with Gemini LLM!');
    console.log('The edge function is properly connected and responding.');
  } else {
    console.log('\n⚠️  Some tests failed. Check the errors above.');
    console.log('Common issues:');
    console.log('  - Edge function not deployed');
    console.log('  - GEMINI_API_KEY not set in Supabase secrets');
    console.log('  - API quota exceeded');
  }
}

runTests();
