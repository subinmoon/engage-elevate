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
import { X, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
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

// 고퀄리티 마스코트 캐릭터 컴포넌트
function MascotCharacter({ className, emotion = "happy" }: { className?: string; emotion?: "happy" | "wave" | "excited" | "thinking" }) {
  return (
    <div className={cn("relative", className)}>
      {/* 그림자 */}
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-28 h-4 bg-black/10 rounded-[100%] blur-md" />
      
      {/* 메인 캐릭터 컨테이너 */}
      <div className={cn(
        "relative transition-transform duration-300",
        emotion === "wave" && "animate-[bounce_1s_ease-in-out_infinite]",
        emotion === "excited" && "animate-[wiggle_0.5s_ease-in-out_infinite]"
      )}>
        {/* 캐릭터 몸통 */}
        <div className="w-32 h-32 relative">
          {/* 메인 바디 - 3D 효과 */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#3BB8E8] via-[#2AABE2] to-[#1A8BC2] rounded-3xl shadow-2xl overflow-hidden">
            {/* 광택 하이라이트 */}
            <div className="absolute top-3 left-3 w-10 h-10 bg-white/40 rounded-full blur-md" />
            <div className="absolute top-4 left-5 w-4 h-4 bg-white/60 rounded-full" />
            
            {/* 바디 하단 그라데이션 */}
            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[#1A7BA8]/30 to-transparent" />
          </div>
          
          {/* 눈 컨테이너 */}
          <div className="absolute top-10 left-1/2 -translate-x-1/2 flex gap-5">
            {/* 왼쪽 눈 */}
            <div className="relative">
              <div className={cn(
                "w-6 h-7 bg-white rounded-full shadow-inner flex items-center justify-center transition-all duration-200",
                emotion === "thinking" && "h-5"
              )}>
                {/* 눈동자 */}
                <div className={cn(
                  "w-3 h-3 bg-gray-800 rounded-full relative transition-all duration-300",
                  emotion === "thinking" && "translate-y-0.5 translate-x-0.5",
                  emotion === "excited" && "scale-110"
                )}>
                  {/* 눈 반짝임 */}
                  <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-white rounded-full" />
                </div>
              </div>
              {/* 눈썹 (thinking 상태) */}
              {emotion === "thinking" && (
                <div className="absolute -top-2 left-0 w-6 h-1 bg-[#1A7BA8] rounded-full transform -rotate-6" />
              )}
            </div>
            
            {/* 오른쪽 눈 */}
            <div className="relative">
              <div className={cn(
                "w-6 h-7 bg-white rounded-full shadow-inner flex items-center justify-center transition-all duration-200",
                emotion === "thinking" && "h-5"
              )}>
                <div className={cn(
                  "w-3 h-3 bg-gray-800 rounded-full relative transition-all duration-300",
                  emotion === "thinking" && "translate-y-0.5 -translate-x-0.5",
                  emotion === "excited" && "scale-110"
                )}>
                  <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-white rounded-full" />
                </div>
              </div>
              {emotion === "thinking" && (
                <div className="absolute -top-2 right-0 w-6 h-1 bg-[#1A7BA8] rounded-full transform rotate-6" />
              )}
            </div>
          </div>
          
          {/* 볼터치 */}
          <div className="absolute top-[4.5rem] left-4 w-4 h-2.5 bg-pink-400/40 rounded-full blur-[2px]" />
          <div className="absolute top-[4.5rem] right-4 w-4 h-2.5 bg-pink-400/40 rounded-full blur-[2px]" />
          
          {/* 입 */}
          <div className="absolute bottom-7 left-1/2 -translate-x-1/2">
            {emotion === "happy" && (
              <div className="w-8 h-4 border-b-[3px] border-white rounded-b-full" />
            )}
            {emotion === "wave" && (
              <div className="w-10 h-5 bg-white/90 rounded-b-xl rounded-t-sm flex items-center justify-center">
                <div className="w-4 h-2 bg-pink-300 rounded-full mt-1" />
              </div>
            )}
            {emotion === "excited" && (
              <div className="w-10 h-6 bg-white/90 rounded-full flex items-center justify-center">
                <div className="w-5 h-3 bg-pink-300 rounded-full" />
              </div>
            )}
            {emotion === "thinking" && (
              <div className="w-4 h-4 bg-white/70 rounded-full" />
            )}
          </div>
        </div>
        
        {/* 손 (wave 상태) */}
        {emotion === "wave" && (
          <div className="absolute -right-6 top-8 origin-bottom-left animate-[wave-hand_0.6s_ease-in-out_infinite_alternate]">
            <div className="w-7 h-12 bg-gradient-to-br from-[#3BB8E8] to-[#1A8BC2] rounded-xl shadow-lg relative">
              <div className="absolute top-1 left-1 w-2 h-2 bg-white/30 rounded-full" />
            </div>
          </div>
        )}
        
        {/* 반짝이 효과 (excited 상태) */}
        {emotion === "excited" && (
          <>
            <div className="absolute -top-3 -right-3 animate-[sparkle_1s_ease-in-out_infinite]">
              <Sparkles className="w-6 h-6 text-yellow-400 drop-shadow-lg" />
            </div>
            <div className="absolute -top-2 -left-4 animate-[sparkle_1s_ease-in-out_infinite_0.3s]">
              <Sparkles className="w-5 h-5 text-yellow-300 drop-shadow-lg" />
            </div>
            <div className="absolute top-0 right-2 animate-[sparkle_1s_ease-in-out_infinite_0.6s]">
              <Sparkles className="w-4 h-4 text-orange-300 drop-shadow-lg" />
            </div>
          </>
        )}
        
        {/* 물음표 (thinking 상태) */}
        {emotion === "thinking" && (
          <div className="absolute -top-4 -right-2 animate-bounce">
            <span className="text-2xl font-bold text-primary drop-shadow-md">?</span>
          </div>
        )}
      </div>
    </div>
  );
}

// 말풍선 컴포넌트 (마스코트 옆에 표시)
function SpeechBubble({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <div 
      className="relative bg-white rounded-2xl px-6 py-5 shadow-xl max-w-sm motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-left-4 motion-safe:duration-500 border border-gray-100"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* 말풍선 꼬리 */}
      <div className="absolute -left-3 top-6 w-4 h-4 bg-white border-l border-b border-gray-100 transform rotate-45" />
      <p className="text-gray-800 text-lg font-medium leading-relaxed relative z-10">{children}</p>
    </div>
  );
}

// 기존 메시지 버블 (하단용)
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

// 버튼 선택지 컴포넌트 (이수 로고 색상 사용)
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
            "px-8 py-3 rounded-full text-base font-semibold transition-all hover:scale-105",
            choice.variant !== "secondary" 
              ? "bg-[#2AABE2] hover:bg-[#2AABE2]/90 text-white shadow-lg shadow-[#2AABE2]/30"
              : "border-2 border-gray-300 hover:border-[#2AABE2] text-gray-600 hover:text-[#2AABE2]"
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
          <div className="flex flex-col items-center gap-8 py-8 h-full justify-center">
            {/* 마스코트 + 말풍선 가로 배치 */}
            <div className="flex items-start gap-4">
              <MascotCharacter emotion="wave" className="motion-safe:animate-in motion-safe:zoom-in-95 motion-safe:duration-500 shrink-0" />
              <SpeechBubble>
                반가워요! 👋<br />
                놓치기 쉬운 업무까지 먼저 알려주는 업무 비서,<br />
                <span className="text-[#2AABE2] font-bold text-xl">이수 GPT</span>예요.
              </SpeechBubble>
            </div>
            <ChoiceButtons
              choices={[{ label: "다음", value: "next" }]}
              onSelect={() => setStep("intro-ask")}
            />
          </div>
        );
      
      // STEP 2: 소개 여부 묻기
      case "intro-ask":
        return (
          <div className="flex flex-col items-center gap-8 py-8 h-full justify-center">
            <div className="flex items-start gap-4">
              <MascotCharacter emotion="thinking" className="motion-safe:animate-in motion-safe:zoom-in-95 motion-safe:duration-500 shrink-0" />
              <SpeechBubble>
                저에 대해서 조금 <span className="text-[#2AABE2] font-bold">알려드려도</span> 될까요?
              </SpeechBubble>
            </div>
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
          <div className="flex flex-col items-center gap-8 py-8 h-full justify-center">
            <div className="flex items-start gap-4">
              <MascotCharacter emotion="happy" className="motion-safe:animate-in motion-safe:zoom-in-95 motion-safe:duration-500 shrink-0" />
              <SpeechBubble>
                알겠어요 🙂<br />
                <span className="text-[#2AABE2] font-bold">이수 GPT</span>가 궁금해질 때 언제든 다시 말씀해 주세요!
              </SpeechBubble>
            </div>
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
          <div className="flex flex-col items-center gap-8 py-8 h-full justify-center">
            <div className="flex items-start gap-4">
              <MascotCharacter emotion="happy" className="motion-safe:animate-in motion-safe:zoom-in-95 motion-safe:duration-500 shrink-0" />
              <SpeechBubble>
                이제 <span className="text-[#2AABE2] font-bold">박{initialUserName}님</span>에 대해서도 알려주실래요?
              </SpeechBubble>
            </div>
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
          <div className="flex flex-col items-center gap-8 py-8 h-full justify-center">
            <div className="flex items-start gap-4">
              <MascotCharacter emotion="happy" className="motion-safe:animate-in motion-safe:zoom-in-95 motion-safe:duration-500 shrink-0" />
              <SpeechBubble>
                괜찮아요 🙂<br />
                이제 <span className="text-[#2AABE2] font-bold">이수 GPT</span>를 바로 사용하실 수 있어요.<br />
                앞으로 <span className="text-[#A5CF4C] font-bold">{initialUserName}님</span>이 놓치는 업무가 없도록 최선을 다할게요!
              </SpeechBubble>
            </div>
            <ChoiceButtons
              choices={[{ label: "시작하기 🚀", value: "complete" }]}
              onSelect={handleComplete}
            />
          </div>
        );
      
      // STEP 3-2: 좋아 선택 - 설정 시작 안내
      case "user-info-settings":
        return (
          <div className="flex flex-col items-center gap-8 py-8 h-full justify-center">
            <div className="flex items-start gap-4">
              <MascotCharacter emotion="excited" className="motion-safe:animate-in motion-safe:zoom-in-95 motion-safe:duration-500 shrink-0" />
              <SpeechBubble>
                좋아요! 몇 가지만 알려주시면<br />
                더 <span className="text-[#2AABE2] font-bold">잘 도와드릴 수</span> 있어요 😊
              </SpeechBubble>
            </div>
            <ChoiceButtons
              choices={[{ label: "시작하기", value: "next" }]}
              onSelect={() => setStep("settings-name")}
            />
          </div>
        );
      
      // 설정: 호칭
      case "settings-name":
        return (
          <div className="flex flex-col items-center gap-6 py-6 h-full justify-center">
            <div className="flex items-start gap-4">
              <MascotCharacter emotion="thinking" className="motion-safe:animate-in motion-safe:zoom-in-95 motion-safe:duration-300 shrink-0" />
              <SpeechBubble>
                어떻게 <span className="text-[#2AABE2] font-bold">불러드릴까요?</span>
              </SpeechBubble>
            </div>
            <div className="w-full max-w-sm px-4 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300" style={{ animationDelay: "200ms" }}>
              <Input
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder={`예: ${initialUserName}님, 경민씨, 박과장님...`}
                className="w-full text-center text-lg py-4 rounded-xl border-2 border-[#2AABE2]/30 focus:border-[#2AABE2] bg-white/80"
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
          <div className="flex flex-col items-center gap-6 py-6 h-full justify-center">
            <div className="flex items-start gap-4">
              <MascotCharacter emotion="happy" className="motion-safe:animate-in motion-safe:zoom-in-95 motion-safe:duration-300 shrink-0" />
              <SpeechBubble>
                어떤 <span className="text-[#2AABE2] font-bold">말투</span>가 좋으세요?
              </SpeechBubble>
            </div>
            <div className="flex flex-wrap gap-3 justify-center px-4 motion-safe:animate-in motion-safe:fade-in motion-safe:duration-300" style={{ animationDelay: "200ms" }}>
              {toneOptions.map((option, idx) => (
                <button
                  key={option.id}
                  onClick={() => setToneStyle(option.id)}
                  className={cn(
                    "flex items-center gap-2 px-5 py-3 rounded-xl border-2 transition-all hover:scale-105",
                    toneStyle === option.id
                      ? "border-[#2AABE2] bg-[#2AABE2]/10 shadow-md"
                      : "border-gray-200 bg-white/80 hover:border-[#2AABE2]/50"
                  )}
                  style={{ animationDelay: `${300 + idx * 80}ms` }}
                >
                  <span className="text-xl">{option.emoji}</span>
                  <span className={cn(
                    "text-base font-medium",
                    toneStyle === option.id ? "text-[#2AABE2]" : "text-gray-700"
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
          <div className="flex flex-col items-center gap-6 py-6 h-full justify-center">
            <div className="flex items-start gap-4">
              <MascotCharacter emotion="happy" className="motion-safe:animate-in motion-safe:zoom-in-95 motion-safe:duration-300 shrink-0" />
              <SpeechBubble>
                <span className="text-[#2AABE2] font-bold">답변 길이</span>는요?
              </SpeechBubble>
            </div>
            <div className="flex bg-white/80 rounded-full p-1.5 shadow-md motion-safe:animate-in motion-safe:fade-in motion-safe:duration-300" style={{ animationDelay: "200ms" }}>
              {lengthOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setAnswerLength(option.id)}
                  className={cn(
                    "px-6 py-3 text-base font-medium rounded-full transition-all",
                    answerLength === option.id
                      ? "bg-[#2AABE2] text-white shadow-sm"
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
          <div className="flex flex-col items-center gap-6 py-6 h-full justify-center">
            <div className="flex items-start gap-4">
              <MascotCharacter emotion="thinking" className="motion-safe:animate-in motion-safe:zoom-in-95 motion-safe:duration-300 shrink-0" />
              <SpeechBubble>
                필요할 때 자동으로 <span className="text-[#2AABE2] font-bold">웹 검색</span>할까요?
              </SpeechBubble>
            </div>
            <div className="flex gap-4 motion-safe:animate-in motion-safe:fade-in motion-safe:duration-300" style={{ animationDelay: "200ms" }}>
              <button
                onClick={() => setAllowWebSearch(true)}
                className={cn(
                  "flex flex-col items-center gap-2 px-8 py-4 rounded-xl border-2 transition-all hover:scale-105",
                  allowWebSearch
                    ? "border-[#2AABE2] bg-[#2AABE2]/10 shadow-md"
                    : "border-gray-200 bg-white/80 hover:border-[#2AABE2]/50"
                )}
              >
                <span className="text-3xl">🌐</span>
                <span className={cn("font-medium", allowWebSearch ? "text-[#2AABE2]" : "text-gray-700")}>ON</span>
              </button>
              <button
                onClick={() => setAllowWebSearch(false)}
                className={cn(
                  "flex flex-col items-center gap-2 px-8 py-4 rounded-xl border-2 transition-all hover:scale-105",
                  !allowWebSearch
                    ? "border-[#2AABE2] bg-[#2AABE2]/10 shadow-md"
                    : "border-gray-200 bg-white/80 hover:border-[#2AABE2]/50"
                )}
              >
                <span className="text-3xl">🔒</span>
                <span className={cn("font-medium", !allowWebSearch ? "text-[#2AABE2]" : "text-gray-700")}>OFF</span>
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
          <div className="flex flex-col items-center gap-6 py-6 h-full justify-center">
            <div className="flex items-start gap-4">
              <MascotCharacter emotion="happy" className="motion-safe:animate-in motion-safe:zoom-in-95 motion-safe:duration-300 shrink-0" />
              <SpeechBubble>
                대화 중 <span className="text-[#2AABE2] font-bold">다음 질문</span>을 추천해드릴까요?
              </SpeechBubble>
            </div>
            <div className="flex gap-4 motion-safe:animate-in motion-safe:fade-in motion-safe:duration-300" style={{ animationDelay: "200ms" }}>
              <button
                onClick={() => setAllowFollowUpQuestions(true)}
                className={cn(
                  "flex flex-col items-center gap-2 px-8 py-4 rounded-xl border-2 transition-all hover:scale-105",
                  allowFollowUpQuestions
                    ? "border-[#A5CF4C] bg-[#A5CF4C]/10 shadow-md"
                    : "border-gray-200 bg-white/80 hover:border-[#A5CF4C]/50"
                )}
              >
                <span className="text-3xl">💡</span>
                <span className={cn("font-medium", allowFollowUpQuestions ? "text-[#A5CF4C]" : "text-gray-700")}>ON</span>
              </button>
              <button
                onClick={() => setAllowFollowUpQuestions(false)}
                className={cn(
                  "flex flex-col items-center gap-2 px-8 py-4 rounded-xl border-2 transition-all hover:scale-105",
                  !allowFollowUpQuestions
                    ? "border-[#A5CF4C] bg-[#A5CF4C]/10 shadow-md"
                    : "border-gray-200 bg-white/80 hover:border-[#A5CF4C]/50"
                )}
              >
                <span className="text-3xl">🤫</span>
                <span className={cn("font-medium", !allowFollowUpQuestions ? "text-[#A5CF4C]" : "text-gray-700")}>OFF</span>
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
          <div className="flex flex-col items-center gap-8 py-8 h-full justify-center">
            <div className="flex items-start gap-4">
              <MascotCharacter emotion="excited" className="motion-safe:animate-in motion-safe:zoom-in-95 motion-safe:duration-500 shrink-0" />
              <SpeechBubble>
                설정이 완료됐어요! 🎉<br />
                이제 <span className="text-[#2AABE2] font-bold">이수 GPT</span>를 사용하실 수 있어요.<br />
                앞으로 <span className="text-[#A5CF4C] font-bold">{userName || initialUserName}님</span>이 놓치는 업무가 없도록 최선을 다할게요!
              </SpeechBubble>
            </div>
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

  // 뒤로가기 가능 여부 체크
  const canGoBack = step !== "greeting";
  
  // 뒤로가기 핸들러
  const handleGoBack = () => {
    const backMap: Record<TutorialStep, TutorialStep> = {
      "greeting": "greeting",
      "intro-ask": "greeting",
      "intro-skip": "intro-ask",
      "intro-show": "intro-ask",
      "user-info-ask": step === "intro-skip" ? "intro-skip" : "intro-show",
      "user-info-skip": "user-info-ask",
      "user-info-settings": "user-info-ask",
      "settings-name": "user-info-settings",
      "settings-tone": "settings-name",
      "settings-length": "settings-tone",
      "settings-websearch": "settings-length",
      "settings-recommend": "settings-websearch",
      "complete": "settings-recommend",
    };
    setStep(backMap[step] || "greeting");
  };

  return (
    <Dialog open={open}>
      <DialogContent 
        className="sm:max-w-2xl w-[95vw] h-[550px] overflow-hidden p-0 border-none bg-gradient-to-b from-sky-50 via-sky-100/50 to-white" 
        aria-describedby={undefined}
        overlayClassName="bg-black/40"
      >
        <VisuallyHidden>
          <DialogTitle>이수 GPT 튜토리얼</DialogTitle>
        </VisuallyHidden>
        
        {/* 뒤로가기 버튼 */}
        {canGoBack && (
          <button
            onClick={handleGoBack}
            className="absolute top-4 left-4 z-10 flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/80 hover:bg-white text-gray-500 hover:text-gray-700 text-sm font-medium transition-all shadow-sm hover:shadow"
          >
            <ChevronLeft className="w-4 h-4" />
            이전
          </button>
        )}
        
        {/* 닫기/건너뛰기 버튼 */}
        <button
          onClick={handleSkipAll}
          className="absolute top-4 right-4 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 hover:bg-white text-gray-500 hover:text-gray-700 text-sm font-medium transition-all shadow-sm hover:shadow"
        >
          건너뛰기
          <X className="w-4 h-4" />
        </button>
        
        {/* 메인 콘텐츠 영역 - 고정 높이 */}
        <div 
          ref={contentRef}
          className="h-[550px] overflow-y-auto px-6 py-4 flex flex-col"
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
                  "w-2.5 h-2.5 rounded-full transition-all duration-300",
                  idx <= currentPhaseIndex ? "bg-[#2AABE2]" : "bg-gray-300"
                )}
              />
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
