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
    const { fieldKey, userData, detailed = false, language = 'en' } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log('Generating education tip for field:', fieldKey, 'with user data:', userData, 'detailed:', detailed, 'language:', language);

    const languageInstruction = language === 'pl' 
      ? 'CRITICAL: You MUST respond ONLY in Polish language (Polski). Do NOT use English.' 
      : 'CRITICAL: You MUST respond ONLY in English language. Do NOT use Polish.';

    const languageContext = language === 'pl'
      ? 'You are speaking to a Polish user. All explanations, numbers, and examples must be in Polish.'
      : 'You are speaking to an English user. All explanations, numbers, and examples must be in English.';

    // Build context-aware prompt
    const systemPrompt = detailed
      ? `You are an educational assistant for a Polish pension calculator (ZUS). Provide DETAILED educational content about pension concepts in HTML format.

${languageInstruction}
${languageContext}

CRITICAL RULES FOR DETAILED CONTENT:
- Return ONLY valid HTML content (no markdown, no code blocks)
- Use semantic HTML tags: <h3>, <h4>, <p>, <ul>, <li>, <strong>, <em>
- Include colorful emoji icons throughout (🎂💰📅🏥⏰📊💡✅⚠️📈)
- Use inline styles for colors: 
  * Headers: style="color: #8B5CF6; font-weight: 600;"
  * Important text: style="color: #D946EF; font-weight: 500;"
  * Success/positive: style="color: #10B981;"
  * Warning: style="color: #F59E0B;"
  * Numbers/calculations: style="color: #0EA5E9; font-weight: 600;"
- Structure with clear sections using <h3> and <h4>
- Use bullet points <ul><li> for lists
- Include specific calculations using user's data (show math!)
- Make it 400-600 words
- ${languageInstruction}
- Be personal and engaging

HTML Structure Example:
<div>
  <h3 style="color: #8B5CF6; font-weight: 600; margin-bottom: 12px;">💰 How Your Salary Affects Your Pension</h3>
  <p style="margin-bottom: 16px;">Let's break down exactly how your <strong style="color: #D946EF;">5,000 PLN</strong> monthly salary builds your future pension...</p>
  
  <h4 style="color: #8B5CF6; font-weight: 500; margin-top: 16px; margin-bottom: 8px;">📊 The Numbers</h4>
  <ul style="margin-left: 20px; margin-bottom: 16px;">
    <li style="margin-bottom: 8px;">ZUS takes <strong style="color: #0EA5E9;">19.52%</strong> of your salary each month</li>
    <li style="margin-bottom: 8px;">For you: <strong style="color: #0EA5E9;">976 PLN</strong> goes to your pension monthly</li>
  </ul>
  
  <h4 style="color: #10B981; font-weight: 500; margin-top: 16px; margin-bottom: 8px;">✅ What This Means For You</h4>
  <p>Based on your situation...</p>
</div>

IMPORTANT: Return ONLY the HTML content, no markdown formatting, no backticks, no code blocks.`
      : `You are an educational assistant for a Polish pension calculator (ZUS). Explain pension concepts in the SIMPLEST way possible for people with basic education.

${languageInstruction}
${languageContext}

CRITICAL RULES:
- Maximum 2-3 SHORT sentences (5 lines max total)
- Use EXTREMELY simple, direct language - like talking to a 10-year-old
- Focus ONLY on Polish ZUS pension system
- Start with a colorful emoji that matches the topic 🎂💰📅🏥⏰
- Avoid complex terms - use everyday words
- Use context from previous answers (e.g., if female, mention age 60 retirement)
- Include simple Polish numbers in PLN when helpful
- Be friendly and encouraging

Example good response (in the language specified above):
"💰 Higher salary = bigger pension! ZUS takes 19.52% of your salary each month and saves it for you. If you earn 5,000 PLN, about 976 PLN goes to your future pension every month."

Example bad response:
"💰 Higher salary = bigger pension! ZUS takes 19.52% of your salary each month and saves it for you. If you earn 5,000 PLN, about 976 PLN goes to your future pension every month."

Example bad response:
"The contribution rate established by ZUS regulations stipulates that 19.52% of gross remuneration is allocated to the pension capital account, thereby determining future retirement benefits through actuarial calculations."`;

    const userContext = buildUserContext(fieldKey, userData, detailed);

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
          { 
            role: "user", 
            content: `${userContext}\n\n${languageInstruction}` 
          }
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

    if (detailed) {
      // For detailed content, return just the detailed text
      return new Response(
        JSON.stringify({ detailedContent: content }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

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

function buildUserContext(fieldKey: string, userData: any, detailed = false): string {
  const age = userData?.age || null;
  const gender = userData?.gender || userData?.sex || null;
  const currentSalary = userData?.currentSalary || null;
  const workStartYear = userData?.workStartYear || null;
  const expectedPension = userData?.expectedPension || null;

  let context = `Generate ${detailed ? 'detailed educational content' : 'an educational tip'} about "${fieldKey}" for the Polish pension system.\n\n`;

  context += `USER PROFILE:\n`;
  if (age) context += `- Age: ${age} years old\n`;
  if (gender) context += `- Gender: ${gender}\n`;
  if (currentSalary) context += `- Current salary: ${currentSalary} PLN/month\n`;
  if (workStartYear) context += `- Started working in: ${workStartYear}\n`;
  if (expectedPension) context += `- Expected pension goal: ${expectedPension} PLN/month\n`;

  if (detailed) {
    context += `\n\nProvide comprehensive educational content that:\n`;
    context += `1. Explains the concept in detail\n`;
    context += `2. Shows specific calculations using THEIR data (age: ${age}, salary: ${currentSalary} PLN, gender: ${gender})\n`;
    context += `3. Includes real examples and use cases\n`;
    context += `4. Explains how it impacts THEIR specific pension amount\n`;
    context += `5. Provides actionable recommendations for THEIR situation`;
  } else {
    context += `\n\nProvide a personalized tip with:\n1. A clear, engaging title (one line)\n2. 2-3 sentences explaining how this affects their pension, using their specific data when relevant.`;
  }

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
