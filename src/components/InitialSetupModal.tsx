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
      <DialogContent className="sm:max-w-[620px] p-0 border-none overflow-hidden bg-gradient-to-br from-purple-50 via-white to-pink-50">
        {/* Header with gradient */}
        <div className="relative bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 px-8 py-8 text-center">
          <div className="absolute inset-0 opacity-50" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='15' cy='15' r='1' fill='white' fill-opacity='0.1'/%3E%3C/svg%3E\")" }} />
          <div className="relative">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
              <span className="text-3xl">✨</span>
            </div>
            <h2 className="text-xl font-bold text-white leading-relaxed">
              놓치기 쉬운 업무까지 먼저 알려주는 업무 비서,
              <br />
              <span className="text-yellow-200">이수 GPT</span>와 친해져봐요!
            </h2>
          </div>
        </div>

        <div className="px-8 py-6 space-y-5">
          {/* User Name Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <span>🙋</span> 어떻게 부르고 싶으세요?
            </label>
            <Input
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="이름 또는 닉네임을 입력해주세요"
              className="bg-white/80 border-purple-200 focus:border-purple-400 focus:ring-purple-400/20 transition-all"
            />
          </div>

          {/* Assistant Name Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <span>🤖</span> 어떻게 불러드릴까요?
            </label>
            <Input
              value={assistantName}
              onChange={(e) => setAssistantName(e.target.value)}
              placeholder="원하시는 호칭을 입력해주세요"
              className="bg-white/80 border-purple-200 focus:border-purple-400 focus:ring-purple-400/20 transition-all"
            />
          </div>

          {/* Tone Style Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <span>💬</span> 선호하는 말투를 알려주세요!
            </label>
            <div className="grid grid-cols-2 gap-2">
              {toneOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setToneStyle(option.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all text-left",
                    toneStyle === option.id
                      ? "border-purple-500 bg-purple-50 shadow-md shadow-purple-200/50"
                      : "border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-50/50"
                  )}
                >
                  <span className="text-lg">{option.emoji}</span>
                  <span className={cn(
                    "text-sm font-medium",
                    toneStyle === option.id ? "text-purple-700" : "text-gray-600"
                  )}>
                    {option.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Answer Length Selection */}
          <div className="flex items-center justify-between bg-white/60 rounded-xl p-4 border border-purple-100">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <span>📏</span> 답변의 길이는 어때요?
            </label>
            <div className="flex bg-purple-100 rounded-full p-1">
              {lengthOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setAnswerLength(option.id)}
                  className={cn(
                    "px-4 py-1.5 text-sm font-medium rounded-full transition-all",
                    answerLength === option.id
                      ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md"
                      : "text-purple-600 hover:bg-purple-200/50"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Toggle Options */}
          <div className="space-y-3">
            {/* Web Search Toggle */}
            <div className="flex items-center justify-between bg-white/60 rounded-xl p-4 border border-purple-100">
              <div>
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <span>🌐</span> 자동 인터넷 검색을 허용할까요?
                </label>
                <p className="text-xs text-muted-foreground mt-1 ml-6">
                  인터넷 검색이 필요한 질문을 알아서 판단해드려요!
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="webSearch"
                  checked={allowWebSearch}
                  onCheckedChange={(checked) => setAllowWebSearch(checked as boolean)}
                  className="border-purple-400 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                />
                <label htmlFor="webSearch" className="text-sm font-medium text-purple-600 cursor-pointer">
                  허용
                </label>
              </div>
            </div>

            {/* Follow-up Questions Toggle */}
            <div className="flex items-center justify-between bg-white/60 rounded-xl p-4 border border-purple-100">
              <div>
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <span>💡</span> 대화 중에 다음 질문을 추천해드릴까요?
                </label>
                <p className="text-xs text-muted-foreground mt-1 ml-6">
                  막힘 없이 대화할 수 있어요.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="followUp"
                  checked={allowFollowUpQuestions}
                  onCheckedChange={(checked) => setAllowFollowUpQuestions(checked as boolean)}
                  className="border-purple-400 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                />
                <label htmlFor="followUp" className="text-sm font-medium text-purple-600 cursor-pointer">
                  허용
                </label>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <Button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white py-6 text-base font-semibold rounded-xl shadow-lg shadow-purple-300/50 transition-all hover:shadow-xl hover:shadow-purple-400/50 hover:scale-[1.02]"
            >
              🚀 대화 시작하기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
