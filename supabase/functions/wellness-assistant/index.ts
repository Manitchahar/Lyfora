import "jsr:@supabase/functions-js/edge-runtime.d.ts";

declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
  serve(handler: (req: Request) => Response | Promise<Response>): void;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

// Use Gemini Flash-Lite Latest - smallest and most cost effective model
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent";

interface GeminiContentPart {
  text: string;
}

interface GeminiContent {
  role: "user" | "model";
  parts: GeminiContentPart[];
}

interface GeminiResponse {
  candidates?: Array<{
    content?: GeminiContent;
    finishReason?: string;
  }>;
  promptFeedback?: {
    safetyRatings?: Array<{ category: string; probability: string }>;
  };
}

const buildPrompt = (message: string): GeminiContent[] => [
  {
    role: "user",
    parts: [
      {
        text: `You are a compassionate wellness assistant. Provide supportive, evidence-informed guidance and motivation. Focus on actionable, safe wellness practices. If asked for medical advice, encourage consulting a healthcare professional.\n\nUser question: ${message}`,
      },
    ],
  },
];

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  // Only allow POST
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  try {
    // Get API key from environment
    const apiKey = Deno.env.get("GEMINI_API_KEY");
    console.log("[Wellness] API Key present:", !!apiKey);
    
    if (!apiKey) {
      console.error("[Wellness] GEMINI_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "API key not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Parse request body
    const { message } = await req.json();
    console.log("[Wellness] Received message:", message?.substring(0, 50));

    if (!message || typeof message !== "string") {
      console.error("[Wellness] Invalid message");
      return new Response(
        JSON.stringify({ error: "Message is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    console.log(`[Wellness] Calling Gemini API...`);

    // Call Gemini API
    const geminiResponse = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: buildPrompt(message),
        generationConfig: {
          temperature: 0.7,
          topP: 0.9,
          maxOutputTokens: 512,
        },
      }),
    });

    console.log(`[Wellness] Gemini status: ${geminiResponse.status}`);

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error(`[Wellness] Gemini error:`, errorText);
      return new Response(
        JSON.stringify({ response: "I'm here to help with your wellness journey. Could you try rephrasing your question?" }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const data = (await geminiResponse.json()) as GeminiResponse;
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    console.log(`[Wellness] Got response:`, !!candidateText);

    if (!candidateText) {
      return new Response(
        JSON.stringify({
          response: "I'm here to support you. Let's try that again with a bit more detail about what you need today.",
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    return new Response(
      JSON.stringify({ response: candidateText }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("[Wellness] Error:", error);
    return new Response(
      JSON.stringify({
        response: "I'm experiencing some technical difficulties. Please try again in a moment.",
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});