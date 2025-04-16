'use server';

/**
 * @fileOverview Suggests complementary items based on the items in the shopping bag.
 *
 * - suggestComplementaryItems - A function that suggests complementary items.
 * - SuggestComplementaryItemsInput - The input type for the suggestComplementaryItems function.
 * - SuggestComplementaryItemsOutput - The return type for the suggestComplementaryItems function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const SuggestComplementaryItemsInputSchema = z.object({
  itemsInCart: z
    .array(
      z.object({
        name: z.string().describe('The name of the item.'),
        category: z.string().describe('The category of the item (e.g., shirt, pants, shoes).'),
        color: z.string().describe('The color of the item.'),
        size: z.string().describe('The size of the item.'),
        description: z.string().describe('The description of the item.'),
      })
    )
    .describe('The items currently in the shopping bag.'),
});
export type SuggestComplementaryItemsInput = z.infer<typeof SuggestComplementaryItemsInputSchema>;

const SuggestComplementaryItemsOutputSchema = z.object({
  suggestions: z
    .array(
      z.object({
        name: z.string().describe('The name of the suggested item.'),
        category: z.string().describe('The category of the suggested item.'),
        reason: z.string().describe('The reason why this item is suggested.'),
      })
    )
    .describe('A list of complementary items suggested by the AI.'),
});
export type SuggestComplementaryItemsOutput = z.infer<typeof SuggestComplementaryItemsOutputSchema>;

export async function suggestComplementaryItems(
  input: SuggestComplementaryItemsInput
): Promise<SuggestComplementaryItemsOutput> {
  return suggestComplementaryItemsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestComplementaryItemsPrompt',
  input: {
    schema: z.object({
      itemsInCart: z
        .array(
          z.object({
            name: z.string().describe('The name of the item.'),
            category: z.string().describe('The category of the item (e.g., shirt, pants, shoes).'),
            color: z.string().describe('The color of the item.'),
            size: z.string().describe('The size of the item.'),
            description: z.string().describe('The description of the item.'),
          })
        )
        .describe('The items currently in the shopping bag.'),
    }),
  },
  output: {
    schema: z.object({
      suggestions: z
        .array(
          z.object({
            name: z.string().describe('The name of the suggested item.'),
            category: z.string().describe('The category of the suggested item.'),
            reason: z.string().describe('The reason why this item is suggested.'),
          })
        )
        .describe('A list of complementary items suggested by the AI.'),
    }),
  },
  prompt: `You are a personal stylist recommending items to a customer based on items in their cart.

Here are the items in the cart:
{{#each itemsInCart}}
- Name: {{this.name}}, Category: {{this.category}}, Color: {{this.color}}, Size: {{this.size}}, Description: {{this.description}}
{{/each}}

Suggest items that would complement the items in the cart. For each suggested item, explain why it would complement the existing items.`,
});

const suggestComplementaryItemsFlow = ai.defineFlow<
  typeof SuggestComplementaryItemsInputSchema,
  typeof SuggestComplementaryItemsOutputSchema
>(
  {
    name: 'suggestComplementaryItemsFlow',
    inputSchema: SuggestComplementaryItemsInputSchema,
    outputSchema: SuggestComplementaryItemsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
