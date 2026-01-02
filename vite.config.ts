import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        // Legacy Gemini API keys (for backward compatibility)
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        
        // AI Provider Configuration
        'process.env.AI_PROVIDER': JSON.stringify(env.AI_PROVIDER || 'openrouter'),
        'process.env.OPENROUTER_MODEL': JSON.stringify(env.OPENROUTER_MODEL || 'google/gemini-2.0-flash-exp:free'),
        
        // OpenRouter Configuration (for client-side reference only)
        'process.env.OPENROUTER_SITE_URL': JSON.stringify(env.OPENROUTER_SITE_URL || 'https://savethebus.vercel.app'),
        'process.env.OPENROUTER_APP_NAME': JSON.stringify(env.OPENROUTER_APP_NAME || 'SaveTheBus'),
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
