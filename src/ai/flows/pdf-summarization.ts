'use server';

/**
 * @fileOverview This file defines a Genkit flow for summarizing PDF research papers.
 *
 * - pdfSummarization - A function that takes PDF content as input and returns a concise summary.
 * - PdfSummarizationInput - The input type for the pdfSummarization function.
 * - PdfSummarizationOutput - The return type for the pdfSummarization function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PdfSummarizationInputSchema = z.object({
  pdfContent: z
    .string()
    .describe('The text content extracted from the PDF document.'),
});
export type PdfSummarizationInput = z.infer<typeof PdfSummarizationInputSchema>;

const PdfSummarizationOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the research paper.'),
});
export type PdfSummarizationOutput = z.infer<typeof PdfSummarizationOutputSchema>;

export async function pdfSummarization(input: PdfSummarizationInput): Promise<PdfSummarizationOutput> {
  return pdfSummarizationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'pdfSummarizationPrompt',
  input: {schema: PdfSummarizationInputSchema},
  output: {schema: PdfSummarizationOutputSchema},
  prompt: `Summarize the following research paper. The summary should be concise and capture the main points of the paper.

Research Paper Content:
{{{pdfContent}}}`,
});

const pdfSummarizationFlow = ai.defineFlow(
  {
    name: 'pdfSummarizationFlow',
    inputSchema: PdfSummarizationInputSchema,
    outputSchema: PdfSummarizationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
