'use server';

/**
 * @fileOverview Semantic search flow for research documents.
 *
 * - semanticSearch - A function that performs semantic search within a document.
 * - SemanticSearchInput - The input type for the semanticSearch function.
 * - SemanticSearchOutput - The return type for the semanticSearch function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SemanticSearchInputSchema = z.object({
  documentContent: z.string().describe('The content of the document to search within.'),
  query: z.string().describe('The semantic search query.'),
});
export type SemanticSearchInput = z.infer<typeof SemanticSearchInputSchema>;

const SemanticSearchOutputSchema = z.object({
  relevantPassages: z.array(z.string()).describe('The passages from the document that are most relevant to the query.'),
});
export type SemanticSearchOutput = z.infer<typeof SemanticSearchOutputSchema>;

export async function semanticSearch(input: SemanticSearchInput): Promise<SemanticSearchOutput> {
  return semanticSearchFlow(input);
}

const prompt = ai.definePrompt({
  name: 'semanticSearchPrompt',
  input: {schema: SemanticSearchInputSchema},
  output: {schema: SemanticSearchOutputSchema},
  prompt: `You are a research assistant tasked with performing semantic searches within documents.

  Given the following document content and a search query, identify and extract the passages from the document that are most relevant to the query, even if the exact keywords are not present.

  Document Content: {{{documentContent}}}

  Search Query: {{{query}}}

  Return only the relevant passages.
  `,
});

const semanticSearchFlow = ai.defineFlow(
  {
    name: 'semanticSearchFlow',
    inputSchema: SemanticSearchInputSchema,
    outputSchema: SemanticSearchOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
