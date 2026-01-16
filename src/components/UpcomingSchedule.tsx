import { useState } from "react";
import { Calendar, Plane, Palmtree, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { scheduleData, ScheduleItem } from "@/data/scheduleData";

interface UpcomingScheduleProps {
  isExpanded?: boolean;
  onToggle?: () => void;
}

const UpcomingSchedule = ({ isExpanded = false, onToggle }: UpcomingScheduleProps) => {
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleItem | null>(null);

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

  const getBgColor = (type: ScheduleItem["type"]) => {
    switch (type) {
      case "vacation":
        return "bg-green-50 border-green-200 hover:bg-green-100";
      case "business":
        return "bg-blue-50 border-blue-200 hover:bg-blue-100";
      default:
        return "bg-muted border-border hover:bg-muted/80";
    }
  };

  return (
    <>
      {/* Trigger Button - always visible in header */}
      <button
        onClick={onToggle}
        className="bg-card/50 hover:bg-muted/50 rounded-full px-3 py-1.5 transition-all cursor-pointer flex items-center gap-2"
        title="일정 보기"
      >
        <span className="text-lg">😊</span>
        <span className="text-xs text-muted-foreground font-medium">
          {schedules.length}개 일정
        </span>
      </button>

      {/* Schedule List Modal */}
      <Dialog open={isExpanded} onOpenChange={() => onToggle?.()}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              다가오는 일정
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 max-h-[60vh] overflow-y-auto">
            {schedules.map((schedule, index) => (
              <button
                key={index}
                onClick={() => setSelectedSchedule(schedule)}
                className={`flex flex-col w-full p-4 rounded-xl border transition-all text-left ${getBgColor(schedule.type)}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {getIcon(schedule.type)}
                  <span className="text-sm font-semibold text-foreground">
                    {schedule.title}
                  </span>
                </div>
                <span className="text-xs font-medium text-muted-foreground mb-1">
                  📅 {schedule.date}
                </span>
                {schedule.message && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {schedule.message}
                  </p>
                )}
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={!!selectedSchedule} onOpenChange={() => setSelectedSchedule(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedSchedule && getIcon(selectedSchedule.type)}
              {selectedSchedule?.title}
            </DialogTitle>
          </DialogHeader>
          {selectedSchedule && (
            <div className="space-y-4">
              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">유형</span>
                  <span className="text-sm font-medium">{getTypeLabel(selectedSchedule.type)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">기간</span>
                  <span className="text-sm font-medium">{selectedSchedule.details?.duration || selectedSchedule.date}</span>
                </div>
                {selectedSchedule.details?.location && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">장소</span>
                    <span className="text-sm font-medium">{selectedSchedule.details.location}</span>
                  </div>
                )}
                {selectedSchedule.details?.notes && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">메모</span>
                    <span className="text-sm font-medium">{selectedSchedule.details.notes}</span>
                  </div>
                )}
              </div>
              {selectedSchedule.message && (
                <div className="bg-primary/10 rounded-lg p-3 text-center">
                  <p className="text-sm text-primary font-medium">
                    💬 {selectedSchedule.message}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UpcomingSchedule;
