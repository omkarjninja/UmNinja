import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for topics (in production, you'd use a database)
let topicCache: string[] = [];
let isFetchingTopics = false;

export async function GET(request: NextRequest) {
  // Check if API key is configured
  if (!process.env.GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY is not configured');
    return NextResponse.json({ 
      error: "API key not configured. Please add GEMINI_API_KEY to your environment variables.",
      topic: "What is the nature of happiness and how should we pursue it?",
      fallback: true
    });
  }

  // If we have cached topics, serve one from cache
  if (topicCache.length > 0) {
    const topic = topicCache.pop()!;
    console.log(`Serving cached topic. ${topicCache.length} topics remaining in cache.`);
    
    return NextResponse.json({ 
      topic: topic,
      id: Math.floor(Math.random() * 1000) + 1,
      totalTopics: topicCache.length + 1,
      cached: true
    });
  }

  // If we're already fetching topics, wait a bit and try again
  if (isFetchingTopics) {
    console.log('Already fetching topics, returning fallback...');
    return getFallbackTopic();
  }

  // Fetch new batch of topics from Gemini
  isFetchingTopics = true;
  
  try {
    console.log('Fetching 15 new topics from Gemini API...');
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { 
                  text: `Generate exactly 15 philosophical conversation topics for public speaking practice. Focus on classic philosophical themes like ethics, metaphysics, epistemology, political philosophy, or existential questions. Make them engaging and thought-provoking. 

Return ONLY the topics, one per line, with no numbering or additional text. Each topic should be under 15 words. Example format:

What is the nature of happiness and how should we pursue it?
Do we have free will or are our actions predetermined?
What makes an action morally right or wrong?

Generate exactly 15 topics in this format.` 
                }
              ],
            },
          ],
        }),
      }
    );

    console.log('Gemini API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', errorText);
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Gemini API response received successfully');

    const responseText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    
    // Parse the response to extract individual topics
    const topics = responseText
      .split('\n')
      .map((topic: string) => topic.trim())
      .filter((topic: string) => topic.length > 0 && !topic.match(/^\d+\./)) // Remove empty lines and numbered items
      .slice(0, 15); // Ensure we only take 15 topics

    if (topics.length === 0) {
      throw new Error('No valid topics found in response');
    }

    // Store topics in cache
    topicCache = topics;
    console.log(`Successfully cached ${topics.length} topics from Gemini API`);

    // Return the first topic
    const topic = topicCache.pop()!;
    
    return NextResponse.json({ 
      topic: topic,
      id: Math.floor(Math.random() * 1000) + 1,
      totalTopics: topicCache.length + 1,
      cached: false
    });
    
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return getFallbackTopic();
  } finally {
    isFetchingTopics = false;
  }
}

function getFallbackTopic() {
  // Fallback to a static topic if Gemini fails
  const fallbackTopics = [
    "What is the nature of happiness and how should we pursue it?",
    "Do we have free will or are our actions predetermined?",
    "What makes an action morally right or wrong?",
    "Is knowledge possible, or are we limited by our perceptions?",
    "What is the meaning of life and how should we find purpose?",
    "Should we prioritize individual liberty or collective welfare?",
    "What is the relationship between mind and body?",
    "Is beauty objective or purely subjective?",
    "What is justice and how should it be distributed?",
    "Does God exist, and what would that mean for morality?",
    "What is the value of art and creative expression?",
    "How should we balance tradition with progress?",
    "What is the nature of consciousness and self-awareness?",
    "Should we focus on individual rights or collective responsibility?",
    "What is the role of technology in human development?"
  ];
  
  const randomTopic = fallbackTopics[Math.floor(Math.random() * fallbackTopics.length)];
  
  return NextResponse.json({ 
    topic: randomTopic,
    id: Math.floor(Math.random() * 1000) + 1,
    totalTopics: fallbackTopics.length,
    fallback: true
  });
}
