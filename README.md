# SaveTheBus

A public advocacy platform designed to help citizens of Tamil Nadu voice their opposition to Rule 288-A, a proposed amendment to the Tamilnadu Motor Vehicle Rules, 1989.

## Overview

SaveTheBus enables citizens to easily generate formal objection letters against Rule 288-A, which threatens public ownership of transportation infrastructure. The application uses AI to generate personalized, well-structured objection letters in both English and Tamil.

## Features

- **AI-Powered Letter Generation**: Uses advanced AI models to generate personalized objection letters
- **Bilingual Support**: Full support for English and Tamil languages
- **Dual Generation Modes**:
  - Auto-Draft Mode: AI generates letters from scratch based on selected concerns
  - Manual Mode: Users provide text, AI optimizes and polishes it
- **Multiple AI Providers**: Support for both Google Gemini and OpenRouter APIs
- **Fallback System**: Pre-written templates ensure the application always works
- **Countdown Timer**: Tracks the January 7, 2026 deadline for objections
- **Email Integration**: One-click copy and mailto links for easy submission
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Technology Stack

- **Frontend**: React 19.2.3 with TypeScript 5.8.2
- **Build Tool**: Vite 6.2.0
- **Styling**: Tailwind CSS
- **AI Integration**: 
  - Google Gemini API (direct)
  - OpenRouter API (via Edge Function proxy)
- **Deployment**: Vercel (Edge Runtime)

## Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/savethebus.git
cd savethebus
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Configure your environment variables (see [Configuration](#configuration))

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Configuration

### Environment Variables

The application supports two AI providers. Choose one based on your needs:

#### Option 1: OpenRouter (Recommended)

```env
AI_PROVIDER=openrouter
OPENROUTER_API_KEY=your_openrouter_api_key_here
OPENROUTER_MODEL=google/gemini-2.0-flash-exp:free
```

#### Option 2: Google Gemini (Legacy)

```env
AI_PROVIDER=gemini
GEMINI_API_KEY=your_gemini_api_key_here
```

### Getting API Keys

**OpenRouter:**
1. Visit [OpenRouter.ai](https://openrouter.ai/)
2. Sign up and create an API key
3. Add to your `.env` file

**Google Gemini:**
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a new API key
3. Add to your `.env` file

For detailed setup instructions, see [docs/OPENROUTER_SETUP.md](docs/OPENROUTER_SETUP.md).

## Project Structure

```
savethebus/
├── api/                      # Edge Functions
│   ├── proxy.ts              # OpenRouter proxy (Edge Function)
│   └── types.ts             # Type definitions for API
├── components/               # React components
│   ├── ObjectionForm.tsx     # Form for user input
│   └── EmailResult.tsx       # Display generated letter
├── services/                # Business logic
│   ├── aiService.ts         # Main AI service (router)
│   ├── geminiService.ts     # Direct Gemini API integration
│   └── openrouterService.ts # OpenRouter client integration
├── docs/                    # Documentation
│   └── OPENROUTER_SETUP.md  # OpenRouter setup guide
├── App.tsx                  # Main application component
├── constants.ts             # Translations and configuration
├── types.ts                 # TypeScript type definitions
├── backupTemplates.ts       # Fallback letter templates
├── vite.config.ts          # Vite configuration
├── vercel.json            # Vercel deployment config
└── package.json           # Dependencies
```

## Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check
```

### AI Service Architecture

The application uses a flexible AI service architecture that supports multiple providers:

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

## Deployment

### Vercel Deployment

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)

2. Import your project in Vercel

3. Configure environment variables in Vercel dashboard:
   - `AI_PROVIDER` (optional, defaults to `openrouter`)
   - `OPENROUTER_API_KEY` (if using OpenRouter)
   - `GEMINI_API_KEY` (if using Gemini)

4. Deploy

The Edge Function (`api/proxy.ts`) will be automatically deployed with the application.

### Environment Variables in Production

Set the following in Vercel dashboard:

**For OpenRouter:**
- `OPENROUTER_API_KEY` (required)
- `OPENROUTER_MODEL` (optional, defaults to `google/gemini-2.0-flash-exp:free`)
- `OPENROUTER_SITE_URL` (optional)
- `OPENROUTER_APP_NAME` (optional)

**For Gemini:**
- `GEMINI_API_KEY` (required)

## Available AI Models

### OpenRouter Models

The application supports multiple models through OpenRouter:

**Free Models:**
- `google/gemini-2.0-flash-exp:free` - Fast, efficient (recommended)
- `google/gemini-2.0-flash-thinking-exp:free` - Enhanced reasoning
- `meta-llama/llama-3.1-8b-instruct:free` - Open source
- `mistralai/mistral-7b-instruct:free` - Efficient

**Paid Models:**
- `google/gemini-pro` - Balanced performance
- `anthropic/claude-3-haiku` - Fast for simple tasks
- `anthropic/claude-3.5-sonnet` - High quality

See [docs/OPENROUTER_SETUP.md](docs/OPENROUTER_SETUP.md) for complete model list and recommendations.

## Testing

### Test AI Connection

```typescript
import { testAIConnection } from './services/aiService';

const result = await testAIConnection();
console.log(result);
// Output: { success: true, message: 'OpenRouter connection successful', provider: 'openrouter', model: 'google/gemini-2.0-flash-exp:free' }
```

### Test Proxy API

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

## Troubleshooting

### Common Issues

**Issue:** "OPENROUTER_API_KEY environment variable is not configured"

**Solution:** Add `OPENROUTER_API_KEY` to your environment variables.

**Issue:** "API error: 401 Unauthorized"

**Solution:** Verify your API key is valid and has sufficient credits.

**Issue:** "Network error: Unable to connect to the API"

**Solution:** Check your internet connection and verify Edge Function deployment.

For more troubleshooting tips, see [docs/OPENROUTER_SETUP.md](docs/OPENROUTER_SETUP.md).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built for the public transit advocacy campaign in Tamil Nadu
- Powered by Google Gemini AI and OpenRouter
- Deployed on Vercel Edge Functions

## Contact

For questions or support, please open an issue on GitHub.

---

**Public Transit is Public Property** - பொதுப் போக்குவரத்து மக்கள் சொத்து
