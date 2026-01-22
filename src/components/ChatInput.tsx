import { useState, useEffect, useRef } from "react";
import { Plus, Globe, ChevronDown, Send, Paperclip, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
      <div className="p-3 sm:p-4 pb-2">
        <textarea
          value={message}
          onChange={(e) => handleMessageChange(e.target.value)}
          placeholder="무엇이든 물어보세요..."
          className="w-full bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-sm sm:text-base resize-none min-h-[24px] max-h-[150px] sm:max-h-[200px]"
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
      <div className="flex items-center justify-between px-2 sm:px-4 pb-3 sm:pb-4 pt-2 gap-2">
        <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap flex-1 min-w-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full h-8 w-8 p-0 hover:bg-muted flex-shrink-0"
              >
                <Plus className="w-4 h-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="bg-background border shadow-lg z-50">
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                <Globe className="w-4 h-4" />
                <span>Web Search</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                <FileText className="w-4 h-4" />
                <span>사규</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full h-8 w-8 p-0 hover:bg-muted flex-shrink-0"
          >
            <Paperclip className="w-4 h-4 text-muted-foreground" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full gap-1 sm:gap-1.5 hover:bg-muted text-muted-foreground h-8 px-2 sm:px-3 text-xs flex-shrink-0 hidden sm:flex"
          >
            <span className="text-xs">🌐</span>
            <span className="hidden md:inline">Azure gpt 4o-2024-11-20</span>
            <span className="md:hidden">GPT-4o</span>
            <ChevronDown className="w-3 h-3" />
          </Button>
          
          {/* Response Type Buttons - Hidden on very small screens */}
          <div className="hidden xs:flex items-center bg-muted rounded-full p-0.5">
            {responseTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`px-2 sm:px-3 h-6 sm:h-7 rounded-full text-xs font-medium transition-all duration-200 ${
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
          className={`rounded-full h-9 w-9 sm:h-10 sm:w-10 transition-colors flex-shrink-0 ${
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
