import { MessageSquare, Sparkles, BarChart3, Zap } from "lucide-react";

interface QuickAction {
  id: string;
  icon: React.ReactNode;
  label: string;
  bgColor: string;
  iconColor: string;
  hoverBg: string;
}

const actions: QuickAction[] = [
  {
    id: "summary",
    icon: <MessageSquare className="w-5 h-5" />,
    label: "문서/회의 요약",
    bgColor: "bg-lavender-light",
    iconColor: "text-primary",
    hoverBg: "hover:bg-lavender-light/80",
  },
  {
    id: "brainstorm",
    icon: <Sparkles className="w-5 h-5" />,
    label: "아이디어 브레인스토밍",
    bgColor: "bg-peach",
    iconColor: "text-peach-dark",
    hoverBg: "hover:bg-peach/80",
  },
  {
    id: "tone",
    icon: <BarChart3 className="w-5 h-5" />,
    label: "글 다듬기 / 톤 변경",
    bgColor: "bg-lavender-light",
    iconColor: "text-primary",
    hoverBg: "hover:bg-lavender-light/80",
  },
  {
    id: "email",
    icon: <Zap className="w-5 h-5" />,
    label: "메일 & 메세지 초안 생성",
    bgColor: "bg-mint",
    iconColor: "text-mint-dark",
    hoverBg: "hover:bg-mint/80",
  },
];

const QuickActions = () => {
  return (
    <div className="bg-card rounded-2xl p-5 shadow-card border border-border/50">
      <h2 className="text-lg font-bold text-foreground mb-4">빠른 시작</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {actions.map((action) => (
          <button
            key={action.id}
            className={`${action.bgColor} ${action.hoverBg} rounded-xl p-4 flex flex-col items-center gap-3 transition-all duration-300 hover:shadow-hover hover:scale-[1.02] active:scale-[0.98]`}
          >
            <div className={`${action.iconColor} p-2.5 bg-white/60 rounded-lg shadow-sm`}>
              {action.icon}
            </div>
            <span className="text-xs font-semibold text-foreground text-center leading-tight">
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
