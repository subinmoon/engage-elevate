import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { X, ChevronLeft, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface TutorialModalProps {
  open: boolean;
  onComplete: (settings: UserSettings) => void;
  onSkip: () => void;
  userName?: string;
}

interface UserSettings {
  userName: string;
  assistantName: string;
  toneStyle: string;
  answerLength: string;
  allowWebSearch: boolean;
  allowFollowUpQuestions: boolean;
}

type TutorialStep = 
  | "greeting"
  | "intro-ask"
  | "intro-skip"
  | "intro-show"
  | "user-info-ask"
  | "user-info-skip"
  | "user-info-settings"
  | "settings-name"
  | "settings-tone"
  | "settings-length"
  | "settings-websearch"
  | "settings-recommend"
  | "complete";

interface ChatMessage {
  id: string;
  type: "bot" | "user" | "system";
  content: React.ReactNode;
  emotion?: "happy" | "wave" | "excited" | "thinking";
}

const toneOptions = [
  { id: "professional", label: "전문적인", emoji: "👔" },
  { id: "warm", label: "따뜻한", emoji: "🤗" },
  { id: "friendly", label: "친근한", emoji: "😊" },
];

const lengthOptions = [
  { id: "concise", label: "간결" },
  { id: "default", label: "보통" },
  { id: "detailed", label: "자세히" },
];

// 미니 마스코트 (채팅 아바타용)
function MiniMascot({ emotion = "happy", size = "md" }: { emotion?: "happy" | "wave" | "excited" | "thinking"; size?: "sm" | "md" }) {
  const sizeClass = size === "sm" ? "w-8 h-8" : "w-10 h-10";
  
  return (
    <div className={cn("relative flex-shrink-0", sizeClass)}>
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br from-[#3BB8E8] via-[#2AABE2] to-[#1A8BC2] rounded-xl shadow-md overflow-hidden",
        emotion === "wave" && "animate-[wiggle_0.5s_ease-in-out_infinite]",
        emotion === "excited" && "animate-[wiggle_0.3s_ease-in-out_infinite]"
      )}>
        <div className="absolute top-1 left-1 w-3 h-3 bg-white/40 rounded-full blur-[2px]" />
      </div>
      
      {/* 눈 */}
      <div className="absolute top-[35%] left-1/2 -translate-x-1/2 flex gap-1.5">
        <div className="w-1.5 h-2 bg-white rounded-full flex items-center justify-center">
          <div className="w-0.5 h-0.5 bg-gray-800 rounded-full" />
        </div>
        <div className="w-1.5 h-2 bg-white rounded-full flex items-center justify-center">
          <div className="w-0.5 h-0.5 bg-gray-800 rounded-full" />
        </div>
      </div>
      
      {/* 볼터치 */}
      <div className="absolute top-[55%] left-1 w-1.5 h-1 bg-pink-400/40 rounded-full blur-[1px]" />
      <div className="absolute top-[55%] right-1 w-1.5 h-1 bg-pink-400/40 rounded-full blur-[1px]" />
      
      {/* 입 */}
      <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2">
        {emotion === "happy" && <div className="w-2.5 h-1 border-b-[1.5px] border-white rounded-b-full" />}
        {emotion === "wave" && <div className="w-3 h-1.5 bg-white/90 rounded-b-lg rounded-t-sm" />}
        {emotion === "excited" && <div className="w-3 h-2 bg-white/90 rounded-full" />}
        {emotion === "thinking" && <div className="w-1.5 h-1.5 bg-white/70 rounded-full" />}
      </div>
      
      {/* 반짝이 효과 */}
      {emotion === "excited" && (
        <div className="absolute -top-1 -right-1 animate-[sparkle_1s_ease-in-out_infinite]">
          <Sparkles className="w-3 h-3 text-yellow-400" />
        </div>
      )}
    </div>
  );
}

