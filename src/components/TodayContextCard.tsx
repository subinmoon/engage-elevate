import { Calendar, Plane, Palmtree, Sparkles, MessageCircle } from "lucide-react";
import { scheduleData, ScheduleItem } from "@/data/scheduleData";
import { Button } from "@/components/ui/button";

interface TodayContextCardProps {
  onGetHelp?: (prompt: string) => void;
  onNewsChat?: (prompt: string) => void;
}

// Mock news - single item with thumbnail
const todayNews = {
  title: "생성형 AI, 사내 업무에 이렇게 쓰이고 있어요",
  thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=200&h=120&fit=crop",
  source: "테크뉴스",
};

const TodayContextCard = ({ onGetHelp, onNewsChat }: TodayContextCardProps) => {
  const nextSchedule = scheduleData[0]; // Get the first upcoming schedule

  const getEmoji = (type: ScheduleItem["type"]) => {
    switch (type) {
      case "vacation":
        return "🌴";
      case "business":
        return "🛫";
      case "anniversary":
        return "💕";
      default:
        return "📌";
    }
  };

  const getTypeLabel = (type: ScheduleItem["type"]) => {
    switch (type) {
      case "vacation":
        return "휴가";
      case "business":
        return "출장";
      case "anniversary":
        return "기념일";
      default:
        return "일정";
    }
  };

  const handleScheduleHelp = () => {
    if (!nextSchedule) return;
    const prompt = `"${nextSchedule.title}" 일정에 대해 도움이 필요해요.\n\n📅 일자: ${nextSchedule.date}\n\n이 일정과 관련해서 어떤 도움이 필요하신가요?`;
    onGetHelp?.(prompt);
  };

  const handleNewsChat = () => {
    const prompt = `"${todayNews.title}"에 대해 얘기해볼까요? 요약해주거나 의견을 나눠볼 수 있어요.`;
    onNewsChat?.(prompt);
  };

  return (
    <div className="bg-card rounded-2xl p-5 shadow-soft h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <div className="w-7 h-7 rounded-lg bg-lavender-light flex items-center justify-center">
          <span className="text-sm">📌</span>
        </div>
        <h2 className="text-base font-bold text-foreground">오늘의 컨텍스트</h2>
      </div>

      {/* Schedule Section */}
      <div className="mb-4">
        <p className="text-[11px] text-muted-foreground mb-2 font-medium">[다음 일정]</p>
        
        {nextSchedule ? (
          <div className="bg-muted/30 rounded-xl p-4 space-y-3">
            {/* Schedule Header */}
            <div className="flex items-start gap-3">
              <span className="text-xl">{getEmoji(nextSchedule.type)}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">
                  {nextSchedule.date} {nextSchedule.title}
                </p>
                {nextSchedule.message && (
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    "{nextSchedule.message}"
                  </p>
                )}
              </div>
            </div>

            {/* Schedule Details */}
            <div className="bg-white/60 rounded-lg p-2.5 space-y-1.5 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">유형</span>
                <span className="font-medium text-foreground">{getTypeLabel(nextSchedule.type)}</span>
              </div>
              {nextSchedule.details?.duration && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">기간</span>
                  <span className="font-medium text-foreground">{nextSchedule.details.duration}</span>
                </div>
              )}
              {nextSchedule.details?.location && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">장소</span>
                  <span className="font-medium text-foreground">{nextSchedule.details.location}</span>
                </div>
              )}
              {nextSchedule.details?.notes && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">메모</span>
                  <span className="font-medium text-foreground">{nextSchedule.details.notes}</span>
                </div>
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full gap-1.5 h-8 text-xs bg-white hover:bg-primary/5 border-primary/20"
              onClick={handleScheduleHelp}
            >
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-primary font-medium">이 일정에 대해 물어보기</span>
            </Button>
          </div>
        ) : (
          <div className="bg-muted/30 rounded-xl p-4 text-center">
            <p className="text-sm text-foreground font-medium">
              오늘은 예정된 일정이 없어요 🙂
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              집중하기 좋은 하루네요.
            </p>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-border my-2" />

      {/* News Section */}
      <div className="flex-1">
        <p className="text-[11px] text-muted-foreground mb-2 font-medium">[요즘 관심 있는 이야기]</p>
        
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 space-y-3">
          {/* News with Thumbnail */}
          <div className="flex gap-3">
            <img
              src={todayNews.thumbnail}
              alt={todayNews.title}
              className="w-16 h-16 rounded-lg object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground leading-relaxed line-clamp-2">
                📰 {todayNews.title}
              </p>
              <p className="text-[10px] text-muted-foreground mt-1">{todayNews.source}</p>
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            className="w-full gap-1.5 h-8 text-xs bg-white hover:bg-orange-50 border-orange-200"
            onClick={handleNewsChat}
          >
            <MessageCircle className="w-3.5 h-3.5 text-orange-600" />
            <span className="text-orange-700 font-medium">이 뉴스에 대해 얘기해볼까요?</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TodayContextCard;
