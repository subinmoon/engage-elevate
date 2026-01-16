import { useState, useEffect } from "react";
import logoIcon from "@/assets/logo-icon.png";
import { MessageSquare, Sparkles, Zap, Calendar } from "lucide-react";

interface WelcomeHeaderProps {
  userName?: string;
  onSelectAction?: (promptTemplate: string) => void;
}

interface QuickAction {
  id: string;
  icon: React.ReactNode;
  label: string;
  iconColor: string;
  promptTemplate?: string;
}

const actions: QuickAction[] = [
  {
    id: "schedule",
    icon: <Calendar className="w-4 h-4" />,
    label: "일정 확인",
    iconColor: "text-violet-500",
    promptTemplate: "다가오는 일정을 알려줘",
  },
  {
    id: "summary",
    icon: <MessageSquare className="w-4 h-4" />,
    label: "문서/회의 요약",
    iconColor: "text-primary",
    promptTemplate: "다음 내용을 요약해주세요:\n\n[여기에 문서나 회의 내용을 붙여넣으세요]",
  },
  {
    id: "brainstorm",
    icon: <Sparkles className="w-4 h-4" />,
    label: "브레인스토밍",
    iconColor: "text-amber-500",
    promptTemplate: "다음 주제에 대해 브레인스토밍을 도와주세요:\n\n주제: [주제를 입력하세요]\n목적: [브레인스토밍의 목적을 입력하세요]",
  },
  {
    id: "email",
    icon: <Zap className="w-4 h-4" />,
    label: "메일 초안 생성",
    iconColor: "text-rose-500",
    promptTemplate: "다음 조건에 맞는 이메일 초안을 작성해주세요:\n\n받는 사람: [예: 팀장님, 고객사 담당자]\n목적: [예: 회의 일정 조율, 프로젝트 진행 상황 공유]\n주요 내용: [전달하고 싶은 핵심 내용]\n톤앤매너: [예: 공식적, 친근한, 정중한]",
  },
];

const greetingMessages = [
  "오늘은 무엇이 궁금하세요?",
  "무엇을 도와드릴까요?",
  "오늘 하루도 화이팅! 💪",
  "궁금한 것이 있으시면 물어보세요!",
  "좋은 하루 되세요! ☀️",
  "무엇이든 질문해 주세요!",
  "오늘도 좋은 일만 가득하길! ✨",
];

const WelcomeHeader = ({ userName = "현민", onSelectAction }: WelcomeHeaderProps) => {
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * greetingMessages.length);
    setGreeting(greetingMessages[randomIndex]);
  }, []);

  const handleActionClick = (action: QuickAction) => {
    if (action.promptTemplate && onSelectAction) {
      onSelectAction(action.promptTemplate);
    }
  };

  return (
    <div className="w-full mb-4">
      {/* Welcome Message */}
      <div className="flex items-center gap-4 mb-4">
        <img src={logoIcon} alt="Logo" className="w-12 h-12" />
        <h1 className="text-2xl font-bold text-foreground">
          <span className="text-gradient-name">{userName}</span>님, {greeting}
        </h1>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => handleActionClick(action)}
            className="bg-card border border-border rounded-full py-2 px-4 flex items-center gap-2 transition-all duration-200 hover:shadow-soft hover:bg-muted/50 active:scale-[0.98]"
          >
            <div className={`${action.iconColor}`}>
              {action.icon}
            </div>
            <span className="text-sm font-medium text-foreground">
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default WelcomeHeader;
