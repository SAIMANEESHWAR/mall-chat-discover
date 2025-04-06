
import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ShoppingBag } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatMessage from "./ChatMessage";
import ProductCard from "./ProductCard";

interface ChatInterfaceProps {
  chatId: string | null;
  onNewChat: () => void;
}

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  products?: Product[];
}

interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  description: string;
}

const ChatInterface = ({ chatId, onNewChat }: ChatInterfaceProps) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);

  // Sample product data
  const sampleProducts = [
    {
      id: '1',
      name: 'Premium Running Shoes',
      price: '$129.99',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
      description: 'Lightweight running shoes with advanced cushioning for marathon training.'
    },
    {
      id: '2',
      name: 'Fitness Tracker Watch',
      price: '$89.99',
      image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a',
      description: 'Smart fitness watch with heart rate monitoring and GPS tracking.'
    },
    {
      id: '3',
      name: 'Wireless Earbuds',
      price: '$79.99',
      image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb',
      description: 'Noise-cancelling wireless earbuds for an immersive audio experience.'
    }
  ];

  useEffect(() => {
    if (chatId) {
      // In a real app, this would fetch chat history from an API
      // For now we'll simulate conversations based on chatId
      let initialMessages: Message[] = [];
      
      if (chatId === '1') {
        initialMessages = [
          {
            id: '1-1',
            content: 'I need a new pair of running shoes for my marathon training.',
            sender: 'user',
            timestamp: new Date(Date.now() - 3600000)
          },
          {
            id: '1-2',
            content: 'I can help with that! What kind of features are you looking for in running shoes?',
            sender: 'assistant',
            timestamp: new Date(Date.now() - 3580000)
          },
          {
            id: '1-3',
            content: 'I need good cushioning and support. I have flat feet and I'll be running long distances.',
            sender: 'user',
            timestamp: new Date(Date.now() - 3560000)
          },
          {
            id: '1-4',
            content: 'Based on your needs, I recommend shoes with stability features and extra cushioning. Here are some options that would work well for marathon training with flat feet:',
            sender: 'assistant',
            timestamp: new Date(Date.now() - 3540000),
            products: sampleProducts
          }
        ];
      } else if (chatId === '2') {
        initialMessages = [
          {
            id: '2-1',
            content: 'I need to find an anniversary gift for my wife.',
            sender: 'user',
            timestamp: new Date(Date.now() - 86400000)
          },
          {
            id: '2-2',
            content: 'I'd be happy to help with anniversary gift ideas! What kinds of things does your wife enjoy?',
            sender: 'assistant',
            timestamp: new Date(Date.now() - 86380000)
          }
        ];
      } else if (chatId === '3') {
        initialMessages = [
          {
            id: '3-1',
            content: 'I'm looking to redecorate my living room.',
            sender: 'user',
            timestamp: new Date(Date.now() - 259200000)
          },
          {
            id: '3-2',
            content: 'That sounds exciting! What style are you going for with your living room redecoration?',
            sender: 'assistant',
            timestamp: new Date(Date.now() - 259180000)
          }
        ];
      } else {
        // New chat
        initialMessages = [
          {
            id: 'new-1',
            content: 'Hello! I'm your shopping assistant. How can I help you discover products today?',
            sender: 'assistant',
            timestamp: new Date()
          }
        ];
      }
      
      setMessages(initialMessages);
    }
  }, [chatId]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      content: input,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages([...messages, userMessage]);
    setInput('');
    setIsTyping(true);
    
    // Simulate assistant response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        content: simulateAssistantResponse(input),
        sender: 'assistant',
        timestamp: new Date(),
        // Sometimes include product recommendations
        products: Math.random() > 0.5 ? sampleProducts.slice(0, Math.floor(Math.random() * 3) + 1) : undefined
      };
      
      setMessages(prevMessages => [...prevMessages, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const simulateAssistantResponse = (userInput: string): string => {
    const responses = [
      "I can help you find that! Could you tell me more about what you're looking for?",
      "Based on what you're looking for, I have a few recommendations to share.",
      "Great question! Here are some options that might interest you.",
      "I understand what you're looking for. Let me suggest a few products that match your needs.",
      "Thanks for providing that information. Would you like me to show you some popular options in this category?"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <div className="bg-mall-primary/10 p-4 rounded-full mb-4">
        <ShoppingBag className="h-12 w-12 text-mall-primary" />
      </div>
      <h2 className="text-2xl font-bold text-mall-dark mb-2">
        Start a New Conversation
      </h2>
      <p className="text-gray-600 mb-6 max-w-md">
        Describe what you're looking for, and I'll help you discover the perfect products tailored to your needs.
      </p>
      <Button
        onClick={onNewChat}
        className="bg-mall-primary hover:bg-mall-dark"
      >
        New Chat
      </Button>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      {!chatId ? (
        <EmptyState />
      ) : (
        <>
          <ScrollArea className="flex-1 p-4">
            <div className="max-w-3xl mx-auto space-y-4 pb-20">
              {messages.map((message) => (
                <div key={message.id}>
                  <ChatMessage message={message} />
                  {message.products && (
                    <div className="pl-10 mt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {message.products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-mall-primary/20 p-2 rounded-full mr-3">
                    <ShoppingBag className="h-5 w-5 text-mall-primary" />
                  </div>
                  <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                    <div className="flex space-x-2">
                      <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messageEndRef} />
            </div>
          </ScrollArea>
          
          <div className="border-t border-gray-200 p-4 bg-white">
            <div className="max-w-3xl mx-auto flex">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about products, styles, recommendations..."
                className="resize-none border-gray-300 focus:border-mall-primary focus:ring-mall-primary"
                rows={1}
              />
              <Button
                onClick={handleSendMessage}
                className="ml-2 bg-mall-primary hover:bg-mall-dark shrink-0"
                disabled={!input.trim()}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="18" 
                  height="18" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatInterface;
