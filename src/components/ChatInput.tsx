import { useState } from "react";
import { Plus, Globe, ChevronDown, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

const responseTypes = [
  { id: "concise", label: "간결" },
  { id: "detailed", label: "상세" },
  { id: "default", label: "기본" },
];

const ChatInput = () => {
  const [message, setMessage] = useState("");
  const [selectedType, setSelectedType] = useState("default");

  return (
    <div className="bg-card rounded-2xl shadow-soft border border-border">
      <div className="p-4 pb-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="무엇이든 물어보세요..."
          className="w-full bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-base"
        />
      </div>
      <div className="flex items-center justify-between px-4 pb-4 pt-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full h-8 w-8 p-0 hover:bg-muted"
          >
            <Plus className="w-4 h-4 text-muted-foreground" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full gap-1.5 hover:bg-muted text-muted-foreground h-8 px-3 text-xs"
          >
            <Globe className="w-3.5 h-3.5" />
            Web Search
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full gap-1.5 hover:bg-muted text-muted-foreground h-8 px-3 text-xs"
          >
            <span className="text-xs">🌐</span>
            Azure gpt 4o-2024-11-20
            <ChevronDown className="w-3 h-3" />
          </Button>
          
          {/* Response Type Buttons */}
          <div className="flex items-center bg-muted rounded-full p-0.5">
            {responseTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`px-3 h-7 rounded-full text-xs font-medium transition-all duration-200 ${
                  selectedType === type.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>
        <Button
          size="icon"
          className={`rounded-full h-10 w-10 transition-colors ${
            message.trim() 
              ? "bg-primary hover:bg-lavender-dark text-primary-foreground" 
              : "bg-muted text-muted-foreground"
          }`}
          disabled={!message.trim()}
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;
