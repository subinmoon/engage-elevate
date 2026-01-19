import { FileText, Calendar, Users, Plane, Building2, UserCircle, UtensilsCrossed } from "lucide-react";

const helpItems = [
  { label: "결재", icon: FileText, color: "bg-slate-100 text-slate-600" },
  { label: "회의실", icon: Calendar, color: "bg-slate-100 text-slate-600" },
  { label: "동료일정", icon: Users, color: "bg-slate-100 text-slate-600" },
  { label: "휴가", icon: Plane, color: "bg-slate-100 text-slate-600" },
  { label: "조직도", icon: Building2, color: "bg-slate-100 text-slate-600" },
  { label: "직원검색", icon: UserCircle, color: "bg-slate-100 text-slate-600" },
  { label: "식단", icon: UtensilsCrossed, color: "bg-slate-100 text-slate-600" },
];

const HRHelper = () => {
  return (
    <div className="bg-card rounded-2xl p-5 shadow-soft border border-border">
      <h2 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
        <span>🏢</span>
        회사생활도우미
      </h2>
      <div className="grid grid-cols-4 gap-2">
        {helpItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={index}
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl hover:bg-muted/60 transition-all group"
            >
              <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors text-center">
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
