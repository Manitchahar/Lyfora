# Fix: Deploy Updated Edge Function

## Problem

The edge function is returning fallback messages instead of real AI responses because:
1. The deployed version is outdated
2. Missing `thinkingConfig` parameter
3. Possibly using wrong model name

## Solution

Deploy the updated edge function with the correct Gemini model configuration.

## Steps to Fix

### 1. Verify Supabase CLI is installed

```bash
npx supabase --version
```

### 2. Link to your Supabase project (if not already linked)

```bash
cd Lyfora
npx supabase link --project-ref hvqszwkacdfumdoeapti
```

### 3. Verify GEMINI_API_KEY secret is set

```bash
npx supabase secrets list
```

If not set:
```bash
npx supabase secrets set GEMINI_API_KEY=your_api_key_here
```

### 4. Deploy the updated edge function

```bash
npx supabase functions deploy persona-chat
```

### 5. Test the deployment

```bash
node test-edge-function.js
```

You should now see real AI responses instead of fallback messages!

## What Changed

- **Model**: Updated to `gemini-flash-latest` (auto-resolves to Gemini 2.5 Flash)
- **Config**: Added `thinkingConfig: { thinkingBudget: 0 }` for faster responses
- **Optimization**: Disabled thinking mode for more conversational responses

## Expected Output

Before fix:
```
User: "I want to lift heavy"
Bot: "Let's try that again! What fitness question can I help you with?" ❌
```

After fix:
```
User: "I want to lift heavy"
Bot: "That's the spirit! To lift heavy, focus on perfect form..." ✅
```

## Troubleshooting

### If deployment fails:
- Check you're logged in: `npx supabase login`
- Verify project link: `npx supabase projects list`

### If still getting fallbacks:
- Check edge function logs: `npx supabase functions logs persona-chat`
- Verify API key is set correctly
- Check for API quota limits

### If getting 404 errors:
- The model name might not be available in your region
- Try alternative: `gemini-1.5-flash` or `gemini-2.0-flash-exp`
