import "jsr:@supabase/functions-js/edge-runtime.d.ts";

declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
  serve(handler: (req: Request) => Response | Promise<Response>): void;
};

const DEFAULT_ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://lyfora.vercel.app",
];

const envAllowedOrigins = Deno.env.get("ALLOWED_ORIGINS")
  ?.split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = new Set(envAllowedOrigins?.length ? envAllowedOrigins : DEFAULT_ALLOWED_ORIGINS);

const baseCorsHeaders = {
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
  "Access-Control-Allow-Credentials": "true",
};

const getCorsHeaders = (origin?: string) => {
  const allowOrigin = origin && allowedOrigins.has(origin)
    ? origin
    : allowedOrigins.values().next()?.value ?? "http://localhost:5173";

  return {
    ...baseCorsHeaders,
    "Access-Control-Allow-Origin": allowOrigin,
  };
};

const jsonResponse = (body: Record<string, unknown>, status: number, origin?: string) =>
  new Response(
    JSON.stringify(body),
    {
      status,
      headers: {
        ...getCorsHeaders(origin),
        "Content-Type": "application/json",
      },
    },
  );

// Use Gemini Flash Latest - fast, cost effective, and most up-to-date model (Gemini 2.5)
// Note: gemini-flash-latest auto-resolves to the best available flash model
const GEMINI_MODEL = "gemini-flash-latest";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

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
  'health-coach': `You're a friendly health coach. Keep responses short and conversational (2-3 sentences max). 
Focus on practical, actionable advice. Be supportive and encouraging. Remind users to consult 
healthcare professionals for medical concerns.`,
  
  'gym-coach': `You're an energetic gym coach. Keep it short and motivating (2-3 sentences). 
Give practical workout advice with proper form tips. Be encouraging but remind users to 
start gradually and listen to their bodies.`,
  
  'swimming-coach': `You're a swimming coach who keeps things simple. Short responses (2-3 sentences). 
Focus on technique tips and water safety. Be encouraging and clear.`,
  
  'weightlifting-coach': `You're a weightlifting coach. Keep responses brief (2-3 sentences). 
Focus on form, safety, and progressive strength. Be precise but conversational.`,
  
  'nutrition-coach': `You're a nutrition coach. Keep it conversational and brief (2-3 sentences). 
Give practical meal ideas and nutrition tips. Be supportive and remind users to consult 
professionals for specific dietary needs.`,
  
  'yoga-coach': `You're a calming yoga instructor. Keep responses short and peaceful (2-3 sentences). 
Share yoga tips, poses, and mindfulness practices. Remind users to practice within their limits.`
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
  const originHeader = req.headers.get("Origin") || undefined;

  if (originHeader && !allowedOrigins.has(originHeader)) {
    console.warn("[PersonaChat] Blocked request from disallowed origin", originHeader);
    return jsonResponse({ error: "Origin not allowed" }, 403, originHeader);
  }

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: getCorsHeaders(originHeader),
    });
  }

  // Only allow POST
  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405, originHeader);
  }

  try {
    // Get API key from environment
    const apiKey = Deno.env.get("GEMINI_API_KEY");
    console.log("[PersonaChat] API Key present:", !!apiKey);
    
    if (!apiKey) {
      console.error("[PersonaChat] GEMINI_API_KEY not configured");
      return jsonResponse({ error: "API key not configured - service unavailable" }, 500, originHeader);
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
      return jsonResponse({ error: "Invalid request format" }, 400, originHeader);
    }

    console.log("[PersonaChat] Message length:", typeof message === "string" ? message.length : 0);
    console.log("[PersonaChat] Persona ID:", personaId);

    // Validate request
    if (!message || typeof message !== "string") {
      console.error("[PersonaChat] Invalid message type");
      return jsonResponse({ error: "Message is required and must be a string" }, 400, originHeader);
    }

    // Validate message length
    if (message.trim().length === 0) {
      console.error("[PersonaChat] Empty message");
      return jsonResponse({ error: "Message cannot be empty" }, 400, originHeader);
    }

    if (message.length > 5000) {
      console.error("[PersonaChat] Message too long");
      return jsonResponse({ error: "Message is too long (max 5000 characters)" }, 400, originHeader);
    }

    if (!personaId || typeof personaId !== "string") {
      console.error("[PersonaChat] Invalid personaId");
      return jsonResponse({ error: "PersonaId is required and must be a string" }, 400, originHeader);
    }

    // Validate persona exists
    if (!PERSONA_CONTEXTS[personaId]) {
      console.error("[PersonaChat] Unknown persona:", personaId);
      return jsonResponse({ error: "Invalid persona ID" }, 400, originHeader);
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
            thinkingConfig: {
              thinkingBudget: 0  // Disable thinking mode for faster, conversational responses
            }
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
        
        return jsonResponse(
          {
            error: "Upstream timeout",
            response: timeoutResponses[personaId] || timeoutResponses['health-coach'],
          },
          504,
          originHeader,
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
        return jsonResponse({ error: "Rate limit exceeded. Please try again in a moment." }, 429, originHeader);
      }
      
      if (geminiResponse.status === 401 || geminiResponse.status === 403) {
        console.error("[PersonaChat] Gemini API authentication failed");
        return jsonResponse({ error: "API authentication failed - service unavailable" }, 502, originHeader);
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
      
      return jsonResponse(
        {
          error: "Gemini request failed",
          response: fallbackResponses[personaId] || fallbackResponses['health-coach'],
        },
        502,
        originHeader,
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
      
      return jsonResponse(
        {
          error: "Gemini response parse failure",
          response: fallbackResponses[personaId] || fallbackResponses['health-coach'],
        },
        502,
        originHeader,
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
      
      return jsonResponse(
        {
          error: "Content blocked by safety filters",
          response: safetyResponses[personaId] || safetyResponses['health-coach'],
        },
        400,
        originHeader,
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
      
      return jsonResponse(
        {
          error: "Gemini returned no content",
          response: fallbackResponses[personaId] || fallbackResponses['health-coach'],
        },
        502,
        originHeader,
      );
    }

    return jsonResponse({ response: candidateText }, 200, originHeader);
  } catch (error) {
    console.error("[PersonaChat] Unexpected error:", error);
    
    // Provide helpful error message based on error type
    let errorMessage = "I'm experiencing some technical difficulties. Please try again in a moment.";
    
    if (error instanceof Error) {
      if (error.message.includes('network') || error.message.includes('fetch')) {
        errorMessage = "Network connection issue. Please check your connection and try again.";
      }
    }
    
    return jsonResponse({ error: "Server error", response: errorMessage }, 500, originHeader);
  }
});
