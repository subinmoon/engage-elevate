import { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, ThumbsUp, ThumbsDown, MessageSquare, RotateCcw, ExternalLink, FileText, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import logoIcon from "@/assets/logo-icon.png";

export interface Source {
  title: string;
  url: string;
  description?: string;
}

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  onRegenerate?: () => void;
  isLastAssistant?: boolean;
  sources?: Source[];
}

const ChatMessage = ({ role, content, timestamp, onRegenerate, isLastAssistant, sources }: ChatMessageProps) => {
  const isUser = role === "user";
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<"like" | "dislike" | null>(null);
  const [showAllSources, setShowAllSources] = useState(false);

  const visibleSources = sources && sources.length > 0 
    ? (showAllSources ? sources : sources.slice(0, 3)) 
    : [];

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success("텍스트가 복사되었습니다");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFeedback = (type: "like" | "dislike") => {
    setFeedback(type);
    toast.success(type === "like" ? "긍정적 피드백 감사합니다!" : "피드백이 반영되었습니다");
  };

  const handleDetailedFeedback = () => {
    toast.info("피드백 전달 기능이 준비 중입니다");
  };

  const formattedTime = format(timestamp, "a h:mm", { locale: ko });

  return (
    <div className={cn("flex gap-3 mb-4 group", isUser && "justify-end")}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
          <img src={logoIcon} alt="AI" className="w-5 h-5" />
        </div>
      )}
      <div className="flex flex-col">
        <div className={cn("flex items-end gap-2", isUser && "flex-row-reverse")}>
          <div
            className={cn(
              "max-w-[80%] rounded-2xl px-4 py-3",
              isUser
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-foreground"
            )}
          >
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
            
            {/* Sources section */}
            {!isUser && sources && sources.length > 0 && (
              <div className="mt-3 pt-3 border-t border-border/50">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                  <FileText className="w-3 h-3" />
                  <span className="font-medium">출처 ({sources.length})</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {visibleSources.map((source, index) => (
                    <a
                      key={index}
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/source flex items-center gap-1.5 px-2.5 py-1.5 bg-background/80 hover:bg-background border border-border/50 rounded-lg text-xs transition-all hover:shadow-sm hover:border-primary/30"
                      title={source.description || source.title}
                    >
                      <span className="w-4 h-4 rounded bg-primary/10 text-primary flex items-center justify-center text-[10px] font-medium">
                        {index + 1}
                      </span>
                      <span className="max-w-[120px] truncate text-foreground/80 group-hover/source:text-foreground">
                        {source.title}
                      </span>
                      <ExternalLink className="w-3 h-3 text-muted-foreground group-hover/source:text-primary transition-colors" />
                    </a>
                  ))}
                </div>
                {sources.length > 3 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
                    onClick={() => setShowAllSources(!showAllSources)}
                  >
                    {showAllSources ? (
                      <>
                        <ChevronUp className="w-3 h-3 mr-1" />
                        접기
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-3 h-3 mr-1" />
                        {sources.length - 3}개 더 보기
                      </>
                    )}
                  </Button>
                )}
              </div>
            )}
          </div>
          <span className="text-[10px] text-muted-foreground mb-1 flex-shrink-0">
            {formattedTime}
          </span>
        </div>
        
        {/* Actions for all messages */}
        <div className={cn(
          "flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity",
          isUser ? "justify-end" : "justify-start"
        )}>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-full hover:bg-muted"
            onClick={handleCopy}
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-green-500" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-muted-foreground" />
            )}
          </Button>
          
          {/* Feedback buttons only for assistant */}
          {!isUser && (
            <>
              {isLastAssistant && onRegenerate && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-full hover:bg-muted"
                  onClick={onRegenerate}
                  title="답변 재생성"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-muted-foreground" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-7 w-7 rounded-full hover:bg-muted",
                  feedback === "like" && "bg-green-100 text-green-600"
                )}
                onClick={() => handleFeedback("like")}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-7 w-7 rounded-full hover:bg-muted",
                  feedback === "dislike" && "bg-red-100 text-red-600"
                )}
                onClick={() => handleFeedback("dislike")}
              >
                <ThumbsDown className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-full hover:bg-muted"
                onClick={handleDetailedFeedback}
              >
                <MessageSquare className="w-3.5 h-3.5 text-muted-foreground" />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
