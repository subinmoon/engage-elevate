import { FileText, Calendar, Users, Plane, Building2, UserCircle, UtensilsCrossed, Mail } from "lucide-react";

const helpItems = [
  { label: "결재", icon: FileText, color: "bg-purple-100 text-purple-600" },
  { label: "회의실", icon: Calendar, color: "bg-blue-100 text-blue-600" },
  { label: "동료일정", icon: Users, color: "bg-green-100 text-green-600" },
  { label: "휴가", icon: Plane, color: "bg-orange-100 text-orange-600" },
  { label: "조직도", icon: Building2, color: "bg-pink-100 text-pink-600" },
  { label: "직원검색", icon: UserCircle, color: "bg-cyan-100 text-cyan-600" },
  { label: "식단", icon: UtensilsCrossed, color: "bg-amber-100 text-amber-600" },
  { label: "메일전송", icon: Mail, color: "bg-indigo-100 text-indigo-600" },
];

const HRHelper = () => {
  return (
    <div className="bg-card rounded-xl sm:rounded-2xl p-2.5 sm:p-5 shadow-soft border border-border h-full">
      <h2 className="text-xs sm:text-base font-bold text-foreground mb-1.5 sm:mb-4 flex items-center gap-1.5">
        <span className="text-sm sm:text-base">🏢</span>
        회사생활도우미
      </h2>
      <div className="grid grid-cols-4 gap-0.5 sm:gap-2">
        {helpItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={index}
              className="flex flex-col items-center gap-0.5 sm:gap-1 p-1 sm:p-3 rounded-lg hover:bg-muted/60 transition-all group"
            >
              <div className={`w-7 h-7 sm:w-10 sm:h-10 rounded-lg ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <Icon className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
              </div>
              <span className="text-[9px] sm:text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors text-center leading-tight">
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
