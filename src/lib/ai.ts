import { supabase } from './supabase';
import OpenAI from 'openai';

const TOGETHER_API_KEY = import.meta.env.VITE_TOGETHER_API_KEY;

const openai = new OpenAI({
  apiKey: TOGETHER_API_KEY,
  baseURL: 'https://api.together.xyz/v1',
  dangerouslyAllowBrowser: true
});

const SYSTEM_PROMPT = `You are a career advisor AI assistant. Your responses should be well-formatted and easy to read.
Please structure your responses with:
- Clear headings using markdown (e.g., ## Key Points)
- Bullet points for lists
- Line breaks between sections
- Bold text for important points
- Organized sections with clear hierarchy

Keep your tone professional, supportive, and encouraging while maintaining clear formatting.`;

const CAREER_ANALYSIS_PROMPT = `As a career advisor, analyze the following quiz responses and provide career recommendations. 
Format your response with the following structure:

## Career Recommendations
[List top career matches with explanations]

## Key Strengths
[Bullet points of identified strengths]

## Development Areas
[Areas for growth and learning]

## Next Steps
[Actionable recommendations]

Consider the user's skills, interests, personality traits, and preferred work environment.
Make the response visually organized and easy to read.`;

export async function getAIResponse(message: string): Promise<string> {
  try {
    if (!TOGETHER_API_KEY) {
      throw new Error('Together.ai API key not configured');
    }

    const completion = await openai.chat.completions.create({
      model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: message }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return completion.choices[0]?.message?.content || 
      "I apologize, but I'm having trouble generating a response at the moment.";
  } catch (error) {
    console.error('AI API error:', error);
    return "I apologize, but I'm having trouble connecting to my AI service at the moment. Please try again later.";
  }
}

export async function getCareerInfo(career: string): Promise<string> {
  try {
    if (!TOGETHER_API_KEY) {
      throw new Error('Together.ai API key not configured');
    }

    const prompt = `Provide comprehensive information about a career as a ${career}. Format your response with the following structure:

## Role Overview
[Brief description of the role]

## Key Responsibilities
- [Bullet points of main duties]

## Required Skills & Qualifications
- [List of essential skills]
- [Educational requirements]

## Salary Range & Benefits
- Average salary range
- Common benefits

## Career Growth
- Potential career paths
- Advancement opportunities

## Industry Outlook
- Current trends
- Future prospects

Please ensure the response is well-formatted and easy to read.`;

    const completion = await openai.chat.completions.create({
      model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    return completion.choices[0]?.message?.content || 
      "I apologize, but I'm having trouble retrieving career information at the moment.";
  } catch (error) {
    console.error('AI API error:', error);
    return "I apologize, but I'm having trouble connecting to my AI service at the moment. Please try again later.";
  }
}

export async function analyzeQuizResponses(responses: Array<{ question: string; answer: string }>): Promise<string> {
  try {
    if (!TOGETHER_API_KEY) {
      throw new Error('Together.ai API key not configured');
    }

    const formattedResponses = responses
      .map(r => `Question: ${r.question}\nAnswer: ${r.answer}`)
      .join('\n\n');

    const completion = await openai.chat.completions.create({
      model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
      messages: [
        { role: 'system', content: CAREER_ANALYSIS_PROMPT },
        { role: 'user', content: formattedResponses }
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    return completion.choices[0]?.message?.content || 
      "I apologize, but I'm having trouble analyzing your responses at the moment.";
  } catch (error) {
    console.error('AI API error:', error);
    return "I apologize, but I'm having trouble analyzing your responses at the moment. Please try again later.";
  }
}

export async function saveChatMessage(userId: string, message: string, sender: 'user' | 'ai') {
  try {
    const { error } = await supabase
      .from('chat_messages')
      .insert({
        user_id: userId,
        message,
        sender
      });
    
    if (error) throw error;
  } catch (error) {
    console.error('Error saving message:', error);
  }
}