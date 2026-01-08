import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
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
}

const ChatView = ({ messages, onSendMessage, onBack, isLoading }: ChatViewProps) => {
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
        <h2 className="text-lg font-semibold text-foreground">AI 대화</h2>
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
                <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
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
