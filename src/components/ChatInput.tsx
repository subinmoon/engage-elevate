import { useState } from "react";
import { Plus, Globe, ChevronDown, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

const ChatInput = () => {
  const [message, setMessage] = useState("");

  return (
    <div className="bg-card rounded-3xl shadow-card border border-border/50 overflow-hidden">
      <div className="p-5 pb-3">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="무엇이든 물어보세요..."
          className="w-full bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-lg font-medium"
        />
      </div>
      <div className="flex items-center justify-between px-5 pb-5 pt-2 border-t border-border/30">
        <div className="flex items-center gap-1 flex-wrap">
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full h-10 w-10 p-0 hover:bg-muted"
          >
            <Plus className="w-5 h-5 text-muted-foreground" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full gap-2 hover:bg-muted text-muted-foreground h-10 px-4"
          >
            <Globe className="w-4 h-4" />
            <span className="hidden sm:inline">Web Search</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full gap-2 hover:bg-muted text-muted-foreground h-10 px-4"
          >
            <span className="text-sm">🌐</span>
            <span className="hidden md:inline">Azure gpt 4o-2024-11-20</span>
            <span className="md:hidden">GPT-4o</span>
            <ChevronDown className="w-3 h-3" />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="rounded-full gap-1 bg-foreground text-background hover:bg-foreground/90 h-10 px-4 font-medium"
          >
            <span className="hidden sm:inline">답변 유형 선택</span>
            <span className="sm:hidden">답변 유형</span>
            <span className="text-background/70">(간결, 상세, 기본)</span>
          </Button>
        </div>
        <Button
          size="icon"
          className={`rounded-full h-12 w-12 transition-all duration-300 ${
            message.trim() 
              ? "bg-primary hover:bg-lavender-dark text-primary-foreground shadow-card" 
              : "bg-muted text-muted-foreground"
          }`}
          disabled={!message.trim()}
        >
          <Send className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;
