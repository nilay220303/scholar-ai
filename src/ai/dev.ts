import { config } from 'dotenv';
config();

import '@/ai/flows/multi-document-comparison.ts';
import '@/ai/flows/pdf-summarization.ts';
import '@/ai/flows/citation-generation.ts';
import '@/ai/flows/semantic-search.ts';
import '@/ai/flows/keyword-extraction.ts';