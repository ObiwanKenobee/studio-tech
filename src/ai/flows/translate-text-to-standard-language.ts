'use server';
/**
 * @fileOverview A flow for translating text to a standard language.
 *
 * - translateTextToStandardLanguage - A function that translates text to a standard language.
 * - TranslateTextToStandardLanguageInput - The input type for the translateTextToStandardLanguage function.
 * - TranslateTextToStandardLanguageOutput - The return type for the translateTextToStandardLanguage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranslateTextToStandardLanguageInputSchema = z.object({
  text: z.string().describe('The text to translate.'),
  targetLanguage: z.string().describe('The language to translate the text to.  Example: `English`.'),
});
export type TranslateTextToStandardLanguageInput = z.infer<typeof TranslateTextToStandardLanguageInputSchema>;

const TranslateTextToStandardLanguageOutputSchema = z.object({
  translatedText: z.string().describe('The translated text.'),
});
export type TranslateTextToStandardLanguageOutput = z.infer<typeof TranslateTextToStandardLanguageOutputSchema>;

export async function translateTextToStandardLanguage(
  input: TranslateTextToStandardLanguageInput
): Promise<TranslateTextToStandardLanguageOutput> {
  return translateTextToStandardLanguageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'translateTextToStandardLanguagePrompt',
  input: {schema: TranslateTextToStandardLanguageInputSchema},
  output: {schema: TranslateTextToStandardLanguageOutputSchema},
  prompt: `You are a translation expert. Translate the following text to {{{targetLanguage}}}.\n\nText: {{{text}}}`,
});

const translateTextToStandardLanguageFlow = ai.defineFlow(
  {
    name: 'translateTextToStandardLanguageFlow',
    inputSchema: TranslateTextToStandardLanguageInputSchema,
    outputSchema: TranslateTextToStandardLanguageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
