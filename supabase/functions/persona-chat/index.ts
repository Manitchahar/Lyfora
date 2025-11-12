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

// Use Gemini 1.5 Flash - fast and cost effective model
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

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

// Persona context mapping - matches personas.ts in frontend
const PERSONA_CONTEXTS: Record<string, string> = {
  'health-coach': `You are a certified health coach specializing in holistic wellness and preventive health. 
Provide evidence-based guidance on lifestyle balance, stress management, sleep hygiene, 
and overall wellbeing. Be supportive, encouraging, and focus on sustainable habits. 
Always remind users to consult healthcare professionals for medical concerns.`,
  
  'gym-coach': `You are an experienced gym coach specializing in strength training and fitness. 
Provide guidance on workout routines, proper form, progressive overload, and gym-based 
exercises. Be motivating and practical. Focus on safe, effective training methods. 
Remind users to start gradually and listen to their bodies.`,
  
  'swimming-coach': `You are a professional swimming coach with expertise in aquatic fitness and swimming 
techniques. Provide guidance on stroke improvement, water-based workouts, breathing 
techniques, and swimming training plans. Be encouraging and technical when needed. 
Focus on proper technique and water safety.`,
  
  'weightlifting-coach': `You are a certified weightlifting coach specializing in powerlifting and Olympic lifting. 
Provide guidance on compound movements, strength progression, programming, and lifting 
techniques. Be precise about form and safety. Focus on progressive strength development 
and injury prevention.`,
  
  'nutrition-coach': `You are a certified nutrition coach with expertise in dietary guidance and meal planning. 
Provide evidence-based nutritional advice, healthy eating strategies, and practical meal 
ideas. Be supportive and non-judgmental. Always remind users to consult registered 
dietitians or doctors for specific dietary needs or medical conditions.`,
  
  'yoga-coach': `You are an experienced yoga instructor specializing in mindfulness, flexibility, and 
breathwork. Provide guidance on yoga practices, poses, meditation, and mind-body 
connection. Be calming, supportive, and focus on the holistic benefits of yoga. 
Remind users to practice within their limits and modify as needed.`
};

