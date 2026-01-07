import { MessageSquare, Sparkles, BarChart3, Zap } from "lucide-react";

interface QuickAction {
  id: string;
  icon: React.ReactNode;
  label: string;
  iconColor: string;
  bgGradient: string;
}

const actions: QuickAction[] = [
  {
    id: "summary",
    icon: <MessageSquare className="w-4 h-4" />,
    label: "문서/회의 요약",
    iconColor: "text-violet-600",
    bgGradient: "from-violet-50 to-violet-100",
  },
  {
    id: "brainstorm",
    icon: <Sparkles className="w-4 h-4" />,
    label: "브레인스토밍",
    iconColor: "text-amber-600",
    bgGradient: "from-amber-50 to-orange-100",
  },
  {
    id: "tone",
    icon: <BarChart3 className="w-4 h-4" />,
    label: "글 다듬기",
    iconColor: "text-purple-600",
    bgGradient: "from-purple-100 to-purple-200",
  },
  {
    id: "email",
    icon: <Zap className="w-4 h-4" />,
    label: "메일 초안 생성",
    iconColor: "text-fuchsia-600",
    bgGradient: "from-fuchsia-50 to-pink-100",
  },
];

const QuickActions = () => {
  return (
    <div className="bg-card rounded-2xl p-5 shadow-soft border border-border">
      <h2 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
        <span>⚡</span>
        빠른 시작
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {actions.map((action) => (
          <button
            key={action.id}
            className={`bg-gradient-to-br ${action.bgGradient} rounded-xl py-3 px-4 flex items-center gap-3 transition-all duration-200 hover:shadow-soft hover:scale-[1.02] active:scale-[0.98] border border-border/30`}
          >
            <div className={`${action.iconColor} p-2 bg-white/80 rounded-lg shadow-sm`}>
              {action.icon}
            </div>
            <span className="text-sm font-medium text-foreground text-left">
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
