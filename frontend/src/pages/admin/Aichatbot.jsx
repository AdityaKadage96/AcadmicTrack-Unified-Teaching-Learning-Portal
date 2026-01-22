import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { FaPaperPlane, FaArrowLeft, FaRobot, FaTrash, FaCopy, FaExclamationTriangle, FaLightbulb, FaMicrophone } from 'react-icons/fa';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

function Aichatbot() {
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: "🔄 Initializing AI Tutor... Checking connection..." 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [availableModel, setAvailableModel] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const suggestions = [
    "Explain quantum computing in simple terms",
    "Help me debug this Python code",
    "What are the best practices for React?",
    "Teach me about machine learning"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const initializeAPI = async () => {
      if (!apiKey) {
        setApiError('NO_KEY');
        setMessages([{
          role: 'assistant',
          content: '⚠️ **API Key Missing**\n\nPlease configure your API key to start chatting.'
        }]);
        return;
      }

      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        const validModels = data.models?.filter(model => 
          model.supportedGenerationMethods?.includes('generateContent')
        ) || [];

        const preferredModels = [
          'gemini-1.5-flash',
          'gemini-1.5-flash-latest',
          'gemini-1.5-flash-8b',
          'gemini-flash-1.5',
          'gemini-1.5-pro',
          'gemini-pro'
        ];

        let selectedModel = null;
        for (const preferred of preferredModels) {
          const found = validModels.find(m => 
            m.name.toLowerCase().includes(preferred.toLowerCase())
          );
          if (found) {
            selectedModel = found;
            break;
          }
        }

        if (!selectedModel && validModels.length > 0) {
          selectedModel = validModels[0];
        }

        if (!selectedModel) {
          setApiError('NO_MODELS');
          setMessages([{
            role: 'assistant',
            content: '⚠️ **No AI Models Available**\n\nPlease check your API configuration.'
          }]);
          return;
        }

        const modelName = selectedModel.name.replace('models/', '');
        setAvailableModel(modelName);

        setMessages([{
          role: 'assistant',
          content: `✨ **Welcome to AI Tutor!**\n\nI'm here to help you learn and grow. Ask me anything about:\n\n• 💻 Programming & Development\n• 📐 Mathematics & Science\n• 📚 History & Literature\n• 🌍 General Knowledge\n• 🎓 Exam Preparation\n\nWhat would you like to explore today?`
        }]);

      } catch (error) {
        setApiError('INVALID_KEY');
        setMessages([{
          role: 'assistant',
          content: '⚠️ **Connection Failed**\n\nUnable to establish connection. Please check your configuration.'
        }]);
      }
    };

    initializeAPI();
  }, []);

  const handleSend = async (text = input) => {
    if (!text.trim() || loading || !availableModel) return;

    const userMessage = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setShowSuggestions(false);

    try {
      const model = genAI.getGenerativeModel({ model: availableModel });

      const prompt = `You are an expert educational AI tutor. Be helpful, clear, and encouraging.

Student's question: "${text}"

Instructions:
- Provide accurate, educational answers
- Use bullet points for lists
- Include examples when helpful
- For code, use markdown code blocks with language specification
- Keep responses concise but thorough (aim for 200-400 words)
- Be encouraging and supportive

Answer:`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const responseText = response.text();

      setMessages(prev => [...prev, { role: 'assistant', content: responseText }]);

    } catch (error) {
      let errorMessage = '⚠️ **Error**\n\n';
      
      if (error.message?.includes('quota') || error.message?.includes('429')) {
        const retryMatch = error.message.match(/retry in ([\d.]+)s/);
        const retryTime = retryMatch ? Math.ceil(parseFloat(retryMatch[1])) : 30;
        
        errorMessage += `Request limit reached. Please wait ${retryTime} seconds and try again.\n\n💡 Tip: Responses are being rate-limited to ensure fair usage.`;
      } else if (error.message?.includes('blocked')) {
        errorMessage += 'Request blocked by safety filters. Please rephrase your question.';
      } else {
        errorMessage += 'Something went wrong. Please try again.';
      }
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: errorMessage 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([
      { 
        role: 'assistant', 
        content: `✨ **Chat Cleared!**\n\nI'm ready to help you with your next question. What would you like to learn?` 
      }
    ]);
    setShowSuggestions(true);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const formatMessage = (content) => {
    const parts = content.split('```');
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        const lines = part.split('\n');
        const language = lines[0].trim();
        const code = lines.slice(1).join('\n');
        return (
          <div key={index} className="my-3 relative group">
            <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => copyToClipboard(code)}
                className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 shadow-lg"
              >
                <FaCopy />
                Copy
              </button>
            </div>
            {language && (
              <div className="bg-gray-800 text-gray-300 px-3 py-1 text-xs rounded-t-lg font-mono">
                {language}
              </div>
            )}
            <pre className={`bg-gray-900 text-gray-100 p-4 ${language ? 'rounded-b-lg' : 'rounded-lg'} overflow-x-auto text-sm font-mono shadow-inner`}>
              <code>{code}</code>
            </pre>
          </div>
        );
      }
      return (
        <div key={index} className="whitespace-pre-wrap leading-relaxed">
          {part.split('\n').map((line, i) => {
            line = line.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>');
            line = line.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
            
            if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
              return (
                <div key={i} className="flex gap-2 my-2">
                  <span className="text-indigo-500 mt-1">•</span>
                  <span dangerouslySetInnerHTML={{ __html: line.replace(/^[•\-]\s*/, '') }} />
                </div>
              );
            }
            return line ? (
              <p key={i} className="my-2" dangerouslySetInnerHTML={{ __html: line }} />
            ) : (
              <br key={i} />
            );
          })}
        </div>
      );
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex flex-col relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-200/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-indigo-200/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Header */}
      <div className="relative bg-white/70 backdrop-blur-xl shadow-lg border-b border-white/20 p-4 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => window.history.back()}
              className="text-gray-600 hover:text-indigo-600 transition-all transform hover:scale-110 active:scale-95 p-2 hover:bg-indigo-50 rounded-lg"
            >
              <FaArrowLeft className="text-xl" />
            </button>
            <div className="flex items-center gap-3">
              <div className={`relative p-3 rounded-2xl shadow-lg ${apiError ? 'bg-gradient-to-br from-red-500 to-red-600' : 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500'}`}>
                {apiError ? (
                  <FaExclamationTriangle className="text-2xl text-white" />
                ) : (
                  <FaRobot className="text-2xl text-white animate-pulse" />
                )}
                {!apiError && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-ping"></div>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  AI Tutor
                </h1>
                <p className="text-xs text-gray-500 flex items-center gap-2">
                  {apiError ? (
                    <><span className="w-2 h-2 bg-red-500 rounded-full"></span>Setup Required</>
                  ) : availableModel ? (
                    <><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>Ready to help</>
                  ) : (
                    <><span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>Connecting...</>
                  )}
                </p>
              </div>
            </div>
          </div>
          {!apiError && (
            <button
              onClick={clearChat}
              className="text-gray-600 hover:text-red-500 transition-all flex items-center gap-2 text-sm px-4 py-2 hover:bg-red-50 rounded-lg font-medium"
            >
              <FaTrash />
              <span className="hidden sm:inline">Clear Chat</span>
            </button>
          )}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="relative flex-1 overflow-y-auto p-6 pb-40">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slideIn`}
            >
              <div
                className={`max-w-[85%] px-6 py-4 rounded-2xl shadow-xl backdrop-blur-sm ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white ml-auto'
                    : 'bg-white/90 text-gray-800 border border-gray-100'
                }`}
              >
                {msg.role === 'assistant' && (
                  <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-100">
                    <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                      <FaRobot className="text-white text-xs" />
                    </div>
                    <span className="text-xs font-semibold text-gray-600">AI Tutor</span>
                  </div>
                )}
                <div className="text-[15px] leading-relaxed">
                  {msg.role === 'assistant' ? formatMessage(msg.content) : msg.content}
                </div>
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex justify-start animate-slideIn">
              <div className="bg-white/90 backdrop-blur-sm px-6 py-5 rounded-2xl shadow-xl border border-gray-100">
                <div className="flex gap-3 items-center">
                  <div className="flex gap-1">
                    <div className="w-2.5 h-2.5 bg-indigo-400 rounded-full animate-bounce"></div>
                    <div className="w-2.5 h-2.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2.5 h-2.5 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm text-gray-600 font-medium">Thinking...</span>
                </div>
              </div>
            </div>
          )}

          {/* Suggestions */}
          {showSuggestions && messages.length <= 1 && !loading && (
            <div className="mt-8 space-y-3 animate-slideIn">
              <div className="flex items-center gap-2 text-gray-500 mb-4">
                <FaLightbulb className="text-yellow-500" />
                <span className="text-sm font-medium">Suggested questions:</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {suggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(suggestion)}
                    className="text-left p-4 bg-white/70 hover:bg-white backdrop-blur-sm border border-gray-200 rounded-xl hover:border-indigo-300 hover:shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] group"
                  >
                    <span className="text-sm text-gray-700 group-hover:text-indigo-600 transition-colors">
                      {suggestion}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Box */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-transparent backdrop-blur-xl border-t border-gray-200/50 p-6 shadow-2xl z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3 items-end bg-white rounded-2xl shadow-xl border border-gray-200 p-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={apiError ? "Fix configuration to start chatting..." : "Ask me anything... (Press Enter to send)"}
              className="flex-1 p-3 bg-transparent resize-none focus:outline-none transition max-h-32 text-gray-800 placeholder-gray-400"
              rows="1"
              disabled={loading || !availableModel}
              style={{ minHeight: '48px' }}
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !input.trim() || !availableModel}
              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-3 rounded-xl hover:shadow-lg disabled:from-gray-300 disabled:via-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 h-12 w-12 flex items-center justify-center shrink-0"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <FaPaperPlane />
              )}
            </button>
          </div>
          <p className="text-center text-xs text-gray-500 mt-4">
            🚀 Powered by AI • Your Personal Learning Assistant
          </p>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.4s ease-out;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #6366f1, #a855f7);
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #4f46e5, #9333ea);
        }
      `}</style>
    </div>
  );
}

export default Aichatbot;