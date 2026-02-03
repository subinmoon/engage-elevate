import { useState } from "react";
import { Sparkles, MessageCircle, ChevronDown, ChevronUp, Plane, Palmtree, Calendar } from "lucide-react";
import { scheduleData, ScheduleItem } from "@/data/scheduleData";
import { Button } from "@/components/ui/button";

interface TodayContextCardProps {
  onGetHelp?: (prompt: string) => void;
  onNewsChat?: (prompt: string) => void;
}

// Mock news - 3 items with thumbnails
const newsItems = [
  {
    id: "1",
    title: "생성형 AI, 사내 업무에 이렇게 쓰이고 있어요",
    thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=200&h=120&fit=crop",
    source: "테크뉴스",
  },
  {
    id: "2",
    title: "클라우드 보안 강화를 위한 5가지 전략",
    thumbnail: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=200&h=120&fit=crop",
    source: "IT조선",
  },
  {
    id: "3",
    title: "리액트 19 새로운 기능 미리보기",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=200&h=120&fit=crop",
    source: "개발자뉴스",
  },
];

const TodayContextCard = ({ onGetHelp, onNewsChat }: TodayContextCardProps) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const schedules = scheduleData;

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

  const getBgColor = (type: ScheduleItem["type"], isExpanded: boolean) => {
    const ring = isExpanded ? "ring-2 ring-primary/30" : "";
    switch (type) {
      case "vacation":
        return `bg-green-50 border-green-200 ${ring}`;
      case "business":
        return `bg-blue-50 border-blue-200 ${ring}`;
      case "anniversary":
        return `bg-pink-50 border-pink-200 ${ring}`;
      default:
        return `bg-muted border-border ${ring}`;
    }
  };

  const getMessageStyle = (type: ScheduleItem["type"]) => {
    switch (type) {
      case "vacation":
        return { bar: "from-green-500 to-green-400", text: "text-green-700", icon: "🌴" };
      case "business":
        return { bar: "from-blue-500 to-blue-400", text: "text-blue-700", icon: "✈️" };
      case "anniversary":
        return { bar: "from-pink-500 to-pink-400", text: "text-pink-700", icon: "💕" };
      default:
        return { bar: "from-primary to-lavender", text: "text-foreground/80", icon: "📌" };
    }
  };

  const handleScheduleHelp = (schedule: ScheduleItem) => {
    const prompt = `"${schedule.title}" 일정에 대해 도움이 필요해요.\n\n📅 일자: ${schedule.date}\n\n이 일정과 관련해서 어떤 도움이 필요하신가요?`;
    onGetHelp?.(prompt);
  };

  const handleNewsChat = (news: typeof newsItems[0]) => {
    const prompt = `"${news.title}"에 대해 얘기해볼까요? 요약해주거나 의견을 나눠볼 수 있어요.`;
    onNewsChat?.(prompt);
  };

  return (
    <div className="bg-card rounded-2xl p-5 shadow-soft h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg bg-lavender-light flex items-center justify-center">
          <span className="text-sm">📌</span>
        </div>
        <h2 className="text-base font-bold text-foreground">오늘의 컨텍스트</h2>
      </div>

      {/* Schedule Section */}
      <div className="mb-3">
        <p className="text-[11px] text-muted-foreground mb-2 font-medium">[다음 일정]</p>
        
        {schedules.length > 0 ? (
          <div className="space-y-1.5 max-h-48 overflow-auto">
            {schedules.map((schedule, index) => (
              <div
                key={index}
                className={`rounded-lg border transition-all overflow-hidden ${getBgColor(schedule.type, expandedIndex === index)}`}
              >
                {/* Header Row - Clickable */}
                <button
                  onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                  className="w-full text-left p-2.5 hover:bg-black/5 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {getIcon(schedule.type)}
                    <span className="text-xs font-medium text-foreground flex-1 truncate">
                      {schedule.title}
                    </span>
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                      {schedule.date}
                    </span>
                    {expandedIndex === index ? (
                      <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                    )}
                  </div>
                  
                  {/* Message - Always visible with emphasis */}
                  {schedule.message && (() => {
                    const msgStyle = getMessageStyle(schedule.type);
                    return (
                      <div className="mt-2 relative overflow-hidden rounded-lg bg-white shadow-sm border border-black/5">
                        <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${msgStyle.bar}`} />
                        <p className={`text-[11px] font-medium px-3 py-2 leading-relaxed ${msgStyle.text}`}>
                          <span className="mr-1.5">{msgStyle.icon}</span>
                          {schedule.message}
                        </p>
                      </div>
                    );
                  })()}
                </button>

                {/* Expanded Detail Section */}
                {expandedIndex === index && (
                  <div className="px-2.5 pb-2.5 space-y-2 border-t border-black/10">
                    
                    {/* Detail Info */}
                    <div className="bg-white/50 rounded-md p-2 space-y-1 text-[11px]">
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

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full gap-1.5 h-7 text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleScheduleHelp(schedule);
                      }}
                    >
                      <Sparkles className="w-3 h-3" />
                      AI에게 물어보기
                    </Button>
                  </div>
                )}
              </div>
            ))}
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
      <div className="flex-1 min-h-0">
        <p className="text-[11px] text-muted-foreground mb-2 font-medium">[요즘 관심 있는 이야기]</p>
        
        <div className="space-y-2 overflow-auto max-h-40">
          {newsItems.map((news) => (
            <button
              key={news.id}
              onClick={() => handleNewsChat(news)}
              className="w-full flex gap-3 p-2 rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 hover:from-orange-100 hover:to-amber-100 transition-all text-left group"
            >
              <img
                src={news.thumbnail}
                alt={news.title}
                className="w-14 h-14 rounded-lg object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground leading-relaxed line-clamp-2 group-hover:text-primary transition-colors">
                  📰 {news.title}
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-[10px] text-muted-foreground">{news.source}</span>
                  <MessageCircle className="w-3 h-3 text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TodayContextCard;
