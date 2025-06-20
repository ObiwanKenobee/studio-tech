import { config } from 'dotenv';
config();

import '@/ai/flows/generate-civic-scroll.ts';
import '@/ai/flows/transcribe-voice-to-text.ts';
import '@/ai/flows/translate-text-to-standard-language.ts';
import '@/ai/flows/simulate-impact-of-actions.ts';