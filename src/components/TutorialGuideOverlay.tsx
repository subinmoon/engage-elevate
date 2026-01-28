import { useState } from "react";
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

// 가이드 스텝 데이터 (메시지는 나중에 수정 가능하도록 placeholder)
const guideSteps: GuideStep[] = [
  {
    id: "sidebar",
    position: { x: "270px", y: "180px" },
    bubblePosition: "right",
    message: "사이드바 설명 (수정 예정)",
    highlightArea: { top: "48px", left: "0", width: "256px", height: "calc(100% - 48px)" },
  },
  {
    id: "header",
    position: { x: "calc(50% + 128px)", y: "100px" },
    bubblePosition: "bottom",
    message: "상단 영역 설명 (수정 예정)",
    highlightArea: { top: "0", left: "256px", width: "calc(100% - 256px)", height: "48px" },
  },
  {
    id: "main-content",
    position: { x: "calc(50% + 128px)", y: "50%" },
    bubblePosition: "right",
    message: "메인 콘텐츠 설명 (수정 예정)",
    highlightArea: { top: "48px", left: "256px", width: "calc(100% - 256px)", height: "calc(100% - 160px)" },
  },
  {
    id: "chat-input",
    position: { x: "calc(50% + 128px)", y: "calc(100% - 140px)" },
    bubblePosition: "top",
    message: "채팅 입력창 설명 (수정 예정)",
    highlightArea: { top: "calc(100% - 100px)", left: "256px", width: "calc(100% - 256px)", height: "100px" },
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

  const step = guideSteps[currentStep];
  const isLastStep = currentStep === guideSteps.length - 1;

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
        className={cn(
          "absolute z-[102] flex items-center gap-3 transition-all duration-500 ease-out",
          getFlexDirection(),
          isAnimating && "opacity-0 scale-90"
        )}
        style={{
          left: step.position.x,
          top: step.position.y,
          transform: "translate(-50%, -50%)",
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
