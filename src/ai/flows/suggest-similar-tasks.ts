'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting similar tasks based on a list of existing tasks.
 *
 * - suggestSimilarTasks - A function that takes a list of tasks and returns a list of suggested tasks.
 * - SuggestSimilarTasksInput - The input type for the suggestSimilarTasks function.
 * - SuggestSimilarTasksOutput - The return type for the suggestSimilarTasks function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestSimilarTasksInputSchema = z.object({
  tasks: z.array(z.string()).describe('A list of existing tasks.'),
});
export type SuggestSimilarTasksInput = z.infer<typeof SuggestSimilarTasksInputSchema>;

const SuggestSimilarTasksOutputSchema = z.object({
  suggestions: z.array(z.string()).describe('A list of suggested tasks.'),
});
export type SuggestSimilarTasksOutput = z.infer<typeof SuggestSimilarTasksOutputSchema>;

export async function suggestSimilarTasks(input: SuggestSimilarTasksInput): Promise<SuggestSimilarTasksOutput> {
  return suggestSimilarTasksFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestSimilarTasksPrompt',
  input: {schema: SuggestSimilarTasksInputSchema},
  output: {schema: SuggestSimilarTasksOutputSchema},
  prompt: `You are a helpful assistant that suggests similar tasks based on a list of existing tasks.

  Here are the existing tasks:
  {{#each tasks}}
  - {{this}}
  {{/each}}

  Please suggest 5 similar tasks:
  `,config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const suggestSimilarTasksFlow = ai.defineFlow(
  {
    name: 'suggestSimilarTasksFlow',
    inputSchema: SuggestSimilarTasksInputSchema,
    outputSchema: SuggestSimilarTasksOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
