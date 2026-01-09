import { ChevronRight } from "lucide-react";
import iconApproval from "@/assets/icons/icon-approval.png";
import iconMeeting from "@/assets/icons/icon-meeting.png";
import iconSchedule from "@/assets/icons/icon-schedule.png";
import iconVacation from "@/assets/icons/icon-vacation.png";
import iconOrgChart from "@/assets/icons/icon-org-chart.png";
import iconEmployee from "@/assets/icons/icon-employee.png";

const helpItems = [
  { label: "결재 목록 조회", icon: iconApproval },
  { label: "회의실 예약 조회", icon: iconMeeting },
  { label: "동료 근무 일정 조회", icon: iconSchedule },
  { label: "휴가 일수 조회", icon: iconVacation },
  { label: "조직도 조회", icon: iconOrgChart },
  { label: "직원 정보 조회", icon: iconEmployee },
];

const HRHelper = () => {
  return (
    <div className="bg-card rounded-2xl p-5 shadow-soft h-full border border-border">
      <h2 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
        <span>👔</span>
        HR 도우미
      </h2>
      <div className="space-y-1">
        {helpItems.map((item, index) => {
          return (
            <button
              key={index}
              className="w-full flex items-center gap-3 text-left text-foreground hover:text-primary hover:bg-lavender-light transition-all duration-200 py-2.5 px-3 rounded-xl text-sm font-medium group"
            >
              <img 
                src={item.icon} 
                alt={item.label} 
                className="w-8 h-8 object-contain"
              />
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
