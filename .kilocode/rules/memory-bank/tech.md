# Tech - SaveTheBus

## Technologies Used

### Frontend Framework
- **React 19.2.3** - UI library with functional components and hooks
- **TypeScript 5.8.2** - Type-safe JavaScript with strict configuration

### Build Tool
- **Vite 6.2.0** - Fast development server and build tool
- **@vitejs/plugin-react 5.0.0** - React plugin for Vite

### Styling
- **Tailwind CSS** (via CDN) - Utility-first CSS framework
- **Custom CSS** - Additional styles for gradients, glass effects, and scrollbars

### Icons & Fonts
- **Font Awesome 6.6.0** - Icon library
- **Inter** (Google Fonts) - Primary typeface

### AI Integration
- **@google/genai 1.34.0** - Google Gemini AI SDK
- **Model**: gemini-3-flash-preview

### Deployment
- **Vercel** - Cloud platform for static site deployment

## Development Setup

### Prerequisites
- Node.js (version matching @types/node 22.14.0)
- npm or yarn package manager

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```
- Runs on port 3000
- Hosts on 0.0.0.0 for network access
- Hot module replacement enabled

### Build for Production
```bash
npm run build
```
- Outputs to `dist/` directory
- Optimizes and minifies assets
- Injects environment variables at build time

### Preview Production Build
```bash
npm run preview
```

## Technical Constraints

### Environment Variables
- `GEMINI_API_KEY` - Required for AI generation
  - Loaded via Vite's `define` configuration in [`vite.config.ts`](vite.config.ts:14)
  - Injected as `process.env.API_KEY` and `process.env.GEMINI_API_KEY`
  - Must be set in Vercel environment variables for production

### Browser Compatibility
- Modern browsers with ES2022 support
- Requires:
  - ES modules support
  - CSS Grid and Flexbox
  - Fetch API
  - Clipboard API (for copy functionality)

### API Constraints
- **Gemini API Rate Limits**: Dependent on Google's tier limits
- **Fallback Required**: Application must work without AI (backup templates)
- **No Backend**: All processing happens client-side

### File Size Constraints
- Uses ESM imports from CDN (esm.sh)
- Tailwind CSS loaded via CDN (not bundled)
- Font Awesome loaded via CDN

## Dependencies

### Runtime Dependencies
```json
{
  "react": "^19.2.3",
  "react-dom": "^19.2.3",
  "@google/genai": "^1.34.0"
}
```

### Development Dependencies
```json
{
  "@types/node": "^22.14.0",
  "@vitejs/plugin-react": "^5.0.0",
  "typescript": "~5.8.2",
  "vite": "^6.2.0"
}
```

## TypeScript Configuration

### Compiler Options
- **Target**: ES2022
- **Module**: ESNext
- **JSX**: react-jsx (automatic runtime)
- **Module Resolution**: bundler
- **Path Alias**: `@/*` maps to project root
- **Strict Mode**: Enabled via React.StrictMode

### Key Settings
- `allowJs: true` - Allow JavaScript files
- `skipLibCheck: true` - Skip type checking of declaration files
- `noEmit: true` - Don't emit output files (Vite handles this)

## Vite Configuration

### Server Configuration
```typescript
{
  server: {
    port: 3000,
    host: '0.0.0.0'
  }
}
```

### Plugin Setup
- React plugin for JSX transformation

### Environment Variable Injection
```typescript
define: {
  'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
  'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
}
```

### Path Aliases
```typescript
resolve: {
  alias: {
    '@': path.resolve(__dirname, '.')
  }
}
```

## Deployment Configuration

### Vercel Setup
- **vercel.json** contains rewrite rules for API proxy
- Proxy routes `/api/proxy/*` to OpenRouter API (currently unused)
- Static site deployment with no build command needed beyond `npm run build`

### Environment Variables (Production)
- `GEMINI_API_KEY` - Must be configured in Vercel dashboard

## Code Organization

### File Structure
```
savethebus/
├── components/
│   ├── ObjectionForm.tsx
│   └── EmailResult.tsx
├── services/
│   ├── aiService.ts
│   └── geminiService.ts
├── App.tsx
├── index.tsx
├── index.html
├── types.ts
├── constants.ts
├── backupTemplates.ts
├── vite.config.ts
├── tsconfig.json
└── vercel.json
```

### Import Patterns
- Absolute imports using `@/` alias
- Relative imports for local files
- ESM imports from CDN for React and dependencies

## Tool Usage Patterns

### AI Service Integration
1. Initialize GoogleGenAI with API key
2. Call `generateContent()` with model, prompt, and config
3. Parse JSON response with structured schema
4. Handle errors and fall back to templates

### State Management
- Use `useState` for local component state
- Use `useEffect` for side effects (countdown timer, language sync)
- Pass state down via props
- No external state management needed

### Form Handling
- Controlled components with value bindings
- Validation before submission
- Loading states during async operations
- Error handling with user-friendly alerts

### Styling Approach
- Tailwind utility classes for layout and styling
- Custom CSS classes in `<style>` tag for special effects
- Responsive design using Tailwind breakpoints (md, lg)
- Animations using Tailwind animate utilities

## Performance Considerations

### Optimization Opportunities
- Bundle Tailwind CSS (currently CDN-loaded)
- Lazy load components if needed
- Implement caching for AI responses
- Add service worker for offline support

### Current Performance
- Fast initial load (React 19 with Vite)
- Hot module replacement in development
- Code splitting not implemented (small app size)
- No build-time optimization for AI calls

## Security Considerations

### API Key Exposure
- API key is injected at build time
- Visible in client-side JavaScript
- Acceptable for this use case (public campaign)
- Consider proxy for production if needed

### Input Validation
- Basic validation on form fields
- No server-side validation (no backend)
- User input passed directly to AI API

### Content Security
- No user authentication required
- No data persistence
- All data processing client-side

## Testing

### Current State
- No test framework configured
- No unit tests written
- Manual testing required

### Recommended Testing Tools
- Vitest for unit testing
- React Testing Library for component tests
- Playwright for E2E testing
