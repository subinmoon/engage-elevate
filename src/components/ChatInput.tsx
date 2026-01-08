import { useState, useEffect } from "react";
import { Plus, Globe, ChevronDown, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

const responseTypes = [
  { id: "concise", label: "간결" },
  { id: "detailed", label: "상세" },
  { id: "default", label: "기본" },
];

interface ChatInputProps {
  onSendMessage?: (message: string) => void;
  disabled?: boolean;
  initialMessage?: string;
  onMessageChange?: (message: string) => void;
}

const ChatInput = ({ onSendMessage, disabled, initialMessage, onMessageChange }: ChatInputProps) => {
  const [message, setMessage] = useState(initialMessage || "");
  const [selectedType, setSelectedType] = useState("default");

  // Sync with initialMessage when it changes externally
  useEffect(() => {
    if (initialMessage) {
      setMessage(initialMessage);
    }
  }, [initialMessage]);

  const handleMessageChange = (value: string) => {
    setMessage(value);
    onMessageChange?.(value);
  };

  return (
    <div className="bg-primary/10 rounded-3xl shadow-soft border-2 border-primary/30">
      <div className="p-4 pb-2">
        <textarea
          value={message}
          onChange={(e) => handleMessageChange(e.target.value)}
          placeholder="무엇이든 물어보세요..."
          className="w-full bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-base resize-none min-h-[24px] max-h-[200px]"
          rows={message.split('\n').length > 5 ? 5 : message.split('\n').length || 1}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              if (message.trim() && onSendMessage) {
                onSendMessage(message.trim());
                setMessage("");
              }
            }
          }}
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
            message.trim() && !disabled
              ? "bg-primary hover:bg-lavender-dark text-primary-foreground" 
              : "bg-muted text-muted-foreground"
          }`}
          disabled={!message.trim() || disabled}
          onClick={() => {
            if (message.trim() && onSendMessage) {
              onSendMessage(message.trim());
              setMessage("");
            }
          }}
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;
