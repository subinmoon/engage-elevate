import { Calendar, Plane, Palmtree } from "lucide-react";

interface ScheduleItem {
  type: "vacation" | "business";
  title: string;
  date: string;
  message?: string;
}

const UpcomingSchedule = () => {
  const schedules: ScheduleItem[] = [
    {
      type: "vacation",
      title: "연차 휴가",
      date: "1/20 (월)",
      message: "아이와 좋은 시간 보내고 오세요~",
    },
    {
      type: "business",
      title: "출장",
      date: "1/27 (월)",
      message: "좋은 성과 있길 바랍니다!",
    },
  ];

  const getIcon = (type: ScheduleItem["type"]) => {
    switch (type) {
      case "vacation":
        return <Palmtree className="w-4 h-4 text-green-500" />;
      case "business":
        return <Plane className="w-4 h-4 text-blue-500" />;
      default:
        return <Calendar className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <Calendar className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">다가오는 일정</h3>
      </div>
      <div className="space-y-3">
        {schedules.map((schedule, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="mt-0.5">{getIcon(schedule.type)}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">
                  {schedule.title}
                </span>
                <span className="text-xs text-muted-foreground">
                  {schedule.date}
                </span>
              </div>
              {schedule.message && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {schedule.message}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingSchedule;
