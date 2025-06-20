'use server';
/**
 * @fileOverview Simulates the potential impact of proposed actions across relevant community clusters.
 *
 * - simulateImpactOfActions - A function that simulates the impact of actions.
 * - SimulateImpactOfActionsInput - The input type for the simulateImpactOfActions function.
 * - SimulateImpactOfActionsOutput - The return type for the simulateImpactOfActions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SimulateImpactOfActionsInputSchema = z.object({
  actionDescription: z.string().describe('A description of the proposed action.'),
  communityClusters: z.array(z.string()).describe('An array of relevant community clusters.'),
});
export type SimulateImpactOfActionsInput = z.infer<typeof SimulateImpactOfActionsInputSchema>;

const SimulateImpactOfActionsOutputSchema = z.object({
  impactSimulation: z.record(z.string(), z.string()).describe('A record of community clusters and their simulated impacts.'),
});
export type SimulateImpactOfActionsOutput = z.infer<typeof SimulateImpactOfActionsOutputSchema>;

export async function simulateImpactOfActions(input: SimulateImpactOfActionsInput): Promise<SimulateImpactOfActionsOutput> {
  return simulateImpactOfActionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'simulateImpactOfActionsPrompt',
  input: {schema: SimulateImpactOfActionsInputSchema},
  output: {schema: SimulateImpactOfActionsOutputSchema},
  prompt: `You are a civic impact simulator. Given a proposed action and a list of community clusters, simulate the potential impact of the action on each cluster.\n\nAction Description: {{{actionDescription}}}\nCommunity Clusters: {{#each communityClusters}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}\n\nFor each community cluster, provide a brief description of the potential impact. Return the results as a record object with the community clusters as keys and the impact descriptions as values.\n\nExample:\n{
  "cluster1": "The action will have a positive impact on cluster1 by...".
  "cluster2": "The action will have a negative impact on cluster2 due to...".
}
`,
});

const simulateImpactOfActionsFlow = ai.defineFlow(
  {
    name: 'simulateImpactOfActionsFlow',
    inputSchema: SimulateImpactOfActionsInputSchema,
    outputSchema: SimulateImpactOfActionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
