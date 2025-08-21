import { InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import { bedrockClient } from './aws';

export interface TagSelectionRequest {
  labels: string[];
  availableTags: string[];
  maxTags?: number;
}

export interface TagSelectionResponse {
  selectedTags: Array<{
    tag: string;
    confidence: number;
  }>;
  reasoning?: string;
}

export async function selectTagsForContent(
  labels: string[],
  availableTags: string[],
  maxTags: number = 3
): Promise<Array<{ tag: string; confidence: number }>> {
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
4. For each selected tag, provide a confidence score from 1-100
5. Response format: tag1:confidence1, tag2:confidence2, tag3:confidence3

Example response: People:85, Livestock:72, Herder Life:65

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

    let selectedTags: Array<{ tag: string; confidence: number }> = [];

    if (generatedText.trim().toUpperCase() === 'NONE') {
      console.log('AI determined no tags are relevant');
      return [];
    }

    const tagEntries = generatedText
      .trim()
      .replace(/^\d+\.\s*/gm, '') // Remove numbered list formatting
      .split(/[,\n]/) // Split by comma or newline
      .map((entry: string) => entry.trim())
      .filter((entry: string) => entry);

    for (const entry of tagEntries) {
      // Parse tag:confidence format
      const parts = entry.split(':');
      if (parts.length !== 2) {
        console.log(`Skipping malformed entry: ${entry}`);
        continue;
      }

      const tagName = parts[0].trim();
      const confidenceStr = parts[1].trim();
      const confidence = parseInt(confidenceStr, 10);

      if (isNaN(confidence) || confidence < 1 || confidence > 100) {
        console.log(
          `Invalid confidence score for ${tagName}: ${confidenceStr}`
        );
        continue;
      }

      // Check if tag exists in available tags (case insensitive)
      const matchingTag = availableTags.find(
        (availableTag) => availableTag.toLowerCase() === tagName.toLowerCase()
      );

      if (matchingTag) {
        selectedTags.push({
          tag: matchingTag,
          confidence,
        });
      } else {
        console.log(`Tag not found in available tags: ${tagName}`);
      }
    }

    selectedTags = selectedTags.slice(0, maxTags);

    if (selectedTags.length === 0) {
      console.log('No matching tags found in available tags list');
      console.log('Raw response:', generatedText);
      console.log('Available tags:', availableTags);
    }

    console.log(
      `Selected ${selectedTags.length} tags:`,
      selectedTags.map((item) => `${item.tag}:${item.confidence}`).join(', ')
    );

    return selectedTags;
  } catch (error) {
    console.error('Error selecting tags for content:', error);
    throw new Error(
      `Failed to select tags: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
