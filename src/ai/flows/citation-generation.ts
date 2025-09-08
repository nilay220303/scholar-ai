// src/ai/flows/citation-generation.ts
'use server';
/**
 * @fileOverview A citation generation AI agent.
 *
 * - generateCitation - A function that handles the citation generation process.
 * - GenerateCitationInput - The input type for the generateCitation function.
 * - GenerateCitationOutput - The return type for the generateCitation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCitationInputSchema = z.object({
  documentText: z.string().describe('The text content of the document to cite.'),
  citationFormat: z
    .string()
    .default('APA')
    .describe('The desired citation format (e.g., APA, MLA, Chicago).'),
});
export type GenerateCitationInput = z.infer<typeof GenerateCitationInputSchema>;

const GenerateCitationOutputSchema = z.object({
  citation: z.string().describe('The generated citation in the specified format.'),
});
export type GenerateCitationOutput = z.infer<typeof GenerateCitationOutputSchema>;

// Schema for structured citation metadata
const CitationMetadataSchema = z.object({
    title: z.string().describe('The title of the paper.'),
    authors: z.array(z.string()).describe('The list of authors.'),
    publicationYear: z.string().optional().describe('The publication year.'),
    journal: z.string().optional().describe('The name of the journal or conference.'),
    doi: z.string().optional().describe('The DOI of the paper.')
});

// Prompt to extract metadata from the document text
const metadataExtractionPrompt = ai.definePrompt({
    name: 'metadataExtractionPrompt',
    input: { schema: z.object({ documentText: z.string() }) },
    output: { schema: CitationMetadataSchema },
    prompt: `You are an expert at parsing academic papers. Extract the citation metadata from the following document text.

Document Text:
{{{documentText}}}
`,
});

// Prompt to format the citation from metadata
const citationFormattingPrompt = ai.definePrompt({
    name: 'citationFormattingPrompt',
    input: { schema: z.object({
        metadata: CitationMetadataSchema,
        citationFormat: z.string(),
    })},
    output: { schema: GenerateCitationOutputSchema },
    prompt: `You are a citation expert. Generate a citation in the specified format based on the following metadata.

Metadata:
Title: {{metadata.title}}
Authors: {{#each metadata.authors}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
{{#if metadata.publicationYear}}Publication Year: {{metadata.publicationYear}}{{/if}}
{{#if metadata.journal}}Journal: {{metadata.journal}}{{/if}}
{{#if metadata.doi}}DOI: {{metadata.doi}}{{/if}}

Citation Format: {{{citationFormat}}}

Citation:`,
});


export async function generateCitation(input: GenerateCitationInput): Promise<GenerateCitationOutput> {
  return generateCitationFlow(input);
}


const generateCitationFlow = ai.defineFlow(
  {
    name: 'generateCitationFlow',
    inputSchema: GenerateCitationInputSchema,
    outputSchema: GenerateCitationOutputSchema,
  },
  async input => {
    // Step 1: Extract structured metadata from the document text.
    const { output: metadata } = await metadataExtractionPrompt({ documentText: input.documentText });
    if (!metadata) {
        throw new Error("Could not extract citation metadata from the document.");
    }
    
    // Step 2: Use the extracted metadata to generate the formatted citation.
    const { output: citationOutput } = await citationFormattingPrompt({
        metadata: metadata,
        citationFormat: input.citationFormat
    });

    if (!citationOutput) {
        throw new Error("Could not generate the citation.");
    }

    return citationOutput;
  }
);
