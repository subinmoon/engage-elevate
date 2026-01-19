import { Calendar, Plane, Palmtree, Bell } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { scheduleData, ScheduleItem } from "@/data/scheduleData";

interface UpcomingScheduleProps {
  isExpanded?: boolean;
  onToggle?: () => void;
}

const UpcomingSchedule = ({ isExpanded = false, onToggle }: UpcomingScheduleProps) => {
  const schedules = scheduleData;


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

  const getBgColor = (type: ScheduleItem["type"]) => {
    switch (type) {
      case "vacation":
        return "bg-green-50 border-green-200";
      case "business":
        return "bg-blue-50 border-blue-200";
      default:
        return "bg-muted border-border";
    }
  };

  return (
    <Popover open={isExpanded} onOpenChange={() => onToggle?.()}>
      <PopoverTrigger asChild>
        <button
          className="relative p-2 hover:bg-muted/50 rounded-lg transition-all cursor-pointer"
          title="일정 보기"
        >
          <Bell className="w-5 h-5 text-muted-foreground" />
          {schedules.length > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center px-1">
              {schedules.length}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent 
        align="end" 
        className="w-80 p-0 bg-card border border-border z-50"
        sideOffset={8}
      >
        {/* Header */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
          <Calendar className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold">다가오는 일정</span>
          <span className="ml-auto text-xs text-muted-foreground">{schedules.length}개</span>
        </div>

        {/* Schedule List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1.5">
          {schedules.map((schedule, index) => (
            <div
              key={index}
              className={`rounded-lg border transition-all overflow-hidden ${getBgColor(schedule.type)}`}
            >
              {/* Compact Single Line */}
              <div className="flex items-center gap-2 p-2.5">
                {getIcon(schedule.type)}
                <span className="text-xs font-medium text-foreground flex-1 truncate">
                  {schedule.title}
                </span>
                <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                  {schedule.date}
                </span>
              </div>
              
              {/* Message - Always visible if exists */}
              {schedule.message && (
                <div className="px-2.5 pb-2 -mt-1">
                  <div className="bg-primary/10 rounded-md px-2 py-1.5">
                    <p className="text-[10px] text-primary font-medium">
                      💬 {schedule.message}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default UpcomingSchedule;
