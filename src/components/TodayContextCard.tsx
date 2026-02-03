import { Calendar, Plane, Palmtree, Sparkles, MessageCircle } from "lucide-react";
import { scheduleData, ScheduleItem } from "@/data/scheduleData";
import { Button } from "@/components/ui/button";

interface TodayContextCardProps {
  onGetHelp?: (prompt: string) => void;
  onNewsChat?: (prompt: string) => void;
}

// Mock news - single item only
const todayNews = {
  title: "생성형 AI, 사내 업무에 이렇게 쓰이고 있어요",
  emoji: "📰",
};

const TodayContextCard = ({ onGetHelp, onNewsChat }: TodayContextCardProps) => {
  const nextSchedule = scheduleData[0]; // Get the first upcoming schedule

  const getIcon = (type: ScheduleItem["type"]) => {
    switch (type) {
      case "vacation":
        return <Palmtree className="w-4 h-4 text-green-500" />;
      case "business":
        return <Plane className="w-4 h-4 text-blue-500" />;
      case "anniversary":
        return <Calendar className="w-4 h-4 text-pink-500" />;
      default:
        return <Calendar className="w-4 h-4 text-muted-foreground" />;
    }
  };

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
          <div className="flex items-start gap-3">
            <span className="text-xl">{todayNews.emoji}</span>
            <p className="text-sm font-medium text-foreground leading-relaxed flex-1">
              {todayNews.title}
            </p>
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
