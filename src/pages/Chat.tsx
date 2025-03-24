import { useState, useRef, useEffect } from 'react';
import { Send, Bot, Sparkles, ArrowLeft, User2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { getAIResponse, saveChatMessage } from '../lib/ai';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const GREETING_MESSAGE = `## Welcome to Career AI Assistant! 👋

I'm here to help you with:
- Career guidance and planning
- Skill development recommendations
- Industry insights and trends
- Job market analysis
- Professional growth strategies

How can I assist you today?`;

export function Chat() {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'greeting',
      text: GREETING_MESSAGE,
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = inputRef.current.scrollHeight + 'px';
    }
  }, [input]);

  const handleSend = async () => {
    if (!input.trim() || !user) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }

    // Save user message
    await saveChatMessage(user.id, input, 'user');

    try {
      // Get AI response
      const aiResponse = await getAIResponse(input);
      
      // Add AI message
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      
      // Save AI message
      await saveChatMessage(user.id, aiResponse, 'ai');
    } catch (error) {
      console.error('Error getting AI response:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-indigo-800">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white/10 backdrop-blur-lg rounded-lg shadow-xl h-[80vh] flex flex-col border border-white/20 mt-12">
          {/* Header */}
          <div className="p-4 border-b border-white/20">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Bot className="h-8 w-8 text-indigo-300" />
                <div className="absolute -right-1 -bottom-1">
                  <Sparkles className="h-4 w-4 text-indigo-400" />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Career AI Assistant</h2>
                <p className="text-sm text-indigo-200">
                  Your personal career guidance companion
                </p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`flex space-x-2 max-w-[80%] ${
                    message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                    {message.sender === 'user' ? (
                      <div className="bg-indigo-600 rounded-full p-1">
                        <User2 className="h-6 w-6 text-white" />
                      </div>
                    ) : (
                      <div className="bg-indigo-400/20 rounded-full p-1">
                        <Bot className="h-6 w-6 text-indigo-300" />
                      </div>
                    )}
                  </div>
                  <div
                    className={`rounded-2xl p-4 ${
                      message.sender === 'user'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white/10 text-indigo-100'
                    }`}
                  >
                    <ReactMarkdown
                      className="prose prose-invert max-w-none
                        [&>h2]:text-lg [&>h2]:font-bold [&>h2]:mb-2 
                        [&>ul]:list-disc [&>ul]:pl-4 [&>ul]:mb-2 [&>ul>li]:mb-1
                        [&>p]:mb-2 [&>p:last-child]:mb-0"
                    >
                      {message.text}
                    </ReactMarkdown>
                    <div className="mt-2 text-xs opacity-75 flex items-center justify-end space-x-1">
                      <span>{message.timestamp.toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white/10 rounded-2xl p-4">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-indigo-300 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-indigo-300 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-indigo-300 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-white/20">
            <div className="flex space-x-4">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message... (Shift + Enter for new line)"
                  className="w-full bg-white/10 text-white placeholder-indigo-300 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none overflow-hidden min-h-[44px] max-h-32"
                  style={{ height: 'auto' }}
                />
              </div>
              <button
                onClick={handleSend}
                disabled={isTyping || !input.trim()}
                className={`${
                  isTyping || !input.trim()
                    ? 'bg-white/10 text-indigo-300 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-500'
                } p-3 rounded-xl transition-colors flex-shrink-0 flex items-center justify-center group`}
              >
                <Send className="h-5 w-5 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </div>
            <div className="mt-2 text-xs text-indigo-300 text-center">
              Press Enter to send, Shift + Enter for new line
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}