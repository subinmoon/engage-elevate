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
    <div className="relative overflow-hidden bg-gradient-glass backdrop-blur-md rounded-3xl p-6 shadow-card h-full border border-white/60">
      {/* Decorative gradient orb */}
      <div className="absolute -top-16 -right-16 w-40 h-40 bg-gradient-to-br from-primary/15 via-violet/10 to-transparent rounded-full blur-3xl" />
      <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-gradient-to-tr from-peach/20 to-transparent rounded-full blur-2xl" />
      
      <div className="relative">
        <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          <span className="w-1.5 h-6 bg-gradient-hero rounded-full" />
          HR 도우미
        </h2>
        <div className="space-y-0.5">
          {helpItems.map((item, index) => (
            <button
              key={index}
              className="w-full flex items-center justify-between text-left text-foreground/80 hover:text-primary hover:bg-gradient-to-r hover:from-lavender-light/80 hover:to-transparent transition-all duration-300 py-2.5 px-3 rounded-xl text-sm font-medium group"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <span className="group-hover:translate-x-1 transition-transform duration-300">{item}</span>
              <ChevronRight className="w-4 h-4 opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-primary" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HRHelper;
