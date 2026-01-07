import { Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InterestItem {
  id: string;
  title: string;
  description: string;
}

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

const RecentInterests = () => {
  return (
    <div className="bg-gradient-to-br from-mint/60 to-mint/30 rounded-2xl p-5 h-full border border-mint-dark/10">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-white/80 backdrop-blur flex items-center justify-center shadow-sm">
          <Clock className="w-4 h-4 text-mint-dark" />
        </div>
        <h2 className="text-lg font-bold text-foreground">최근 관심사</h2>
      </div>
      <div className="space-y-3">
        {interests.map((item) => (
          <div 
            key={item.id} 
            className="bg-white/70 backdrop-blur-sm rounded-xl p-4 transition-all duration-300 hover:bg-white hover:shadow-soft group"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-foreground mb-0.5">{item.title}</h3>
                <p className="text-sm text-muted-foreground truncate">{item.description}</p>
              </div>
              <Button
                size="sm"
                className="shrink-0 bg-primary hover:bg-lavender-dark text-primary-foreground gap-1 rounded-full px-4 h-8 text-xs shadow-sm"
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
