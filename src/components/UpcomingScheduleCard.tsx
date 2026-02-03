import { useState } from "react";
import { Calendar, ChevronDown, ChevronUp, Plane, Palmtree, Sparkles } from "lucide-react";
import { scheduleData, ScheduleItem } from "@/data/scheduleData";
import { Button } from "@/components/ui/button";

interface UpcomingScheduleCardProps {
  onGetHelp?: (prompt: string) => void;
}

const UpcomingScheduleCard = ({ onGetHelp }: UpcomingScheduleCardProps) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const schedules = scheduleData;

  const getIcon = (type: ScheduleItem["type"]) => {
    switch (type) {
      case "vacation":
        return <Palmtree className="w-4 h-4" />;
      case "business":
        return <Plane className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: ScheduleItem["type"]) => {
    switch (type) {
      case "vacation":
        return "bg-green-100 text-green-600 border-green-200";
      case "business":
        return "bg-blue-100 text-blue-600 border-blue-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  const getAccentColor = (type: ScheduleItem["type"]) => {
    switch (type) {
      case "vacation":
        return "bg-green-500";
      case "business":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleAskAI = (schedule: ScheduleItem) => {
    const prompt = schedule.type === "vacation" 
      ? `${schedule.date} ${schedule.title}에 대해 알려주세요. 휴가 관련 정책이나 준비사항이 있을까요?`
      : `${schedule.date} ${schedule.title}에 대해 알려주세요. 출장 관련 정책이나 준비사항이 있을까요?`;
    onGetHelp?.(prompt);
  };

  if (schedules.length === 0) {
    return (
      <div className="bg-card rounded-2xl p-4 shadow-soft h-full">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center">
            <Calendar className="w-4 h-4 text-blue-600" />
          </div>
          <h2 className="text-base font-bold text-foreground">다가오는 일정</h2>
        </div>
        <p className="text-sm text-muted-foreground text-center py-8">
          다가오는 일정이 없습니다.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl p-4 shadow-soft h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center">
          <Calendar className="w-4 h-4 text-blue-600" />
        </div>
        <h2 className="text-base font-bold text-foreground">다가오는 일정</h2>
        <span className="ml-auto text-xs text-muted-foreground">{schedules.length}개</span>
      </div>

      <div className="flex-1 space-y-2 overflow-auto">
        {schedules.map((schedule, index) => (
          <div 
            key={index}
            className="border border-border rounded-xl overflow-hidden"
          >
            {/* Header - Always visible */}
            <button
              onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
              className="w-full flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors text-left"
            >
              <div className={`w-8 h-8 rounded-lg ${getTypeColor(schedule.type)} flex items-center justify-center shrink-0`}>
                {getIcon(schedule.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm text-foreground">{schedule.title}</span>
                  <span className="text-xs text-muted-foreground">{schedule.date}</span>
                </div>
              </div>
              {expandedIndex === index ? (
                <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
              ) : (
                <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
              )}
            </button>

            {/* Expanded content */}
            {expandedIndex === index && (
              <div className="px-3 pb-3 pt-0">
                <div className={`rounded-lg p-3 bg-card border-l-4 ${getAccentColor(schedule.type)}`}>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">기간:</span>
                      <span className="font-medium text-foreground">{schedule.details?.duration || schedule.date}</span>
                    </div>
                    {schedule.details?.location && (
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">장소:</span>
                        <span className="font-medium text-foreground">{schedule.details.location}</span>
                      </div>
                    )}
                    {schedule.details?.notes && (
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">메모:</span>
                        <span className="font-medium text-foreground">{schedule.details.notes}</span>
                      </div>
                    )}
                  </div>
                  
                  {schedule.message && (
                    <p className="text-xs text-muted-foreground mt-2 italic">
                      💬 {schedule.message}
                    </p>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 w-full gap-1.5 text-xs h-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAskAI(schedule);
                    }}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                    AI에게 물어보기
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingScheduleCard;
