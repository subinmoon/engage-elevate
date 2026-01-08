import { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import logoIcon from "@/assets/logo-icon.png";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const ChatMessage = ({ role, content, timestamp }: ChatMessageProps) => {
  const isUser = role === "user";
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<"like" | "dislike" | null>(null);

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
