# Backend Connection Status

## ✅ Current Configuration

### Edge Functions (Both Using Same Model)

**1. persona-chat** (for AI expert coaches)
- Model: `gemini-flash-lite-latest` ✅
- API: REST API (fetch)
- Endpoint: `/functions/v1/persona-chat`
- Input: `{ message, personaId }`
- Output: `{ response }`

**2. wellness-assistant** (general wellness)
- Model: `gemini-flash-lite-latest` ✅
- API: REST API (fetch)
- Endpoint: `/functions/v1/wellness-assistant`
- Input: `{ message }`
- Output: `{ response }`

### API Method

Both functions use **REST API with fetch** (not SDK):
```typescript
fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key=${apiKey}`)
```

This is the correct approach for Supabase Edge Functions (Deno runtime).

### Configuration

```typescript
generationConfig: {
  temperature: 0.7,
  topP: 0.9,
  maxOutputTokens: 512
}
```

## 🔗 Frontend Integration

**PersonaChat.tsx** calls persona-chat:
```typescript
fetch(`${VITE_SUPABASE_URL}/functions/v1/persona-chat`, {
  headers: {
    'Authorization': `Bearer ${VITE_SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ message, personaId })
})
```

## 📋 Deployment Status

⚠️ **Edge functions need deployment**

Deploy commands:
```bash
npx supabase functions deploy persona-chat
npx supabase functions deploy wellness-assistant
```

## ✅ Summary

- Both functions use same model: `gemini-flash-lite-latest`
- Both use REST API (correct for Deno/Edge Functions)
- Configuration is consistent
- Frontend is properly configured
- Just needs deployment to work
