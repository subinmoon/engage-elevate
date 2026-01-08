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

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isChatMode, setIsChatMode] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setIsChatMode(true);
    setIsLoading(true);

    // Mock AI response (UI only)
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `"${content}"에 대해 답변드리겠습니다.\n\n이것은 UI 데모용 응답입니다. 실제 AI 연동 시 더 풍부한 응답을 제공할 수 있습니다.`,
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleBack = () => {
    setIsChatMode(false);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(false)} />
      
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
