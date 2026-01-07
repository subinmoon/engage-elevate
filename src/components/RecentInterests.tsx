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
    <div className="bg-gradient-to-br from-mint/60 to-mint/30 rounded-3xl p-7 h-full border border-mint-dark/10">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-white/80 backdrop-blur flex items-center justify-center shadow-sm">
          <Clock className="w-5 h-5 text-mint-dark" />
        </div>
        <h2 className="text-xl font-bold text-foreground">최근 관심사</h2>
      </div>
      <div className="space-y-5">
        {interests.map((item) => (
          <div 
            key={item.id} 
            className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 transition-all duration-300 hover:bg-white hover:shadow-soft group"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-foreground text-lg mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground truncate">{item.description}</p>
              </div>
              <Button
                size="sm"
                className="shrink-0 bg-primary hover:bg-lavender-dark text-primary-foreground gap-1.5 rounded-full px-5 shadow-sm transition-all duration-300 group-hover:shadow-card"
              >
                질문하기
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentInterests;
