import { MessageSquare, Sparkles, BarChart3, Zap } from "lucide-react";

interface QuickAction {
  id: string;
  icon: React.ReactNode;
  label: string;
  bgColor: string;
  iconColor: string;
}

const actions: QuickAction[] = [
  {
    id: "summary",
    icon: <MessageSquare className="w-6 h-6" />,
    label: "문서/회의 요약",
    bgColor: "bg-lavender-light",
    iconColor: "text-primary",
  },
  {
    id: "brainstorm",
    icon: <Sparkles className="w-6 h-6" />,
    label: "아이디어 브레인스토밍",
    bgColor: "bg-peach",
    iconColor: "text-peach-dark",
  },
  {
    id: "tone",
    icon: <BarChart3 className="w-6 h-6" />,
    label: "글 다듬기/ 톤 변경",
    bgColor: "bg-lavender-light",
    iconColor: "text-primary",
  },
  {
    id: "email",
    icon: <Zap className="w-6 h-6" />,
    label: "메일 & 메세지 초안 생성",
    bgColor: "bg-mint",
    iconColor: "text-mint-dark",
  },
];

const QuickActions = () => {
  return (
    <div className="bg-card rounded-2xl p-6 shadow-soft">
      <h2 className="text-lg font-bold text-foreground mb-5">빠른 시작</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action) => (
          <button
            key={action.id}
            className={`${action.bgColor} rounded-2xl p-6 flex flex-col items-center gap-4 transition-all duration-300 hover:shadow-hover hover:scale-[1.02]`}
          >
            <div className={action.iconColor}>{action.icon}</div>
            <span className="text-sm font-medium text-foreground text-center">
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
