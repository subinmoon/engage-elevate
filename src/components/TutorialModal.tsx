import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { X, ChevronRight, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface TutorialModalProps {
  open: boolean;
  onComplete: (settings: UserSettings) => void;
  onSkip: () => void;
  userName?: string; // 박경민 등 사전에 알고있는 이름
}

interface UserSettings {
  userName: string;
  assistantName: string;
  toneStyle: string;
  answerLength: string;
  allowWebSearch: boolean;
  allowFollowUpQuestions: boolean;
}

// 튜토리얼 스텝 타입
type TutorialStep = 
  | "greeting"           // STEP 1: 첫 인사
  | "intro-ask"          // STEP 2: 소개 여부 묻기
  | "intro-skip"         // STEP 2-1: 괜찮아 선택
  | "intro-show"         // STEP 2-2: 알려줘 선택
  | "user-info-ask"      // STEP 3: 사용자 정보 설정 여부
  | "user-info-skip"     // STEP 3-1: 싫어 선택
  | "user-info-settings" // STEP 3-2: 좋아 선택 - 설정 시작
  | "settings-name"      // 호칭 설정
  | "settings-tone"      // 말투 선택
  | "settings-length"    // 답변 길이
  | "settings-websearch" // 자동 웹 검색
  | "settings-recommend" // 다음 질문 추천
  | "complete";          // 완료

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

// 귀여운 캐릭터 컴포넌트 (이수GPT 마스코트)
function MascotCharacter({ className, emotion = "happy" }: { className?: string; emotion?: "happy" | "wave" | "excited" | "thinking" }) {
  const eyeStyle = emotion === "thinking" ? "animate-pulse" : "";
  const bodyAnimation = emotion === "wave" ? "animate-bounce" : emotion === "excited" ? "animate-pulse" : "";
  
  return (
    <div className={cn("relative", bodyAnimation, className)}>
      {/* 캐릭터 몸통 */}
      <div className="w-24 h-24 bg-gradient-to-br from-[#2AABE2] to-[#1E90B8] rounded-2xl shadow-lg relative">
        {/* 하이라이트 */}
        <div className="absolute top-2 left-2 w-6 h-6 bg-white/30 rounded-full blur-sm" />
        
        {/* 눈 */}
        <div className="absolute top-8 left-4 flex gap-4">
          <div className={cn("w-4 h-5 bg-white rounded-full flex items-center justify-center", eyeStyle)}>
            <div className="w-2 h-2 bg-gray-800 rounded-full" />
          </div>
          <div className={cn("w-4 h-5 bg-white rounded-full flex items-center justify-center", eyeStyle)}>
            <div className="w-2 h-2 bg-gray-800 rounded-full" />
          </div>
        </div>
        
        {/* 입 */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
          {emotion === "happy" || emotion === "excited" ? (
            <div className="w-6 h-3 border-b-2 border-white rounded-b-full" />
          ) : (
            <div className="w-4 h-2 bg-white/60 rounded-full" />
          )}
        </div>
        
        {/* 볼터치 */}
        <div className="absolute bottom-8 left-1 w-3 h-2 bg-pink-300/50 rounded-full" />
        <div className="absolute bottom-8 right-1 w-3 h-2 bg-pink-300/50 rounded-full" />
      </div>
      
      {/* 손 인사 (wave 상태일 때) */}
      {emotion === "wave" && (
        <div className="absolute -right-3 top-6 w-5 h-8 bg-gradient-to-br from-[#2AABE2] to-[#1E90B8] rounded-lg transform rotate-12 animate-[wave_0.5s_ease-in-out_infinite_alternate] origin-bottom" />
      )}
      
      {/* 반짝이 효과 */}
      {emotion === "excited" && (
        <>
          <Sparkles className="absolute -top-2 -right-2 w-5 h-5 text-yellow-400 animate-pulse" />
          <Sparkles className="absolute -top-1 -left-3 w-4 h-4 text-yellow-300 animate-pulse" style={{ animationDelay: "200ms" }} />
        </>
      )}
    </div>
  );
}

// 메시지 버블 컴포넌트
function MessageBubble({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <div 
      className="bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg max-w-md motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-3 motion-safe:duration-500"
      style={{ animationDelay: `${delay}ms` }}
    >
      <p className="text-gray-800 text-base leading-relaxed">{children}</p>
    </div>
  );
}

// 버튼 선택지 컴포넌트
function ChoiceButtons({ 
  choices, 
  onSelect,
  delay = 300 
}: { 
  choices: { label: string; value: string; variant?: "primary" | "secondary" }[];
  onSelect: (value: string) => void;
  delay?: number;
}) {
  return (
    <div 
      className="flex flex-wrap gap-3 justify-center motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300"
      style={{ animationDelay: `${delay}ms` }}
    >
      {choices.map((choice, idx) => (
        <Button
          key={choice.value}
          onClick={() => onSelect(choice.value)}
          variant={choice.variant === "secondary" ? "outline" : "default"}
          className={cn(
            "px-6 py-3 rounded-full text-base font-medium transition-all hover:scale-105",
            choice.variant !== "secondary" && "bg-primary hover:bg-primary/90 shadow-md"
          )}
          style={{ animationDelay: `${delay + idx * 100}ms` }}
        >
          {choice.label}
        </Button>
      ))}
    </div>
  );
}

export function TutorialModal({ open, onComplete, onSkip, userName: initialUserName = "경민" }: TutorialModalProps) {
  const [step, setStep] = useState<TutorialStep>("greeting");
  const [userName, setUserName] = useState("");
  const [assistantName, setAssistantName] = useState("이수 GPT");
  const [toneStyle, setToneStyle] = useState("warm");
  const [answerLength, setAnswerLength] = useState("default");
  const [allowWebSearch, setAllowWebSearch] = useState(true);
  const [allowFollowUpQuestions, setAllowFollowUpQuestions] = useState(true);
  
  const contentRef = useRef<HTMLDivElement>(null);
  
  // 스크롤 자동 이동
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [step]);

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

  // 스텝별 콘텐츠 렌더링
  const renderStepContent = () => {
    switch (step) {
      // STEP 1: 첫 인사
      case "greeting":
        return (
          <div className="flex flex-col items-center gap-8 py-8">
            <MascotCharacter emotion="wave" className="motion-safe:animate-in motion-safe:zoom-in-95 motion-safe:duration-500" />
            <MessageBubble>
              반가워요! 👋<br />
              놓치기 쉬운 업무까지 먼저 알려주는 업무 비서,<br />
              <strong className="text-primary">이수 GPT</strong>예요.
            </MessageBubble>
            <ChoiceButtons
              choices={[{ label: "다음", value: "next" }]}
              onSelect={() => setStep("intro-ask")}
            />
          </div>
        );
      
      // STEP 2: 소개 여부 묻기
      case "intro-ask":
        return (
          <div className="flex flex-col items-center gap-8 py-8">
            <MascotCharacter emotion="thinking" className="motion-safe:animate-in motion-safe:zoom-in-95 motion-safe:duration-500" />
            <MessageBubble>
              저에 대해서 조금 알려드려도 될까요?
            </MessageBubble>
            <ChoiceButtons
              choices={[
                { label: "괜찮아", value: "skip", variant: "secondary" },
                { label: "알려줘", value: "show" },
              ]}
              onSelect={(value) => setStep(value === "skip" ? "intro-skip" : "intro-show")}
            />
          </div>
        );
      
      // STEP 2-1: 괜찮아 선택
      case "intro-skip":
        return (
          <div className="flex flex-col items-center gap-8 py-8">
            <MascotCharacter emotion="happy" className="motion-safe:animate-in motion-safe:zoom-in-95 motion-safe:duration-500" />
            <MessageBubble>
              알겠어요 🙂<br />
              이수 GPT가 궁금해질 때 언제든 다시 말씀해 주세요!
            </MessageBubble>
            <ChoiceButtons
              choices={[{ label: "다음", value: "next" }]}
              onSelect={() => setStep("user-info-ask")}
            />
          </div>
        );
      
      // STEP 2-2: 알려줘 선택 - 기능 소개
      case "intro-show":
        return (
          <div className="flex flex-col items-center gap-6 py-6">
            <MascotCharacter emotion="excited" className="motion-safe:animate-in motion-safe:zoom-in-95 motion-safe:duration-500" />
            
            {/* 기능 소개 카드들 */}
            <div className="w-full max-w-lg space-y-4 px-4">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-left-4 motion-safe:duration-300" style={{ animationDelay: "100ms" }}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📋</span>
                  <div>
                    <h4 className="font-semibold text-gray-800">메인 메뉴</h4>
                    <p className="text-sm text-gray-600">자주 쓰는 기능들을 빠르게 찾아보세요</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-right-4 motion-safe:duration-300" style={{ animationDelay: "200ms" }}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">💬</span>
                  <div>
                    <h4 className="font-semibold text-gray-800">대화 창</h4>
                    <p className="text-sm text-gray-600">무엇이든 물어보세요! 업무 도우미가 답해드려요</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-left-4 motion-safe:duration-300" style={{ animationDelay: "300ms" }}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⚡</span>
                  <div>
                    <h4 className="font-semibold text-gray-800">사이드바</h4>
                    <p className="text-sm text-gray-600">대화 기록과 즐겨찾기를 관리해요</p>
                  </div>
                </div>
              </div>
            </div>
            
            <MessageBubble delay={500}>
              이수 GPT에 대해 궁금할 땐 언제든 다시 말씀해 주세요!
            </MessageBubble>
            
            <ChoiceButtons
              choices={[{ label: "다음", value: "next" }]}
              onSelect={() => setStep("user-info-ask")}
              delay={600}
            />
          </div>
        );
      
      // STEP 3: 사용자 정보 설정 여부
      case "user-info-ask":
        return (
          <div className="flex flex-col items-center gap-8 py-8">
            <MascotCharacter emotion="happy" className="motion-safe:animate-in motion-safe:zoom-in-95 motion-safe:duration-500" />
            <MessageBubble>
              이제 <strong className="text-primary">박{initialUserName}님</strong>에 대해서도 알려주실래요?
            </MessageBubble>
            <ChoiceButtons
              choices={[
                { label: "싫어", value: "skip", variant: "secondary" },
                { label: "좋아", value: "settings" },
              ]}
              onSelect={(value) => setStep(value === "skip" ? "user-info-skip" : "user-info-settings")}
            />
          </div>
        );
      
      // STEP 3-1: 싫어 선택 - 바로 시작
      case "user-info-skip":
        return (
          <div className="flex flex-col items-center gap-8 py-8">
            <MascotCharacter emotion="happy" className="motion-safe:animate-in motion-safe:zoom-in-95 motion-safe:duration-500" />
            <MessageBubble>
              괜찮아요 🙂<br />
              이제 이수 GPT를 바로 사용하실 수 있어요.<br />
              앞으로 <strong className="text-primary">{initialUserName}님</strong>이 놓치는 업무가 없도록 최선을 다할게요!
            </MessageBubble>
            <ChoiceButtons
              choices={[{ label: "시작하기 🚀", value: "complete" }]}
              onSelect={handleComplete}
            />
          </div>
        );
      
      // STEP 3-2: 좋아 선택 - 설정 시작 안내
      case "user-info-settings":
        return (
          <div className="flex flex-col items-center gap-8 py-8">
            <MascotCharacter emotion="excited" className="motion-safe:animate-in motion-safe:zoom-in-95 motion-safe:duration-500" />
            <MessageBubble>
              좋아요! 몇 가지만 알려주시면<br />
              더 잘 도와드릴 수 있어요 😊
            </MessageBubble>
            <ChoiceButtons
              choices={[{ label: "시작하기", value: "next" }]}
              onSelect={() => setStep("settings-name")}
            />
          </div>
        );
      
      // 설정: 호칭
      case "settings-name":
        return (
          <div className="flex flex-col items-center gap-6 py-6">
            <MascotCharacter emotion="thinking" className="motion-safe:animate-in motion-safe:zoom-in-95 motion-safe:duration-300" />
            <MessageBubble>
              어떻게 불러드릴까요?
            </MessageBubble>
            <div className="w-full max-w-sm px-4 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300" style={{ animationDelay: "200ms" }}>
              <Input
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder={`예: ${initialUserName}님, 경민씨, 박과장님...`}
                className="w-full text-center text-lg py-4 rounded-xl border-2 border-primary/30 focus:border-primary bg-white/80"
                onKeyDown={(e) => e.key === "Enter" && setStep("settings-tone")}
                autoFocus
              />
            </div>
            <ChoiceButtons
              choices={[
                { label: "건너뛰기", value: "skip", variant: "secondary" },
                { label: "다음", value: "next" },
              ]}
              onSelect={() => setStep("settings-tone")}
              delay={300}
            />
          </div>
        );
      
      // 설정: 말투
      case "settings-tone":
        return (
          <div className="flex flex-col items-center gap-6 py-6">
            <MascotCharacter emotion="happy" className="motion-safe:animate-in motion-safe:zoom-in-95 motion-safe:duration-300" />
            <MessageBubble>
              어떤 말투가 좋으세요?
            </MessageBubble>
            <div className="flex flex-wrap gap-3 justify-center px-4 motion-safe:animate-in motion-safe:fade-in motion-safe:duration-300" style={{ animationDelay: "200ms" }}>
              {toneOptions.map((option, idx) => (
                <button
                  key={option.id}
                  onClick={() => setToneStyle(option.id)}
                  className={cn(
                    "flex items-center gap-2 px-5 py-3 rounded-xl border-2 transition-all hover:scale-105",
                    toneStyle === option.id
                      ? "border-primary bg-primary/10 shadow-md"
                      : "border-gray-200 bg-white/80 hover:border-primary/50"
                  )}
                  style={{ animationDelay: `${300 + idx * 80}ms` }}
                >
                  <span className="text-xl">{option.emoji}</span>
                  <span className={cn(
                    "text-base font-medium",
                    toneStyle === option.id ? "text-primary" : "text-gray-700"
                  )}>
                    {option.label}
                  </span>
                </button>
              ))}
            </div>
            <ChoiceButtons
              choices={[
                { label: "건너뛰기", value: "skip", variant: "secondary" },
                { label: "다음", value: "next" },
              ]}
              onSelect={() => setStep("settings-length")}
              delay={400}
            />
          </div>
        );
      
      // 설정: 답변 길이
      case "settings-length":
        return (
          <div className="flex flex-col items-center gap-6 py-6">
            <MascotCharacter emotion="happy" className="motion-safe:animate-in motion-safe:zoom-in-95 motion-safe:duration-300" />
            <MessageBubble>
              답변 길이는요?
            </MessageBubble>
            <div className="flex bg-white/80 rounded-full p-1.5 shadow-md motion-safe:animate-in motion-safe:fade-in motion-safe:duration-300" style={{ animationDelay: "200ms" }}>
              {lengthOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setAnswerLength(option.id)}
                  className={cn(
                    "px-6 py-3 text-base font-medium rounded-full transition-all",
                    answerLength === option.id
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-gray-600 hover:text-gray-800"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <ChoiceButtons
              choices={[
                { label: "건너뛰기", value: "skip", variant: "secondary" },
                { label: "다음", value: "next" },
              ]}
              onSelect={() => setStep("settings-websearch")}
              delay={300}
            />
          </div>
        );
      
      // 설정: 자동 웹 검색
      case "settings-websearch":
        return (
          <div className="flex flex-col items-center gap-6 py-6">
            <MascotCharacter emotion="thinking" className="motion-safe:animate-in motion-safe:zoom-in-95 motion-safe:duration-300" />
            <MessageBubble>
              필요할 때 자동으로 웹 검색할까요?
            </MessageBubble>
            <div className="flex gap-4 motion-safe:animate-in motion-safe:fade-in motion-safe:duration-300" style={{ animationDelay: "200ms" }}>
              <button
                onClick={() => setAllowWebSearch(true)}
                className={cn(
                  "flex flex-col items-center gap-2 px-8 py-4 rounded-xl border-2 transition-all hover:scale-105",
                  allowWebSearch
                    ? "border-primary bg-primary/10 shadow-md"
                    : "border-gray-200 bg-white/80 hover:border-primary/50"
                )}
              >
                <span className="text-3xl">🌐</span>
                <span className={cn("font-medium", allowWebSearch ? "text-primary" : "text-gray-700")}>ON</span>
              </button>
              <button
                onClick={() => setAllowWebSearch(false)}
                className={cn(
                  "flex flex-col items-center gap-2 px-8 py-4 rounded-xl border-2 transition-all hover:scale-105",
                  !allowWebSearch
                    ? "border-primary bg-primary/10 shadow-md"
                    : "border-gray-200 bg-white/80 hover:border-primary/50"
                )}
              >
                <span className="text-3xl">🔒</span>
                <span className={cn("font-medium", !allowWebSearch ? "text-primary" : "text-gray-700")}>OFF</span>
              </button>
            </div>
            <ChoiceButtons
              choices={[
                { label: "건너뛰기", value: "skip", variant: "secondary" },
                { label: "다음", value: "next" },
              ]}
              onSelect={() => setStep("settings-recommend")}
              delay={300}
            />
          </div>
        );
      
      // 설정: 다음 질문 추천
      case "settings-recommend":
        return (
          <div className="flex flex-col items-center gap-6 py-6">
            <MascotCharacter emotion="happy" className="motion-safe:animate-in motion-safe:zoom-in-95 motion-safe:duration-300" />
            <MessageBubble>
              대화 중 다음 질문을 추천해드릴까요?
            </MessageBubble>
            <div className="flex gap-4 motion-safe:animate-in motion-safe:fade-in motion-safe:duration-300" style={{ animationDelay: "200ms" }}>
              <button
                onClick={() => setAllowFollowUpQuestions(true)}
                className={cn(
                  "flex flex-col items-center gap-2 px-8 py-4 rounded-xl border-2 transition-all hover:scale-105",
                  allowFollowUpQuestions
                    ? "border-primary bg-primary/10 shadow-md"
                    : "border-gray-200 bg-white/80 hover:border-primary/50"
                )}
              >
                <span className="text-3xl">💡</span>
                <span className={cn("font-medium", allowFollowUpQuestions ? "text-primary" : "text-gray-700")}>ON</span>
              </button>
              <button
                onClick={() => setAllowFollowUpQuestions(false)}
                className={cn(
                  "flex flex-col items-center gap-2 px-8 py-4 rounded-xl border-2 transition-all hover:scale-105",
                  !allowFollowUpQuestions
                    ? "border-primary bg-primary/10 shadow-md"
                    : "border-gray-200 bg-white/80 hover:border-primary/50"
                )}
              >
                <span className="text-3xl">🤫</span>
                <span className={cn("font-medium", !allowFollowUpQuestions ? "text-primary" : "text-gray-700")}>OFF</span>
              </button>
            </div>
            <ChoiceButtons
              choices={[{ label: "완료", value: "complete" }]}
              onSelect={() => setStep("complete")}
              delay={300}
            />
          </div>
        );
      
      // 완료
      case "complete":
        return (
          <div className="flex flex-col items-center gap-8 py-8">
            <MascotCharacter emotion="excited" className="motion-safe:animate-in motion-safe:zoom-in-95 motion-safe:duration-500" />
            <MessageBubble>
              설정이 완료됐어요! 🎉<br />
              이제 이수 GPT를 사용하실 수 있어요.<br />
              앞으로 <strong className="text-primary">{userName || initialUserName}님</strong>이 놓치는 업무가 없도록 최선을 다할게요!
            </MessageBubble>
            <ChoiceButtons
              choices={[{ label: "시작하기 🚀", value: "start" }]}
              onSelect={handleComplete}
            />
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent 
        className="sm:max-w-2xl w-[95vw] max-h-[90vh] overflow-hidden p-0 border-none bg-gradient-to-b from-sky-50 via-sky-100/50 to-white" 
        aria-describedby={undefined}
      >
        <VisuallyHidden>
          <DialogTitle>이수 GPT 튜토리얼</DialogTitle>
        </VisuallyHidden>
        
        {/* 닫기/건너뛰기 버튼 */}
        <button
          onClick={handleSkipAll}
          className="absolute top-4 right-4 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 hover:bg-white text-gray-500 hover:text-gray-700 text-sm font-medium transition-all shadow-sm hover:shadow"
        >
          건너뛰기
          <X className="w-4 h-4" />
        </button>
        
        {/* 메인 콘텐츠 영역 */}
        <div 
          ref={contentRef}
          className="min-h-[500px] max-h-[80vh] overflow-y-auto px-6 py-4"
        >
          {renderStepContent()}
        </div>
        
        {/* 진행 표시 */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
          {["greeting", "intro", "user-info", "settings", "complete"].map((phase, idx) => {
            const currentPhaseIndex = step === "greeting" ? 0 
              : step.startsWith("intro") ? 1 
              : step.startsWith("user-info") ? 2 
              : step.startsWith("settings") ? 3 
              : 4;
            return (
              <div
                key={phase}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  idx <= currentPhaseIndex ? "bg-primary" : "bg-gray-300"
                )}
              />
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
