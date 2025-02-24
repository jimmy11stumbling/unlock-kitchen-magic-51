
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const CLAUDE_API_KEY = "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";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { analysisType, data } = await req.json();
    console.log(`Received ${analysisType} analysis request:`, data);

    let systemPrompt = "";
    let userPrompt = "";

    switch (analysisType) {
      case "menu-optimization":
        systemPrompt = "You are a restaurant analytics expert focusing on menu optimization and pricing strategies.";
        userPrompt = `Analyze this menu performance data: ${JSON.stringify(data)}. 
                     Provide specific recommendations for menu optimization, pricing adjustments, and potential new items based on trends.`;
        break;
      case "staffing-analysis":
        systemPrompt = "You are a restaurant staffing and scheduling optimization expert.";
        userPrompt = `Based on this staffing and customer traffic data: ${JSON.stringify(data)}.
                     Provide detailed recommendations for optimal staff scheduling and coverage.`;
        break;
      case "inventory-prediction":
        systemPrompt = "You are an inventory management and prediction expert for restaurants.";
        userPrompt = `Using this inventory and sales data: ${JSON.stringify(data)}.
                     Predict future inventory needs and suggest optimal ordering patterns.`;
        break;
      case "customer-insights":
        systemPrompt = "You are a customer behavior and feedback analysis expert for restaurants.";
        userPrompt = `Analyze this customer feedback and sales data: ${JSON.stringify(data)}.
                     Provide insights on customer preferences and satisfaction trends.`;
        break;
      default:
        throw new Error("Invalid analysis type specified");
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CLAUDE_API_KEY,
        'anthropic-version': '2024-02-15-preview'
      },
      body: JSON.stringify({
        model: 'claude-3-opus-20240229',
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: userPrompt
          }
        ],
        system: systemPrompt
      })
    });

    console.log('Claude API Response Status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Claude API Error:', errorData);
      throw new Error(`Claude API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Claude API Response:', data);

    if (!data.content || !data.content[0] || !data.content[0].text) {
      console.error('Unexpected response structure:', data);
      throw new Error('Unexpected response format from Claude API');
    }

    const analysis = data.content[0].text;
    
    return new Response(
      JSON.stringify({ analysis }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    );
  } catch (error) {
    console.error('Error in analytics function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An unexpected error occurred',
        details: error instanceof Error ? error.stack : undefined
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});
