import { useState } from "react";
import { Calendar, Plane, Palmtree, Bell, ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
        return <Palmtree className="w-5 h-5 text-green-500" />;
      case "business":
        return <Plane className="w-5 h-5 text-blue-500" />;
      default:
        return <Calendar className="w-5 h-5 text-muted-foreground" />;
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
    // TODO: Implement help functionality
    console.log("도움받기 clicked for:", schedule.title);
  };

  return (
    <>
      {/* Trigger Button - always visible in header */}
      <button
        onClick={onToggle}
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

      {/* Schedule List Modal with Expandable Cards */}
      <Dialog open={isExpanded} onOpenChange={() => { onToggle?.(); setExpandedIndex(null); }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              다가오는 일정
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 max-h-[60vh] overflow-y-auto">
            {schedules.map((schedule, index) => (
              <div
                key={index}
                className={`rounded-xl border transition-all overflow-hidden ${getBgColor(schedule.type, expandedIndex === index)}`}
              >
                {/* Card Header - Clickable */}
                <button
                  onClick={() => toggleExpand(index)}
                  className="flex items-center justify-between w-full p-4 text-left hover:bg-black/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {getIcon(schedule.type)}
                    <div>
                      <span className="text-sm font-semibold text-foreground block">
                        {schedule.title}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        📅 {schedule.date}
                      </span>
                    </div>
                  </div>
                  {expandedIndex === index ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>

                {/* Expanded Detail */}
                {expandedIndex === index && (
                  <div className="px-4 pb-4 space-y-3 border-t border-black/10">
                    <div className="bg-white/50 rounded-lg p-3 space-y-2 mt-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">유형</span>
                        <span className="text-xs font-medium">{getTypeLabel(schedule.type)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">기간</span>
                        <span className="text-xs font-medium">{schedule.details?.duration || schedule.date}</span>
                      </div>
                      {schedule.details?.location && (
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">장소</span>
                          <span className="text-xs font-medium">{schedule.details.location}</span>
                        </div>
                      )}
                      {schedule.details?.notes && (
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">메모</span>
                          <span className="text-xs font-medium">{schedule.details.notes}</span>
                        </div>
                      )}
                    </div>
                    {schedule.message && (
                      <div className="bg-primary/10 rounded-lg p-2 text-center">
                        <p className="text-xs text-primary font-medium">
                          💬 {schedule.message}
                        </p>
                      </div>
                    )}
                    {/* 도움받기 Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full gap-2"
                      onClick={() => handleGetHelp(schedule)}
                    >
                      <HelpCircle className="w-4 h-4" />
                      도움받기
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UpcomingSchedule;
