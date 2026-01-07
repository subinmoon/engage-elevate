import { useState } from "react";
import { Plus, Globe, ChevronDown, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

const ChatInput = () => {
  const [message, setMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`relative overflow-hidden bg-gradient-glass backdrop-blur-md rounded-3xl shadow-card border transition-all duration-500 ${isFocused ? 'border-primary/30 shadow-glow' : 'border-white/60'}`}>
      {/* Animated gradient border on focus */}
      <div className={`absolute inset-0 bg-gradient-hero rounded-3xl opacity-0 transition-opacity duration-500 ${isFocused ? 'opacity-10' : ''}`} />
      
      <div className="relative p-5 pb-3">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="무엇이든 물어보세요..."
          className="w-full bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-base font-medium"
        />
      </div>
      <div className="relative flex items-center justify-between px-5 pb-4 pt-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full h-9 w-9 p-0 hover:bg-lavender-light/50 transition-all duration-300 hover:scale-105"
          >
            <Plus className="w-4 h-4 text-muted-foreground" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full gap-1.5 hover:bg-lavender-light/50 text-muted-foreground h-9 px-3 text-xs transition-all duration-300"
          >
            <Globe className="w-3.5 h-3.5" />
            Web Search
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full gap-1.5 hover:bg-lavender-light/50 text-muted-foreground h-9 px-3 text-xs transition-all duration-300"
          >
            <span className="text-xs">🌐</span>
            Azure gpt 4o
            <ChevronDown className="w-3 h-3" />
          </Button>
          <Button
            size="sm"
            className="rounded-full bg-foreground/90 backdrop-blur text-background hover:bg-foreground h-9 px-4 text-xs font-medium shadow-soft transition-all duration-300 hover:shadow-card"
          >
            답변 유형 (간결, 상세, 기본)
          </Button>
        </div>
        <Button
          size="icon"
          className={`rounded-full h-11 w-11 transition-all duration-500 ${
            message.trim() 
              ? "bg-gradient-hero hover:opacity-90 text-white shadow-glow scale-100" 
              : "bg-muted/50 text-muted-foreground scale-95"
          }`}
          disabled={!message.trim()}
        >
          <Send className={`w-4 h-4 transition-transform duration-300 ${message.trim() ? 'translate-x-0.5' : ''}`} />
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;
