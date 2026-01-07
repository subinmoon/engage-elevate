import logoIcon from "@/assets/logo-icon.png";

interface WelcomeHeaderProps {
  userName?: string;
}

const WelcomeHeader = ({ userName = "사용자" }: WelcomeHeaderProps) => {
  return (
    <div className="flex items-center gap-5 mb-8">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-hero rounded-2xl blur-xl opacity-50 animate-pulse-soft" />
        <div className="relative w-14 h-14 rounded-2xl bg-gradient-hero p-0.5 shadow-glow">
          <div className="w-full h-full rounded-[14px] bg-white/20 backdrop-blur flex items-center justify-center overflow-hidden">
            <img src={logoIcon} alt="Logo" className="w-10 h-10" />
          </div>
        </div>
      </div>
      <div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text">
          {userName}님, 오늘 하루도 화이팅!
        </h1>
        <p className="text-muted-foreground text-sm mt-0.5">무엇을 도와드릴까요?</p>
      </div>
    </div>
  );
};

export default WelcomeHeader;
