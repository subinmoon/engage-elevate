import { useState } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import logoIcon from "@/assets/logo-icon.png";
import { ChevronRight, Check } from "lucide-react";

interface InitialSetupModalProps {
  open: boolean;
  onComplete: (settings: UserSettings) => void;
}

interface UserSettings {
  userName: string;
  assistantName: string;
  toneStyle: string;
  answerLength: string;
  allowWebSearch: boolean;
  allowFollowUpQuestions: boolean;
}

const toneOptions = [
  { id: "professional", label: "전문적인 말투", emoji: "👔" },
  { id: "warm-formal", label: "따뜻함이 담긴 말투", emoji: "🤝" },
  { id: "default", label: "기본 말투", emoji: "💬" },
  { id: "friendly", label: "유쾌하고 친근함", emoji: "😊" },
];

const lengthOptions = [
  { id: "concise", label: "간결하게" },
  { id: "default", label: "기본" },
  { id: "detailed", label: "상세하게" },
];

type Step = 1 | 2 | 3 | 4 | 5;

export function InitialSetupModal({ open, onComplete }: InitialSetupModalProps) {
  const [step, setStep] = useState<Step>(1);
  const [userName, setUserName] = useState("");
  const [assistantName, setAssistantName] = useState("");
  const [toneStyle, setToneStyle] = useState("default");
  const [answerLength, setAnswerLength] = useState("default");
  const [allowWebSearch, setAllowWebSearch] = useState(true);
  const [allowFollowUpQuestions, setAllowFollowUpQuestions] = useState(true);

  const handleSubmit = () => {
    onComplete({
      userName,
      assistantName,
      toneStyle,
      answerLength,
      allowWebSearch,
      allowFollowUpQuestions,
    });
  };

  const nextStep = () => {
    if (step < 5) setStep((step + 1) as Step);
  };

  const canProceed = () => {
    switch (step) {
      case 1: return userName.trim().length > 0;
      case 2: return assistantName.trim().length > 0;
      case 3: return true;
      case 4: return true;
      case 5: return true;
      default: return false;
    }
  };

  // Assistant message bubble
  const AssistantMessage = ({ children }: { children: React.ReactNode }) => (
    <div className="flex gap-3 items-start">
      <img src={logoIcon} alt="Assistant" className="w-8 h-8 rounded-full flex-shrink-0" />
      <div className="bg-muted rounded-2xl rounded-tl-md px-4 py-3 max-w-[85%]">
        <p className="text-sm text-foreground leading-relaxed">{children}</p>
      </div>
    </div>
  );

  // User response bubble
  const UserResponse = ({ children }: { children: React.ReactNode }) => (
    <div className="flex justify-end">
      <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-md px-4 py-2 max-w-[85%]">
        <p className="text-sm">{children}</p>
      </div>
    </div>
  );

  // Completed step indicator
  const CompletedAnswer = ({ answer }: { answer: string }) => (
    <div className="flex justify-end items-center gap-2">
      <Check className="w-4 h-4 text-primary" />
      <div className="bg-primary/10 text-primary rounded-full px-3 py-1.5">
        <p className="text-sm font-medium">{answer}</p>
      </div>
    </div>
  );

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-[440px] max-h-[85vh] overflow-hidden p-0 border-none bg-background">
        {/* Header */}
        <div className="bg-card border-b border-border px-5 py-4">
          <div className="flex items-center gap-3">
            <img src={logoIcon} alt="Logo" className="w-10 h-10" />
            <div>
              <h2 className="text-sm font-bold text-foreground">이수 GPT</h2>
              <p className="text-xs text-muted-foreground">대화 설정</p>
            </div>
          </div>
          {/* Progress dots */}
          <div className="flex gap-1.5 mt-3">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className={cn(
                  "h-1 rounded-full flex-1 transition-colors",
                  s <= step ? "bg-primary" : "bg-muted"
                )}
              />
            ))}
          </div>
        </div>

        {/* Chat area */}
        <div className="px-5 py-4 space-y-4 min-h-[320px] max-h-[400px] overflow-y-auto">
          {/* Step 1: User Name */}
          <AssistantMessage>
            안녕하세요! 👋 저는 업무를 도와드리는 이수 GPT예요.
            <br /><br />
            먼저 <strong>어떻게 불러드릴까요?</strong>
          </AssistantMessage>
          
          {step === 1 ? (
            <div className="flex justify-end">
              <Input
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="이름 또는 닉네임을 입력해주세요"
                className="max-w-[75%] bg-card border-primary/30 focus:border-primary rounded-2xl rounded-tr-md text-sm"
                onKeyDown={(e) => e.key === "Enter" && canProceed() && nextStep()}
                autoFocus
              />
            </div>
          ) : (
            <CompletedAnswer answer={userName} />
          )}

          {/* Step 2: Assistant Name */}
          {step >= 2 && (
            <>
              <AssistantMessage>
                반가워요, <strong>{userName}</strong>님! 😊
                <br /><br />
                저를 뭐라고 부르실 건가요?
              </AssistantMessage>
              
              {step === 2 ? (
                <div className="flex justify-end">
                  <Input
                    value={assistantName}
                    onChange={(e) => setAssistantName(e.target.value)}
                    placeholder="예: 수비니, 이수, 비서님..."
                    className="max-w-[75%] bg-card border-primary/30 focus:border-primary rounded-2xl rounded-tr-md text-sm"
                    onKeyDown={(e) => e.key === "Enter" && canProceed() && nextStep()}
                    autoFocus
                  />
                </div>
              ) : (
                <CompletedAnswer answer={assistantName} />
              )}
            </>
          )}

          {/* Step 3: Tone Style */}
          {step >= 3 && (
            <>
              <AssistantMessage>
                좋아요! 앞으로 <strong>{assistantName}</strong>이라고 불러주세요 💕
                <br /><br />
                어떤 말투로 대화할까요?
              </AssistantMessage>
              
              {step === 3 ? (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    {toneOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setToneStyle(option.id)}
                        className={cn(
                          "flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 transition-all text-left",
                          toneStyle === option.id
                            ? "border-primary bg-primary/10"
                            : "border-border bg-card hover:border-primary/50"
                        )}
                      >
                        <span className="text-base">{option.emoji}</span>
                        <span className={cn(
                          "text-xs font-medium",
                          toneStyle === option.id ? "text-primary" : "text-muted-foreground"
                        )}>
                          {option.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <CompletedAnswer answer={toneOptions.find(t => t.id === toneStyle)?.label || ""} />
              )}
            </>
          )}

          {/* Step 4: Answer Length */}
          {step >= 4 && (
            <>
              <AssistantMessage>
                알겠어요! 그렇게 말씀드릴게요 ✨
                <br /><br />
                답변은 얼마나 길게 드릴까요?
              </AssistantMessage>
              
              {step === 4 ? (
                <div className="flex justify-end">
                  <div className="flex bg-muted rounded-full p-1 gap-1">
                    {lengthOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setAnswerLength(option.id)}
                        className={cn(
                          "px-4 py-2 text-xs font-medium rounded-full transition-all",
                          answerLength === option.id
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <CompletedAnswer answer={lengthOptions.find(l => l.id === answerLength)?.label || ""} />
              )}
            </>
          )}

          {/* Step 5: Additional Options */}
          {step >= 5 && (
            <>
              <AssistantMessage>
                거의 다 됐어요! 마지막으로 몇 가지만 더 알려주세요 🙌
              </AssistantMessage>
              
              <div className="space-y-2">
                <button
                  onClick={() => setAllowWebSearch(!allowWebSearch)}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all text-left",
                    allowWebSearch
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">🌐</span>
                    <div>
                      <p className="text-sm font-medium text-foreground">자동 검색</p>
                      <p className="text-xs text-muted-foreground">필요할 때 인터넷 검색을 해요</p>
                    </div>
                  </div>
                  <Checkbox
                    checked={allowWebSearch}
                    className="border-primary/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                </button>
                
                <button
                  onClick={() => setAllowFollowUpQuestions(!allowFollowUpQuestions)}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all text-left",
                    allowFollowUpQuestions
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">💡</span>
                    <div>
                      <p className="text-sm font-medium text-foreground">질문 추천</p>
                      <p className="text-xs text-muted-foreground">대화 중 다음 질문을 추천해드려요</p>
                    </div>
                  </div>
                  <Checkbox
                    checked={allowFollowUpQuestions}
                    className="border-primary/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                </button>
              </div>
            </>
          )}
        </div>

        {/* Bottom action */}
        <div className="px-5 py-4 border-t border-border bg-card">
          {step < 5 ? (
            <Button
              onClick={nextStep}
              disabled={!canProceed()}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-5 text-sm font-semibold rounded-xl shadow-md transition-all hover:shadow-lg disabled:opacity-50"
            >
              다음
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-5 text-sm font-semibold rounded-xl shadow-md transition-all hover:shadow-lg hover:scale-[1.01]"
            >
              🚀 대화 시작하기
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
