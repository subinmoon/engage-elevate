import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import SidebarTrigger from "@/components/SidebarTrigger";
import WelcomeHeader from "@/components/WelcomeHeader";
import RecentInterests from "@/components/RecentInterests";
import HRHelper from "@/components/HRHelper";
import QuickActions from "@/components/QuickActions";
import ChatInput from "@/components/ChatInput";
import ChatView from "@/components/ChatView";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isChatMode, setIsChatMode] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatTitle, setChatTitle] = useState("새 대화");
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  const handleSendMessage = (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
    };
    
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    
    // First message sets the title
    if (messages.length === 0) {
      const newTitle = content.length > 20 ? content.slice(0, 20) + "..." : content;
      setChatTitle(newTitle);
      
      // Create new chat session
      const newChatId = Date.now().toString();
      setCurrentChatId(newChatId);
      setChatHistory(prev => [{
        id: newChatId,
        title: newTitle,
        messages: newMessages,
        createdAt: new Date(),
      }, ...prev]);
    } else {
      // Update existing chat session
      setChatHistory(prev => prev.map(chat => 
        chat.id === currentChatId 
          ? { ...chat, messages: newMessages, title: chatTitle }
          : chat
      ));
    }
    
    setIsChatMode(true);
    setIsLoading(true);

    // Mock AI response (UI only)
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `"${content}"에 대해 답변드리겠습니다.\n\n이것은 UI 데모용 응답입니다. 실제 AI 연동 시 더 풍부한 응답을 제공할 수 있습니다.`,
      };
      const updatedMessages = [...newMessages, assistantMessage];
      setMessages(updatedMessages);
      setIsLoading(false);
      
      // Update chat history with assistant response
      setChatHistory(prev => prev.map(chat => 
        chat.id === currentChatId 
          ? { ...chat, messages: updatedMessages }
          : chat
      ));
    }, 1500);
  };

  const handleBack = () => {
    setIsChatMode(false);
  };

  const handleTitleChange = (newTitle: string) => {
    setChatTitle(newTitle);
    setChatHistory(prev => prev.map(chat => 
      chat.id === currentChatId 
        ? { ...chat, title: newTitle }
        : chat
    ));
  };

  const handleSelectChat = (chatId: string) => {
    const chat = chatHistory.find(c => c.id === chatId);
    if (chat) {
      setCurrentChatId(chatId);
      setMessages(chat.messages);
      setChatTitle(chat.title);
      setIsChatMode(true);
    }
  };

  const handleNewChat = () => {
    setCurrentChatId(null);
    setMessages([]);
    setChatTitle("새 대화");
    setIsChatMode(false);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onToggle={() => setSidebarOpen(false)}
        chatHistory={chatHistory}
        currentChatId={currentChatId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
      />
      
      {/* Sidebar Trigger when closed */}
      {!sidebarOpen && <SidebarTrigger onClick={() => setSidebarOpen(true)} />}

      {/* Main Content */}
      <main className="flex-1 min-h-screen bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          {isChatMode ? (
            <ChatView
              messages={messages}
              onSendMessage={handleSendMessage}
              onBack={handleBack}
              isLoading={isLoading}
              title={chatTitle}
              onTitleChange={handleTitleChange}
            />
          ) : (
            <>
              <WelcomeHeader userName="은선" />
              
              {/* Quick Actions */}
              <div className="mb-4">
                <QuickActions />
              </div>
              
              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6">
                <div className="lg:col-span-3">
                  <RecentInterests />
                </div>
                <div className="lg:col-span-2">
                  <HRHelper />
                </div>
              </div>
              
              {/* Chat Input - Bottom */}
              <ChatInput onSendMessage={handleSendMessage} />
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
