import { MessageSquare, Sparkles, BarChart3, Zap } from "lucide-react";

interface QuickAction {
  id: string;
  icon: React.ReactNode;
  label: string;
  gradient: string;
  iconBg: string;
  iconColor: string;
  decorColor: string;
}

const actions: QuickAction[] = [
  {
    id: "summary",
    icon: <MessageSquare className="w-5 h-5" />,
    label: "문서/회의 요약",
    gradient: "bg-gradient-to-br from-lavender-light via-lavender-light to-violet/20",
    iconBg: "bg-white/80",
    iconColor: "text-primary",
    decorColor: "from-primary/20",
  },
  {
    id: "brainstorm",
    icon: <Sparkles className="w-5 h-5" />,
    label: "아이디어 브레인스토밍",
    gradient: "bg-gradient-warm",
    iconBg: "bg-white/80",
    iconColor: "text-peach-dark",
    decorColor: "from-coral/20",
  },
  {
    id: "tone",
    icon: <BarChart3 className="w-5 h-5" />,
    label: "글 다듬기 / 톤 변경",
    gradient: "bg-gradient-sky",
    iconBg: "bg-white/80",
    iconColor: "text-sky-dark",
    decorColor: "from-sky-dark/20",
  },
  {
    id: "email",
    icon: <Zap className="w-5 h-5" />,
    label: "메일 & 메세지 초안",
    gradient: "bg-gradient-mint",
    iconBg: "bg-white/80",
    iconColor: "text-mint-dark",
    decorColor: "from-mint-dark/20",
  },
];

const QuickActions = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-glass backdrop-blur-md rounded-3xl p-6 shadow-card border border-white/60">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/4 w-64 h-32 bg-gradient-to-b from-primary/5 to-transparent rounded-full blur-3xl" />
      
      <div className="relative">
        <h2 className="text-lg font-bold text-foreground mb-5 flex items-center gap-2">
          <span className="w-1.5 h-6 bg-gradient-hero rounded-full" />
          빠른 시작
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {actions.map((action, index) => (
            <button
              key={action.id}
              className={`group relative ${action.gradient} rounded-2xl p-5 flex flex-col items-center gap-3 transition-all duration-500 hover:shadow-hover hover:-translate-y-1 active:scale-[0.98] border border-white/50 overflow-hidden`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Hover glow effect */}
              <div className={`absolute inset-0 bg-gradient-to-t ${action.decorColor} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              {/* Animated ring on hover */}
              <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-white/30 transition-all duration-500" />
              
              <div className={`relative ${action.iconBg} backdrop-blur-sm p-3 rounded-xl shadow-soft border border-white/50 transition-all duration-300 group-hover:scale-110 group-hover:shadow-card`}>
                <div className={action.iconColor}>
                  {action.icon}
                </div>
              </div>
              <span className="relative text-xs font-semibold text-foreground text-center leading-tight">
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
