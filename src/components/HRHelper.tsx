import { FileText, Calendar, Users, Plane, Building2, UserCircle, UtensilsCrossed, Mail } from "lucide-react";

const helpItems = [{
  label: "내가 올린 전자결재 목록 보여줘!",
  icon: FileText,
  color: "bg-purple-100 text-purple-600"
}, {
  label: "회의 준비할래",
  icon: Calendar,
  color: "bg-blue-100 text-blue-600"
}, {
  label: "동료 일정 알려줘!",
  icon: Users,
  color: "bg-green-100 text-green-600"
}, {
  label: "휴가 물어보기",
  icon: Plane,
  color: "bg-orange-100 text-orange-600"
}, {
  label: "누구 찾을까",
  icon: Building2,
  color: "bg-pink-100 text-pink-600"
}, {
  label: "직원검색",
  icon: UserCircle,
  color: "bg-cyan-100 text-cyan-600"
}, {
  label: "오늘 뭐 먹지",
  icon: UtensilsCrossed,
  color: "bg-amber-100 text-amber-600"
}, {
  label: "메일 써볼까",
  icon: Mail,
  color: "bg-indigo-100 text-indigo-600"
}];

const HRHelper = () => {
  return (
    <div className="bg-card rounded-2xl p-4 shadow-soft border border-border">
      <h2 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
        <span>🏢</span>
        나만의 커넥터
      </h2>
      <div className="grid grid-cols-4 gap-1">
        {helpItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={index}
              className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-muted/60 transition-all group"
            >
              <div className={`w-9 h-9 rounded-lg ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-medium text-muted-foreground group-hover:text-foreground transition-colors text-center leading-tight">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default HRHelper;
