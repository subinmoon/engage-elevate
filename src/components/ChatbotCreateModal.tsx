import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Upload, User, Users, Globe, Lock } from "lucide-react";
import { toast } from "sonner";
import type { Chatbot } from "./ChatbotManagementModal";

const ICON_OPTIONS = [
  { value: "📊", label: "📊 차트" },
  { value: "💻", label: "💻 코딩" },
  { value: "🤖", label: "🤖 로봇" },
  { value: "👥", label: "👥 사람들" },
  { value: "🔧", label: "🔧 도구" },
  { value: "📚", label: "📚 책" },
  { value: "💡", label: "💡 아이디어" },
  { value: "🎯", label: "🎯 목표" },
  { value: "📝", label: "📝 메모" },
  { value: "🏢", label: "🏢 회사" },
];

const LLM_OPTIONS = [
  { value: "gpt-4o", label: "GPT-4o" },
  { value: "gpt-4o-mini", label: "GPT-4o Mini" },
  { value: "claude-3.5-sonnet", label: "Claude 3.5 Sonnet" },
  { value: "gemini-pro", label: "Gemini Pro" },
];

type VisibilityType = "personal" | "team" | "public";

interface ChatbotCreateModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (chatbot: Omit<Chatbot, "id" | "isFavorite" | "isOwner">) => void;
  editingChatbot?: Chatbot | null;
}

export const ChatbotCreateModal = ({
  open,
  onClose,
  onSave,
  editingChatbot,
}: ChatbotCreateModalProps) => {
  const [name, setName] = useState(editingChatbot?.name || "");
  const [description, setDescription] = useState(editingChatbot?.description || "");
  const [icon, setIcon] = useState(editingChatbot?.icon || "🤖");
  const [llmModel, setLlmModel] = useState("gpt-4o");
  const [prompt, setPrompt] = useState("");
  const [visibility, setVisibility] = useState<VisibilityType>(
    editingChatbot?.visibility || "personal"
  );

  const handleSubmit = () => {
    if (!name.trim()) {
      toast.error("챗봇 이름을 입력해주세요");
      return;
    }
    if (!description.trim()) {
      toast.error("챗봇 설명을 입력해주세요");
      return;
    }

    onSave({
      name: name.trim(),
      description: description.trim(),
      icon,
      visibility,
    });

    toast.success(editingChatbot ? "챗봇이 수정되었습니다" : "챗봇이 생성되었습니다");
    handleClose();
  };

  const handleClose = () => {
    setName("");
    setDescription("");
    setIcon("🤖");
    setLlmModel("gpt-4o");
    setPrompt("");
    setVisibility("personal");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {editingChatbot ? "챗봇 수정" : "새 챗봇 만들기"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* 챗봇 이름 */}
          <div className="space-y-2">
            <Label htmlFor="name">챗봇 이름</Label>
            <Input
              id="name"
              placeholder="챗봇의 이름을 작성해주세요"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* 챗봇 설명 */}
          <div className="space-y-2">
            <Label htmlFor="description">챗봇 설명</Label>
            <Textarea
              id="description"
              placeholder="챗봇의 설명을 작성해주세요"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          {/* 챗봇 아이콘 */}
          <div className="space-y-2">
            <Label>챗봇 아이콘</Label>
            <Select value={icon} onValueChange={setIcon}>
              <SelectTrigger>
                <SelectValue placeholder="챗봇 아이콘을 선택해주세요." />
              </SelectTrigger>
              <SelectContent>
                {ICON_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* LLM 모델선택 */}
          <div className="space-y-2">
            <Label>LLM 모델선택</Label>
            <Select value={llmModel} onValueChange={setLlmModel}>
              <SelectTrigger>
                <SelectValue placeholder="LLM 모델을 선택해주세요" />
              </SelectTrigger>
              <SelectContent>
                {LLM_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 프롬프트 */}
          <div className="space-y-2">
            <Label htmlFor="prompt">프롬프트</Label>
            <Textarea
              id="prompt"
              placeholder="프롬프트를 작성해주세요"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[120px]"
            />
          </div>

          {/* 공개 범위 */}
          <div className="space-y-3">
            <Label>공개 범위</Label>
            <RadioGroup
              value={visibility}
              onValueChange={(v) => setVisibility(v as VisibilityType)}
              className="space-y-2"
            >
              <div className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="personal" id="personal" />
                <Label
                  htmlFor="personal"
                  className="flex items-center gap-2 cursor-pointer flex-1"
                >
                  <Lock className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">나만 보기</div>
                    <div className="text-xs text-muted-foreground">
                      본인만 이 챗봇을 사용할 수 있습니다
                    </div>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors opacity-60">
                <RadioGroupItem value="team" id="team" disabled />
                <Label
                  htmlFor="team"
                  className="flex items-center gap-2 cursor-not-allowed flex-1"
                >
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">팀에 공유</div>
                    <div className="text-xs text-muted-foreground">
                      특정 팀원들에게 공유합니다 (추후 지원 예정)
                    </div>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors opacity-60">
                <RadioGroupItem value="public" id="public" disabled />
                <Label
                  htmlFor="public"
                  className="flex items-center gap-2 cursor-not-allowed flex-1"
                >
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">전체 공개</div>
                    <div className="text-xs text-muted-foreground">
                      모든 사용자에게 공개합니다 (추후 지원 예정)
                    </div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* 파일첨부 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>파일첨부</Label>
              <Button variant="outline" size="sm" className="gap-1.5">
                <Upload className="w-4 h-4" />
                파일첨부
              </Button>
            </div>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                참조할 파일을 업로드 해주세요
              </p>
            </div>
          </div>
        </div>

        {/* 저장 버튼 */}
        <div className="flex justify-end pt-4 border-t border-border">
          <Button onClick={handleSubmit}>저장</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
