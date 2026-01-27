import { useState } from "react";
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

// 마스코트 캐릭터 컴포넌트
function MascotCharacter({ emotion = "happy" }: { emotion?: "happy" | "wave" | "excited" | "thinking" }) {
  return (
    <div className="relative w-24 h-24">
      {/* 그림자 */}
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-20 h-3 bg-black/10 rounded-[100%] blur-sm" />
      
      <div className={cn(
        "relative w-24 h-24 transition-transform duration-300",
        emotion === "wave" && "animate-bounce",
        emotion === "excited" && "animate-pulse"
      )}>
        {/* 메인 바디 */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#3BB8E8] via-[#2AABE2] to-[#1A8BC2] rounded-2xl shadow-xl overflow-hidden">
          <div className="absolute top-2 left-2 w-8 h-8 bg-white/30 rounded-full blur-md" />
          <div className="absolute top-3 left-4 w-3 h-3 bg-white/50 rounded-full" />
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[#1A7BA8]/30 to-transparent" />
        </div>
        
        {/* 눈 */}
        <div className="absolute top-7 left-1/2 -translate-x-1/2 flex gap-4">
          <div className="w-5 h-6 bg-white rounded-full shadow-inner flex items-center justify-center">
            <div className={cn(
              "w-2.5 h-2.5 bg-gray-800 rounded-full relative",
              emotion === "thinking" && "translate-y-0.5"
            )}>
              <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-white rounded-full" />
            </div>
          </div>
          <div className="w-5 h-6 bg-white rounded-full shadow-inner flex items-center justify-center">
            <div className={cn(
              "w-2.5 h-2.5 bg-gray-800 rounded-full relative",
              emotion === "thinking" && "translate-y-0.5"
            )}>
              <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-white rounded-full" />
            </div>
          </div>
        </div>
        
        {/* 볼터치 */}
        <div className="absolute top-14 left-3 w-3 h-2 bg-pink-400/40 rounded-full blur-[1px]" />
        <div className="absolute top-14 right-3 w-3 h-2 bg-pink-400/40 rounded-full blur-[1px]" />
        
        {/* 입 */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2">
          {emotion === "happy" && <div className="w-6 h-3 border-b-2 border-white rounded-b-full" />}
          {emotion === "wave" && (
            <div className="w-8 h-4 bg-white/90 rounded-b-lg rounded-t-sm flex items-center justify-center">
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
        
        {/* 손 (wave) */}
        {emotion === "wave" && (
          <div className="absolute -right-4 top-6 animate-[wave-hand_0.6s_ease-in-out_infinite_alternate]">
            <div className="w-5 h-9 bg-gradient-to-br from-[#3BB8E8] to-[#1A8BC2] rounded-lg shadow-md" />
          </div>
        )}
        
        {/* 반짝이 (excited) */}
        {emotion === "excited" && (
          <>
            <Sparkles className="absolute -top-2 -right-2 w-5 h-5 text-yellow-400 animate-pulse" />
            <Sparkles className="absolute -top-1 -left-3 w-4 h-4 text-yellow-300 animate-pulse" style={{ animationDelay: '0.3s' }} />
          </>
        )}
        
        {/* 물음표 (thinking) */}
        {emotion === "thinking" && (
          <span className="absolute -top-3 -right-1 text-xl font-bold text-[#2AABE2] animate-bounce">?</span>
        )}
      </div>
    </div>
  );
}

// 말풍선 컴포넌트
function SpeechBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative bg-white rounded-2xl px-6 py-4 shadow-lg max-w-sm border border-gray-100">
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-l border-t border-gray-100 transform rotate-45" />
      <div className="text-gray-800 text-base leading-relaxed text-center relative z-10">{children}</div>
    </div>
  );
}

export function TutorialModal({ open, onComplete, onSkip, userName: initialUserName = "경민" }: TutorialModalProps) {
  const [step, setStep] = useState<TutorialStep>("greeting");
  const [userName, setUserName] = useState("");
  const [toneStyle, setToneStyle] = useState("warm");
  const [answerLength, setAnswerLength] = useState("default");
  const [allowWebSearch, setAllowWebSearch] = useState(true);
  const [allowFollowUpQuestions, setAllowFollowUpQuestions] = useState(true);
  const [prevStep, setPrevStep] = useState<TutorialStep | null>(null);

  const fireConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { x: 0.5, y: 0.5 },
      colors: ['#2AABE2', '#A5CF4C', '#FFD700', '#FF69B4'],
    });
  };

  const handleComplete = () => {
    fireConfetti();
    setTimeout(() => {
      onComplete({
        userName: userName || initialUserName,
        assistantName: "이수 GPT",
        toneStyle,
        answerLength,
        allowWebSearch,
        allowFollowUpQuestions,
      });
    }, 600);
  };

  const goToStep = (next: TutorialStep) => {
    setPrevStep(step);
    setStep(next);
  };

  const handleGoBack = () => {
    if (prevStep) {
      setStep(prevStep);
      setPrevStep(null);
    } else {
      const backMap: Partial<Record<TutorialStep, TutorialStep>> = {
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
      setStep(backMap[step] || "greeting");
    }
  };

  // 현재 단계의 감정
  const getEmotion = (): "happy" | "wave" | "excited" | "thinking" => {
    if (step === "greeting") return "wave";
    if (step === "intro-ask" || step === "settings-name" || step === "settings-websearch") return "thinking";
    if (step === "intro-show" || step === "user-info-settings" || step === "complete") return "excited";
    return "happy";
  };

  // 현재 단계의 메시지
  const getMessage = () => {
    switch (step) {
      case "greeting":
        return (
          <>
            반가워요! 👋<br />
            놓치기 쉬운 업무까지 먼저 알려주는 업무 비서,<br />
            <span className="text-[#2AABE2] font-bold">이수 GPT</span>예요.
          </>
        );
      case "intro-ask":
        return <>저에 대해서 조금 <span className="text-[#2AABE2] font-bold">알려드려도</span> 될까요?</>;
      case "intro-skip":
        return (
          <>
            알겠어요 🙂<br />
            <span className="text-[#2AABE2] font-bold">이수 GPT</span>가 궁금해질 때 언제든 다시 말씀해 주세요!
          </>
        );
      case "user-info-ask":
        return <>이제 <span className="text-[#2AABE2] font-bold">박{initialUserName}님</span>에 대해서도 알려주실래요?</>;
      case "user-info-skip":
        return (
          <>
            괜찮아요 🙂<br />
            이제 <span className="text-[#2AABE2] font-bold">이수 GPT</span>를 바로 사용하실 수 있어요!
          </>
        );
      case "user-info-settings":
        return <>좋아요! 몇 가지만 알려주시면 더 <span className="text-[#2AABE2] font-bold">잘 도와드릴</span> 수 있어요 😊</>;
      case "settings-name":
        return <>어떻게 <span className="text-[#2AABE2] font-bold">불러드릴까요?</span></>;
      case "settings-tone":
        return <>어떤 <span className="text-[#2AABE2] font-bold">말투</span>가 좋으세요?</>;
      case "settings-length":
        return <><span className="text-[#2AABE2] font-bold">답변 길이</span>는요?</>;
      case "settings-websearch":
        return <>필요할 때 자동으로 <span className="text-[#2AABE2] font-bold">웹 검색</span>할까요?</>;
      case "settings-recommend":
        return <>대화 중 <span className="text-[#2AABE2] font-bold">다음 질문</span>을 추천해드릴까요?</>;
      case "complete":
        return (
          <>
            설정이 완료됐어요! 🎉<br />
            앞으로 <span className="text-[#A5CF4C] font-bold">{userName || initialUserName}님</span>이 놓치는 업무가 없도록 최선을 다할게요!
          </>
        );
      default:
        return null;
    }
  };

  // 현재 단계의 컨텐츠
  const renderContent = () => {
    switch (step) {
      case "intro-show":
        return (
          <div className="w-full max-w-md space-y-3 mt-2">
            {[
              { emoji: "📋", title: "메인 메뉴", desc: "자주 쓰는 기능들을 빠르게 찾아보세요" },
              { emoji: "💬", title: "대화 창", desc: "무엇이든 물어보세요! 업무 도우미가 답해드려요" },
              { emoji: "⚡", title: "사이드바", desc: "대화 기록과 즐겨찾기를 관리해요" },
            ].map((item, idx) => (
              <div key={idx} className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 flex items-center gap-3">
                <span className="text-xl">{item.emoji}</span>
                <div>
                  <h4 className="font-semibold text-gray-800 text-sm">{item.title}</h4>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
            <p className="text-center text-sm text-gray-600 mt-3">이수 GPT에 대해 궁금할 땐 언제든 다시 말씀해 주세요!</p>
          </div>
        );
      
      case "settings-name":
        return (
          <div className="w-full max-w-xs mt-2">
            <Input
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder={`예: ${initialUserName}님, 경민씨...`}
              className="text-center py-3 rounded-xl border-2 border-[#2AABE2]/30 focus:border-[#2AABE2] bg-white"
              onKeyDown={(e) => e.key === "Enter" && goToStep("settings-tone")}
              autoFocus
            />
          </div>
        );
      
      case "settings-tone":
        return (
          <div className="flex gap-2 mt-2">
            {toneOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setToneStyle(opt.id)}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-2 rounded-xl border-2 transition-all",
                  toneStyle === opt.id
                    ? "border-[#2AABE2] bg-[#2AABE2]/10"
                    : "border-gray-200 bg-white hover:border-[#2AABE2]/50"
                )}
              >
                <span>{opt.emoji}</span>
                <span className={cn("text-sm font-medium", toneStyle === opt.id ? "text-[#2AABE2]" : "text-gray-700")}>
                  {opt.label}
                </span>
              </button>
            ))}
          </div>
        );
      
      case "settings-length":
        return (
          <div className="flex bg-white rounded-full p-1 shadow-sm border border-gray-100 mt-2">
            {lengthOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setAnswerLength(opt.id)}
                className={cn(
                  "px-5 py-2 text-sm font-medium rounded-full transition-all",
                  answerLength === opt.id ? "bg-[#2AABE2] text-white" : "text-gray-600 hover:text-gray-800"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        );
      
      case "settings-websearch":
        return (
          <div className="flex gap-3 mt-2">
            {[
              { value: true, emoji: "🌐", label: "ON" },
              { value: false, emoji: "🔒", label: "OFF" },
            ].map((opt) => (
              <button
                key={opt.label}
                onClick={() => setAllowWebSearch(opt.value)}
                className={cn(
                  "flex flex-col items-center gap-1 px-6 py-3 rounded-xl border-2 transition-all",
                  allowWebSearch === opt.value
                    ? "border-[#2AABE2] bg-[#2AABE2]/10"
                    : "border-gray-200 bg-white hover:border-[#2AABE2]/50"
                )}
              >
                <span className="text-2xl">{opt.emoji}</span>
                <span className={cn("text-sm font-medium", allowWebSearch === opt.value ? "text-[#2AABE2]" : "text-gray-600")}>
                  {opt.label}
                </span>
              </button>
            ))}
          </div>
        );
      
      case "settings-recommend":
        return (
          <div className="flex gap-3 mt-2">
            {[
              { value: true, emoji: "💡", label: "ON" },
              { value: false, emoji: "🤫", label: "OFF" },
            ].map((opt) => (
              <button
                key={opt.label}
                onClick={() => setAllowFollowUpQuestions(opt.value)}
                className={cn(
                  "flex flex-col items-center gap-1 px-6 py-3 rounded-xl border-2 transition-all",
                  allowFollowUpQuestions === opt.value
                    ? "border-[#2AABE2] bg-[#2AABE2]/10"
                    : "border-gray-200 bg-white hover:border-[#2AABE2]/50"
                )}
              >
                <span className="text-2xl">{opt.emoji}</span>
                <span className={cn("text-sm font-medium", allowFollowUpQuestions === opt.value ? "text-[#2AABE2]" : "text-gray-600")}>
                  {opt.label}
                </span>
              </button>
            ))}
          </div>
        );
      
      default:
        return null;
    }
  };

  // 현재 단계의 버튼들
  const getButtons = () => {
    switch (step) {
      case "greeting":
        return [{ label: "다음", onClick: () => goToStep("intro-ask") }];
      case "intro-ask":
        return [
          { label: "괜찮아", onClick: () => goToStep("intro-skip"), secondary: true },
          { label: "알려줘", onClick: () => goToStep("intro-show") },
        ];
      case "intro-skip":
      case "intro-show":
        return [{ label: "다음", onClick: () => goToStep("user-info-ask") }];
      case "user-info-ask":
        return [
          { label: "싫어", onClick: () => goToStep("user-info-skip"), secondary: true },
          { label: "좋아", onClick: () => goToStep("user-info-settings") },
        ];
      case "user-info-skip":
        return [{ label: "시작하기 🚀", onClick: handleComplete }];
      case "user-info-settings":
        return [{ label: "시작하기", onClick: () => goToStep("settings-name") }];
      case "settings-name":
      case "settings-tone":
      case "settings-length":
      case "settings-websearch":
        const nextMap: Record<string, TutorialStep> = {
          "settings-name": "settings-tone",
          "settings-tone": "settings-length",
          "settings-length": "settings-websearch",
          "settings-websearch": "settings-recommend",
        };
        return [
          { label: "건너뛰기", onClick: () => goToStep(nextMap[step]), secondary: true },
          { label: "다음", onClick: () => goToStep(nextMap[step]) },
        ];
      case "settings-recommend":
        return [{ label: "완료", onClick: () => goToStep("complete") }];
      case "complete":
        return [{ label: "시작하기 🚀", onClick: handleComplete }];
      default:
        return [];
    }
  };

  const currentPhase = step === "greeting" ? 0 
    : step.startsWith("intro") ? 1 
    : step.startsWith("user-info") ? 2 
    : step.startsWith("settings") ? 3 
    : 4;

  return (
    <Dialog open={open}>
      <DialogContent 
        className="sm:max-w-lg w-[90vw] h-[480px] overflow-hidden p-0 border-none bg-gradient-to-b from-sky-50 via-sky-100/50 to-white"
        aria-describedby={undefined}
        overlayClassName="bg-black/40"
      >
        <VisuallyHidden>
          <DialogTitle>이수 GPT 튜토리얼</DialogTitle>
        </VisuallyHidden>
        
        {/* 헤더 버튼들 */}
        {step !== "greeting" && (
          <button
            onClick={handleGoBack}
            className="absolute top-3 left-3 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/80 hover:bg-white text-gray-500 hover:text-gray-700 text-sm transition-all shadow-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            이전
          </button>
        )}
        
        <button
          onClick={onSkip}
          className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/80 hover:bg-white text-gray-500 hover:text-gray-700 text-sm transition-all shadow-sm"
        >
          건너뛰기
          <X className="w-4 h-4" />
        </button>

        {/* 메인 컨텐츠 */}
        <div className="flex flex-col items-center justify-center h-full px-6 py-8">
          {/* 마스코트 - 고정 위치 */}
          <div className="mb-4">
            <MascotCharacter emotion={getEmotion()} />
          </div>
          
          {/* 말풍선 */}
          <div className="mb-4">
            <SpeechBubble>{getMessage()}</SpeechBubble>
          </div>
          
          {/* 추가 컨텐츠 */}
          {renderContent()}
          
          {/* 버튼들 */}
          <div className="flex gap-3 mt-6">
            {getButtons().map((btn, idx) => (
              <Button
                key={idx}
                onClick={btn.onClick}
                className={cn(
                  "px-6 py-2.5 rounded-full text-sm font-semibold transition-all",
                  btn.secondary
                    ? "border-2 border-gray-300 bg-white text-gray-600 hover:border-[#2AABE2] hover:text-[#2AABE2]"
                    : "bg-[#2AABE2] hover:bg-[#239ACC] text-white shadow-md"
                )}
                variant={btn.secondary ? "outline" : "default"}
              >
                {btn.label}
              </Button>
            ))}
          </div>
        </div>

        {/* 진행 인디케이터 */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
          {[0, 1, 2, 3, 4].map((idx) => (
            <div
              key={idx}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                idx <= currentPhase ? "bg-[#2AABE2]" : "bg-gray-300"
              )}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
