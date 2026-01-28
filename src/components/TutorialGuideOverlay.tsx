import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Sparkles, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GuideStep {
  id: string;
  target: string; // CSS selector or position identifier
  position: { x: string; y: string }; // 캐릭터 위치
  bubblePosition: "top" | "bottom" | "left" | "right";
  message: string;
  emoji?: string;
  highlightArea?: { top: string; left: string; width: string; height: string };
}

const guideSteps: GuideStep[] = [
  {
    id: "sidebar",
    target: "sidebar",
    position: { x: "280px", y: "200px" },
    bubblePosition: "right",
    message: "여기는 사이드바예요!\n대화 기록과 즐겨찾기를 관리할 수 있어요 📚",
    emoji: "📚",
    highlightArea: { top: "60px", left: "0", width: "256px", height: "calc(100% - 60px)" },
  },
  {
    id: "header",
    target: "header",
    position: { x: "50%", y: "80px" },
    bubblePosition: "bottom",
    message: "상단에서는 일정 확인과 프로필 관리가 가능해요! 📅",
    emoji: "📅",
    highlightArea: { top: "0", left: "256px", width: "calc(100% - 256px)", height: "56px" },
  },
  {
    id: "main-content",
    target: "main",
    position: { x: "50%", y: "45%" },
    bubblePosition: "top",
    message: "메인 화면에서는 빠른 시작, 최근 관심사,\n회사생활 도우미 등을 확인할 수 있어요! ⚡",
    emoji: "⚡",
    highlightArea: { top: "56px", left: "256px", width: "calc(100% - 256px)", height: "calc(100% - 180px)" },
  },
  {
    id: "chat-input",
    target: "chat-input",
    position: { x: "50%", y: "calc(100% - 180px)" },
    bubblePosition: "top",
    message: "무엇이든 물어보세요!\n저는 항상 여기서 대기하고 있어요 💬",
    emoji: "💬",
    highlightArea: { top: "calc(100% - 120px)", left: "256px", width: "calc(100% - 256px)", height: "100px" },
  },
];

interface TutorialGuideOverlayProps {
  onComplete: () => void;
  onSkip: () => void;
}

