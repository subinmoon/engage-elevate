import { Star, ArrowRight, TrendingUp, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InterestItem {
  id: string;
  title: string;
  description: string;
}

interface PopularQuestion {
  id: string;
  title: string;
  icon: React.ReactNode;
}

// 실제 대화 이력이 있을 때 표시할 데이터
const interests: InterestItem[] = [
  {
    id: "1",
    title: "복지카드 발급",
    description: "복지카드 발급 방법에 대한 궁금증이 다 해결되었나요?",
  },
  {
    id: "2",
    title: "출장 신청 방법",
    description: "출장 신청은 잘 되었나요? 더 궁금한게 있으신가요?",
  },
];

// 첫 진입 시 표시할 인기 질문
const popularQuestions: PopularQuestion[] = [
  { id: "1", title: "휴가 신청은 어떻게 하나요?", icon: <Lightbulb className="w-4 h-4 text-primary" /> },
  { id: "2", title: "복지 포인트 사용처가 궁금해요", icon: <TrendingUp className="w-4 h-4 text-primary" /> },
  { id: "3", title: "출장비 정산 방법 알려주세요", icon: <Lightbulb className="w-4 h-4 text-primary" /> },
  { id: "4", title: "신규 입사자 체크리스트", icon: <TrendingUp className="w-4 h-4 text-primary" /> },
];

interface RecentInterestsProps {
  hasHistory?: boolean;
  onQuestionClick?: (question: string) => void;
}

const RecentInterests = ({ hasHistory = false, onQuestionClick }: RecentInterestsProps) => {
  if (!hasHistory) {
    // 첫 진입 시: 인기 질문 표시
    return (
      <div className="bg-white rounded-2xl p-5 shadow-soft">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-lavender-light flex items-center justify-center">
            <Lightbulb className="w-4 h-4 text-primary" />
          </div>
          <h2 className="text-base font-bold text-foreground">이런 것도 물어보세요</h2>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {popularQuestions.map((item) => (
            <button
              key={item.id}
              onClick={() => onQuestionClick?.(item.title)}
              className="flex items-center gap-2 bg-lavender-light hover:bg-primary/20 rounded-xl p-3 text-left transition-all hover:shadow-md group"
            >
              <span className="shrink-0">{item.icon}</span>
              <span className="text-sm text-foreground group-hover:text-primary truncate">
                {item.title}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // 대화 이력이 있을 때: 최근 관심사 표시
  return (
    <div className="bg-white rounded-2xl p-5 shadow-soft">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-lavender-light flex items-center justify-center">
          <Star className="w-4 h-4 text-primary" />
        </div>
        <h2 className="text-base font-bold text-foreground">최근 관심사</h2>
      </div>
      <div className="space-y-3">
        {interests.map((item) => (
          <div 
            key={item.id} 
            className="bg-blue-light rounded-xl p-4 transition-shadow hover:shadow-md"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground mb-0.5">{item.title}</h3>
                <p className="text-sm text-muted-foreground truncate">{item.description}</p>
              </div>
              <Button
                size="sm"
                className="shrink-0 bg-primary hover:bg-lavender-dark text-primary-foreground gap-1 rounded-full px-4 h-8 text-xs"
                onClick={() => onQuestionClick?.(item.title)}
              >
                질문하기
                <ArrowRight className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentInterests;
