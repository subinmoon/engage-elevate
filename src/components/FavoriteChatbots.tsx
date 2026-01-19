import { Bot, Star, ArrowRight } from "lucide-react";
import { chatbotServices, ChatbotService } from "@/data/chatbotServices";

interface FavoriteChatbotsProps {
  onSelectChatbot?: (chatbot: ChatbotService) => void;
}

const FavoriteChatbots = ({ onSelectChatbot }: FavoriteChatbotsProps) => {
  const favoriteChatbots = chatbotServices.filter(c => c.isFavorite);

  if (favoriteChatbots.length === 0) return null;

  return (
    <div className="bg-card rounded-2xl p-5 shadow-soft">
      <div className="flex items-center gap-2 mb-4">
        <Bot className="w-5 h-5 text-primary" />
        <h2 className="text-base font-semibold text-foreground">즐겨찾는 챗봇</h2>
        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {favoriteChatbots.map((chatbot) => (
          <button
            key={chatbot.id}
            onClick={() => onSelectChatbot?.(chatbot)}
            className="group flex items-start gap-3 p-3 bg-muted/40 hover:bg-primary/10 rounded-xl transition-all text-left border border-transparent hover:border-primary/20"
          >
            <span className="text-xl shrink-0">{chatbot.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <span className="font-medium text-sm text-foreground truncate">
                  {chatbot.name}
                </span>
                <ArrowRight className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                {chatbot.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FavoriteChatbots;
