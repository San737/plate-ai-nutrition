
// Follow Deno runtime TypeScript conventions for Supabase Edge Functions
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

// Define CORS headers to allow requests from any origin
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Handle OPTIONS requests for CORS
function handleCors(req: Request) {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
}

// Main serve handler
serve(async (req) => {
  try {
    // Handle CORS preflight request
    const corsResponse = handleCors(req);
    if (corsResponse) return corsResponse;

    // Parse request body
    const { imageData } = await req.json();

    if (!imageData) {
      return new Response(
        JSON.stringify({ error: "Image data is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Mock response while waiting for Gemini API key
    // In a real implementation, this would call the Gemini API
    const mockFoodItems = [
      {
        name: "Grilled Chicken Salad",
        portionSize: "1 serving",
        nutrition: {
          calories: 320,
          protein: 28,
          carbs: 12,
          fat: 18
        }
      },
      {
        name: "Avocado",
        portionSize: "1/2 medium",
        nutrition: {
          calories: 160,
          protein: 2,
          carbs: 8,
          fat: 15
        }
      }
    ];

    // Return the mock response
    return new Response(
      JSON.stringify({ foodItems: mockFoodItems }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    // Handle errors
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
