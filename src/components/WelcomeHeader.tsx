import { MessageSquare } from "lucide-react";

interface WelcomeHeaderProps {
  userName?: string;
}

const WelcomeHeader = ({ userName = "사용자" }: WelcomeHeaderProps) => {
  return (
    <div className="flex items-center gap-5 mb-10">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary via-lavender-dark to-primary flex items-center justify-center shadow-card animate-pulse-slow">
        <MessageSquare className="w-8 h-8 text-primary-foreground" />
      </div>
      <div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          {userName}님, 오늘 하루도 화이팅!
        </h1>
        <p className="text-muted-foreground mt-1">무엇을 도와드릴까요?</p>
      </div>
    </div>
  );
};

export default WelcomeHeader;
