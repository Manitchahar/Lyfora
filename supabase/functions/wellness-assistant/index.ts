import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { message } = await req.json();

    const responses = [
      "That's wonderful! Remember, every small step counts toward your wellness goals. Stay consistent and be patient with yourself.",
      "Great question! Focus on building sustainable habits. Start with small changes and gradually increase the difficulty as you progress.",
      "I'm here to support you! Remember to listen to your body and take rest days when needed. Balance is key to long-term wellness.",
      "Excellent! Staying hydrated, getting enough sleep, and moving your body regularly are foundational to feeling your best.",
      "Remember, wellness is a journey, not a destination. Celebrate your progress and be kind to yourself on challenging days.",
      "That's a common concern. Try breaking your goals into smaller, manageable tasks. This makes them less overwhelming and more achievable.",
      "Great mindset! Consistency matters more than perfection. Even 5-10 minutes of wellness activities can make a significant difference.",
      "I'm glad you're prioritizing your health! Consider tracking your progress to stay motivated and see how far you've come.",
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

    const data = {
      response: randomResponse,
      timestamp: new Date().toISOString(),
    };

    return new Response(
      JSON.stringify(data),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});