// 큰 마스코트 (사이드)
function LargeMascot({ emotion = "happy" }: { emotion?: "happy" | "wave" | "excited" | "thinking" }) {
  return (
    <div className="relative">
      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-20 h-3 bg-black/10 rounded-[100%] blur-md" />
      
      <div className={cn(
        "relative transition-transform duration-300",
        emotion === "wave" && "animate-[bounce_1s_ease-in-out_infinite]",
        emotion === "excited" && "animate-[wiggle_0.5s_ease-in-out_infinite]"
      )}>
        <div className="w-24 h-24 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[#3BB8E8] via-[#2AABE2] to-[#1A8BC2] rounded-2xl shadow-2xl overflow-hidden">
            <div className="absolute top-2 left-2 w-8 h-8 bg-white/40 rounded-full blur-md" />
            <div className="absolute top-3 left-4 w-3 h-3 bg-white/60 rounded-full" />
            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[#1A7BA8]/30 to-transparent" />
          </div>
          
          <div className="absolute top-7 left-1/2 -translate-x-1/2 flex gap-4">
            <div className="relative">
              <div className={cn(
                "w-5 h-6 bg-white rounded-full shadow-inner flex items-center justify-center",
                emotion === "thinking" && "h-4"
              )}>
                <div className={cn(
                  "w-2.5 h-2.5 bg-gray-800 rounded-full relative",
                  emotion === "excited" && "scale-110"
                )}>
                  <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-white rounded-full" />
                </div>
              </div>
            </div>
            <div className="relative">
              <div className={cn(
                "w-5 h-6 bg-white rounded-full shadow-inner flex items-center justify-center",
                emotion === "thinking" && "h-4"
              )}>
                <div className={cn(
                  "w-2.5 h-2.5 bg-gray-800 rounded-full relative",
                  emotion === "excited" && "scale-110"
                )}>
                  <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-white rounded-full" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="absolute top-[3.5rem] left-3 w-3 h-2 bg-pink-400/40 rounded-full blur-[2px]" />
          <div className="absolute top-[3.5rem] right-3 w-3 h-2 bg-pink-400/40 rounded-full blur-[2px]" />
          
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2">
            {emotion === "happy" && <div className="w-6 h-3 border-b-[2px] border-white rounded-b-full" />}
            {emotion === "wave" && (
              <div className="w-8 h-4 bg-white/90 rounded-b-xl rounded-t-sm flex items-center justify-center">
                <div className="w-3 h-1.5 bg-pink-300 rounded-full mt-0.5" />
              </div>
            )}
            {emotion === "excited" && (
              <div className="w-8 h-5 bg-white/90 rounded-full flex items-center justify-center">
                <div className="w-4 h-2 bg-pink-300 rounded-full" />
              </div>
            )}
            {emotion === "thinking" && <div className="w-3 h-3 bg-white/70 rounded-full" />}
          </div>
        </div>
        
        {emotion === "wave" && (
          <div className="absolute -right-4 top-6 origin-bottom-left animate-[wave-hand_0.6s_ease-in-out_infinite_alternate]">
            <div className="w-5 h-9 bg-gradient-to-br from-[#3BB8E8] to-[#1A8BC2] rounded-lg shadow-lg relative">
              <div className="absolute top-1 left-1 w-1.5 h-1.5 bg-white/30 rounded-full" />
            </div>
          </div>
        )}
        
        {emotion === "excited" && (
          <>
            <div className="absolute -top-2 -right-2 animate-[sparkle_1s_ease-in-out_infinite]">
              <Sparkles className="w-5 h-5 text-yellow-400 drop-shadow-lg" />
            </div>
            <div className="absolute -top-1 -left-3 animate-[sparkle_1s_ease-in-out_infinite_0.3s]">
              <Sparkles className="w-4 h-4 text-yellow-300 drop-shadow-lg" />
            </div>
          </>
        )}
        
        {emotion === "thinking" && (
          <div className="absolute -top-3 -right-1 animate-bounce">
            <span className="text-xl font-bold text-primary drop-shadow-md">?</span>
          </div>
        )}
      </div>
    </div>
  );
}

// 봇 메시지 버블
function BotMessage({ children, emotion = "happy" }: { children: React.ReactNode; emotion?: "happy" | "wave" | "excited" | "thinking" }) {
  return (
    <div className="flex items-start gap-3 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-left-2 motion-safe:duration-300">
      <MiniMascot emotion={emotion} />
      <div className="bg-white rounded-2xl rounded-tl-md px-4 py-3 shadow-sm max-w-[85%]">
        <div className="text-gray-800 text-sm leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

// 사용자 선택 버블
function UserChoice({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-end motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-right-2 motion-safe:duration-300">
      <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-md px-4 py-3 shadow-sm">
        <div className="text-sm">{children}</div>
      </div>
    </div>
  );
}

// 시스템 카드 (기능 소개 등)
function SystemCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 shadow-sm border border-gray-100 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300">
      <div className="flex items-center gap-3">
        <span className="text-xl">{icon}</span>
        <div>
          <h4 className="font-medium text-gray-800 text-sm">{title}</h4>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
      </div>
    </div>
  );
}

export function TutorialModal({ open, onComplete, onSkip, userName: initialUserName = "경민" }: TutorialModalProps) {
  const [step, setStep] = useState<TutorialStep>("greeting");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userName, setUserName] = useState("");
  const [assistantName, setAssistantName] = useState("이수 GPT");
  const [toneStyle, setToneStyle] = useState("warm");
  const [answerLength, setAnswerLength] = useState("default");
  const [allowWebSearch, setAllowWebSearch] = useState(true);
  const [allowFollowUpQuestions, setAllowFollowUpQuestions] = useState(true);
  const [prevStep, setPrevStep] = useState<TutorialStep | null>(null);
  
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // 현재 감정 상태
  const currentEmotion = (): "happy" | "wave" | "excited" | "thinking" => {
    if (step === "greeting") return "wave";
    if (step === "intro-ask" || step === "settings-name" || step === "settings-websearch") return "thinking";
    if (step === "intro-show" || step === "user-info-settings" || step === "complete") return "excited";
    return "happy";
  };

  // 스크롤 자동 이동
  useEffect(() => {
    if (chatContainerRef.current) {
      setTimeout(() => {
        chatContainerRef.current?.scrollTo({
          top: chatContainerRef.current.scrollHeight,
          behavior: "smooth"
        });
      }, 100);
    }
  }, [step, messages]);

  // 메시지 히스토리 관리
  useEffect(() => {
    if (step === prevStep) return;
    
    const newMessages: ChatMessage[] = [];
    
    // 사용자 응답 추가 (이전 스텝에서 선택한 경우)
    if (prevStep === "intro-ask" && step === "intro-skip") {
      newMessages.push({ id: `user-${Date.now()}`, type: "user", content: "괜찮아" });
    } else if (prevStep === "intro-ask" && step === "intro-show") {
      newMessages.push({ id: `user-${Date.now()}`, type: "user", content: "알려줘" });
    } else if (prevStep === "user-info-ask" && step === "user-info-skip") {
      newMessages.push({ id: `user-${Date.now()}`, type: "user", content: "싫어" });
    } else if (prevStep === "user-info-ask" && step === "user-info-settings") {
      newMessages.push({ id: `user-${Date.now()}`, type: "user", content: "좋아" });
    }

    setMessages(prev => [...prev, ...newMessages]);
    setPrevStep(step);
  }, [step, prevStep]);

  const fireConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { x: 0.3, y: 0.6 },
      colors: ['#2AABE2', '#A5CF4C', '#FFD700', '#FF69B4'],
    });
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { x: 0.7, y: 0.6 },
      colors: ['#2AABE2', '#A5CF4C', '#FFD700', '#FF69B4'],
    });
    setTimeout(() => {
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { x: 0.5, y: 0.5 },
        colors: ['#2AABE2', '#A5CF4C', '#FFD700', '#FF69B4', '#9b87f5'],
      });
    }, 200);
  };

  const handleComplete = () => {
    fireConfetti();
    setTimeout(() => {
      onComplete({
        userName: userName || initialUserName,
        assistantName,
        toneStyle,
        answerLength,
        allowWebSearch,
        allowFollowUpQuestions,
      });
    }, 800);
  };

  const handleSkipAll = () => {
    onSkip();
  };

  // 뒤로가기
  const canGoBack = step !== "greeting";
  
  const handleGoBack = () => {
    const backMap: Record<TutorialStep, TutorialStep> = {
      "greeting": "greeting",
      "intro-ask": "greeting",
      "intro-skip": "intro-ask",
      "intro-show": "intro-ask",
      "user-info-ask": "intro-ask",
      "user-info-skip": "user-info-ask",
      "user-info-settings": "user-info-ask",
      "settings-name": "user-info-settings",
      "settings-tone": "settings-name",
      "settings-length": "settings-tone",
      "settings-websearch": "settings-length",
      "settings-recommend": "settings-websearch",
      "complete": "settings-recommend",
    };
    const prevTarget = backMap[step] || "greeting";
    setMessages([]);
    setPrevStep(null);
    setStep(prevTarget);
  };

  // 현재 스텝의 콘텐츠
  const renderCurrentStep = () => {
    switch (step) {
      case "greeting":
        return (
          <div className="space-y-4">
            <BotMessage emotion="wave">
              반가워요! 👋<br />
              놓치기 쉬운 업무까지 먼저 알려주는 업무 비서,<br />
              <strong className="text-primary">이수 GPT</strong>예요.
            </BotMessage>
            <div className="flex justify-center pt-2">
              <Button onClick={() => setStep("intro-ask")} className="rounded-full px-6">
                다음
              </Button>
            </div>
          </div>
        );

      case "intro-ask":
        return (
          <div className="space-y-4">
            <BotMessage emotion="thinking">
              저에 대해서 조금 알려드려도 될까요?
            </BotMessage>
            <div className="flex justify-center gap-3 pt-2">
              <Button variant="outline" onClick={() => setStep("intro-skip")} className="rounded-full px-5">
                괜찮아
              </Button>
              <Button onClick={() => setStep("intro-show")} className="rounded-full px-5">
                알려줘
              </Button>
            </div>
          </div>
        );

      case "intro-skip":
        return (
          <div className="space-y-4">
            <UserChoice>괜찮아</UserChoice>
            <BotMessage emotion="happy">
              알겠어요 🙂<br />
              이수 GPT가 궁금해질 때 언제든 다시 말씀해 주세요!
            </BotMessage>
            <div className="flex justify-center pt-2">
              <Button onClick={() => setStep("user-info-ask")} className="rounded-full px-6">
                다음
              </Button>
            </div>
          </div>
        );

      case "intro-show":
        return (
          <div className="space-y-4">
            <UserChoice>알려줘</UserChoice>
            <BotMessage emotion="excited">
              좋아요! 주요 기능을 소개해드릴게요 ✨
            </BotMessage>
            <div className="space-y-2 pl-13">
              <SystemCard icon="📋" title="메인 메뉴" description="자주 쓰는 기능들을 빠르게 찾아보세요" />
              <SystemCard icon="💬" title="대화 창" description="무엇이든 물어보세요!" />
              <SystemCard icon="⚡" title="사이드바" description="대화 기록과 즐겨찾기를 관리해요" />
            </div>
            <BotMessage emotion="happy">
              이수 GPT에 대해 궁금할 땐 언제든 다시 말씀해 주세요!
            </BotMessage>
            <div className="flex justify-center pt-2">
              <Button onClick={() => setStep("user-info-ask")} className="rounded-full px-6">
                다음
              </Button>
            </div>
          </div>
        );

      case "user-info-ask":
        return (
          <div className="space-y-4">
            <BotMessage emotion="happy">
              이제 <strong className="text-primary">박{initialUserName}님</strong>에 대해서도 알려주실래요?
            </BotMessage>
            <div className="flex justify-center gap-3 pt-2">
              <Button variant="outline" onClick={() => setStep("user-info-skip")} className="rounded-full px-5">
                싫어
              </Button>
              <Button onClick={() => setStep("user-info-settings")} className="rounded-full px-5">
                좋아
              </Button>
            </div>
          </div>
        );

      case "user-info-skip":
        return (
          <div className="space-y-4">
            <UserChoice>싫어</UserChoice>
            <BotMessage emotion="happy">
              괜찮아요 🙂<br />
              이제 이수 GPT를 바로 사용하실 수 있어요.<br />
              앞으로 <strong className="text-primary">{initialUserName}님</strong>이 놓치는 업무가 없도록 최선을 다할게요!
            </BotMessage>
            <div className="flex justify-center pt-2">
              <Button onClick={handleComplete} className="rounded-full px-6">
                시작하기 🚀
              </Button>
            </div>
          </div>
        );

      case "user-info-settings":
        return (
          <div className="space-y-4">
            <UserChoice>좋아</UserChoice>
            <BotMessage emotion="excited">
              좋아요! 몇 가지만 알려주시면<br />
              더 잘 도와드릴 수 있어요 😊
            </BotMessage>
            <div className="flex justify-center pt-2">
              <Button onClick={() => setStep("settings-name")} className="rounded-full px-6">
                시작하기
              </Button>
            </div>
          </div>
        );

      case "settings-name":
        return (
          <div className="space-y-4">
            <BotMessage emotion="thinking">
              어떻게 불러드릴까요?
            </BotMessage>
            <div className="px-4">
              <Input
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder={`예: ${initialUserName}님, 경민씨, 박과장님...`}
                className="w-full text-center py-3 rounded-xl border-2 border-primary/30 focus:border-primary bg-white"
                onKeyDown={(e) => e.key === "Enter" && setStep("settings-tone")}
                autoFocus
              />
            </div>
            <div className="flex justify-center gap-3 pt-2">
              <Button variant="outline" onClick={() => setStep("settings-tone")} className="rounded-full px-5">
                건너뛰기
              </Button>
              <Button onClick={() => setStep("settings-tone")} className="rounded-full px-5">
                다음
              </Button>
            </div>
          </div>
        );

      case "settings-tone":
        return (
          <div className="space-y-4">
            <BotMessage emotion="happy">
              어떤 말투가 좋으세요?
            </BotMessage>
            <div className="flex flex-wrap gap-2 justify-center px-4">
              {toneOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setToneStyle(option.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 transition-all hover:scale-105 text-sm",
                    toneStyle === option.id
                      ? "border-primary bg-primary/10 shadow-md"
                      : "border-gray-200 bg-white hover:border-primary/50"
                  )}
                >
                  <span>{option.emoji}</span>
                  <span className={cn("font-medium", toneStyle === option.id ? "text-primary" : "text-gray-700")}>
                    {option.label}
                  </span>
                </button>
              ))}
            </div>
            <div className="flex justify-center gap-3 pt-2">
              <Button variant="outline" onClick={() => setStep("settings-length")} className="rounded-full px-5">
                건너뛰기
              </Button>
              <Button onClick={() => setStep("settings-length")} className="rounded-full px-5">
                다음
              </Button>
            </div>
          </div>
        );

      case "settings-length":
        return (
          <div className="space-y-4">
            <BotMessage emotion="happy">
              답변 길이는요?
            </BotMessage>
            <div className="flex justify-center">
              <div className="flex bg-white rounded-full p-1 shadow-sm border">
                {lengthOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setAnswerLength(option.id)}
                    className={cn(
                      "px-5 py-2 text-sm font-medium rounded-full transition-all",
                      answerLength === option.id
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-gray-600 hover:text-gray-800"
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-center gap-3 pt-2">
              <Button variant="outline" onClick={() => setStep("settings-websearch")} className="rounded-full px-5">
                건너뛰기
              </Button>
              <Button onClick={() => setStep("settings-websearch")} className="rounded-full px-5">
                다음
              </Button>
            </div>
          </div>
        );

      case "settings-websearch":
        return (
          <div className="space-y-4">
            <BotMessage emotion="thinking">
              필요할 때 자동으로 웹 검색할까요?
            </BotMessage>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setAllowWebSearch(true)}
                className={cn(
                  "flex flex-col items-center gap-1.5 px-6 py-3 rounded-xl border-2 transition-all hover:scale-105",
                  allowWebSearch
                    ? "border-primary bg-primary/10 shadow-md"
                    : "border-gray-200 bg-white hover:border-primary/50"
                )}
              >
                <span className="text-2xl">🌐</span>
                <span className={cn("text-sm font-medium", allowWebSearch ? "text-primary" : "text-gray-700")}>ON</span>
              </button>
              <button
                onClick={() => setAllowWebSearch(false)}
                className={cn(
                  "flex flex-col items-center gap-1.5 px-6 py-3 rounded-xl border-2 transition-all hover:scale-105",
                  !allowWebSearch
                    ? "border-primary bg-primary/10 shadow-md"
                    : "border-gray-200 bg-white hover:border-primary/50"
                )}
              >
                <span className="text-2xl">🔒</span>
                <span className={cn("text-sm font-medium", !allowWebSearch ? "text-primary" : "text-gray-700")}>OFF</span>
              </button>
            </div>
            <div className="flex justify-center gap-3 pt-2">
              <Button variant="outline" onClick={() => setStep("settings-recommend")} className="rounded-full px-5">
                건너뛰기
              </Button>
              <Button onClick={() => setStep("settings-recommend")} className="rounded-full px-5">
                다음
              </Button>
            </div>
          </div>
        );

      case "settings-recommend":
        return (
          <div className="space-y-4">
            <BotMessage emotion="happy">
              대화 중 다음 질문을 추천해드릴까요?
            </BotMessage>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setAllowFollowUpQuestions(true)}
                className={cn(
                  "flex flex-col items-center gap-1.5 px-6 py-3 rounded-xl border-2 transition-all hover:scale-105",
                  allowFollowUpQuestions
                    ? "border-primary bg-primary/10 shadow-md"
                    : "border-gray-200 bg-white hover:border-primary/50"
                )}
              >
                <span className="text-2xl">💡</span>
                <span className={cn("text-sm font-medium", allowFollowUpQuestions ? "text-primary" : "text-gray-700")}>ON</span>
              </button>
              <button
                onClick={() => setAllowFollowUpQuestions(false)}
                className={cn(
                  "flex flex-col items-center gap-1.5 px-6 py-3 rounded-xl border-2 transition-all hover:scale-105",
                  !allowFollowUpQuestions
                    ? "border-primary bg-primary/10 shadow-md"
                    : "border-gray-200 bg-white hover:border-primary/50"
                )}
              >
                <span className="text-2xl">🤫</span>
                <span className={cn("text-sm font-medium", !allowFollowUpQuestions ? "text-primary" : "text-gray-700")}>OFF</span>
              </button>
            </div>
            <div className="flex justify-center pt-2">
              <Button onClick={() => setStep("complete")} className="rounded-full px-6">
                완료
              </Button>
            </div>
          </div>
        );

      case "complete":
        return (
          <div className="space-y-4">
            <BotMessage emotion="excited">
              설정이 완료됐어요! 🎉<br />
              이제 이수 GPT를 사용하실 수 있어요.<br />
              앞으로 <strong className="text-primary">{userName || initialUserName}님</strong>이 놓치는 업무가 없도록 최선을 다할게요!
            </BotMessage>
            <div className="flex justify-center pt-2">
              <Button onClick={handleComplete} className="rounded-full px-6">
                시작하기 🚀
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // 진행 단계 인덱스
  const getPhaseIndex = () => {
    if (step === "greeting") return 0;
    if (step.startsWith("intro")) return 1;
    if (step.startsWith("user-info")) return 2;
    if (step.startsWith("settings")) return 3;
    return 4;
  };

  return (
    <Dialog open={open}>
      <DialogContent 
        className="sm:max-w-xl w-[95vw] h-[520px] overflow-hidden p-0 border-none bg-gradient-to-br from-sky-50 via-white to-sky-50/50" 
        aria-describedby={undefined}
        overlayClassName="bg-black/40"
      >
        <VisuallyHidden>
          <DialogTitle>이수 GPT 튜토리얼</DialogTitle>
        </VisuallyHidden>
        
        <div className="flex h-full">
          {/* 왼쪽: 마스코트 영역 - 데스크탑만 */}
          <div className="hidden sm:flex w-40 bg-gradient-to-b from-sky-100 to-sky-50 flex-col items-center justify-center border-r border-sky-200/50">
            <LargeMascot emotion={currentEmotion()} />
            <p className="mt-4 text-sm font-medium text-gray-600">이수 GPT</p>
            
            {/* 진행 표시 */}
            <div className="mt-6 flex gap-1.5">
              {[0, 1, 2, 3, 4].map((idx) => (
                <div
                  key={idx}
                  className={cn(
                    "w-1.5 h-1.5 rounded-full transition-all duration-300",
                    idx <= getPhaseIndex() ? "bg-primary" : "bg-gray-300"
                  )}
                />
              ))}
            </div>
          </div>
          
          {/* 오른쪽: 채팅 영역 */}
          <div className="flex-1 flex flex-col">
            {/* 헤더 */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100 bg-white/80">
              {canGoBack ? (
                <button
                  onClick={handleGoBack}
                  className="flex items-center gap-1 text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  이전
                </button>
              ) : (
                <div />
              )}
              
              {/* 모바일: 헤더에 미니 마스코트 + 타이틀 */}
              <div className="sm:hidden flex items-center gap-2">
                <MiniMascot emotion={currentEmotion()} size="sm" />
                <span className="text-sm font-medium text-gray-600">이수 GPT</span>
              </div>
              
              <button
                onClick={handleSkipAll}
                className="flex items-center gap-1 text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
              >
                건너뛰기
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {/* 채팅 내용 */}
            <div 
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto px-3 py-4 space-y-3"
            >
              {renderCurrentStep()}
            </div>
            
            {/* 모바일 진행 표시 */}
            <div className="sm:hidden flex justify-center gap-1.5 py-2 border-t border-gray-100 bg-white/50">
              {[0, 1, 2, 3, 4].map((idx) => (
                <div
                  key={idx}
                  className={cn(
                    "w-1.5 h-1.5 rounded-full transition-all duration-300",
                    idx <= getPhaseIndex() ? "bg-primary" : "bg-gray-300"
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
