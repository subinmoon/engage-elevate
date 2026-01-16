import { useState, useEffect } from "react";
import logoIcon from "@/assets/logo-icon.png";

interface WelcomeHeaderProps {
  userName?: string;
}

const greetingMessages = [
  "오늘은 무엇이 궁금하세요?",
  "무엇을 도와드릴까요?",
  "오늘 하루도 화이팅! 💪",
  "궁금한 것이 있으시면 물어보세요!",
  "좋은 하루 되세요! ☀️",
  "무엇이든 질문해 주세요!",
  "오늘도 좋은 일만 가득하길! ✨",
];

const WelcomeHeader = ({ userName = "현민" }: WelcomeHeaderProps) => {
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    // Pick a random greeting on mount
    const randomIndex = Math.floor(Math.random() * greetingMessages.length);
    setGreeting(greetingMessages[randomIndex]);
  }, []);

  return (
    <div className="flex items-center gap-4 mb-6">
      <img src={logoIcon} alt="Logo" className="w-12 h-12" />
      <h1 className="text-2xl font-bold text-foreground">
        <span className="text-gradient-name">{userName}</span>님, {greeting}
      </h1>
    </div>
  );
};

export default WelcomeHeader;
