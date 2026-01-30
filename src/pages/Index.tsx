import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import SidebarTrigger from "@/components/SidebarTrigger";
import HeaderNav from "@/components/HeaderNav";
import WelcomeHeader from "@/components/WelcomeHeader";
import UpcomingSchedule from "@/components/UpcomingSchedule";
import RecentInterests from "@/components/RecentInterests";
import HRHelper from "@/components/HRHelper";
import FavoriteChatbots from "@/components/FavoriteChatbots";
import ChatInput from "@/components/ChatInput";
import ChatView from "@/components/ChatView";
import { generateScheduleResponse } from "@/data/scheduleData";
import logoIcon from "@/assets/logo-icon.png";
import { PanelLeftClose, ArrowLeft, Pencil, Check, X, MoreHorizontal, Share2, Pin, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Source } from "@/components/ChatMessage";
import { TutorialModal, TutorialStep } from "@/components/TutorialModal";
import { TutorialGuideOverlay } from "@/components/TutorialGuideOverlay";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  sources?: Source[];
}
export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  archived?: boolean;
  pinned?: boolean;
}

interface UserSettings {
  userName: string;
  assistantName: string;
  toneStyle: string;
  answerLength: string;
  allowWebSearch: boolean;
  allowFollowUpQuestions: boolean;
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
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitleValue, setEditTitleValue] = useState("");
  
  // Tutorial state
  const [showSetupModal, setShowSetupModal] = useState(true);
  const [showGuideOverlay, setShowGuideOverlay] = useState(false);
  const [tutorialStep, setTutorialStep] = useState<TutorialStep | undefined>(undefined);
  const [userSettings, setUserSettings] = useState<UserSettings | null>(() => {
    const saved = localStorage.getItem("userSettings");
    return saved ? JSON.parse(saved) : null;
  });

  // 화면 가이드 시작 핸들러
  const handleStartGuide = () => {
    setShowSetupModal(false);
    setShowGuideOverlay(true);
  };

  // 화면 가이드 완료 핸들러
  const handleGuideComplete = () => {
    setShowGuideOverlay(false);
    // 먼저 스텝을 설정한 후 모달 열기 (순서 중요)
    setTimeout(() => {
      setTutorialStep("user-info-ask"); // 다음 단계로 설정
      setShowSetupModal(true); // 다시 모달로 돌아가기
    }, 100);
  };

  const handleSetupComplete = (settings: UserSettings) => {
    setUserSettings(settings);
    localStorage.setItem("userSettings", JSON.stringify(settings));
    setShowSetupModal(false);
  };

  const handleSetupSkip = () => {
    setShowSetupModal(false);
  };

  const handleSendMessage = (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date()
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
        createdAt: new Date()
      }, ...prev]);
    } else {
      // Update existing chat session
      setChatHistory(prev => prev.map(chat => chat.id === currentChatId ? {
        ...chat,
        messages: newMessages,
        title: chatTitle
      } : chat));
    }
    setIsChatMode(true);
    setIsLoading(true);

    // Mock AI response (UI only) - with schedule awareness
    setTimeout(() => {
      // Check if it's a schedule-related question
      const scheduleResponse = generateScheduleResponse(content);
      const responseContent = scheduleResponse ? scheduleResponse : `"${content}"에 대해 답변드리겠습니다.\n\n이것은 UI 데모용 응답입니다. 실제 AI 연동 시 더 풍부한 응답을 제공할 수 있습니다.`;

      // Demo sources for the response
      const demoSources: Source[] = [{
        title: "사내 복지 정책 가이드",
        url: "https://example.com/policy",
        description: "복지 정책에 대한 상세 안내 문서"
      }, {
        title: "HR 포털 FAQ",
        url: "https://example.com/hr-faq",
        description: "자주 묻는 질문 모음"
      }, {
        title: "2024년 업데이트 공지",
        url: "https://example.com/notice",
        description: "최신 정책 변경사항 안내"
      }, {
        title: "근무 규정 문서",
        url: "https://example.com/work-rules",
        description: "근무 관련 규정 전문"
      }];
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responseContent,
        timestamp: new Date(),
        sources: demoSources
      };
      const updatedMessages = [...newMessages, assistantMessage];
      setMessages(updatedMessages);
      setIsLoading(false);

      // Update chat history with assistant response
      setChatHistory(prev => prev.map(chat => chat.id === currentChatId ? {
        ...chat,
        messages: updatedMessages
      } : chat));
    }, 1500);
  };
  const handleBack = () => {
    setIsChatMode(false);
  };
  const handleTitleChange = (newTitle: string) => {
    setChatTitle(newTitle);
    setChatHistory(prev => prev.map(chat => chat.id === currentChatId ? {
      ...chat,
      title: newTitle
    } : chat));
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
        timestamp: new Date()
      };
      const updatedMessages = [...newMessages, assistantMessage];
      setMessages(updatedMessages);
      setIsLoading(false);
      setChatHistory(prev => prev.map(chat => chat.id === currentChatId ? {
        ...chat,
        messages: updatedMessages
      } : chat));
    }, 1500);
  };
  const handleArchive = (chatId?: string) => {
    const targetId = chatId || currentChatId;
    setChatHistory(prev => prev.map(chat => chat.id === targetId ? {
      ...chat,
      archived: true
    } : chat));
  };
  const handlePin = (chatId?: string) => {
    const targetId = chatId || currentChatId;
    setChatHistory(prev => prev.map(chat => chat.id === targetId ? {
      ...chat,
      pinned: !chat.pinned
    } : chat));
  };
  const handleDelete = (chatId?: string) => {
    const targetId = chatId || currentChatId;
    setChatHistory(prev => prev.filter(chat => chat.id !== targetId));
    if (targetId === currentChatId) {
      handleNewChat();
    }
  };
  const handleRenameChat = (chatId: string, newTitle: string) => {
    setChatHistory(prev => prev.map(chat => chat.id === chatId ? {
      ...chat,
      title: newTitle
    } : chat));
    if (chatId === currentChatId) {
      setChatTitle(newTitle);
    }
  };
  const handleShareChat = async (chatId: string) => {
    const chat = chatHistory.find(c => c.id === chatId);
    if (!chat) return;
    const chatText = chat.messages.map(m => `[${m.role === "user" ? "나" : "AI"}] ${m.content}`).join("\n\n");
    if (navigator.share) {
      try {
        await navigator.share({
          title: chat.title,
          text: chatText
        });
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
  return <>
    {/* Tutorial Modal */}
    <TutorialModal 
      open={showSetupModal} 
      onComplete={handleSetupComplete} 
      onSkip={handleSetupSkip}
      onStartGuide={handleStartGuide}
      userName="경민"
      initialStep={tutorialStep}
    />
    
    {/* Tutorial Guide Overlay - 화면 위를 돌아다니는 가이드 */}
    {showGuideOverlay && (
      <TutorialGuideOverlay 
        onComplete={handleGuideComplete}
        onSkip={handleSetupSkip}
      />
    )}
    
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Header Area - spans full width */}
      <div className="flex items-center">
        {/* Logo area - matches sidebar background, hidden when sidebar closed */}
        {sidebarOpen && <div className="flex items-center gap-2 shrink-0 px-4 py-2 w-64 bg-card">
            <img src={logoIcon} alt="Logo" className="w-8 h-8" />
            <span className="font-bold text-foreground">​ISU GPT </span>
            <button onClick={() => setSidebarOpen(false)} className="ml-auto p-1.5 hover:bg-muted rounded-lg transition-colors">
              <PanelLeftClose className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>}
        
        {/* Right side: Chat controls OR HeaderNav + Schedule + User */}
        <div className="flex-1 flex items-center gap-3 px-4 py-2">
          {/* Chat mode: show chat controls on left side */}
          {isChatMode && <div className="flex items-center gap-2">
              <button onClick={handleBack} className="p-2 hover:bg-muted rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-muted-foreground" />
              </button>
              
              {/* Editable title - full width, no truncation */}
              {isEditingTitle ? <div className="flex items-center gap-1">
                  <Input value={editTitleValue} onChange={e => setEditTitleValue(e.target.value)} className="h-7 text-sm font-medium w-60" autoFocus onKeyDown={e => {
              if (e.key === "Enter") {
                if (editTitleValue.trim()) {
                  handleTitleChange(editTitleValue.trim());
                }
                setIsEditingTitle(false);
              }
              if (e.key === "Escape") {
                setIsEditingTitle(false);
              }
            }} />
                  <button onClick={() => {
              if (editTitleValue.trim()) {
                handleTitleChange(editTitleValue.trim());
              }
              setIsEditingTitle(false);
            }} className="p-1 hover:bg-green-100 rounded transition-colors">
                    <Check className="w-4 h-4 text-green-600" />
                  </button>
                  <button onClick={() => setIsEditingTitle(false)} className="p-1 hover:bg-red-100 rounded transition-colors">
                    <X className="w-4 h-4 text-red-500" />
                  </button>
                </div> : <div className="flex items-center gap-1 group">
                  <h2 className="text-base font-medium text-foreground">
                    {chatTitle}
                  </h2>
                  <button onClick={() => {
              setEditTitleValue(chatTitle);
              setIsEditingTitle(true);
            }} className="p-1 opacity-0 group-hover:opacity-100 hover:bg-muted rounded transition-all">
                    <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                </div>}
            </div>}
          
          {/* Spacer to push right items */}
          <div className="flex-1" />
          
          <HeaderNav isChatMode={isChatMode} currentChatId={currentChatId} chatHistory={chatHistory} onShare={handleShareChat} onPin={handlePin} onDelete={handleDelete} />
          <UpcomingSchedule isExpanded={scheduleExpanded} onToggle={() => setScheduleExpanded(!scheduleExpanded)} onGetHelp={prompt => {
          setPrefillMessage(prompt);
          setScheduleExpanded(false);
        }} />
          {/* User Profile */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium text-primary">
              {userSettings?.assistantName?.[0] || "문"}
            </div>
            <span className="text-sm font-medium text-foreground hidden sm:block">
              {userSettings?.assistantName || "문수빈"}
            </span>
          </div>
        </div>
      </div>
      
      {/* Main Area - Sidebar + Content */}
      <div className="flex flex-1">
        {/* Sidebar Body (without header) */}
        <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(false)} chatHistory={chatHistory} currentChatId={currentChatId} onSelectChat={handleSelectChat} onNewChat={handleNewChat} onRenameChat={handleRenameChat} onShareChat={handleShareChat} onPinChat={handlePin} onArchiveChat={handleArchive} onDeleteChat={handleDelete} hideHeader onOpenSettings={() => setShowSetupModal(true)} />
        
        {/* Sidebar Trigger when closed */}
        {!sidebarOpen && <SidebarTrigger onClick={() => setSidebarOpen(true)} />}

        {/* Main Content */}
        <main className="flex-1 bg-background">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 w-full">
          {isChatMode ? <ChatView messages={messages} onSendMessage={handleSendMessage} isLoading={isLoading} onRegenerate={handleRegenerate} /> : <>
              {/* Header with Welcome & Quick Actions */}
              <div className="mb-4">
                <WelcomeHeader userName="현민" onSelectAction={template => setPrefillMessage(template)} />
              </div>
              
              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
                <div className="lg:col-span-3">
                  <RecentInterests hasHistory={chatHistory.length > 0} onQuestionClick={question => {
                  setPrefillMessage(question);
                }} />
                </div>
                <div className="lg:col-span-2">
                  <HRHelper />
                </div>
              </div>
              
              {/* Favorite Chatbots */}
              <div className="mb-6">
                <FavoriteChatbots hasHistory={chatHistory.length > 0} onSelectChatbot={chatbot => {
                setPrefillMessage(`${chatbot.name}에게 질문하기: `);
              }} />
              </div>
              
              {/* Chat Input - Bottom */}
              <ChatInput onSendMessage={msg => {
              handleSendMessage(msg);
              setPrefillMessage("");
            }} initialMessage={prefillMessage} onMessageChange={() => setPrefillMessage("")} />
            </>}
          </div>
        </main>
      </div>
    </div>
  </>;
};
export default Index;