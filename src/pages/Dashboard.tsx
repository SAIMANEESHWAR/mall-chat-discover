
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatInterface from "@/components/chat/ChatInterface";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [chats, setChats] = useState<{id: string, title: string, lastMessage: string, timestamp: string}[]>([]);

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
    }
    
    // Initialize with sample chat history
    setChats([
      {
        id: '1',
        title: 'Finding running shoes',
        lastMessage: 'I recommended the Nike Air Zoom for your marathon training.',
        timestamp: '2 hours ago'
      },
      {
        id: '2',
        title: 'Gift ideas for anniversary',
        lastMessage: 'Here are some jewelry options within your budget.',
        timestamp: '1 day ago'
      },
      {
        id: '3',
        title: 'Living room furniture',
        lastMessage: 'The minimalist scandinavian style would fit your space perfectly.',
        timestamp: '3 days ago'
      }
    ]);
    
    // Set initial chat
    setCurrentChatId('1');
  }, [navigate]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const createNewChat = () => {
    const newChatId = Math.random().toString(36).substr(2, 9);
    const newChat = {
      id: newChatId,
      title: 'New Conversation',
      lastMessage: 'Start a new product discovery conversation',
      timestamp: 'Just now'
    };
    
    setChats([newChat, ...chats]);
    setCurrentChatId(newChatId);
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  const selectChat = (chatId: string) => {
    setCurrentChatId(chatId);
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-mall-light">
      <DashboardHeader onMenuToggle={toggleMobileMenu} />
      
      <div className="flex flex-1 overflow-hidden">
        <ChatSidebar 
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          chats={chats}
          currentChatId={currentChatId}
          onChatSelect={selectChat}
          onNewChat={createNewChat}
        />
        
        <main className="flex-1 flex flex-col">
          <ChatInterface 
            chatId={currentChatId}
            onNewChat={createNewChat}
          />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
