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
    <div className="relative overflow-hidden bg-gradient-mint rounded-3xl p-6 h-full border border-mint-dark/10 shadow-card">
      {/* Decorative elements */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-mint-dark/20 to-transparent rounded-full blur-2xl" />
      <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-to-tr from-accent/20 to-transparent rounded-full blur-xl" />
      
      <div className="relative">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-soft border border-white/50">
            <Clock className="w-4 h-4 text-mint-dark" />
          </div>
          <h2 className="text-lg font-bold text-foreground">최근 관심사</h2>
        </div>
        <div className="space-y-3">
          {interests.map((item, index) => (
            <div 
              key={item.id} 
              className="group relative bg-gradient-glass backdrop-blur-md rounded-2xl p-4 transition-all duration-500 hover:shadow-hover hover:-translate-y-0.5 border border-white/50"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-violet/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-foreground mb-0.5">{item.title}</h3>
                  <p className="text-sm text-muted-foreground truncate">{item.description}</p>
                </div>
                <Button
                  size="sm"
                  className="shrink-0 bg-gradient-hero hover:opacity-90 text-white gap-1.5 rounded-full px-4 h-8 text-xs shadow-card transition-all duration-300 group-hover:shadow-glow group-hover:scale-105"
                >
                  질문하기
                  <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentInterests;
