import { useState, useMemo } from "react";
import { ArrowLeft, Pencil, Check, X, FolderArchive, Share2, Pin, Trash2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatViewProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  onBack: () => void;
  isLoading?: boolean;
  title: string;
  onTitleChange: (title: string) => void;
  onRegenerate?: () => void;
  onArchive?: () => void;
  onPin?: () => void;
  onDelete?: () => void;
  isPinned?: boolean;
}

const suggestionsMap: Record<string, string[]> = {
  default: [
    "더 자세히 설명해줘",
    "예시를 들어줄 수 있어?",
    "다른 방법은 없을까?",
    "요약해줘",
  ],
  복지: [
    "신청 절차가 어떻게 돼?",
    "필요한 서류는 뭐야?",
    "담당 부서 연락처 알려줘",
  ],
  출장: [
    "출장비 정산은 어떻게 해?",
    "숙박비 한도가 얼마야?",
    "출장 승인 절차 알려줘",
  ],
  회의: [
    "회의록 양식 보여줘",
    "참석자 목록 정리해줘",
    "다음 회의 일정 잡아줘",
  ],
};

const ChatView = ({ messages, onSendMessage, onBack, isLoading, title, onTitleChange, onRegenerate, onArchive, onPin, onDelete, isPinned }: ChatViewProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);

  const handleSaveTitle = () => {
    if (editTitle.trim()) {
      onTitleChange(editTitle.trim());
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditTitle(title);
    setIsEditing(false);
  };

  const handleArchive = () => {
    onArchive?.();
    toast.success("대화가 아카이브에 저장되었습니다");
  };

  const handlePin = () => {
    onPin?.();
    toast.success(isPinned ? "채팅 고정이 해제되었습니다" : "채팅이 고정되었습니다");
  };

  const handleDelete = () => {
    onDelete?.();
    toast.success("대화가 삭제되었습니다");
  };

  const handleShare = async () => {
    // Create shareable text
    const chatText = messages.map(m => 
      `[${m.role === "user" ? "나" : "AI"}] ${m.content}`
    ).join("\n\n");
    
    // Try native share first, fallback to clipboard
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: chatText,
        });
        toast.success("공유되었습니다");
      } catch (e) {
        // User cancelled or error
        if ((e as Error).name !== "AbortError") {
          await navigator.clipboard.writeText(chatText);
          toast.success("대화 내용이 클립보드에 복사되었습니다");
        }
      }
    } else {
      await navigator.clipboard.writeText(chatText);
      toast.success("대화 내용이 클립보드에 복사되었습니다");
    }
  };

  // Find the last assistant message index
  const lastAssistantIndex = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === "assistant") return i;
    }
    return -1;
  }, [messages]);
  const suggestions = useMemo(() => {
    if (messages.length === 0) return suggestionsMap.default;
    
    const lastContent = messages[messages.length - 1]?.content.toLowerCase() || "";
    
    if (lastContent.includes("복지") || lastContent.includes("카드")) {
      return suggestionsMap.복지;
    }
    if (lastContent.includes("출장")) {
      return suggestionsMap.출장;
    }
    if (lastContent.includes("회의")) {
      return suggestionsMap.회의;
    }
    
    return suggestionsMap.default;
  }, [messages]);

  return (
    <div className="flex flex-col h-full min-h-[calc(100vh-48px)]">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="rounded-full hover:bg-muted"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        
        {isEditing ? (
          <div className="flex items-center gap-2 flex-1">
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="h-8 text-lg font-semibold max-w-xs"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveTitle();
                if (e.key === "Escape") handleCancelEdit();
              }}
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-full hover:bg-green-100"
              onClick={handleSaveTitle}
            >
              <Check className="w-4 h-4 text-green-600" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-full hover:bg-red-100"
              onClick={handleCancelEdit}
            >
              <X className="w-4 h-4 text-red-600" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2 group">
            <h2 className="text-lg font-semibold text-foreground">{title}</h2>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted"
              onClick={() => setIsEditing(true)}
            >
              <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
            </Button>
          </div>
        )}
        
        {/* Actions dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto rounded-full text-muted-foreground hover:text-foreground"
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-2" />
              공유
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handlePin}>
              <Pin className="w-4 h-4 mr-2" />
              {isPinned ? "고정 해제" : "채팅 고정"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleArchive}>
              <FolderArchive className="w-4 h-4 mr-2" />
              아카이브 저장
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={handleDelete}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              삭제
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto pb-4 space-y-2">
        {messages.map((message, index) => (
          <ChatMessage
            key={message.id}
            role={message.role}
            content={message.content}
            timestamp={message.timestamp}
            isLastAssistant={index === lastAssistantIndex}
            onRegenerate={onRegenerate}
          />
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <div className="w-5 h-5 rounded-full bg-primary/40 animate-pulse" />
            </div>
            <div className="bg-muted rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Suggestions */}
      {!isLoading && messages.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-4">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => onSendMessage(suggestion)}
              className="px-3 py-1.5 text-sm bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary rounded-full transition-colors border border-border hover:border-primary/30"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="mt-auto pt-4">
        <ChatInput onSendMessage={onSendMessage} disabled={isLoading} />
      </div>
    </div>
  );
};

export default ChatView;