const buildPrompt = (message: string, personaId: string): GeminiContent[] => {
  const systemPrompt = PERSONA_CONTEXTS[personaId] || PERSONA_CONTEXTS['health-coach'];
  
  return [
    {
      role: "user",
      parts: [
        {
          text: `${systemPrompt}\n\nUser question: ${message}`,
        },
      ],
    },
  ];
};

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
    console.log("[PersonaChat] API Key present:", !!apiKey);
    
    if (!apiKey) {
      console.error("[PersonaChat] GEMINI_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "API key not configured - service unavailable" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Parse request body with error handling
    let message: string;
    let personaId: string;
    
    try {
      const body = await req.json();
      message = body.message;
      personaId = body.personaId;
    } catch (parseError) {
      console.error("[PersonaChat] Failed to parse request body:", parseError);
      return new Response(
        JSON.stringify({ error: "Invalid request format" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    console.log("[PersonaChat] Received message:", message?.substring(0, 50));
    console.log("[PersonaChat] Persona ID:", personaId);

    // Validate request
    if (!message || typeof message !== "string") {
      console.error("[PersonaChat] Invalid message");
      return new Response(
        JSON.stringify({ error: "Message is required and must be a string" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Validate message length
    if (message.trim().length === 0) {
      console.error("[PersonaChat] Empty message");
      return new Response(
        JSON.stringify({ error: "Message cannot be empty" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    if (message.length > 5000) {
      console.error("[PersonaChat] Message too long");
      return new Response(
        JSON.stringify({ error: "Message is too long (max 5000 characters)" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    if (!personaId || typeof personaId !== "string") {
      console.error("[PersonaChat] Invalid personaId");
      return new Response(
        JSON.stringify({ error: "PersonaId is required and must be a string" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Validate persona exists
    if (!PERSONA_CONTEXTS[personaId]) {
      console.error("[PersonaChat] Unknown persona:", personaId);
      return new Response(
        JSON.stringify({ error: "Invalid persona ID" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    console.log(`[PersonaChat] Calling Gemini API with persona: ${personaId}`);

    // Call Gemini API with persona-specific context and timeout
    const geminiController = new AbortController();
    const geminiTimeoutId = setTimeout(() => geminiController.abort(), 25000); // 25 second timeout for Gemini API
    
    let geminiResponse: Response;
    
    try {
      geminiResponse = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: buildPrompt(message, personaId),
          generationConfig: {
            temperature: 0.7,
            topP: 0.9,
            maxOutputTokens: 512,
          },
        }),
        signal: geminiController.signal,
      });
      
      clearTimeout(geminiTimeoutId);
    } catch (fetchError) {
      clearTimeout(geminiTimeoutId);
      
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        console.error("[PersonaChat] Gemini API timeout");
        
        // Return persona-specific timeout fallback
        const timeoutResponses: Record<string, string> = {
          'health-coach': "I'm taking a bit longer than usual. Let's try that again - what wellness topic can I help you with?",
          'gym-coach': "That's taking too long! Let's reset and tackle your fitness question again.",
          'swimming-coach': "The connection is slow. Let's try again - what swimming question do you have?",
          'weightlifting-coach': "Timeout on that one. Let's go again - what lifting topic can I help with?",
          'nutrition-coach': "That took too long. Let's try again - what nutrition question can I answer?",
          'yoga-coach': "Let's take a breath and try again. What yoga guidance do you need?"
        };
        
        return new Response(
          JSON.stringify({ 
            response: timeoutResponses[personaId] || timeoutResponses['health-coach']
          }),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }
      
      throw fetchError; // Re-throw other errors to be caught by outer try-catch
    }

    console.log(`[PersonaChat] Gemini status: ${geminiResponse.status}`);

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error(`[PersonaChat] Gemini error (${geminiResponse.status}):`, errorText);
      
      // Handle specific Gemini API errors
      if (geminiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }
      
      if (geminiResponse.status === 401 || geminiResponse.status === 403) {
        console.error("[PersonaChat] Gemini API authentication failed");
        return new Response(
          JSON.stringify({ error: "API authentication failed - service unavailable" }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }
      
      // Return persona-specific fallback response for other errors
      const fallbackResponses: Record<string, string> = {
        'health-coach': "I'm here to help with your wellness journey. Could you try rephrasing your question?",
        'gym-coach': "Let's try that again! What fitness question can I help you with?",
        'swimming-coach': "I'm having trouble understanding. What swimming topic would you like to discuss?",
        'weightlifting-coach': "Let me help you with that. Could you rephrase your lifting question?",
        'nutrition-coach': "I'm here to help with nutrition. Could you ask that in a different way?",
        'yoga-coach': "Let's take a breath and try again. What yoga question do you have?"
      };
      
      return new Response(
        JSON.stringify({ 
          response: fallbackResponses[personaId] || fallbackResponses['health-coach']
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    let data: GeminiResponse;
    
    try {
      data = (await geminiResponse.json()) as GeminiResponse;
    } catch (parseError) {
      console.error("[PersonaChat] Failed to parse Gemini response:", parseError);
      
      const fallbackResponses: Record<string, string> = {
        'health-coach': "I'm having trouble processing that. Let's try again - what wellness topic can I help with?",
        'gym-coach': "Something went wrong there. Let's reset - what fitness question do you have?",
        'swimming-coach': "I couldn't process that properly. Let's try again - what swimming topic interests you?",
        'weightlifting-coach': "Error processing that. Let's go again - what lifting question can I answer?",
        'nutrition-coach': "I had trouble with that. Let's try again - what nutrition topic can I help with?",
        'yoga-coach': "Let's start fresh. What yoga guidance are you looking for?"
      };
      
      return new Response(
        JSON.stringify({
          response: fallbackResponses[personaId] || fallbackResponses['health-coach']
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }
    
    // Check for safety blocks or other issues
    if (data.promptFeedback?.safetyRatings) {
      console.log("[PersonaChat] Safety ratings present:", data.promptFeedback.safetyRatings);
    }
    
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    const finishReason = data.candidates?.[0]?.finishReason;

    console.log(`[PersonaChat] Got response:`, !!candidateText, `Finish reason:`, finishReason);

    // Handle blocked or filtered content
    if (finishReason === 'SAFETY' || finishReason === 'RECITATION') {
      console.warn("[PersonaChat] Content was blocked:", finishReason);
      
      const safetyResponses: Record<string, string> = {
        'health-coach': "I want to keep our conversation helpful and appropriate. Could you rephrase your question?",
        'gym-coach': "Let's keep it focused on fitness. Can you ask that in a different way?",
        'swimming-coach': "Let's stay on topic with swimming. Could you rephrase your question?",
        'weightlifting-coach': "Let's focus on safe lifting practices. Can you ask that differently?",
        'nutrition-coach': "Let's keep our nutrition discussion helpful. Could you rephrase that?",
        'yoga-coach': "Let's maintain a positive space. Could you ask that in a different way?"
      };
      
      return new Response(
        JSON.stringify({
          response: safetyResponses[personaId] || safetyResponses['health-coach']
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    if (!candidateText) {
      console.warn("[PersonaChat] No candidate text in response");
      
      const fallbackResponses: Record<string, string> = {
        'health-coach': "I'm here to support your wellness. Let's try that again with a bit more detail.",
        'gym-coach': "I'm ready to help! Can you give me more details about your fitness question?",
        'swimming-coach': "I'm here to help with your swimming. Could you provide more details?",
        'weightlifting-coach': "Let's get specific. What lifting topic would you like to discuss?",
        'nutrition-coach': "I'm here for your nutrition questions. Can you elaborate a bit more?",
        'yoga-coach': "I'm here to guide you. Could you share more about what you need?"
      };
      
      return new Response(
        JSON.stringify({
          response: fallbackResponses[personaId] || fallbackResponses['health-coach']
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
    console.error("[PersonaChat] Unexpected error:", error);
    
    // Provide helpful error message based on error type
    let errorMessage = "I'm experiencing some technical difficulties. Please try again in a moment.";
    
    if (error instanceof Error) {
      if (error.message.includes('network') || error.message.includes('fetch')) {
        errorMessage = "Network connection issue. Please check your connection and try again.";
      }
    }
    
    return new Response(
      JSON.stringify({
        response: errorMessage,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
