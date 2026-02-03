import { useState } from "react";
import { Newspaper, ExternalLink, Clock, ChevronRight } from "lucide-react";

interface NewsItem {
  id: string;
  title: string;
  source: string;
  time: string;
  category: string;
  url: string;
}

const mockNews: NewsItem[] = [
  {
    id: "1",
    title: "2024년 AI 트렌드: 생성형 AI가 바꾸는 업무 환경",
    source: "테크뉴스",
    time: "2시간 전",
    category: "AI/기술",
    url: "#",
  },
  {
    id: "2",
    title: "클라우드 보안 강화를 위한 5가지 전략",
    source: "IT조선",
    time: "4시간 전",
    category: "보안",
    url: "#",
  },
  {
    id: "3",
    title: "리액트 19 새로운 기능 미리보기",
    source: "개발자뉴스",
    time: "6시간 전",
    category: "개발",
    url: "#",
  },
];

const InterestNews = () => {
  const [interests] = useState<string[]>(["AI/기술", "개발", "보안"]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "AI/기술":
        return "bg-purple-100 text-purple-600";
      case "개발":
        return "bg-blue-100 text-blue-600";
      case "보안":
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="bg-card rounded-2xl p-4 shadow-soft h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg bg-orange-100 flex items-center justify-center">
          <Newspaper className="w-4 h-4 text-orange-600" />
        </div>
        <h2 className="text-base font-bold text-foreground">나의 관심 뉴스</h2>
        <span className="ml-auto text-xs text-muted-foreground">{mockNews.length}개</span>
      </div>

      {/* Interest Tags */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {interests.map((interest) => (
          <span
            key={interest}
            className={`text-[10px] px-2 py-0.5 rounded-full ${getCategoryColor(interest)}`}
          >
            {interest}
          </span>
        ))}
      </div>

      {/* News List */}
      <div className="flex-1 space-y-2 overflow-auto min-h-0">
        {mockNews.map((news) => (
          <a
            key={news.id}
            href={news.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-2.5 rounded-lg border border-border hover:border-primary/30 hover:bg-muted/50 transition-all group"
          >
            <div className="flex items-start gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                  {news.title}
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${getCategoryColor(news.category)}`}>
                    {news.category}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{news.source}</span>
                  <div className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {news.time}
                  </div>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5" />
            </div>
          </a>
        ))}
      </div>

      {/* More Button */}
      <button className="mt-3 w-full flex items-center justify-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors py-2 border-t border-border">
        더 많은 뉴스 보기
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export default InterestNews;
