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
    const { messages, language = 'en', fieldKey, userData, tipTitle, tipContent } = await req.json();
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

    // Sanitize user data similar to generator
    const sanitizeUserData = (data: any) => {
      if (!data || typeof data !== 'object') return {};
      return {
        age: typeof data?.age === 'number' ? Math.floor(Math.max(0, Math.min(120, data.age))) : null,
        gender: ['male', 'female'].includes(data?.gender) ? data.gender : null,
        sex: ['male', 'female'].includes(data?.sex) ? data.sex : null,
        currentSalary: typeof data?.currentSalary === 'number' ? Math.floor(Math.max(0, data.currentSalary)) : null,
        accountValue: typeof data?.accountValue === 'number' ? Math.floor(Math.max(0, data.accountValue)) : null,
        workStartYear: typeof data?.workStartYear === 'number' ? Math.floor(Math.max(1950, Math.min(2050, data.workStartYear))) : null,
        expectedPension: typeof data?.expectedPension === 'number' || typeof data?.expectedPension === 'string' 
          ? Math.floor(Math.max(0, parseFloat(data.expectedPension))) : null,
        pensionGroupKey: typeof data?.pensionGroupKey === 'string' ? data.pensionGroupKey : null,
        pensionGroupLabel: typeof data?.pensionGroupLabel === 'string' ? data.pensionGroupLabel : null,
        pensionAmount: typeof data?.pensionAmount === 'number' ? Math.floor(Math.max(0, data.pensionAmount)) : null,
        pensionDescription: typeof data?.pensionDescription === 'string' ? data.pensionDescription : null,
      };
    };

    const sanitizedUserData = sanitizeUserData(userData);

    // Build context text like generator
    function buildUserContext(fieldKey?: string, userData?: any): string {
      if (!fieldKey) {
        // Fallback to tip title/content
        const title = tipTitle ? `Title: ${tipTitle}` : '';
        const content = tipContent ? `\nContent: ${tipContent}` : '';
        return `Provide more details based on the previous tip. ${title}${content}`;
      }

      const age = userData?.age || null;
      const gender = userData?.gender || userData?.sex || null;
      const currentSalary = userData?.currentSalary || null;
      const workStartYear = userData?.workStartYear || null;
      const expectedPension = userData?.expectedPension || null;
      const pensionGroupKey = userData?.pensionGroupKey || null;
      const pensionGroupLabel = userData?.pensionGroupLabel || null;
      const pensionAmount = userData?.pensionAmount || null;
      const pensionDescription = userData?.pensionDescription || null;

      if (fieldKey.startsWith('pension_group_')) {
        let context = `Generate detailed follow-up explanation about the "${pensionGroupLabel}" group (${pensionAmount} PLN/month) in the Polish pension system.\n\n`;
        context += `PENSION GROUP DETAILS:\n`;
        context += `- Group: ${pensionGroupLabel}\n`;
        context += `- Average amount: ${pensionAmount} PLN/month\n`;
        context += `- Description: ${pensionDescription}\n`;
        if (expectedPension) context += `- User's expected pension: ${expectedPension} PLN/month\n`;
        return context;
      }

      let context = `Provide a follow-up explanation about "${fieldKey}" for the Polish pension system.\n\n`;
      context += `USER PROFILE:\n`;
      if (age) context += `- Age: ${age} years old\n`;
      if (gender) context += `- Gender: ${gender}\n`;
      if (currentSalary) context += `- Current salary: ${currentSalary} PLN/month\n`;
      if (workStartYear) context += `- Started working in: ${workStartYear}\n`;
      if (expectedPension) context += `- Expected pension goal: ${expectedPension} PLN/month\n`;
      return context;
    }

    const userContext = buildUserContext(fieldKey, sanitizedUserData);



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
          { role: "user", content: userContext },
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
