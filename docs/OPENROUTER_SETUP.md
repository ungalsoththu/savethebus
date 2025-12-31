# OpenRouter Proxy Setup Guide

This guide explains how to configure and deploy the OpenRouter proxy for the SaveTheBus application.

## Overview

The SaveTheBus application now supports two AI providers:

1. **Google Gemini** - Direct API integration (original implementation)
2. **OpenRouter** - Multi-model API proxy (new implementation)

The OpenRouter proxy provides:
- Access to multiple AI models through a single API
- Secure server-side API key management
- Streaming support for real-time responses
- CORS-enabled for browser-based access
- Edge runtime optimization for fast responses

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                              │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                     React App                            │ │
│  │  ┌──────────────────┐  ┌────────────────────────────┐  │ │
│  │  │  aiService.ts    │  │   openrouterService.ts     │  │ │
│  │  │  (Router)        │  │   (Client Integration)     │  │ │
│  │  └────────┬─────────┘  └────────────┬───────────────┘  │ │
│  │           │                         │                   │ │
│  └───────────┼─────────────────────────┼───────────────────┘ │
└──────────────┼─────────────────────────┼─────────────────────┘
               │                         │
               │                         │
               ▼                         ▼
    ┌──────────────────────┐   ┌──────────────────────┐
    │  Direct Gemini API  │   │  /api/proxy (Edge)   │
    │  (Client-side)      │   │  (Server-side)       │
    └──────────────────────┘   └──────────┬───────────┘
                                          │
                                          ▼
                                ┌─────────────────────┐
                                │  OpenRouter API     │
                                │  (Multiple Models)  │
                                └─────────────────────┘
```

## Environment Variables

### Required Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `OPENROUTER_API_KEY` | Your OpenRouter API key | Yes (for OpenRouter) | - |
| `GEMINI_API_KEY` | Your Google Gemini API key | Yes (for Gemini) | - |

### Optional Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `AI_PROVIDER` | AI provider to use: `openrouter` or `gemini` | No | `openrouter` |
| `OPENROUTER_MODEL` | Default OpenRouter model ID | No | `google/gemini-2.0-flash-exp:free` |
| `OPENROUTER_SITE_URL` | Site URL for OpenRouter analytics | No | `https://savethebus.vercel.app` |
| `OPENROUTER_APP_NAME` | App name for OpenRouter analytics | No | `SaveTheBus` |

## Getting OpenRouter API Key

