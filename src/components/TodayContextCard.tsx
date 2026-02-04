import { useState } from "react";
import { Sparkles, MessageCircle, ChevronDown, ChevronUp, Plane, Palmtree, Calendar, Newspaper, ExternalLink, Settings } from "lucide-react";
import { scheduleData, ScheduleItem, calculateDday, getDdayText, getDdayColor } from "@/data/scheduleData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DailyBriefingSettingsModal } from "./DailyBriefingSettingsModal";

interface TodayContextCardProps {
  onGetHelp?: (prompt: string) => void;
  onNewsChat?: (prompt: string) => void;
}

// Mock news - 3 items with thumbnails and links
const newsItems = [
  {
    id: "1",
    title: "생성형 AI, 사내 업무에 이렇게 쓰이고 있어요",
    thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=200&h=120&fit=crop",
    source: "테크뉴스",
    url: "https://example.com/news/1",
  },
  {
    id: "2",
    title: "클라우드 보안 강화를 위한 5가지 전략",
    thumbnail: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=200&h=120&fit=crop",
    source: "IT조선",
    url: "https://example.com/news/2",
  },
  {
    id: "3",
    title: "리액트 19 새로운 기능 미리보기",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=200&h=120&fit=crop",
    source: "개발자뉴스",
    url: "https://example.com/news/3",
  },
];

// AI messages for each tab
const aiMessages = {
  schedule: "다가오는 일정을 미리 챙겨봤어요! 준비할 건 없는지 확인해보세요 ✨",
  news: "업무에 도움 될 만한 이야기들을 모아봤어요! 클릭해서 읽어보세요 📖",
};

type TabType = "schedule" | "news";

const TodayContextCard = ({ onGetHelp, onNewsChat }: TodayContextCardProps) => {
  const [activeTab, setActiveTab] = useState<TabType>("schedule");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [showSettings, setShowSettings] = useState(false);
  const [scheduleFilters, setScheduleFilters] = useState<string[]>(["vacation", "business", "anniversary"]);
  const [interestTopics, setInterestTopics] = useState<string[]>(["ai", "dev"]);
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
    <div className="bg-card rounded-2xl p-4 shadow-soft h-full flex flex-col">
      {/* Settings Modal */}
      <DailyBriefingSettingsModal
        open={showSettings}
        onClose={() => setShowSettings(false)}
        scheduleFilters={scheduleFilters}
        onScheduleFiltersChange={setScheduleFilters}
        interestTopics={interestTopics}
        onInterestTopicsChange={setInterestTopics}
      />

      {/* Header */}
      <div className="flex items-center gap-2 mb-3 shrink-0">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary/20 to-lavender-light flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-primary" />
        </div>
        <h2 className="text-base font-bold text-foreground flex-1">AI 데일리 체크</h2>
        <button
          onClick={() => setShowSettings(true)}
          className="p-1.5 rounded-lg hover:bg-muted transition-colors"
          title="설정"
        >
          <Settings className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Tab Toggle */}
      <div className="flex gap-1 p-1 bg-muted/50 rounded-lg mb-3 shrink-0">
        <button
          onClick={() => setActiveTab("schedule")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-md text-xs font-medium transition-all ${
            activeTab === "schedule"
              ? "bg-white shadow-sm text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          다가오는 내 일정
          {schedules.length > 0 && (
            <span className="ml-1 px-1.5 py-0.5 bg-primary/10 text-primary text-[10px] rounded-full">
              {schedules.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("news")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-md text-xs font-medium transition-all ${
            activeTab === "news"
              ? "bg-white shadow-sm text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Newspaper className="w-3.5 h-3.5" />
          관심 이야기
          <span className="ml-1 px-1.5 py-0.5 bg-orange-100 text-orange-600 text-[10px] rounded-full">
            {newsItems.length}
          </span>
        </button>
      </div>

      {/* AI Message */}
      <div className="mb-3 p-2.5 bg-gradient-to-r from-primary/5 to-lavender-light/50 rounded-lg border border-primary/10 shrink-0">
        <p className="text-xs text-foreground flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" />
          <span>{activeTab === "schedule" ? aiMessages.schedule : aiMessages.news}</span>
        </p>
      </div>

      {/* Content Area - fills remaining space */}
      <div className="flex-1 min-h-0 overflow-auto">
        {activeTab === "schedule" ? (
          schedules.length > 0 ? (
            <div className="space-y-1">
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
                      {(() => {
                        const dday = calculateDday(schedule.startDate);
                        const ddayColor = getDdayColor(dday);
                        return (
                          <Badge 
                            variant="outline" 
                            className={`text-[10px] font-bold px-1.5 py-0 h-5 ${ddayColor.bg} ${ddayColor.text} ${ddayColor.border}`}
                          >
                            {getDdayText(dday)}
                          </Badge>
                        );
                      })()}
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
                    <div className="px-2.5 pb-2 space-y-1.5">
                      {/* Detail Info */}
                      <div className="bg-white/50 rounded-md p-2 space-y-1 mt-1.5 text-[11px]">
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

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 gap-1.5 h-7 text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleScheduleHelp(schedule);
                          }}
                        >
                          <Sparkles className="w-3 h-3" />
                          AI에게 물어보기
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 gap-1.5 h-7 text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(`#/schedule/${schedule.title}`, '_blank');
                          }}
                        >
                          <ExternalLink className="w-3 h-3" />
                          상세 사이트
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-center py-2">
                <p className="text-sm text-foreground font-medium">
                  오늘은 예정된 일정이 없어요 🙂
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  지금 여유 있을 때 이런 건 어때요?
                </p>
              </div>
              
              <div className="space-y-2">
                {[
                  { emoji: "💬", text: "이번 주 할 일 정리해볼까?" },
                  { emoji: "✉️", text: "밀린 메일 초안 도와줄게요" },
                  { emoji: "🧠", text: "요즘 관심 있는 주제 얘기해볼까요?" },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => onGetHelp?.(item.text)}
                    className="w-full text-left px-3 py-2.5 rounded-lg bg-muted/40 hover:bg-primary/10 transition-colors group"
                  >
                    <span className="text-xs text-foreground group-hover:text-primary transition-colors">
                      <span className="mr-2">{item.emoji}</span>
                      "{item.text}"
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )
        ) : (
          /* News Section */
          <div className="space-y-2">
            {newsItems.map((news) => (
              <a
                key={news.id}
                href={news.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 p-2.5 hover:shadow-md transition-all group"
              >
                <div className="flex gap-3">
                  <img
                    src={news.thumbnail}
                    alt={news.title}
                    className="w-14 h-14 rounded-lg object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground leading-relaxed line-clamp-2 group-hover:text-primary transition-colors">
                      📰 {news.title}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span className="text-[10px] text-muted-foreground">{news.source}</span>
                      <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TodayContextCard;
