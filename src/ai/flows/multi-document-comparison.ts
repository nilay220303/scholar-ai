'use server';

/**
 * @fileOverview A multi-document comparison AI agent.
 *
 * - multiDocumentComparison - A function that handles the document comparison process.
 * - MultiDocumentComparisonInput - The input type for the multiDocumentComparison function.
 * - MultiDocumentComparisonOutput - The return type for the multiDocumentComparison function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MultiDocumentComparisonInputSchema = z.object({
  documents: z
    .array(
      z.object({
        filename: z.string().describe('The name of the document.'),
        content: z.string().describe('The content of the document.'),
      })
    )
    .describe('An array of documents to compare.'),
});
export type MultiDocumentComparisonInput = z.infer<
  typeof MultiDocumentComparisonInputSchema
>;

const MultiDocumentComparisonOutputSchema = z.object({
  comparison: z
    .string()
    .describe(
      'A comparison of the documents in Markdown format, identifying overlapping themes, conflicting findings, and unique insights.'
    ),
});
export type MultiDocumentComparisonOutput = z.infer<
  typeof MultiDocumentComparisonOutputSchema
>;

export async function multiDocumentComparison(
  input: MultiDocumentComparisonInput
): Promise<MultiDocumentComparisonOutput> {
  return multiDocumentComparisonFlow(input);
}

const prompt = ai.definePrompt({
  name: 'multiDocumentComparisonPrompt',
  input: {schema: MultiDocumentComparisonInputSchema},
  output: {schema: MultiDocumentComparisonOutputSchema},
  prompt: `You are an expert literature reviewer.

You will compare the following documents, identifying overlapping themes, conflicting findings, and unique insights.

Please format your output in Markdown, using headings for each section (e.g., ## Overlapping Themes, ## Conflicting Findings, ## Unique Insights).

{{#each documents}}
Document Name: {{{filename}}}
Content:
{{content}}
{{/each}}`,
});

const multiDocumentComparisonFlow = ai.defineFlow(
  {
    name: 'multiDocumentComparisonFlow',
    inputSchema: MultiDocumentComparisonInputSchema,
    outputSchema: MultiDocumentComparisonOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
