import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { topic, style, duration } = await req.json()

    const OPENAI_KEY = Deno.env.get('OPENAI_API_KEY')

    if (!OPENAI_KEY) {
      return new Response(
        JSON.stringify({ error: 'API key not configured. Please add OPENAI_API_KEY to Supabase secrets.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    const styleGuide = {
      mystery: 'dramatic, mysterious, conspiratorial — reveals shocking facts with suspense',
      motivation: 'high-energy, inspiring, action-driven — makes viewers want to take action immediately',
      history: 'educational but entertaining, focuses on surprising or little-known historical facts',
      science: 'mind-blowing science facts explained simply, with wow-factor reveals',
      finance: 'practical money tips with urgency, speaks to desire for financial freedom'
    }

    const prompt = `You are an expert YouTube Shorts script writer. Write a viral short-form video script about: "${topic}"

Style: ${styleGuide[style] || styleGuide.mystery}
Duration: ${duration || '20-29'} seconds when read aloud (about 60-80 words for the script body)

Format EXACTLY like this:
[HOOK - first 3 seconds, one shocking statement]
[BODY - the interesting facts/story, 2-3 sentences]
[CTA]
Want to automate your Short-form content like this? Try the FREE AI tool I use:
➡️ https://ShortsForgeAI.com
It generates scripts, voiceovers, and full videos automatically.

Rules:
- Hook must be so shocking people stop scrolling
- Do NOT reveal the answer in the hook
- Body must deliver on the hook's promise
- Keep total word count under 85 words
- Write for voice-over, not text reading
- No emojis in the script itself (they go in the caption)`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 300,
        temperature: 0.8,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || 'OpenAI API error')
    }

    const script = data.choices[0].message.content

    return new Response(
      JSON.stringify({ script, topic, style }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
