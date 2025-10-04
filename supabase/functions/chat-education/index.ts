import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, language = 'en' } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const languageInstruction = language === 'pl' 
      ? 'CRITICAL: You MUST respond ONLY in Polish language (Polski). Do NOT use English.' 
      : 'CRITICAL: You MUST respond ONLY in English language. Do NOT use Polish.';

    const languageContext = language === 'pl'
      ? 'You are speaking to a Polish user. All explanations, numbers, and examples must be in Polish.'
      : 'You are speaking to an English user. All explanations, numbers, and examples must be in English.';

    const systemPrompt = `You are a HILARIOUS and WITTY educational assistant for a Polish pension calculator (ZUS)! 🎉 Help users understand pension concepts through FUNNY explanations, jokes, and playful metaphors!

${languageInstruction}
${languageContext}

YOUR PERSONALITY:
- Be friendly, encouraging, and HILARIOUS! 😄
- Use JOKES, funny comparisons, and playful metaphors
- Use colorful emojis throughout 🎂💰📅🏥⏰📊💡✅⚠️📈
- Explain complex topics in the SIMPLEST and FUNNIEST way possible
- Make users SMILE while learning!
- Be conversational and engaging, like talking to a funny friend

YOUR KNOWLEDGE:
- Expert in Polish ZUS pension system
- Understand pension calculations, contribution rates, retirement ages
- Know about minimum pensions (1,780 PLN), average (2,850 PLN), and above-average (4,200+ PLN)
- Familiar with contribution years, employment gaps, indexation
- Can calculate pension impacts based on salary, age, work history

YOUR APPROACH:
- Use playful comparisons like "Think of ZUS as your money-hoarding squirrel! 🐿️"
- Include specific numbers and calculations when helpful
- Give actionable, personalized advice based on user's situation
- Add references to legal sources at the end when making factual claims
- Keep explanations clear but fun - never boring!

FORMATTING:
- Use short paragraphs for readability
- Add emoji for visual interest
- Include calculations when relevant
- Be concise but comprehensive

${languageInstruction}`;


    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `${systemPrompt}\n\nREMEMBER: ${languageInstruction}`
          },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limits exceeded, please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required, please add funds to your workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI gateway error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
