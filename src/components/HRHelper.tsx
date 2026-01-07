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
    <div className="bg-card rounded-2xl p-6 shadow-soft">
      <h2 className="text-lg font-bold text-foreground mb-5">HR 도우미</h2>
      <div className="space-y-3">
        {helpItems.map((item, index) => (
          <button
            key={index}
            className="w-full text-left text-foreground hover:text-primary transition-colors duration-200 py-1 text-sm font-medium"
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
};

export default HRHelper;
