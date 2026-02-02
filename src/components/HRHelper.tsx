import { FileText, Calendar, Users, Plane, Building2, UserCircle, UtensilsCrossed, Mail } from "lucide-react";

const helpItems = [{
  label: "결재 목록 보여줘",
  icon: FileText,
  color: "bg-purple-100 text-purple-600"
}, {
  label: "회의실 잡아줘",
  icon: Calendar,
  color: "bg-blue-100 text-blue-600"
}, {
  label: "동료 일정 확인해줘",
  icon: Users,
  color: "bg-green-100 text-green-600"
}, {
  label: "휴가 확인할래",
  icon: Plane,
  color: "bg-orange-100 text-orange-600"
}, {
  label: "조직도 보여줘",
  icon: Building2,
  color: "bg-pink-100 text-pink-600"
}, {
  label: "직원 찾아줘",
  icon: UserCircle,
  color: "bg-cyan-100 text-cyan-600"
}, {
  label: "오늘 메뉴 뭐 나와?",
  icon: UtensilsCrossed,
  color: "bg-amber-100 text-amber-600"
}, {
  label: "메일 써줘",
  icon: Mail,
  color: "bg-indigo-100 text-indigo-600"
}];

const HRHelper = () => {
  return (
    <div className="bg-sky-50 rounded-2xl p-4 shadow-soft h-full">
      <h2 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
        <span>💬</span>
        대화로 업무하기
      </h2>
      <div className="grid grid-cols-4 gap-2">
        {helpItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <button 
              key={index} 
              className="flex flex-col items-center gap-1.5 p-1.5 rounded-xl hover:bg-muted/60 transition-all group"
            >
              <div className={`w-9 h-9 rounded-xl ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-medium text-muted-foreground group-hover:text-foreground transition-colors text-center whitespace-nowrap leading-tight">
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
