import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

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
  { id: "professional", label: "전문적인 말투" },
  { id: "warm-formal", label: "따뜻함이 담긴 말투" },
  { id: "warm", label: "따뜻한 말투" },
  { id: "friendly", label: "유쾌하고 친근함" },
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
      <DialogContent className="sm:max-w-[600px] bg-purple-50 border-none p-8">
        <DialogHeader className="text-center mb-6">
          <DialogTitle className="text-xl font-bold text-foreground leading-relaxed">
            놓치기 쉬운 업무까지 먼저 알려주는 업무 비서,
            <br />
            이수 GPT와 친해져봐요.
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Name Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              어떻게 부르고 싶으세요?
            </label>
            <Input
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="이름 또는 닉네임"
              className="bg-purple-100/50 border-purple-200 focus:border-purple-400"
            />
          </div>

          {/* Assistant Name Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              어떻게 불러드릴까요?
            </label>
            <Input
              value={assistantName}
              onChange={(e) => setAssistantName(e.target.value)}
              placeholder="닉네임"
              className="bg-purple-100/50 border-purple-200 focus:border-purple-400"
            />
          </div>

          {/* Tone Style Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">
              선호하는 말투를 알려주세요!
            </label>
            <div className="flex flex-wrap gap-4">
              {toneOptions.map((option) => (
                <label
                  key={option.id}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <div
                    className={cn(
                      "w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors",
                      toneStyle === option.id
                        ? "border-purple-600 bg-purple-600"
                        : "border-purple-400"
                    )}
                  >
                    {toneStyle === option.id && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </div>
                  <span className="text-sm text-foreground">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Answer Length Selection */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">
              답변의 길이는 어때요?
            </label>
            <div className="flex bg-purple-200/50 rounded-full p-1">
              {lengthOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setAnswerLength(option.id)}
                  className={cn(
                    "px-4 py-1.5 text-sm rounded-full transition-all",
                    answerLength === option.id
                      ? "bg-purple-600 text-white"
                      : "text-foreground hover:bg-purple-100"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Web Search Toggle */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <label className="text-sm font-medium text-foreground">
                자동 인터넷 검색을 허용할까요?
              </label>
              <p className="text-xs text-muted-foreground mt-0.5">
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
              <label htmlFor="webSearch" className="text-sm cursor-pointer">
                허용
              </label>
            </div>
          </div>

          {/* Follow-up Questions Toggle */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <label className="text-sm font-medium text-foreground">
                대화 중에 다음 질문을 추천해드릴까요?
              </label>
              <p className="text-xs text-muted-foreground mt-0.5">
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
              <label htmlFor="followUp" className="text-sm cursor-pointer">
                허용
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <Button
              onClick={handleSubmit}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6"
            >
              대화 시작하기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
