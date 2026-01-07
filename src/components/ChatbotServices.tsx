import { ChevronRight, Bot, Settings } from "lucide-react";

const chatbotServices = [
  { 
    id: "company-rules",
    name: "이수시스템 사규 챗봇", 
    description: "회사 규정 및 정책에 대해 질문해보세요",
    emoji: "📊"
  },
  { 
    id: "hr-assistant",
    name: "HR 어시스턴트", 
    description: "인사 관련 문의를 도와드립니다",
    emoji: "👔"
  },
  { 
    id: "it-support",
    name: "IT 지원 봇", 
    description: "기술 지원 및 시스템 문의",
    emoji: "💻"
  },
];

const ChatbotServices = () => {
  return (
    <div className="bg-card rounded-2xl p-5 shadow-soft border border-border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-foreground flex items-center gap-2">
          <Bot className="w-4 h-4 text-primary" />
          나만의 챗봇 서비스
        </h2>
        <button className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors">
          <Settings className="w-3 h-3" />
          관리
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {chatbotServices.map((service) => (
          <button
            key={service.id}
            className="group bg-gradient-to-br from-lavender-light to-secondary p-4 rounded-xl text-left transition-all duration-200 hover:shadow-soft hover:scale-[1.02] active:scale-[0.98] border border-border/50"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{service.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm text-foreground mb-1 truncate">
                  {service.name}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {service.description}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChatbotServices;
