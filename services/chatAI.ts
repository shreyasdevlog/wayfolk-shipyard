/**
 * Chat AI Service - Newell AI Integration
 *
 * This file demonstrates how to integrate Newell AI capabilities
 * for smart replies and image analysis in the chat feature.
 *
 * To use these features:
 * 1. Ensure EXPO_PUBLIC_NEWELL_API_URL is set in your .env
 * 2. Import and use these functions in your chat components
 * 3. Update the UI to display AI-generated suggestions
 */

import { generateText, analyzeImage } from '@fastshot/ai';
import {
  SmartReplyRequest,
  SmartReplyResponse,
  ImageAnalysisRequest,
  ImageAnalysisResponse,
} from '@/types/chat';

/**
 * Generate smart reply suggestions based on conversation context
 *
 * Example usage in ChatThreadScreen:
 * ```
 * const suggestions = await generateSmartReplies({
 *   conversationId: id,
 *   messageHistory: messages,
 *   context: {
 *     destination: chatUser.sharedDestination,
 *     rigType: chatUser.rigType
 *   }
 * });
 * ```
 */
export async function generateSmartReplies(
  request: SmartReplyRequest
): Promise<SmartReplyResponse> {
  try {
    // Build context for AI
    const conversationContext = request.messageHistory
      .slice(-5) // Last 5 messages
      .map((msg) => `${msg.sender === 'user' ? 'You' : 'Them'}: ${msg.text}`)
      .join('\n');

    const prompt = `You are helping a van-life nomad respond to a message. Generate 3 short, friendly reply suggestions.

Context:
${request.context?.destination ? `Shared destination: ${request.context.destination}` : ''}
${request.context?.rigType ? `Your rig: ${request.context.rigType}` : ''}

Recent conversation:
${conversationContext}

Generate 3 casual, helpful reply options (each under 60 characters):`;

    const response = await generateText({
      prompt,
      temperature: 0.7,
    });

    // Parse replies from response
    const replies = response
      .split('\n')
      .filter((line: string) => line.trim())
      .map((line: string) => line.replace(/^\d+\.\s*/, '').trim())
      .slice(0, 3);

    return {
      replies,
      confidence: replies.length > 0 ? 0.85 : 0,
    };
  } catch (error) {
    console.error('Error generating smart replies:', error);
    return { replies: [], confidence: 0 };
  }
}

/**
 * Analyze shared images (van builds, locations, etc.)
 *
 * Example usage when user shares an image:
 * ```
 * const analysis = await analyzeSharedImage({
 *   imageUri: selectedImage.uri,
 *   analysisType: 'van-build'
 * });
 * ```
 */
export async function analyzeSharedImage(
  request: ImageAnalysisRequest
): Promise<ImageAnalysisResponse> {
  try {
    const analysisPrompts = {
      'van-build':
        'Analyze this van build photo. Describe the setup, materials used, and any notable features.',
      location:
        'Describe this camping or travel location. Mention key features, scenery, and what makes it special.',
      general: 'Describe what you see in this image.',
    };

    const description = await analyzeImage({
      imageUrl: request.imageUri,
      prompt: analysisPrompts[request.analysisType],
    });

    // Generate tags from description
    const tagsResponse = await generateText({
      prompt: `Generate 5 relevant hashtags for this description: ${description}`,
      temperature: 0.3,
    });

    const tags = tagsResponse
      .split(/[,\s]+/)
      .filter((tag: string) => tag.startsWith('#'))
      .map((tag: string) => tag.replace('#', ''))
      .slice(0, 5);

    return {
      description,
      tags,
      suggestions: generateSuggestions(request.analysisType, description),
    };
  } catch (error) {
    console.error('Error analyzing image:', error);
    return {
      description: 'Image uploaded',
      tags: [],
    };
  }
}

/**
 * Generate contextual suggestions based on image analysis
 */
function generateSuggestions(
  type: ImageAnalysisRequest['analysisType'],
  description: string
): string[] {
  const suggestions: Record<string, string[]> = {
    'van-build': [
      'Share more build progress photos',
      'Ask about materials and costs',
      'Connect with other builders',
    ],
    location: [
      'Add to your route',
      'Save as favorite spot',
      'Share coordinates',
    ],
    general: ['React with 👍', 'Save for later', 'Share with others'],
  };

  return suggestions[type] || suggestions.general;
}

/**
 * Get AI-powered conversation starters
 * Useful for breaking the ice or when conversation stalls
 */
export async function getConversationStarters(
  recipientName: string,
  sharedDestination?: string
): Promise<string[]> {
  try {
    const prompt = `Generate 3 casual, friendly conversation starters for van-life nomads meeting on a travel app.
${sharedDestination ? `They're both heading to ${sharedDestination}.` : ''}
Recipient name: ${recipientName}

Make them brief (under 60 characters), warm, and travel-focused:`;

    const response = await generateText({
      prompt,
      temperature: 0.8,
    });

    const starters = response
      .split('\n')
      .filter((line: string) => line.trim())
      .map((line: string) => line.replace(/^\d+\.\s*/, '').trim())
      .slice(0, 3);

    return starters.length > 0
      ? starters
      : [
          `Hey ${recipientName}! 👋`,
          'Love your rig!',
          'Any recommendations for the area?',
        ];
  } catch (error) {
    console.error('Error generating conversation starters:', error);
    return [`Hey ${recipientName}! 👋`, 'Love your setup!', 'Any travel tips?'];
  }
}
