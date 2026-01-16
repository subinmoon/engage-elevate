import { useState } from "react";
import { Calendar, Plane, Palmtree, ChevronDown, ChevronUp, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ScheduleItem {
  type: "vacation" | "business";
  title: string;
  date: string;
  message?: string;
  details?: {
    duration: string;
    location?: string;
    notes?: string;
  };
}

const UpcomingSchedule = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleItem | null>(null);

  const schedules: ScheduleItem[] = [
    {
      type: "vacation",
      title: "연차 휴가",
      date: "1/20 (월)",
      message: "아이와 좋은 시간 보내고 오세요~",
      details: {
        duration: "1/20 (월) ~ 1/21 (화)",
        notes: "가족 여행",
      },
    },
    {
      type: "business",
      title: "출장",
      date: "1/27 (월)",
      message: "좋은 성과 있길 바랍니다!",
      details: {
        duration: "1/27 (월) ~ 1/28 (화)",
        location: "부산 해운대",
        notes: "고객사 미팅",
      },
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

  // Collapsed state - show emoji
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="bg-card border border-border rounded-full p-3 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center gap-2"
        title="일정 보기"
      >
        <span className="text-xl">😊</span>
        <span className="text-xs text-muted-foreground font-medium">
          {schedules.length}개 일정
        </span>
      </button>
    );
  }

  return (
    <>
      <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">다가오는 일정</h3>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-muted rounded transition-colors"
            title="접기"
          >
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
        <div className="space-y-2">
          {schedules.map((schedule, index) => (
            <button
              key={index}
              onClick={() => setSelectedSchedule(schedule)}
              className="w-full flex items-start gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors text-left"
            >
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
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">
                    {schedule.message}
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

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
