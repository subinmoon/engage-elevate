import { useState } from "react";
import { ArrowLeft, Pencil, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatViewProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  onBack: () => void;
  isLoading?: boolean;
  title: string;
  onTitleChange: (title: string) => void;
}

const ChatView = ({ messages, onSendMessage, onBack, isLoading, title, onTitleChange }: ChatViewProps) => {
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
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto pb-4 space-y-2">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            role={message.role}
            content={message.content}
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

      {/* Input */}
      <div className="mt-auto pt-4">
        <ChatInput onSendMessage={onSendMessage} disabled={isLoading} />
      </div>
    </div>
  );
};

export default ChatView;
