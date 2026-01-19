import { useState } from "react";
import { Calendar, Plane, Palmtree, Bell, ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { scheduleData, ScheduleItem } from "@/data/scheduleData";

interface UpcomingScheduleProps {
  isExpanded?: boolean;
  onToggle?: () => void;
}

const UpcomingSchedule = ({ isExpanded = false, onToggle }: UpcomingScheduleProps) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

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

  const getTypeLabel = (type: ScheduleItem["type"]) => {
    switch (type) {
      case "vacation":
        return "휴가";
      case "business":
        return "출장";
      default:
        return "일정";
    }
  };

  const getBgColor = (type: ScheduleItem["type"], isExpanded: boolean) => {
    const base = isExpanded ? "ring-2 ring-primary/30" : "";
    switch (type) {
      case "vacation":
        return `bg-green-50 border-green-200 ${base}`;
      case "business":
        return `bg-blue-50 border-blue-200 ${base}`;
      default:
        return `bg-muted border-border ${base}`;
    }
  };

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handleGetHelp = (schedule: ScheduleItem) => {
    console.log("도움받기 clicked for:", schedule.title);
  };

  return (
    <Popover open={isExpanded} onOpenChange={() => { onToggle?.(); setExpandedIndex(null); }}>
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
        <div className="max-h-80 overflow-y-auto p-2 space-y-2">
          {schedules.map((schedule, index) => (
            <div
              key={index}
              className={`rounded-lg border transition-all overflow-hidden ${getBgColor(schedule.type, expandedIndex === index)}`}
            >
              {/* Card Header */}
              <button
                onClick={() => toggleExpand(index)}
                className="flex items-center justify-between w-full p-3 text-left hover:bg-black/5 transition-colors"
              >
                <div className="flex items-center gap-2">
                  {getIcon(schedule.type)}
                  <div>
                    <span className="text-xs font-semibold text-foreground block">
                      {schedule.title}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {schedule.date}
                    </span>
                  </div>
                </div>
                {expandedIndex === index ? (
                  <ChevronUp className="w-3 h-3 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-3 h-3 text-muted-foreground" />
                )}
              </button>

              {/* Expanded Detail */}
              {expandedIndex === index && (
                <div className="px-3 pb-3 space-y-2 border-t border-black/10">
                  <div className="bg-white/50 rounded-md p-2 space-y-1.5 mt-2 text-[11px]">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">유형</span>
                      <span className="font-medium">{getTypeLabel(schedule.type)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">기간</span>
                      <span className="font-medium">{schedule.details?.duration || schedule.date}</span>
                    </div>
                    {schedule.details?.location && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">장소</span>
                        <span className="font-medium">{schedule.details.location}</span>
                      </div>
                    )}
                    {schedule.details?.notes && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">메모</span>
                        <span className="font-medium">{schedule.details.notes}</span>
                      </div>
                    )}
                  </div>
                  {schedule.message && (
                    <div className="bg-primary/10 rounded-md p-2 text-center">
                      <p className="text-[10px] text-primary font-medium">
                        💬 {schedule.message}
                      </p>
                    </div>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-1.5 h-7 text-xs"
                    onClick={() => handleGetHelp(schedule)}
                  >
                    <HelpCircle className="w-3 h-3" />
                    도움받기
                  </Button>
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
