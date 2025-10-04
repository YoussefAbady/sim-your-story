import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { fieldKey, userData } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log('Generating education tip for field:', fieldKey, 'with user data:', userData);

    // Build context-aware prompt
    const systemPrompt = `You are an educational assistant for a Polish pension calculator. Your role is to explain WHY each field impacts the user's retirement plan.

RULES:
- Explain WHY this specific field affects their pension calculation
- Educate users about the impact on their retirement plan
- Use context from their previous answers to personalize the explanation (e.g., if sex is female, explain female-specific retirement rules)
- Keep explanations under 3 sentences but make them educational and insightful
- Use simple, worker-friendly language
- Include relevant numbers when possible
- Be encouraging and informative
- ALWAYS respond in English`;

    const userContext = buildUserContext(fieldKey, userData);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userContext }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), 
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to continue." }), 
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Extract title and content from AI response
    const lines = content.split('\n').filter((line: string) => line.trim());
    const title = lines[0].replace(/^#+\s*/, '').replace(/^\*\*/, '').replace(/\*\*$/, '');
    const tipContent = lines.slice(1).join(' ').trim();

    const tip = {
      id: fieldKey,
      title: title,
      content: tipContent || content,
      icon: getIconForField(fieldKey)
    };

    console.log('Generated tip:', tip);

    return new Response(
      JSON.stringify(tip),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-education-tip:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function buildUserContext(fieldKey: string, userData: any): string {
  const age = userData?.age || null;
  const gender = userData?.gender || null;
  const currentSalary = userData?.currentSalary || null;
  const workStartYear = userData?.workStartYear || null;
  const expectedPension = userData?.expectedPension || null;

  let context = `Generate an educational tip about "${fieldKey}" for the Polish pension system.\n\n`;

  if (age) context += `User is ${age} years old. `;
  if (gender) context += `Gender: ${gender}. `;
  if (currentSalary) context += `Current salary: ${currentSalary} PLN/month. `;
  if (workStartYear) context += `Started working in ${workStartYear}. `;
  if (expectedPension) context += `Expected pension goal: ${expectedPension} PLN/month. `;

  context += `\n\nProvide a personalized tip with:\n1. A clear, engaging title (one line)\n2. 2-3 sentences explaining how this affects their pension, using their specific data when relevant.`;

  return context;
}

function getIconForField(fieldKey: string): string {
  const iconMap: Record<string, string> = {
    birthDate: "🎂",
    gender: "👤",
    currentSalary: "💰",
    workStartYear: "📅",
    expectedPension: "🎯",
    pensionGroups: "📊",
    minimumPension: "🛡️",
    averagePension: "📈",
    aboveAverage: "⭐",
    contributionYears: "⏰",
    sickLeave: "🏥",
    simulation: "🎓",
    employmentGaps: "⚠️",
    indexation: "📉"
  };
  
  return iconMap[fieldKey] || "💡";
}
