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

    const instruction = `You are a tag selection AI. Your task is to select the most relevant tags from a predefined list based on image recognition labels.

Image Recognition Labels: ${labels.join(', ')}

Predefined Tag Options: ${availableTags.join(', ')}

Rules:
1. Select up to ${maxTags} tags that are most relevant to the image content
2. Only choose from the predefined tag options listed above
3. If no tags are relevant, respond with "NONE"
4. Response format: tag1, tag2, tag3 (comma-separated, no numbers, no explanations)

Response:`;

    console.log('Sending instruction to Titan:', instruction);

    const command = new InvokeModelCommand({
      modelId: 'anthropic.claude-3-haiku-20240307-v1:0',
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify({
        anthropic_version: 'bedrock-2023-05-31',
        max_tokens: 100,
        temperature: 0.1,
        messages: [
          {
            role: 'user',
            content: instruction,
          },
        ],
      }),
    });

    const response = await bedrockClient.send(command);

    if (!response.body) {
      throw new Error('No response body from Titan text model');
    }

    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    const generatedText = responseBody.content?.[0]?.text || '';

    console.log('Titan response:', generatedText);

    let selectedTags: string[] = [];

    if (generatedText.trim().toUpperCase() === 'NONE') {
      console.log('AI determined no tags are relevant');
      return [];
    }

    selectedTags = generatedText
      .trim()
      .replace(/^\d+\.\s*/gm, '') // Remove numbered list formatting
      .split(/[,\n]/) // Split by comma or newline
      .map((tag: string) => tag.trim())
      .filter((tag: string) => {
        if (!tag) return false;
        // Check if tag exists in available tags (case insensitive)
        const matchingTag = availableTags.find(
          (availableTag) => availableTag.toLowerCase() === tag.toLowerCase()
        );
        return !!matchingTag;
      })
      .map((tag: string) => {
        // Return the exact case from available tags
        return (
          availableTags.find(
            (availableTag) => availableTag.toLowerCase() === tag.toLowerCase()
          ) || tag
        );
      })
      .slice(0, maxTags);

    if (selectedTags.length === 0) {
      console.log('No matching tags found in available tags list');
      console.log('Raw response:', generatedText);
      console.log('Available tags:', availableTags);
    }

    console.log(`Selected ${selectedTags.length} tags:`, selectedTags);

    return selectedTags;
  } catch (error) {
    console.error('Error selecting tags for content:', error);
    throw new Error(
      `Failed to select tags: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