// 마스코트 캐릭터 (TutorialModal에서 가져옴)
function MascotCharacter({ className, emotion = "happy", size = "normal" }: { 
  className?: string; 
  emotion?: "happy" | "wave" | "excited" | "thinking";
  size?: "normal" | "small";
}) {
  const sizeClasses = size === "small" ? "w-20 h-20" : "w-28 h-28";
  const innerSizeClasses = size === "small" ? "w-16 h-16" : "w-24 h-24";
  
  return (
    <div className={cn("relative", className)}>
      {/* 그림자 */}
      <div className={cn(
        "absolute -bottom-3 left-1/2 -translate-x-1/2 bg-black/10 rounded-[100%] blur-md",
        size === "small" ? "w-16 h-3" : "w-24 h-4"
      )} />
      
      {/* 메인 캐릭터 컨테이너 */}
      <div className={cn(
        "relative transition-transform duration-300",
        emotion === "wave" && "animate-[bounce_1s_ease-in-out_infinite]",
        emotion === "excited" && "animate-[wiggle_0.5s_ease-in-out_infinite]"
      )}>
        {/* 캐릭터 몸통 */}
        <div className={sizeClasses}>
          <div className={cn("absolute inset-0 bg-gradient-to-br from-[#3BB8E8] via-[#2AABE2] to-[#1A8BC2] rounded-2xl shadow-xl overflow-hidden", innerSizeClasses)}>
            {/* 광택 하이라이트 */}
            <div className="absolute top-2 left-2 w-6 h-6 bg-white/40 rounded-full blur-md" />
            <div className="absolute top-3 left-4 w-3 h-3 bg-white/60 rounded-full" />
            
            {/* 바디 하단 그라데이션 */}
            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[#1A7BA8]/30 to-transparent" />
          </div>
          
          {/* 눈 */}
          <div className={cn(
            "absolute left-1/2 -translate-x-1/2 flex",
            size === "small" ? "top-6 gap-3" : "top-8 gap-4"
          )}>
            <div className={cn(
              "bg-white rounded-full shadow-inner flex items-center justify-center",
              size === "small" ? "w-4 h-5" : "w-5 h-6"
            )}>
              <div className={cn(
                "bg-gray-800 rounded-full relative",
                size === "small" ? "w-2 h-2" : "w-2.5 h-2.5"
              )}>
                <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-white rounded-full" />
              </div>
            </div>
            <div className={cn(
              "bg-white rounded-full shadow-inner flex items-center justify-center",
              size === "small" ? "w-4 h-5" : "w-5 h-6"
            )}>
              <div className={cn(
                "bg-gray-800 rounded-full relative",
                size === "small" ? "w-2 h-2" : "w-2.5 h-2.5"
              )}>
                <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-white rounded-full" />
              </div>
            </div>
          </div>
          
          {/* 볼터치 */}
          <div className={cn(
            "absolute w-3 h-2 bg-pink-400/40 rounded-full blur-[2px]",
            size === "small" ? "top-10 left-2" : "top-14 left-3"
          )} />
          <div className={cn(
            "absolute w-3 h-2 bg-pink-400/40 rounded-full blur-[2px]",
            size === "small" ? "top-10 right-2" : "top-14 right-3"
          )} />
          
          {/* 입 */}
          <div className={cn(
            "absolute left-1/2 -translate-x-1/2",
            size === "small" ? "bottom-4" : "bottom-5"
          )}>
            {emotion === "happy" && (
              <div className={cn(
                "border-b-[2px] border-white rounded-b-full",
                size === "small" ? "w-5 h-2.5" : "w-7 h-3"
              )} />
            )}
            {emotion === "excited" && (
              <div className={cn(
                "bg-white/90 rounded-full flex items-center justify-center",
                size === "small" ? "w-6 h-4" : "w-8 h-5"
              )}>
                <div className={cn(
                  "bg-pink-300 rounded-full",
                  size === "small" ? "w-3 h-2" : "w-4 h-2.5"
                )} />
              </div>
            )}
            {emotion === "wave" && (
              <div className={cn(
                "bg-white/90 rounded-b-xl rounded-t-sm flex items-center justify-center",
                size === "small" ? "w-6 h-3" : "w-8 h-4"
              )}>
                <div className={cn(
                  "bg-pink-300 rounded-full mt-0.5",
                  size === "small" ? "w-3 h-1.5" : "w-3 h-1.5"
                )} />
              </div>
            )}
          </div>
        </div>
        
        {/* 반짝이 효과 (excited 상태) */}
        {emotion === "excited" && (
          <>
            <div className="absolute -top-2 -right-2 animate-[sparkle_1s_ease-in-out_infinite]">
              <Sparkles className="w-4 h-4 text-yellow-400 drop-shadow-lg" />
            </div>
            <div className="absolute -top-1 -left-3 animate-[sparkle_1s_ease-in-out_infinite_0.3s]">
              <Sparkles className="w-3 h-3 text-yellow-300 drop-shadow-lg" />
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
  position = "right",
  className 
}: { 
  children: React.ReactNode; 
  position?: "top" | "bottom" | "left" | "right";
  className?: string;
}) {
  const tailClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 border-l-[10px] border-r-[10px] border-b-[12px] border-l-transparent border-r-transparent border-b-white",
    bottom: "top-full left-1/2 -translate-x-1/2 border-l-[10px] border-r-[10px] border-t-[12px] border-l-transparent border-r-transparent border-t-white",
    left: "right-full top-1/2 -translate-y-1/2 border-t-[10px] border-b-[10px] border-r-[12px] border-t-transparent border-b-transparent border-r-white",
    right: "left-full top-1/2 -translate-y-1/2 border-t-[10px] border-b-[10px] border-l-[12px] border-t-transparent border-b-transparent border-l-white",
  };

  return (
    <div className={cn(
      "relative bg-white rounded-2xl px-5 py-4 shadow-xl max-w-xs",
      "animate-in fade-in slide-in-from-bottom-2 duration-300",
      className
    )}>
      <div className={cn("absolute w-0 h-0", tailClasses[position])} />
      <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-line font-medium">
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

  // 캐릭터 위치 계산
  const getCharacterPosition = () => {
    const pos = step.position;
    return {
      left: pos.x,
      top: pos.y,
    };
  };

  // 말풍선 위치 오프셋
  const getBubbleOffset = () => {
    switch (step.bubblePosition) {
      case "right":
        return { left: "100px", top: "0" };
      case "left":
        return { right: "100px", top: "0" };
      case "top":
        return { left: "0", bottom: "120px" };
      case "bottom":
        return { left: "0", top: "120px" };
      default:
        return { left: "100px", top: "0" };
    }
  };

  return (
    <div className="fixed inset-0 z-[100]">
      {/* 반투명 오버레이 */}
      <div className="absolute inset-0 bg-black/50 transition-opacity duration-300" />
      
      {/* 하이라이트 영역 (구멍) */}
      {step.highlightArea && (
        <div 
          className="absolute bg-transparent border-2 border-primary/50 rounded-lg shadow-[0_0_0_9999px_rgba(0,0,0,0.5)] transition-all duration-500 z-[101]"
          style={{
            top: step.highlightArea.top,
            left: step.highlightArea.left,
            width: step.highlightArea.width,
            height: step.highlightArea.height,
          }}
        />
      )}
      
      {/* 캐릭터 + 말풍선 컨테이너 */}
      <div 
        className={cn(
          "absolute z-[102] flex items-center gap-4 transition-all duration-500",
          isAnimating && "opacity-0 scale-95"
        )}
        style={{
          left: getCharacterPosition().left,
          top: getCharacterPosition().top,
          transform: step.position.x === "50%" ? "translateX(-50%)" : "none",
        }}
      >
        {/* 말풍선 (왼쪽에 표시될 때) */}
        {step.bubblePosition === "left" && (
          <SpeechBubble position="right" className="order-1">
            {step.message}
          </SpeechBubble>
        )}
        
        {/* 말풍선 (위쪽에 표시될 때) */}
        {step.bubblePosition === "top" && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4">
            <SpeechBubble position="bottom">
              {step.message}
            </SpeechBubble>
          </div>
        )}
        
        {/* 마스코트 캐릭터 */}
        <div className="order-2">
          <MascotCharacter 
            emotion={currentStep === guideSteps.length - 1 ? "excited" : "happy"} 
            size="small"
          />
        </div>
        
        {/* 말풍선 (오른쪽에 표시될 때) */}
        {step.bubblePosition === "right" && (
          <SpeechBubble position="left" className="order-3">
            {step.message}
          </SpeechBubble>
        )}
        
        {/* 말풍선 (아래쪽에 표시될 때) */}
        {step.bubblePosition === "bottom" && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4">
            <SpeechBubble position="top">
              {step.message}
            </SpeechBubble>
          </div>
        )}
      </div>
      
      {/* 하단 컨트롤 */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[103] flex items-center gap-4">
        {/* 진행 표시 */}
        <div className="flex gap-2">
          {guideSteps.map((_, idx) => (
            <div
              key={idx}
              className={cn(
                "w-2.5 h-2.5 rounded-full transition-all duration-300",
                idx === currentStep 
                  ? "bg-primary scale-125" 
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
            onClick={onSkip}
            className="text-white/80 hover:text-white hover:bg-white/10"
          >
            건너뛰기
          </Button>
          <Button
            onClick={handleNext}
            className="bg-primary hover:bg-primary/90 gap-1"
          >
            {isLastStep ? "시작하기 🚀" : "다음"}
            {!isLastStep && <ChevronRight className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
