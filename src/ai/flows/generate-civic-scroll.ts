// This is an autogenerated file from Firebase Studio.

'use server';

/**
 * @fileOverview Generates a civic scroll or petition from translated text.
 *
 * - generateCivicScroll - A function that handles the generation of civic scrolls or petitions.
 * - GenerateCivicScrollInput - The input type for the generateCivicScroll function.
 * - GenerateCivicScrollOutput - The return type for the generateCivicScroll function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCivicScrollInputSchema = z.object({
  translatedText: z
    .string()
    .describe('The translated text from which to generate the civic scroll.'),
});
export type GenerateCivicScrollInput = z.infer<typeof GenerateCivicScrollInputSchema>;

const GenerateCivicScrollOutputSchema = z.object({
  civicScroll: z.string().describe('The generated civic scroll or petition.'),
  needsMoreDetails: z
    .boolean()
    .describe(
      'Whether the LLM requires more details to finalize the scroll based on content, tone and format requirements.'
    ),
});
export type GenerateCivicScrollOutput = z.infer<typeof GenerateCivicScrollOutputSchema>;

export async function generateCivicScroll(input: GenerateCivicScrollInput): Promise<GenerateCivicScrollOutput> {
  return generateCivicScrollFlow(input);
}

const assessScrollRequirementsTool = ai.defineTool({
  name: 'assessScrollRequirements',
  description: 'Assess if the translated text meets content, tone, and format requirements for a civic scroll.',
  inputSchema: z.object({
    text: z.string().describe('The translated text to assess.'),
  }),
  outputSchema: z.object({
    meetsRequirements: z
      .boolean()
      .describe('True if the translated text meets the requirements, false otherwise.'),
    reason: z.string().optional().describe('The reason for not meeting the requirements.'),
  }),
},
async (input) => {
    // Placeholder implementation, replace with actual logic
    // In real use-cases, could connect to a database or external service to validate text.
    return {meetsRequirements: true, reason: 'Meets basic requirements.'};
  });

const generateCivicScrollPrompt = ai.definePrompt({
  name: 'generateCivicScrollPrompt',
  input: {schema: GenerateCivicScrollInputSchema},
  output: {schema: GenerateCivicScrollOutputSchema},
  tools: [assessScrollRequirementsTool],
  prompt: `You are an expert in generating civic scrolls and petitions.

  Based on the translated text provided, generate a civic scroll or petition.
  First, use the assessScrollRequirements tool to determine if the translated text meets the necessary content, tone, and format requirements.
  If the text does not meet the requirements, set needsMoreDetails to true and explain in the civicScroll field what additional information is needed.
  If the text meets the requirements, create a formal civic scroll and set needsMoreDetails to false.

  Translated Text: {{{translatedText}}}`,
});

const generateCivicScrollFlow = ai.defineFlow(
  {
    name: 'generateCivicScrollFlow',
    inputSchema: GenerateCivicScrollInputSchema,
    outputSchema: GenerateCivicScrollOutputSchema,
  },
  async input => {
    const {output} = await generateCivicScrollPrompt(input);
    return output!;
  }
);
