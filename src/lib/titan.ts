import { InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import { bedrockClient } from './aws';

export interface TagSelectionRequest {
  labels: string[];
  availableTags: string[];
  maxTags?: number;
}

export interface TagSelectionResponse {
  selectedTags: string[];
  reasoning?: string;
}

export async function selectTagsForContent(
  labels: string[],
  availableTags: string[],
  maxTags: number = 3
): Promise<string[]> {
  try {
    if (availableTags.length === 0) {
      console.log('No available tags to select from');
      return [];
    }

    if (labels.length === 0) {
      console.log('No labels provided for tag selection');
      return [];
    }

    const instruction = `Based on the following image recognition labels, select up to ${maxTags} most relevant tags from the provided list.

Recognition Labels: ${labels.join(', ')}

Available Tags: ${availableTags.join(', ')}

Please respond with ONLY the selected tag names separated by commas, with no additional text or explanation. Select the tags that best describe the content based on the recognition labels.`;

    console.log('Sending instruction to Titan:', instruction);

    const command = new InvokeModelCommand({
      modelId: 'amazon.titan-text-express-v1',
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify({
        inputText: instruction,
        textGenerationConfig: {
          maxTokenCount: 100,
          temperature: 0.1,
          topP: 0.9,
        },
      }),
    });

    const response = await bedrockClient.send(command);

    if (!response.body) {
      throw new Error('No response body from Titan text model');
    }

    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    const generatedText = responseBody.results?.[0]?.outputText || '';

    console.log('Titan response:', generatedText);

    const selectedTags = generatedText
      .trim()
      .split(',')
      .map((tag: string) => tag.trim())
      .filter((tag: string) => tag && availableTags.includes(tag))
      .slice(0, maxTags);

    console.log(`Selected ${selectedTags.length} tags:`, selectedTags);

    return selectedTags;
  } catch (error) {
    console.error('Error selecting tags for content:', error);
    throw new Error(
      `Failed to select tags: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