1. Visit [OpenRouter.ai](https://openrouter.ai/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key for use in environment variables

## Available Models

### Free Models

| Model ID | Name | Context Window | Max Output | Description |
|----------|------|----------------|------------|-------------|
| `google/gemini-2.0-flash-exp:free` | Gemini 2.0 Flash (Free) | 1M | 8K | Fast, efficient, **recommended** |
| `google/gemini-2.0-flash-thinking-exp:free` | Gemini 2.0 Flash Thinking (Free) | 1M | 8K | Enhanced reasoning |
| `meta-llama/llama-3.1-8b-instruct:free` | Llama 3.1 8B (Free) | 128K | 4K | Open source |
| `mistralai/mistral-7b-instruct:free` | Mistral 7B (Free) | 32K | 4K | Efficient |

### Paid Models

| Model ID | Name | Context Window | Max Output | Description |
|----------|------|----------------|------------|-------------|
| `google/gemini-pro` | Gemini Pro | 91K | 8K | Balanced performance |
| `anthropic/claude-3-haiku` | Claude 3 Haiku | 200K | 4K | Fast for simple tasks |
| `anthropic/claude-3.5-sonnet` | Claude 3.5 Sonnet | 200K | 8K | High quality |

## Deployment Configuration

### Option 1: Use OpenRouter (Recommended)

Set the following environment variables:

```bash
AI_PROVIDER=openrouter
OPENROUTER_API_KEY=your_openrouter_api_key_here
OPENROUTER_MODEL=google/gemini-2.0-flash-exp:free
```

### Option 2: Use Gemini (Legacy)

Set the following environment variables:

```bash
AI_PROVIDER=gemini
GEMINI_API_KEY=your_gemini_api_key_here
```

### Option 3: Use Both (Failover)

Configure both providers. The application will use the provider specified by `AI_PROVIDER`, and if that fails, it will fall back to backup templates.

```bash
AI_PROVIDER=openrouter
OPENROUTER_API_KEY=your_openrouter_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

## Vercel Deployment

### Step 1: Set Environment Variables

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the required variables:
   - `OPENROUTER_API_KEY` (if using OpenRouter)
   - `GEMINI_API_KEY` (if using Gemini)
   - `AI_PROVIDER` (optional, defaults to `openrouter`)

### Step 2: Deploy

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Deploy to Vercel
vercel --prod
```

Or use the Vercel dashboard to deploy from your Git repository.

### Step 3: Verify Deployment

1. Visit your deployed site
2. Open browser DevTools Console
3. Test the API connection by generating an objection letter
4. Check for any errors in the console

## Local Development

### Step 1: Create `.env` File

Create a `.env` file in the project root:

```env
# AI Provider Configuration
AI_PROVIDER=openrouter
OPENROUTER_MODEL=google/gemini-2.0-flash-exp:free

# API Keys
OPENROUTER_API_KEY=your_openrouter_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here

# Optional Analytics
OPENROUTER_SITE_URL=http://localhost:3000
OPENROUTER_APP_NAME=SaveTheBus (Dev)
```

### Step 2: Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Testing the Proxy

### Test Connection Programmatically

```typescript
import { testAIConnection } from './services/aiService';

const result = await testAIConnection();
console.log(result);
// Output: { success: true, message: 'OpenRouter connection successful', provider: 'openrouter', model: 'google/gemini-2.0-flash-exp:free' }
```

### Test Connection via API

```bash
# Get API info
curl https://your-domain.com/api/proxy

# Test chat completion
curl -X POST https://your-domain.com/api/proxy/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "google/gemini-2.0-flash-exp:free",
    "messages": [
      {"role": "user", "content": "Say hello"}
    ],
    "max_tokens": 10
  }'
```

## Model Selection Guide

### For Production

**Recommended Model:** `google/gemini-2.0-flash-exp:free`

- Fast response times
- Good quality for letter generation
- Free tier available
- Supports both English and Tamil

### For High Quality

**Recommended Model:** `anthropic/claude-3.5-sonnet`

- Best quality output
- Better reasoning
- Paid tier required
- Suitable for formal documents

### For Cost Optimization

**Recommended Model:** `meta-llama/llama-3.1-8b-instruct:free`

- Free tier
- Good quality for simple tasks
- Faster response times
- Lower token costs

## Troubleshooting

### Issue: "OPENROUTER_API_KEY environment variable is not configured"

**Solution:** Add the `OPENROUTER_API_KEY` environment variable in Vercel or your `.env` file.

### Issue: "API error: 401 Unauthorized"

**Solution:** Verify that your OpenRouter API key is valid and has sufficient credits.

### Issue: "Network error: Unable to connect to the API"

**Solution:** Check your internet connection and verify that the Edge Function is deployed correctly.

### Issue: "Invalid response format from AI"

**Solution:** This may occur if the model doesn't follow the JSON response format. Try a different model or adjust the system prompt.

### Issue: CORS errors in browser

**Solution:** Verify that the Edge Function is returning the correct CORS headers. The proxy should include:
- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Methods: GET, POST, OPTIONS`
- `Access-Control-Allow-Headers: Content-Type, Authorization`

### Issue: Streaming not working

**Solution:** Ensure that:
1. The `stream: true` parameter is set in the request
2. The Edge Function is configured with `runtime: 'edge'`
3. The client is properly handling SSE events

## Performance Optimization

### Edge Runtime Benefits

- **Cold Starts:** ~50ms (vs ~500ms for Node.js)
- **Global Distribution:** Deployed to edge locations worldwide
- **Low Latency:** Responses from nearest edge location
- **Scalability:** Automatic scaling without configuration

### Caching Strategy

The proxy does not cache responses by design to ensure fresh content. If you need caching, implement it at the application level.

### Rate Limiting

OpenRouter has rate limits based on your plan. Monitor your usage in the OpenRouter dashboard and upgrade if needed.

## Security Considerations

### API Key Protection

- API keys are stored server-side in environment variables
- Never commit API keys to version control
- Rotate API keys regularly
- Use different keys for development and production

### Request Validation

The proxy validates:
- Request structure
- Message format
- Role types
- Model availability

### Header Sanitization

The proxy removes client-side `Authorization` headers to prevent:
- API key leakage
- Conflicting authentication
- Request tampering

## Monitoring and Analytics

### OpenRouter Analytics

OpenRouter provides analytics when you configure:
- `OPENROUTER_SITE_URL`: Your application URL
- `OPENROUTER_APP_NAME`: Your application name

This helps OpenRouter track usage and provide better service.

### Application Monitoring

Monitor:
- Response times
- Error rates
- Token usage
- Model performance

## Migration from Gemini to OpenRouter

### Step 1: Get OpenRouter API Key

Follow the instructions in "Getting OpenRouter API Key" section.

### Step 2: Update Environment Variables

```bash
# Remove or comment out
# AI_PROVIDER=gemini

# Add
AI_PROVIDER=openrouter
OPENROUTER_API_KEY=your_openrouter_api_key_here
OPENROUTER_MODEL=google/gemini-2.0-flash-exp:free
```

### Step 3: Test Locally

```bash
npm run dev
```

Generate a test letter to verify the integration.

### Step 4: Deploy to Production

```bash
vercel --prod
```

### Step 5: Verify

Test the production deployment to ensure everything works correctly.

## Support

For issues related to:
- **OpenRouter API:** Visit [OpenRouter Documentation](https://openrouter.ai/docs)
- **Vercel Deployment:** Visit [Vercel Documentation](https://vercel.com/docs)
- **SaveTheBus Application:** Check the project README or open an issue

## Additional Resources

- [OpenRouter API Documentation](https://openrouter.ai/docs)
- [Vercel Edge Functions](https://vercel.com/docs/concepts/functions/edge-functions)
- [Server-Sent Events (SSE)](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)
- [OpenRouter Model List](https://openrouter.ai/models)
