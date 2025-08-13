"use client";
import { useState, useEffect, useRef } from "react";

export default function SpeechRecorder({ fillers }) {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [fillerCount, setFillerCount] = useState(0);
  const [detectedFillers, setDetectedFillers] = useState([]);

  const recognitionRef = useRef(null);
  const finalTranscriptRef = useRef(""); // stores confirmed speech

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (!SpeechRecognition) {
        alert("Speech Recognition not supported in this browser.");
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event) => {
        let interimTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const text = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscriptRef.current += text + " ";
          } else {
            interimTranscript += text;
          }
        }

        const combinedTranscript =
          finalTranscriptRef.current + interimTranscript;
        setTranscript(combinedTranscript);

        // Count filler words
        if (fillers && fillers.length > 0) {
          const regex = new RegExp(`\\b(${fillers.join("|")})\\b`, "gi");
          const matches = combinedTranscript.match(regex) || [];
          setFillerCount(matches.length);
          
          // Track which specific filler words were used
          const usedFillers = matches.map(match => match.toLowerCase());
          const uniqueFillers = [...new Set(usedFillers)];
          setDetectedFillers(uniqueFillers);
        }
      };

      recognitionRef.current = recognition;
    }
  }, [fillers]);

  const startListening = () => {
    if (recognitionRef.current && !listening) {
      recognitionRef.current.start();
      setListening(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && listening) {
      recognitionRef.current.stop();
      setListening(false);
    }
  };

  const resetTranscript = () => {
    setTranscript("");
    setFillerCount(0);
    setDetectedFillers([]);
    finalTranscriptRef.current = "";
  };

  return (
    <div className="w-full">
      <div className="mb-6 flex gap-3 justify-center">
        <button
          onClick={listening ? stopListening : startListening}
          className={`px-6 py-3 rounded-lg text-white font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            listening 
              ? "bg-red-600 hover:bg-red-700 focus:ring-red-500" 
              : "bg-green-600 hover:bg-green-700 focus:ring-green-500"
          }`}
        >
          {listening ? "⏹️ Stop Recording" : "🎤 Start Recording"}
        </button>
        <button
          onClick={resetTranscript}
          className="px-6 py-3 rounded-lg text-white font-semibold bg-gray-600 hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          🔄 Reset
        </button>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Live Transcript:</h3>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 h-40 overflow-y-auto">
          <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
            {transcript || "Start speaking to see your transcript appear here..."}
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 Filler Word Analysis</h3>
        
        <div className="flex items-center gap-4 mb-4">
          <div className={`text-4xl font-bold ${
            fillerCount === 0 ? 'text-green-600' : 
            fillerCount <= 3 ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {fillerCount}
          </div>
          <div className="flex-1">
            <p className={`text-sm font-medium ${
              fillerCount === 0 ? 'text-green-600' : 
              fillerCount <= 3 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {fillerCount === 0 ? '🎉 Excellent! No filler words detected.' :
               fillerCount <= 3 ? '👍 Good! Some filler words used.' :
               '⚠️ Try to reduce filler words for better clarity.'}
            </p>
          </div>
        </div>
        
        {detectedFillers.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 mb-3">Detected filler words:</p>
            <div className="flex flex-wrap gap-2">
              {detectedFillers.map((filler, index) => (
                <span key={index} className="bg-red-100 text-red-800 text-xs px-3 py-1 rounded-full font-medium">
                  {filler}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
