import { ChevronRight } from "lucide-react";

const helpItems = [
  "결재 목록 조회",
  "회의실 예약 조회",
  "동료 근무 일정 조회",
  "휴가 일수 조회",
  "조직도 조회",
  "직원 정보 조회",
];

const HRHelper = () => {
  return (
    <div className="bg-card rounded-2xl p-5 shadow-card h-full border border-border/50">
      <h2 className="text-lg font-bold text-foreground mb-3">HR 도우미</h2>
      <div className="space-y-0.5">
        {helpItems.map((item, index) => (
          <button
            key={index}
            className="w-full flex items-center justify-between text-left text-foreground hover:text-primary hover:bg-lavender-light/50 transition-all duration-200 py-2 px-3 rounded-lg text-sm font-medium group"
          >
            <span>{item}</span>
            <ChevronRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-primary" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default HRHelper;
