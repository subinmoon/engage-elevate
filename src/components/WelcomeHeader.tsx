import { MessageSquare } from "lucide-react";

interface WelcomeHeaderProps {
  userName?: string;
}

const WelcomeHeader = ({ userName = "사용자" }: WelcomeHeaderProps) => {
  return (
    <div className="flex items-center gap-4 mb-8">
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-lavender-dark flex items-center justify-center shadow-card">
        <MessageSquare className="w-7 h-7 text-primary-foreground" />
      </div>
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          {userName}님, 오늘 하루도 화이팅!
        </h1>
      </div>
    </div>
  );
};

export default WelcomeHeader;
