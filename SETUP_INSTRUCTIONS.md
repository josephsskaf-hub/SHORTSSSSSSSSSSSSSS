# ShortsForgeAI — Setup Instructions

## ✅ What's Already Done
- `dashboard.html` — fully updated with the real AI script generator UI
- `generate-script/index.ts` — Supabase Edge Function code, ready to deploy
- Dashboard calls your edge function securely; OpenAI API key never touches the frontend

---

## 🔑 Step 1: Add Your OpenAI API Key to Supabase

1. Go to **https://supabase.com/dashboard/project/cqqukkvjjrguayiyjvhh/settings/edge-functions**  
   *(or: Supabase Dashboard → your project → Settings → Edge Functions)*
2. Scroll down to **"Edge Function Secrets"**
3. Click **"Add new secret"**
4. Name: `OPENAI_API_KEY`
5. Value: your OpenAI API key from **https://platform.openai.com/api-keys**
6. Click **Save**

> That's it. The dashboard will immediately start generating real scripts once this is set.

---

## 🚀 Step 2: Deploy the Edge Function

### Option A — Supabase Dashboard (easiest, no CLI needed)

1. Go to **https://supabase.com/dashboard/project/cqqukkvjjrguayiyjvhh/functions**  
   *(Supabase Dashboard → your project → Edge Functions)*
2. Click **"Create a new function"**
3. Name it exactly: `generate-script`
4. Replace all the code in the editor with the contents of `generate-script/index.ts`
5. Click **"Deploy function"**

### Option B — Supabase CLI

```bash
# Install CLI if needed
npm install -g supabase

# Login
supabase login

# Link to your project
supabase link --project-ref cqqukkvjjrguayiyjvhh

# Deploy the function
supabase functions deploy generate-script --no-verify-jwt
```

---

## 🧪 Step 3: Test It

Once deployed with the API key set, go to your dashboard and:

1. Click **"Script Generator"** in the sidebar
2. Type a topic (e.g. "Why nobody talks about this ancient Roman secret")
3. Select a style and duration
4. Click **"Generate Script ⚡"**

The script should appear in about 2–4 seconds.

**If you see:** "AI engine not configured yet — owner is setting up the API key. Check back shortly!"  
→ Your API key isn't saved yet. Go back to Step 1.

**If you see:** "Network error" or a fetch failure  
→ The edge function isn't deployed yet. Go back to Step 2.

---

## 💡 How the System Works

```
User clicks "Generate Script"
        ↓
Dashboard sends request to Supabase Edge Function
(with user's auth token — no API key in frontend)
        ↓
Edge Function reads OPENAI_API_KEY from Supabase Secrets
        ↓
Calls OpenAI GPT-4o-mini with your viral script prompt
        ↓
Returns the script to the dashboard
        ↓
Script is displayed + user can copy or save to projects
```

The OpenAI API key is **never exposed to the browser**. It lives only in Supabase's encrypted secrets vault.

---

## 📊 Credit System

| Plan | Credits/Month |
|------|--------------|
| Free | 3 scripts |
| Pro  | 30 scripts |
| Max  | 100 scripts |

Credits are tracked in the `profiles.scripts_generated` column in your Supabase database.

---

## 🆘 Need Help?

- Supabase Edge Functions docs: https://supabase.com/docs/guides/functions
- OpenAI API keys: https://platform.openai.com/api-keys
- Model used: `gpt-4o-mini` (fast + affordable — ~$0.0002 per script)
