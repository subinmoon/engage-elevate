import { useState } from "react";
import { 
  MessageSquarePlus, 
  Search, 
  Sparkles, 
  FolderArchive, 
  History,
  ChevronDown,
  ChevronRight,
  PanelLeftClose
} from "lucide-react";
import logoIcon from "@/assets/logo-icon.png";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const chatHistory = [
  "인사 관련 요청",
  "AI UI 만족도 질문",
  "GD 의미 또는 정의",
  "복지카드 발급 비용",
  "회사 뽀잉뽀잉 1인자",
  "기분 안좋을 때 그림",
  "되는게 하나도 없네",
  "보고서 초안 작성",
  "가능한 능력 목록",
];

const Sidebar = ({ isOpen, onToggle }: SidebarProps) => {
  const [historyOpen, setHistoryOpen] = useState(true);
  const [chatbotOpen, setChatbotOpen] = useState(true);

  return (
    <aside 
      className={`${
        isOpen ? "w-64" : "w-0"
      } bg-card border-r border-border flex flex-col transition-all duration-300 overflow-hidden shrink-0`}
    >
      <div className="min-w-64 flex flex-col h-full">
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-border">
          <div className="flex items-center gap-2">
            <img src={logoIcon} alt="Logo" className="w-8 h-8" />
            <span className="font-bold text-foreground">pear link</span>
          </div>
          <button 
            onClick={onToggle}
            className="p-1.5 hover:bg-muted rounded-lg transition-colors"
          >
            <PanelLeftClose className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-3 flex-1 overflow-y-auto">
          {/* New Chat */}
          <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted rounded-xl transition-colors">
            <MessageSquarePlus className="w-4 h-4" />
            새 채팅
          </button>

          {/* Search */}
          <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted rounded-xl transition-colors">
            <Search className="w-4 h-4" />
            채팅 검색
          </button>

          {/* Chat History - Moved up */}
          <div className="mt-4">
            <button 
              onClick={() => setHistoryOpen(!historyOpen)}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted rounded-xl transition-colors"
            >
              <History className="w-4 h-4" />
              채팅 히스토리
              {historyOpen ? <ChevronDown className="w-3 h-3 ml-auto" /> : <ChevronRight className="w-3 h-3 ml-auto" />}
            </button>
            {historyOpen && (
              <div className="ml-4 mt-1 space-y-0.5 max-h-48 overflow-y-auto">
                {chatHistory.map((item, index) => (
                  <button 
                    key={index}
                    className="w-full text-left px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors truncate"
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Archive - After history */}
          <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted rounded-xl transition-colors mt-2">
            <FolderArchive className="w-4 h-4" />
            채팅 아카이브
          </button>

          {/* Chatbot Services - Moved to bottom */}
          <div className="mt-4">
            <button 
              onClick={() => setChatbotOpen(!chatbotOpen)}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted rounded-xl transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              챗봇 서비스
              {chatbotOpen ? <ChevronDown className="w-3 h-3 ml-auto" /> : <ChevronRight className="w-3 h-3 ml-auto" />}
            </button>
            {chatbotOpen && (
              <div className="ml-4 mt-1 space-y-0.5">
                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors">
                  <span className="text-primary">📊</span>
                  이수시스템 사규 챗봇
                </button>
                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors">
                  챗봇 서비스 관리
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium text-primary">
              문
            </div>
            <span className="text-sm font-medium text-foreground">문수빈</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
