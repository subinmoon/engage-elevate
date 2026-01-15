import { useState } from "react";
import { 
  MessageSquarePlus, 
  Search, 
  Sparkles, 
  FolderArchive, 
  History,
  ChevronDown,
  ChevronRight,
  PanelLeftClose,
  MoreHorizontal,
  Pencil,
  Share2,
  Pin,
  Trash2,
  Link,
  FileText,
  Building2,
  Users
} from "lucide-react";
import logoIcon from "@/assets/logo-icon.png";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import type { ChatSession } from "@/pages/Index";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  chatHistory?: ChatSession[];
  currentChatId?: string | null;
  onSelectChat?: (chatId: string) => void;
  onNewChat?: () => void;
  onRenameChat?: (chatId: string, newTitle: string) => void;
  onShareChat?: (chatId: string) => void;
  onPinChat?: (chatId: string) => void;
  onArchiveChat?: (chatId: string) => void;
  onDeleteChat?: (chatId: string) => void;
}

const defaultChatHistory = [
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

const Sidebar = ({ 
  isOpen, 
  onToggle, 
  chatHistory = [], 
  currentChatId,
  onSelectChat,
  onNewChat,
  onRenameChat,
  onShareChat,
  onPinChat,
  onArchiveChat,
  onDeleteChat
}: SidebarProps) => {
  const [historyOpen, setHistoryOpen] = useState(true);
  const [chatbotOpen, setChatbotOpen] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const displayHistory = chatHistory.length > 0 
    ? chatHistory.filter(c => !c.archived)
    : defaultChatHistory.map((title, i) => ({ id: `default-${i}`, title, messages: [], createdAt: new Date(), pinned: false, archived: false }));

  // Sort: pinned first
  const sortedHistory = [...displayHistory].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return 0;
  });

  const handleStartEdit = (id: string, title: string) => {
    setEditingId(id);
    setEditTitle(title);
  };

  const handleSaveEdit = (id: string) => {
    if (editTitle.trim()) {
      onRenameChat?.(id, editTitle.trim());
      toast.success("대화 이름이 변경되었습니다");
    }
    setEditingId(null);
  };

  const handleShare = (id: string) => {
    onShareChat?.(id);
    toast.success("대화가 공유되었습니다");
  };

  const handlePin = (id: string) => {
    onPinChat?.(id);
    toast.success("채팅 고정 상태가 변경되었습니다");
  };

  const handleArchive = (id: string) => {
    onArchiveChat?.(id);
    toast.success("대화가 아카이브에 저장되었습니다");
  };

  const handleDelete = (id: string) => {
    onDeleteChat?.(id);
    toast.success("대화가 삭제되었습니다");
  };

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

        {/* 바로가기 */}
        <div className="p-3 border-b border-border">
          <div className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground">
            <Link className="w-4 h-4" />
            바로가기
          </div>
          <div className="grid grid-cols-3 gap-2 mt-1">
            <a 
              href="#" 
              className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <FileText className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-xs text-muted-foreground">그룹웨어</span>
            </a>
            <a 
              href="#" 
              className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                <Building2 className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-xs text-muted-foreground">ERP</span>
            </a>
            <a 
              href="#" 
              className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                <Users className="w-4 h-4 text-purple-600" />
              </div>
              <span className="text-xs text-muted-foreground">HR</span>
            </a>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-3 flex-1 overflow-y-auto">
          {/* New Chat */}
          <button 
            onClick={onNewChat}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted rounded-xl transition-colors"
          >
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
                {sortedHistory.map((item) => (
                  <div key={item.id} className="group flex items-center gap-1">
                    {editingId === item.id ? (
                      <Input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onBlur={() => handleSaveEdit(item.id)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSaveEdit(item.id);
                          if (e.key === "Escape") setEditingId(null);
                        }}
                        className="h-7 text-sm flex-1"
                        autoFocus
                      />
                    ) : (
                      <>
                        <button 
                          onClick={() => onSelectChat?.(item.id)}
                          className={cn(
                            "flex-1 text-left px-3 py-2 text-sm hover:bg-muted rounded-lg transition-colors truncate flex items-center gap-1.5",
                            currentChatId === item.id 
                              ? "bg-primary/10 text-primary font-medium" 
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          {item.pinned && <Pin className="w-3 h-3 text-primary shrink-0" />}
                          <span className="truncate">{item.title}</span>
                        </button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="p-1 opacity-0 group-hover:opacity-100 hover:bg-muted rounded transition-all">
                              <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem onClick={() => handleStartEdit(item.id, item.title)}>
                              <Pencil className="w-4 h-4 mr-2" />
                              이름변경
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleShare(item.id)}>
                              <Share2 className="w-4 h-4 mr-2" />
                              공유
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handlePin(item.id)}>
                              <Pin className="w-4 h-4 mr-2" />
                              {item.pinned ? "고정 해제" : "채팅 고정"}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleArchive(item.id)}>
                              <FolderArchive className="w-4 h-4 mr-2" />
                              아카이브 저장
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDelete(item.id)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              삭제
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </>
                    )}
                  </div>
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
