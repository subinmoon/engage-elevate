import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Sparkles, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GuideStep {
  id: string;
  position: { x: string; y: string }; // 캐릭터 위치
  bubblePosition: "top" | "bottom" | "left" | "right";
  message: string;
  highlightArea?: { top: string; left: string; width: string; height: string };
}

type Placement = "left" | "right" | "top" | "bottom";

const clamp = (n: number, min: number, max: number) => Math.min(Math.max(n, min), max);

const getPreferredPlacement = (bubblePosition: GuideStep["bubblePosition"]): Placement => {
  // 말풍선이 놓인 방향의 반대쪽(=하이라이트 밖)으로 기본 배치
  switch (bubblePosition) {
    case "left":
      return "right";
    case "right":
      return "left";
    case "top":
      return "bottom";
    case "bottom":
      return "top";
    default:
      return "bottom";
  }
};

// 가이드 스텝 데이터 - 반응형을 위해 calc() 사용
const guideSteps: GuideStep[] = [
  {
    id: "sidebar",
    position: { x: "270px", y: "50%" },
    bubblePosition: "right",
    message: "여기는 사이드바예요! 🗂️\n새 채팅을 시작하거나\n이전 대화를 찾을 수 있어요.",
    highlightArea: { top: "0", left: "0", width: "256px", height: "100%" },
  },
  {
    id: "header",
    position: { x: "calc(50% + 128px)", y: "80px" },
    bubblePosition: "bottom",
    message: "상단 헤더에서 홈으로 이동하거나\n즐겨찾기, 알림을 확인할 수 있어요! 🔔",
    highlightArea: { top: "0", left: "256px", width: "calc(100% - 256px)", height: "56px" },
  },
  {
    id: "quick-actions",
    position: { x: "calc(50% + 128px)", y: "180px" },
    bubblePosition: "bottom",
    message: "⚡ 빠른 시작 버튼들이에요!\n자주 사용하는 작업을\n한 번의 클릭으로 시작할 수 있어요.",
    highlightArea: { top: "56px", left: "280px", width: "calc(100% - 320px)", height: "130px" },
  },
  {
    id: "popular-questions",
    position: { x: "380px", y: "380px" },
    bubblePosition: "right",
    message: "💬 다른 임직원들이 자주 묻는\n인기 질문들이에요!\n클릭하면 바로 질문할 수 있어요.",
    highlightArea: { top: "200px", left: "280px", width: "calc(60% - 180px)", height: "260px" },
  },
  {
    id: "work-life-helper",
    position: { x: "calc(100% - 200px)", y: "380px" },
    bubblePosition: "left",
    message: "🏢 회사생활도우미예요!\n결재, 회의실, 식단 조회 등\n자주 쓰는 기능을 모아뒀어요.",
    highlightArea: { top: "200px", left: "calc(60% + 100px)", width: "calc(40% - 140px)", height: "260px" },
  },
  {
    id: "favorite-chatbots",
    position: { x: "calc(50% + 128px)", y: "480px" },
    bubblePosition: "top",
    message: "⭐ 즐겨찾는 챗봇들이에요!\n나만의 챗봇을 만들거나\n자주 쓰는 챗봇을 추가해보세요.",
    highlightArea: { top: "460px", left: "280px", width: "calc(100% - 320px)", height: "60px" },
  },
  {
    id: "chat-input",
    position: { x: "calc(50% + 128px)", y: "590px" },
    bubblePosition: "top",
    message: "💬 여기에 질문을 입력하세요!\nAI 모델을 선택하고\n답변 길이도 조절할 수 있어요.",
    highlightArea: { top: "535px", left: "280px", width: "calc(100% - 320px)", height: "150px" },
  },
];

interface TutorialGuideOverlayProps {
  onComplete: () => void;
  onSkip: () => void;
}

