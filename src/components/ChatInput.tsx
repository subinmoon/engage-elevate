import { useState } from "react";
import { Plus, Globe, ChevronDown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const ChatInput = () => {
  const [message, setMessage] = useState("");
  const [responseType, setResponseType] = useState("기본");

  return (
    <div className="bg-card rounded-2xl shadow-soft p-4">
      <div className="mb-3">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="무엇이든 물어보세요..."
          className="w-full bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-base"
        />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full h-9 w-9 p-0 hover:bg-muted"
          >
            <Plus className="w-5 h-5 text-muted-foreground" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full gap-2 hover:bg-muted text-muted-foreground"
          >
            <Globe className="w-4 h-4" />
            Web Search
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full gap-2 hover:bg-muted text-muted-foreground"
          >
            <span className="text-xs">🌐</span>
            Azure gpt 4o-2024-11-20
            <ChevronDown className="w-3 h-3" />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="rounded-full gap-1 bg-foreground text-background hover:bg-foreground/90"
          >
            답변 유형 선택 (간결, 상세, {responseType})
          </Button>
        </div>
        <Button
          size="sm"
          className="rounded-full h-10 w-10 p-0 bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
          disabled={!message.trim()}
        >
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;
