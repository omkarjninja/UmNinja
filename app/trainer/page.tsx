'use client';

import { useState, useEffect } from 'react';
import SpeechRecorder from '../components/SpeechRecorder';

interface TopicResponse {
  topic: string;
  id: number;
  totalTopics: number;
  fallback?: boolean;
  cached?: boolean;
}

export default function TrainerPage() {
  const [currentTopic, setCurrentTopic] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [topicId, setTopicId] = useState<number>(0);
  const [isFallback, setIsFallback] = useState<boolean>(false);
  const [isCached, setIsCached] = useState<boolean>(false);
  const [totalTopics, setTotalTopics] = useState<number>(0);
  const [showRecorder, setShowRecorder] = useState<boolean>(false);

  // Common filler words to track
  const fillerWords = [
    'um', 'uh', 'ah', 'er', 'like', 'you know', 'basically', 'actually', 
    'literally', 'sort of', 'kind of', 'right', 'so', 'well', 'i mean',
    'i guess', 'i think', 'you see', 'okay', 'alright'
  ];

  const fetchNewTopic = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/topic', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: TopicResponse = await response.json();
      setCurrentTopic(data.topic);
      setTopicId(data.id);
      setIsFallback(data.fallback || false);
      setIsCached(data.cached || false);
      setTotalTopics(data.totalTopics || 0);
    } catch (err) {
      console.error('Error fetching topic:', err);
      setError('Failed to load topic. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Load initial topic on component mount
  useEffect(() => {
    fetchNewTopic();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
          UmNinja Discussion Trainer
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Improve your speaking skills with philosophical topics. Practice explaining, 
            debating, and presenting your ideas on ethics, metaphysics, and existential questions.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Your Speaking Topic
            </h2>
            {topicId > 0 && (
              <span className="inline-block bg-indigo-100 text-indigo-800 text-sm px-3 py-1 rounded-full">
                Topic #{topicId}
              </span>
            )}
            {isCached && (
              <span className="inline-block bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full ml-2">
                AI Cached
              </span>
            )}
            {isFallback && (
              <span className="inline-block bg-yellow-100 text-yellow-800 text-sm px-3 py-1 rounded-full ml-2">
                Fallback Topic
              </span>
            )}
            {totalTopics > 1 && (
              <div className="mt-2 text-sm text-gray-500">
                {totalTopics - 1} more AI topics available
              </div>
            )}
          </div>

          <div className="min-h-[200px] flex items-center justify-center">
            {loading ? (
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading your topic...</p>
              </div>
            ) : error ? (
              <div className="text-center">
                <div className="text-red-500 mb-4">
                  <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-red-600 font-medium">{error}</p>
              </div>
            ) : (
              <div className="text-center">
                <blockquote className="text-xl md:text-2xl font-medium text-gray-900 leading-relaxed italic">
                  {currentTopic}
                </blockquote>
              </div>
            )}
          </div>

          <div className="text-center mt-8 space-y-4">
            <button
              onClick={fetchNewTopic}
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {loading ? 'Loading...' : 'Get New Topic'}
            </button>
            
            <div>
              <button
                onClick={() => setShowRecorder(!showRecorder)}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                {showRecorder ? 'Hide' : 'Start'} Speech Practice
              </button>
            </div>
          </div>
        </div>

        {/* Filler Words Guide Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              🚫 Filler Words to Avoid
            </h2>
            <p className="text-gray-600">
              These words can weaken your speech. Try to eliminate them for more confident and clear communication.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {fillerWords.map((word, index) => (
              <div 
                key={index}
                className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-lg p-3 text-center hover:shadow-md transition-all duration-200 transform hover:-translate-y-1"
              >
                <span className="text-red-700 font-semibold text-sm">
                  {word}
                </span>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">Pro Tip</h4>
                <p className="text-blue-800 text-sm">
                  Instead of filler words, try using brief pauses. This gives you time to think and makes you sound more confident and professional.
                </p>
              </div>
            </div>
          </div>
        </div>

        {showRecorder && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                🎤 Speech Practice
              </h2>
              <p className="text-gray-600">
                Practice speaking about the topic above. Your speech will be transcribed and filler words will be tracked in real-time.
              </p>
            </div>
            <SpeechRecorder fillers={fillerWords} />
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            💡 Speaking Tips
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="space-y-2">
              <p><strong>Structure:</strong> Use introduction, main points, and conclusion</p>
              <p><strong>Clarity:</strong> Speak slowly and articulate clearly</p>
              <p><strong>Examples:</strong> Use specific examples to support your points</p>
            </div>
            <div className="space-y-2">
              <p><strong>Engagement:</strong> Maintain eye contact and use gestures</p>
              <p><strong>Practice:</strong> Time yourself (aim for 2-3 minutes)</p>
              <p><strong>Confidence:</strong> Take deep breaths and speak with conviction</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 
