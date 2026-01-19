import { ChevronRight, FileText, Calendar, Users, Plane, Building2, UserCircle, UtensilsCrossed } from "lucide-react";

const helpItems = [
  { label: "결재 목록 조회", icon: FileText },
  { label: "회의실 예약 조회", icon: Calendar },
  { label: "동료 근무 일정 조회", icon: Users },
  { label: "휴가 일수 조회", icon: Plane },
  { label: "조직도 조회", icon: Building2 },
  { label: "직원 정보 조회", icon: UserCircle },
  { label: "구내식당 메뉴 조회", icon: UtensilsCrossed },
];

const HRHelper = () => {
  return (
    <div className="bg-card rounded-2xl p-5 shadow-soft h-full border border-border">
      <h2 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
        <span>🏢</span>
        회사생활도우미
      </h2>
      <div className="space-y-1">
        {helpItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={index}
              className="w-full flex items-center gap-3 text-left text-foreground hover:text-primary hover:bg-lavender-light transition-all duration-200 py-2.5 px-3 rounded-xl text-sm font-medium group"
            >
              <Icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="flex-1">{item.label}</span>
              <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default HRHelper;
