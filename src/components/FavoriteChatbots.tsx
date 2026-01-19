import { Bot, Star, ArrowRight } from "lucide-react";
import { chatbotServices, ChatbotService } from "@/data/chatbotServices";

interface FavoriteChatbotsProps {
  onSelectChatbot?: (chatbot: ChatbotService) => void;
}

const FavoriteChatbots = ({ onSelectChatbot }: FavoriteChatbotsProps) => {
  const favoriteChatbots = chatbotServices.filter(c => c.isFavorite);
  const otherChatbots = chatbotServices.filter(c => !c.isFavorite);

  return (
    <div className="bg-card rounded-2xl p-5 shadow-soft">
      {/* 즐겨찾기 섹션 */}
      <div className="flex items-center gap-2 mb-4">
        <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
        <h2 className="text-base font-semibold text-foreground">즐겨찾는 챗봇</h2>
      </div>
      
      {favoriteChatbots.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-5">
          {favoriteChatbots.map((chatbot) => (
            <button
              key={chatbot.id}
              onClick={() => onSelectChatbot?.(chatbot)}
              className="group flex items-start gap-3 p-3 bg-yellow-50 hover:bg-yellow-100 rounded-xl transition-all text-left border border-yellow-200 hover:border-yellow-300"
            >
              <span className="text-xl shrink-0">{chatbot.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <span className="font-medium text-sm text-foreground truncate">
                    {chatbot.name}
                  </span>
                  <Star className="w-3 h-3 text-yellow-500 fill-yellow-500 shrink-0" />
                  <ArrowRight className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                  {chatbot.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground mb-5">즐겨찾기한 챗봇이 없습니다.</p>
      )}

      {/* 전체 챗봇 섹션 */}
      {otherChatbots.length > 0 && (
        <>
          <div className="flex items-center gap-2 mb-3">
            <Bot className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-sm font-medium text-muted-foreground">전체 챗봇</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {otherChatbots.map((chatbot) => (
              <button
                key={chatbot.id}
                onClick={() => onSelectChatbot?.(chatbot)}
                className="group flex items-center gap-2 p-2.5 bg-muted/40 hover:bg-primary/10 rounded-lg transition-all text-left border border-transparent hover:border-primary/20"
              >
                <span className="text-lg shrink-0">{chatbot.icon}</span>
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-sm text-foreground truncate block">
                    {chatbot.name}
                  </span>
                </div>
                <ArrowRight className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default FavoriteChatbots;
