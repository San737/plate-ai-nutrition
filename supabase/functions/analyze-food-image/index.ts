
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY") || "";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent";

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!GEMINI_API_KEY) {
      throw new Error("Missing Gemini API key");
    }

    // Parse the request body
    const { imageData } = await req.json();
    
    if (!imageData) {
      throw new Error("No image data provided");
    }
    
    // Remove data:image/jpeg;base64, prefix if present
    const base64Image = imageData.split(",")[1] || imageData;
    
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: "Analyze this food image and provide a detailed JSON response with the following structure: { \"foodItems\": [ { \"name\": \"item name\", \"portionSize\": \"estimated portion\", \"nutrition\": { \"calories\": number, \"protein\": number, \"carbs\": number, \"fat\": number } } ] }. Be accurate with nutritional values."
              },
              {
                inline_data: {
                  mime_type: "image/jpeg",
                  data: base64Image
                }
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 1024,
        }
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      throw new Error(`Gemini API error: ${data.error.message}`);
    }
    
    // Extract the text from the response
    const generatedText = data.candidates[0]?.content?.parts[0]?.text || "";
    
    // Extract the JSON from the text
    let jsonMatch = generatedText.match(/```json\n([\s\S]*?)\n```/) || 
                  generatedText.match(/```([\s\S]*?)```/) ||
                  [null, generatedText];
    
    let foodAnalysisResult;
    
    try {
      // Parse the extracted JSON
      foodAnalysisResult = JSON.parse(jsonMatch[1] || generatedText);
    } catch (e) {
      // If JSON parsing fails, try to extract just the JSON object pattern
      const jsonObjectMatch = generatedText.match(/{[\s\S]*}/);
      if (jsonObjectMatch) {
        try {
          foodAnalysisResult = JSON.parse(jsonObjectMatch[0]);
        } catch (e2) {
          throw new Error("Failed to parse Gemini response");
        }
      } else {
        throw new Error("Failed to extract JSON from Gemini response");
      }
    }
    
    return new Response(JSON.stringify(foodAnalysisResult), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in analyze-food-image function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
