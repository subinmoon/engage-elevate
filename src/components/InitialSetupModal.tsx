import { useState } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

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
  { id: "warm", label: "따뜻한 말투", emoji: "💜" },
  { id: "friendly", label: "유쾌하고 친근함", emoji: "😊" },
];

const lengthOptions = [
  { id: "concise", label: "간결" },
  { id: "detailed", label: "상세" },
  { id: "default", label: "기본" },
];

export function InitialSetupModal({ open, onComplete }: InitialSetupModalProps) {
  const [userName, setUserName] = useState("");
  const [assistantName, setAssistantName] = useState("");
  const [toneStyle, setToneStyle] = useState("warm");
  const [answerLength, setAnswerLength] = useState("default");
  const [allowWebSearch, setAllowWebSearch] = useState(false);
  const [allowFollowUpQuestions, setAllowFollowUpQuestions] = useState(false);

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

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-[480px] max-h-[85vh] overflow-y-auto p-0 border-none bg-gradient-to-br from-purple-50/90 via-white to-pink-50/70">
        {/* Header with balanced gradient */}
        <div className="relative bg-gradient-to-r from-purple-500 via-purple-400 to-pink-400 px-6 py-5 text-center">
          <div className="relative">
            <div className="flex items-center justify-center gap-1.5 mb-2">
              <Sparkles className="w-5 h-5 text-yellow-200 animate-pulse" />
              <span className="text-2xl">✨</span>
            </div>
            <h2 className="text-base font-bold text-white leading-relaxed">
              놓치기 쉬운 업무까지 먼저 알려주는 업무 비서,
              <br />
              <span className="text-yellow-100">이수 GPT</span>와 친해져봐요!
            </h2>
          </div>
        </div>

        <div className="px-5 py-4 space-y-3">
          {/* User Name & Assistant Name - side by side */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                <span>🙋</span> 어떻게 부르고 싶으세요?
              </label>
              <Input
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="닉네임 입력"
                className="bg-white/80 border-purple-200 focus:border-purple-400 h-9 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                <span>🤖</span> 어떻게 불러드릴까요?
              </label>
              <Input
                value={assistantName}
                onChange={(e) => setAssistantName(e.target.value)}
                placeholder="호칭 입력"
                className="bg-white/80 border-purple-200 focus:border-purple-400 h-9 text-sm"
              />
            </div>
          </div>

          {/* Tone Style Selection - compact */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
              <span>💬</span> 선호하는 말투를 알려주세요!
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {toneOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setToneStyle(option.id)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 rounded-lg border-2 transition-all text-left",
                    toneStyle === option.id
                      ? "border-purple-500 bg-purple-50 shadow-sm"
                      : "border-gray-200 bg-white hover:border-purple-300"
                  )}
                >
                  <span className="text-sm">{option.emoji}</span>
                  <span className={cn(
                    "text-xs font-medium",
                    toneStyle === option.id ? "text-purple-700" : "text-gray-600"
                  )}>
                    {option.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Answer Length Selection */}
          <div className="bg-white/60 rounded-lg p-3 border border-purple-100 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                <span>📏</span> 답변 길이
              </label>
              <div className="flex bg-purple-100 rounded-full p-0.5">
                {lengthOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setAnswerLength(option.id)}
                    className={cn(
                      "px-3 py-1 text-xs font-medium rounded-full transition-all",
                      answerLength === option.id
                        ? "bg-gradient-to-r from-purple-500 to-pink-400 text-white shadow-sm"
                        : "text-purple-500 hover:bg-purple-100"
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground ml-5">
              원하는 답변 스타일에 맞게 길이를 조절해요
            </p>
          </div>

          {/* Toggle Options */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white/60 rounded-lg p-3 border border-purple-100 space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                  <span>🌐</span> 자동 검색
                </label>
                <Checkbox
                  checked={allowWebSearch}
                  onCheckedChange={(checked) => setAllowWebSearch(checked as boolean)}
                  className="border-purple-400 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                />
              </div>
              <p className="text-[10px] text-muted-foreground leading-tight">
                필요시 인터넷 검색을 자동으로 해요
              </p>
            </div>
            <div className="bg-white/60 rounded-lg p-3 border border-purple-100 space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                  <span>💡</span> 질문 추천
                </label>
                <Checkbox
                  checked={allowFollowUpQuestions}
                  onCheckedChange={(checked) => setAllowFollowUpQuestions(checked as boolean)}
                  className="border-purple-400 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                />
              </div>
              <p className="text-[10px] text-muted-foreground leading-tight">
                대화 중 다음 질문을 추천해드려요
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-400 hover:from-purple-600 hover:to-pink-500 text-white py-5 text-sm font-semibold rounded-lg shadow-md shadow-purple-300/40 transition-all hover:shadow-lg hover:scale-[1.01]"
          >
            🚀 대화 시작하기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
