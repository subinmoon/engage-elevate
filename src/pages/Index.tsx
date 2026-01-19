import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import SidebarTrigger from "@/components/SidebarTrigger";
import HeaderNav from "@/components/HeaderNav";
import WelcomeHeader from "@/components/WelcomeHeader";
import UpcomingSchedule from "@/components/UpcomingSchedule";
import RecentInterests from "@/components/RecentInterests";
import HRHelper from "@/components/HRHelper";
import ChatInput from "@/components/ChatInput";
import ChatView from "@/components/ChatView";
import { generateScheduleResponse } from "@/data/scheduleData";
import logoIcon from "@/assets/logo-icon.png";
import { PanelLeftClose } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  archived?: boolean;
  pinned?: boolean;
}

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isChatMode, setIsChatMode] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatTitle, setChatTitle] = useState("새 대화");
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [prefillMessage, setPrefillMessage] = useState("");
  const [scheduleExpanded, setScheduleExpanded] = useState(false);

  const handleSendMessage = (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
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

    // Mock AI response (UI only) - with schedule awareness
    setTimeout(() => {
      // Check if it's a schedule-related question
      const scheduleResponse = generateScheduleResponse(content);
      
      const responseContent = scheduleResponse 
        ? scheduleResponse
        : `"${content}"에 대해 답변드리겠습니다.\n\n이것은 UI 데모용 응답입니다. 실제 AI 연동 시 더 풍부한 응답을 제공할 수 있습니다.`;
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responseContent,
        timestamp: new Date(),
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

  const handleRegenerate = () => {
    if (messages.length < 2) return;
    
    // Remove last assistant message
    const newMessages = messages.slice(0, -1);
    setMessages(newMessages);
    setIsLoading(true);

    // Get the last user message
    const lastUserMessage = newMessages[newMessages.length - 1];

    // Mock regenerated response
    setTimeout(() => {
      const assistantMessage = {
        id: Date.now().toString(),
        role: "assistant" as const,
        content: `"${lastUserMessage.content}"에 대해 다시 답변드리겠습니다.\n\n이것은 재생성된 UI 데모용 응답입니다. 실제 AI 연동 시 다른 응답을 제공할 수 있습니다.`,
        timestamp: new Date(),
      };
      const updatedMessages = [...newMessages, assistantMessage];
      setMessages(updatedMessages);
      setIsLoading(false);

      setChatHistory(prev => prev.map(chat => 
        chat.id === currentChatId 
          ? { ...chat, messages: updatedMessages }
          : chat
      ));
    }, 1500);
  };

  const handleArchive = (chatId?: string) => {
    const targetId = chatId || currentChatId;
    setChatHistory(prev => prev.map(chat => 
      chat.id === targetId 
        ? { ...chat, archived: true }
        : chat
    ));
  };

  const handlePin = (chatId?: string) => {
    const targetId = chatId || currentChatId;
    setChatHistory(prev => prev.map(chat => 
      chat.id === targetId 
        ? { ...chat, pinned: !chat.pinned }
        : chat
    ));
  };

  const handleDelete = (chatId?: string) => {
    const targetId = chatId || currentChatId;
    setChatHistory(prev => prev.filter(chat => chat.id !== targetId));
    if (targetId === currentChatId) {
      handleNewChat();
    }
  };

  const handleRenameChat = (chatId: string, newTitle: string) => {
    setChatHistory(prev => prev.map(chat => 
      chat.id === chatId 
        ? { ...chat, title: newTitle }
        : chat
    ));
    if (chatId === currentChatId) {
      setChatTitle(newTitle);
    }
  };

  const handleShareChat = async (chatId: string) => {
    const chat = chatHistory.find(c => c.id === chatId);
    if (!chat) return;
    
    const chatText = chat.messages.map(m => 
      `[${m.role === "user" ? "나" : "AI"}] ${m.content}`
    ).join("\n\n");
    
    if (navigator.share) {
      try {
        await navigator.share({ title: chat.title, text: chatText });
      } catch (e) {
        if ((e as Error).name !== "AbortError") {
          await navigator.clipboard.writeText(chatText);
        }
      }
    } else {
      await navigator.clipboard.writeText(chatText);
    }
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
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Header Area - spans full width */}
      <div className="flex items-center">
        {/* Logo area - matches sidebar background */}
        <div className={`flex items-center gap-2 shrink-0 px-4 py-2 ${sidebarOpen ? 'w-64 bg-card' : ''}`}>
          <img src={logoIcon} alt="Logo" className="w-8 h-8" />
          <span className="font-bold text-foreground">pear link</span>
          {/* Sidebar close button - only when open */}
          {sidebarOpen && (
            <button 
              onClick={() => setSidebarOpen(false)}
              className="ml-auto p-1.5 hover:bg-muted rounded-lg transition-colors"
            >
              <PanelLeftClose className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>
        
        {/* Right side: HeaderNav + Schedule + User */}
        <div className="flex-1 flex items-center justify-end gap-3 px-4 py-2">
          <HeaderNav />
          <UpcomingSchedule 
            isExpanded={scheduleExpanded} 
            onToggle={() => setScheduleExpanded(!scheduleExpanded)}
            onGetHelp={(prompt) => {
              setPrefillMessage(prompt);
              setScheduleExpanded(false);
            }}
          />
          {/* User Profile */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium text-primary">
              문
            </div>
            <span className="text-sm font-medium text-foreground hidden sm:block">문수빈</span>
          </div>
        </div>
      </div>
      
      {/* Main Area - Sidebar + Content */}
      <div className="flex flex-1">
        {/* Sidebar Body (without header) */}
        <Sidebar 
          isOpen={sidebarOpen} 
          onToggle={() => setSidebarOpen(false)}
          chatHistory={chatHistory}
          currentChatId={currentChatId}
          onSelectChat={handleSelectChat}
          onNewChat={handleNewChat}
          onRenameChat={handleRenameChat}
          onShareChat={handleShareChat}
          onPinChat={handlePin}
          onArchiveChat={handleArchive}
          onDeleteChat={handleDelete}
          hideHeader
        />
        
        {/* Sidebar Trigger when closed */}
        {!sidebarOpen && <SidebarTrigger onClick={() => setSidebarOpen(true)} />}

        {/* Main Content */}
        <main className="flex-1 bg-background">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 w-full">
          {isChatMode ? (
            <ChatView
              messages={messages}
              onSendMessage={handleSendMessage}
              onBack={handleBack}
              isLoading={isLoading}
              title={chatTitle}
              onTitleChange={handleTitleChange}
              onRegenerate={handleRegenerate}
              onArchive={() => handleArchive()}
              onPin={() => handlePin()}
              onDelete={() => handleDelete()}
              isPinned={chatHistory.find(c => c.id === currentChatId)?.pinned}
            />
          ) : (
            <>
              {/* Header with Welcome & Quick Actions */}
              <div className="mb-4">
                <WelcomeHeader 
                  userName="현민" 
                  onSelectAction={(template) => setPrefillMessage(template)}
                />
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
              <ChatInput 
                onSendMessage={(msg) => {
                  handleSendMessage(msg);
                  setPrefillMessage("");
                }} 
                initialMessage={prefillMessage}
                onMessageChange={() => setPrefillMessage("")}
              />
            </>
          )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
