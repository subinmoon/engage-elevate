import logoIcon from "@/assets/logo-icon.png";

interface WelcomeHeaderProps {
  userName?: string;
}

const WelcomeHeader = ({ userName = "사용자" }: WelcomeHeaderProps) => {
  return (
    <div className="flex items-center gap-4 mb-6">
      <img src={logoIcon} alt="Logo" className="w-12 h-12" />
      <h1 className="text-2xl font-bold text-foreground">
        {userName}님, 오늘 하루도 화이팅!
      </h1>
    </div>
  );
};

export default WelcomeHeader;
