import { useState, useEffect, useRef } from "react";
import { ChevronDown, Send, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const searchModeOptions = [
  { id: "general", label: "일반", emoji: "🌐" },
  { id: "web", label: "웹 검색", emoji: "🔍" },
  { id: "internal", label: "사내 규칙", emoji: "🏢" },
];

const toneOptions = [
  { id: "professional", label: "전문적인", emoji: "👔" },
  { id: "warm", label: "따뜻한", emoji: "🤗" },
  { id: "friendly", label: "친근한", emoji: "😊" },
];

const lengthOptions = [
  { id: "concise", label: "간결" },
  { id: "default", label: "보통" },
  { id: "detailed", label: "자세히" },
];

interface ChatInputProps {
  onSendMessage?: (message: string) => void;
  disabled?: boolean;
  initialMessage?: string;
  onMessageChange?: (message: string) => void;
  toneStyle?: string;
  answerLength?: string;
  onToneChange?: (tone: string) => void;
  onLengthChange?: (length: string) => void;
  userName?: string;
  searchMode?: string;
  onSearchModeChange?: (mode: string) => void;
}

const ChatInput = ({ 
  onSendMessage, 
  disabled, 
  initialMessage, 
  onMessageChange,
  toneStyle = "warm",
  answerLength = "default",
  onToneChange,
  onLengthChange,
  userName,
  searchMode = "general",
  onSearchModeChange,
}: ChatInputProps) => {
  const [message, setMessage] = useState(initialMessage || "");
  const [selectedTone, setSelectedTone] = useState(toneStyle);
  const [selectedLength, setSelectedLength] = useState(answerLength);
  const [selectedSearchMode, setSelectedSearchMode] = useState(searchMode);

  // Sync with props when they change
  useEffect(() => {
    setSelectedTone(toneStyle);
  }, [toneStyle]);

  useEffect(() => {
    setSelectedLength(answerLength);
  }, [answerLength]);

  useEffect(() => {
    setSelectedSearchMode(searchMode);
  }, [searchMode]);

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

  const handleToneSelect = (tone: string) => {
    setSelectedTone(tone);
    onToneChange?.(tone);
  };

  const handleLengthSelect = (length: string) => {
    setSelectedLength(length);
    onLengthChange?.(length);
  };

  const handleSearchModeSelect = (mode: string) => {
    setSelectedSearchMode(mode);
    onSearchModeChange?.(mode);
  };

  const currentTone = toneOptions.find(t => t.id === selectedTone);
  const currentSearchMode = searchModeOptions.find(m => m.id === selectedSearchMode);
  const placeholderText = userName 
    ? `${userName}님, 무엇이든 물어보세요...` 
    : "무엇이든 물어보세요...";

  return (
    <div className="chat-input-gradient bg-background shadow-lg">
      <div className="p-4 pb-2">
        <textarea
          value={message}
          onChange={(e) => handleMessageChange(e.target.value)}
          placeholder={placeholderText}
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
          {/* Search Mode Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full gap-1.5 hover:bg-muted text-muted-foreground h-8 px-3 text-xs border border-border"
              >
                <span>{currentSearchMode?.emoji}</span>
                <span>{currentSearchMode?.label}</span>
                <ChevronDown className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="bg-background border shadow-lg z-50">
              {searchModeOptions.map((mode) => (
                <DropdownMenuItem 
                  key={mode.id}
                  onClick={() => handleSearchModeSelect(mode.id)}
                  className={`flex items-center gap-2 cursor-pointer ${selectedSearchMode === mode.id ? 'bg-primary/10 text-primary' : ''}`}
                >
                  <span>{mode.emoji}</span>
                  <span>{mode.label}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full gap-1.5 hover:bg-muted text-muted-foreground h-8 px-3 text-xs border border-border"
          >
            <Paperclip className="w-4 h-4" />
            <span>파일첨부</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full gap-1.5 hover:bg-muted text-muted-foreground h-8 px-3 text-xs border border-border"
          >
            <span className="text-xs">🌐</span>
            Azure gpt 4o-2024-11-20
            <ChevronDown className="w-3 h-3" />
          </Button>
          
          {/* Tone Style Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full gap-1.5 hover:bg-muted text-muted-foreground h-8 px-3 text-xs border border-border"
              >
                <span>{currentTone?.emoji}</span>
                <span className="hidden sm:inline">{currentTone?.label}</span>
                <ChevronDown className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="bg-background border shadow-lg z-50">
              {toneOptions.map((tone) => (
                <DropdownMenuItem 
                  key={tone.id}
                  onClick={() => handleToneSelect(tone.id)}
                  className={`flex items-center gap-2 cursor-pointer ${selectedTone === tone.id ? 'bg-primary/10 text-primary' : ''}`}
                >
                  <span>{tone.emoji}</span>
                  <span>{tone.label}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Answer Length Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full gap-1.5 hover:bg-muted text-muted-foreground h-8 px-3 text-xs border border-border"
              >
                <span>📏</span>
                <span className="hidden sm:inline">{lengthOptions.find(l => l.id === selectedLength)?.label}</span>
                <ChevronDown className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="bg-background border shadow-lg z-50">
              {lengthOptions.map((option) => (
                <DropdownMenuItem 
                  key={option.id}
                  onClick={() => handleLengthSelect(option.id)}
                  className={`flex items-center gap-2 cursor-pointer ${selectedLength === option.id ? 'bg-primary/10 text-primary' : ''}`}
                >
                  <span>{option.label}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
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