// 마스코트 캐릭터
function MascotCharacter({ emotion = "happy" }: { emotion?: "happy" | "excited" }) {
  return (
    <div className="relative w-16 h-16 flex-shrink-0">
      {/* 그림자 */}
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-2 bg-black/15 rounded-[100%] blur-sm" />
      
      {/* 메인 바디 */}
      <div className={cn(
        "relative w-16 h-16 transition-transform duration-300",
        emotion === "excited" && "animate-[wiggle_0.5s_ease-in-out_infinite]"
      )}>
        <div className="absolute inset-0 bg-gradient-to-br from-[#3BB8E8] via-[#2AABE2] to-[#1A8BC2] rounded-2xl shadow-lg overflow-hidden">
          {/* 광택 */}
          <div className="absolute top-1.5 left-1.5 w-5 h-5 bg-white/40 rounded-full blur-md" />
          <div className="absolute top-2 left-3 w-2 h-2 bg-white/60 rounded-full" />
        </div>
        
        {/* 눈 */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 flex gap-2.5">
          <div className="w-3.5 h-4 bg-white rounded-full shadow-inner flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-gray-800 rounded-full relative">
              <div className="absolute top-0 left-0 w-0.5 h-0.5 bg-white rounded-full" />
            </div>
          </div>
          <div className="w-3.5 h-4 bg-white rounded-full shadow-inner flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-gray-800 rounded-full relative">
              <div className="absolute top-0 left-0 w-0.5 h-0.5 bg-white rounded-full" />
            </div>
          </div>
        </div>
        
        {/* 볼터치 */}
        <div className="absolute top-9 left-1.5 w-2.5 h-1.5 bg-pink-400/40 rounded-full blur-[1px]" />
        <div className="absolute top-9 right-1.5 w-2.5 h-1.5 bg-pink-400/40 rounded-full blur-[1px]" />
        
        {/* 입 */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
          {emotion === "happy" ? (
            <div className="w-5 h-2.5 border-b-2 border-white rounded-b-full" />
          ) : (
            <div className="w-6 h-4 bg-white/90 rounded-full flex items-center justify-center">
              <div className="w-3 h-2 bg-pink-300 rounded-full" />
            </div>
          )}
        </div>
        
        {/* 반짝이 (excited) */}
        {emotion === "excited" && (
          <>
            <div className="absolute -top-1 -right-1 animate-[sparkle_1s_ease-in-out_infinite]">
              <Sparkles className="w-3 h-3 text-yellow-400" />
            </div>
            <div className="absolute -top-0.5 -left-2 animate-[sparkle_1s_ease-in-out_infinite_0.3s]">
              <Sparkles className="w-2.5 h-2.5 text-yellow-300" />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// 말풍선 컴포넌트
function SpeechBubble({ 
  children, 
  tailPosition = "left"
}: { 
  children: React.ReactNode; 
  tailPosition?: "top" | "bottom" | "left" | "right";
}) {
  return (
    <div className="relative bg-white rounded-2xl px-4 py-3 shadow-xl min-w-[180px] max-w-[260px] animate-in fade-in zoom-in-95 duration-300">
      {/* 말풍선 꼬리 */}
      {tailPosition === "left" && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2">
          <div className="w-0 h-0 border-t-[8px] border-b-[8px] border-r-[10px] border-t-transparent border-b-transparent border-r-white" />
        </div>
      )}
      {tailPosition === "right" && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2">
          <div className="w-0 h-0 border-t-[8px] border-b-[8px] border-l-[10px] border-t-transparent border-b-transparent border-l-white" />
        </div>
      )}
      {tailPosition === "top" && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2">
          <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-b-[10px] border-l-transparent border-r-transparent border-b-white" />
        </div>
      )}
      {tailPosition === "bottom" && (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-2">
          <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-t-[10px] border-l-transparent border-r-transparent border-t-white" />
        </div>
      )}
      
      <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-line font-medium text-center">
        {children}
      </p>
    </div>
  );
}

export function TutorialGuideOverlay({ onComplete, onSkip }: TutorialGuideOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [anchoredPos, setAnchoredPos] = useState<{ left: number; top: number } | null>(null);
  const highlightRef = useRef<HTMLDivElement | null>(null);
  const floatingRef = useRef<HTMLDivElement | null>(null);

  // 안전한 step 접근 (범위 체크)
  const safeCurrentStep = Math.min(currentStep, guideSteps.length - 1);
  const step = guideSteps[safeCurrentStep];
  const isLastStep = safeCurrentStep === guideSteps.length - 1;
  
  // step이 없으면 렌더링하지 않음
  if (!step) return null;

  const preferredPlacement = getPreferredPlacement(step.bubblePosition);

  const computeAnchoredPos = useCallback(() => {
    const highlightEl = highlightRef.current;
    const floatingEl = floatingRef.current;
    if (!highlightEl || !floatingEl) return;

    const highlightRect = highlightEl.getBoundingClientRect();
    const floatingRect = floatingEl.getBoundingClientRect();

    // placement
    const gap = 16;
    const pad = 12;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const centerX = highlightRect.left + highlightRect.width / 2;
    const centerY = highlightRect.top + highlightRect.height / 2;

    const placements: Placement[] = [
      preferredPlacement,
      ...(["left", "right", "top", "bottom"] as const).filter(
        (p) => p !== preferredPlacement
      ),
    ];

    const candidates = placements.map((placement) => {
      let left = centerX;
      let top = centerY;

      switch (placement) {
        case "right":
          left = highlightRect.right + gap;
          top = centerY - floatingRect.height / 2;
          break;
        case "left":
          left = highlightRect.left - gap - floatingRect.width;
          top = centerY - floatingRect.height / 2;
          break;
        case "bottom":
          left = centerX - floatingRect.width / 2;
          top = highlightRect.bottom + gap;
          break;
        case "top":
          left = centerX - floatingRect.width / 2;
          top = highlightRect.top - gap - floatingRect.height;
          break;
      }

      const fits =
        left >= pad &&
        top >= pad &&
        left + floatingRect.width <= vw - pad &&
        top + floatingRect.height <= vh - pad;

      return { placement, left, top, fits };
    });

    const best = candidates.find((c) => c.fits) ?? candidates[0];
    const left = clamp(best.left, pad, vw - pad - floatingRect.width);
    const top = clamp(best.top, pad, vh - pad - floatingRect.height);

    setAnchoredPos({ left, top });
  }, [preferredPlacement]);

  // 하이라이트 위치(transition 포함)에 맞춰 마스코트/말풍선을 "하이라이트 밖"으로 자동 배치
  useLayoutEffect(() => {
    if (!step.highlightArea) return;

    setAnchoredPos(null);

    let raf1 = 0;
    let raf2 = 0;
    let timeoutId: number | undefined;

    const run = () => computeAnchoredPos();

    raf1 = window.requestAnimationFrame(() => {
      run();
      raf2 = window.requestAnimationFrame(run);
    });

    // 하이라이트 transition(500ms) 종료 이후 한번 더
    timeoutId = window.setTimeout(run, 520);

    const onResize = () => run();
    window.addEventListener("resize", onResize);

    return () => {
      window.cancelAnimationFrame(raf1);
      window.cancelAnimationFrame(raf2);
      if (timeoutId) window.clearTimeout(timeoutId);
      window.removeEventListener("resize", onResize);
    };
  }, [safeCurrentStep, step.highlightArea, computeAnchoredPos]);

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        setIsAnimating(false);
      }, 300);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(prev => prev - 1);
        setIsAnimating(false);
      }, 300);
    }
  };

  // 캐릭터와 말풍선의 flex 방향 결정
  const getFlexDirection = () => {
    switch (step.bubblePosition) {
      case "left": return "flex-row-reverse";
      case "right": return "flex-row";
      case "top": return "flex-col-reverse";
      case "bottom": return "flex-col";
      default: return "flex-row";
    }
  };

  // 말풍선 꼬리 방향 (캐릭터를 향함)
  const getTailPosition = () => {
    switch (step.bubblePosition) {
      case "left": return "right";
      case "right": return "left";
      case "top": return "bottom";
      case "bottom": return "top";
      default: return "left";
    }
  };

  return (
    <div className="fixed inset-0 z-[100]">
      {/* 반투명 오버레이 */}
      <div className="absolute inset-0 bg-black/50" />
      
      {/* 하이라이트 영역 */}
      {step.highlightArea && (
        <div 
          ref={highlightRef}
          className="absolute bg-transparent border-2 border-primary/60 rounded-lg shadow-[0_0_0_9999px_rgba(0,0,0,0.5)] transition-all duration-500 ease-out z-[101]"
          style={{
            top: step.highlightArea.top,
            left: step.highlightArea.left,
            width: step.highlightArea.width,
            height: step.highlightArea.height,
          }}
        />
      )}
      
      {/* 캐릭터 + 말풍선 */}
      <div 
        ref={floatingRef}
        className={cn(
          "absolute z-[102] flex items-center gap-3 transition-all duration-500 ease-out",
          getFlexDirection(),
          // anchoredPos 계산 전에는 잠깐 숨겨서 하이라이트를 가리는 플래시를 방지
          step.highlightArea && !anchoredPos && "opacity-0",
          isAnimating && "opacity-0 scale-90",
          !anchoredPos && "-translate-x-1/2 -translate-y-1/2"
        )}
        style={{
          left: anchoredPos ? anchoredPos.left : step.position.x,
          top: anchoredPos ? anchoredPos.top : step.position.y,
        }}
      >
        <MascotCharacter emotion={isLastStep ? "excited" : "happy"} />
        <SpeechBubble tailPosition={getTailPosition()}>
          {step.message}
        </SpeechBubble>
      </div>
      
      {/* 하단 컨트롤 */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[103] flex items-center gap-6">
        {/* 진행 표시 */}
        <div className="flex gap-2">
          {guideSteps.map((_, idx) => (
            <div
              key={idx}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                idx === currentStep 
                  ? "bg-primary w-6" 
                  : idx < currentStep 
                    ? "bg-primary/60" 
                    : "bg-white/40"
              )}
            />
          ))}
        </div>
        
        {/* 버튼들 */}
        <div className="flex gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onSkip}
            className="text-white/80 hover:text-white hover:bg-white/10"
          >
            건너뛰기
          </Button>
          {currentStep > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrev}
              className="bg-white/10 border-white/30 text-white hover:bg-white/20"
            >
              이전
            </Button>
          )}
          <Button
            size="sm"
            onClick={handleNext}
            className="bg-primary hover:bg-primary/90 gap-1"
          >
            {isLastStep ? "완료! 🎉" : "다음"}
            {!isLastStep && <ChevronRight className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
