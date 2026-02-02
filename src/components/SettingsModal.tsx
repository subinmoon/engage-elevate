import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { Globe, MessageCircle } from "lucide-react";

export interface UserSettings {
  userName: string;
  assistantName: string;
  toneStyle: string;
  answerLength: string;
  searchMode: string;
  allowWebSearch: boolean;
  allowFollowUpQuestions: boolean;
}

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
  settings: UserSettings | null;
  onSave: (settings: UserSettings) => void;
}

const searchModeOptions = [
  { id: "general", label: "일반", emoji: "🌐" },
  { id: "web", label: "웹 검색", emoji: "🔍" },
  { id: "internal", label: "사내 규칙", emoji: "🏢" },
];

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

export function SettingsModal({ open, onClose, settings, onSave }: SettingsModalProps) {
  const [userName, setUserName] = useState(settings?.userName || "");
  const [assistantName, setAssistantName] = useState(settings?.assistantName || "이수 GPT");
  const [toneStyle, setToneStyle] = useState(settings?.toneStyle || "warm");
  const [answerLength, setAnswerLength] = useState(settings?.answerLength || "default");
  const [searchMode, setSearchMode] = useState(settings?.searchMode || "general");
  const [allowWebSearch, setAllowWebSearch] = useState(settings?.allowWebSearch ?? true);
  const [allowFollowUpQuestions, setAllowFollowUpQuestions] = useState(settings?.allowFollowUpQuestions ?? true);

  // settings가 변경되면 상태 업데이트
  useEffect(() => {
    if (settings) {
      setUserName(settings.userName || "");
      setAssistantName(settings.assistantName || "이수 GPT");
      setToneStyle(settings.toneStyle || "warm");
      setAnswerLength(settings.answerLength || "default");
      setSearchMode(settings.searchMode || "general");
      setAllowWebSearch(settings.allowWebSearch ?? true);
      setAllowFollowUpQuestions(settings.allowFollowUpQuestions ?? true);
    }
  }, [settings]);

  const handleSave = () => {
    onSave({
      userName,
      assistantName,
      toneStyle,
      answerLength,
      searchMode,
      allowWebSearch,
      allowFollowUpQuestions,
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">개인화 설정</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* 호칭 설정 */}
          <div className="space-y-2">
            <Label htmlFor="userName" className="text-sm font-medium">
              호칭
            </Label>
            <Input
              id="userName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="예: 경민님, 박과장님..."
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">이수 GPT가 어떻게 불러드릴까요?</p>
          </div>

          {/* 검색 모드 */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">기본 검색 모드</Label>
            <div className="flex gap-2">
              {searchModeOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSearchMode(option.id)}
                  className={cn(
                    "flex-1 py-3 px-4 rounded-xl border-2 text-center transition-all",
                    searchMode === option.id
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-gray-200 hover:border-gray-300 text-gray-600"
                  )}
                >
                  <span className="text-xl block mb-1">{option.emoji}</span>
                  <span className="text-sm font-medium">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 말투 스타일 */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">말투 스타일</Label>
            <div className="flex gap-2">
              {toneOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setToneStyle(option.id)}
                  className={cn(
                    "flex-1 py-3 px-4 rounded-xl border-2 text-center transition-all",
                    toneStyle === option.id
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-gray-200 hover:border-gray-300 text-gray-600"
                  )}
                >
                  <span className="text-xl block mb-1">{option.emoji}</span>
                  <span className="text-sm font-medium">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 답변 길이 */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">답변 길이</Label>
            <div className="flex gap-2">
              {lengthOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setAnswerLength(option.id)}
                  className={cn(
                    "flex-1 py-2.5 px-4 rounded-xl border-2 text-center transition-all text-sm font-medium",
                    answerLength === option.id
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-gray-200 hover:border-gray-300 text-gray-600"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* 토글 설정 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Globe className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">자동 웹 검색</p>
                  <p className="text-xs text-muted-foreground">필요할 때 자동으로 검색</p>
                </div>
              </div>
              <Switch
                checked={allowWebSearch}
                onCheckedChange={setAllowWebSearch}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">다음 질문 추천</p>
                  <p className="text-xs text-muted-foreground">대화에 맞는 질문 제안</p>
                </div>
              </div>
              <Switch
                checked={allowFollowUpQuestions}
                onCheckedChange={setAllowFollowUpQuestions}
              />
            </div>
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex gap-3 pt-2">
          <Button variant="outline" onClick={onClose} className="flex-1">
            취소
          </Button>
          <Button onClick={handleSave} className="flex-1">
            저장
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
