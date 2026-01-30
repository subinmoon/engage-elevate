import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Star, MoreHorizontal, Pencil, Trash2, Users, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export interface Chatbot {
  id: string;
  name: string;
  description: string;
  icon: string;
  isFavorite: boolean;
  visibility: "personal" | "team" | "public";
  isOwner: boolean;
}

interface ChatbotManagementModalProps {
  open: boolean;
  onClose: () => void;
  onCreateClick: () => void;
  chatbots: Chatbot[];
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (chatbot: Chatbot) => void;
}

export const ChatbotManagementModal = ({
  open,
  onClose,
  onCreateClick,
  chatbots,
  onToggleFavorite,
  onDelete,
  onEdit,
}: ChatbotManagementModalProps) => {
  const [activeTab, setActiveTab] = useState<"group" | "personal">("group");

  // 그룹 챗봇: visibility가 team 또는 public이고 내가 owner가 아닌 것 (공유받은 것)
  const groupChatbots = chatbots.filter(
    (c) => c.visibility !== "personal" && !c.isOwner
  );

  // 개인 챗봇: 내가 owner인 것
  const personalChatbots = chatbots.filter((c) => c.isOwner);

  const handleFavorite = (id: string) => {
    onToggleFavorite(id);
    toast.success("즐겨찾기가 변경되었습니다");
  };

  const handleDelete = (id: string) => {
    onDelete(id);
    toast.success("챗봇이 삭제되었습니다");
  };

  const renderChatbotItem = (chatbot: Chatbot, showActions: boolean) => (
    <div
      key={chatbot.id}
      className="flex items-center gap-3 p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors"
    >
      <span className="text-2xl shrink-0">{chatbot.icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-foreground">{chatbot.name}</span>
          {chatbot.visibility === "team" && (
            <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
              팀
            </span>
          )}
          {chatbot.visibility === "public" && (
            <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">
              전체
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground truncate">
          {chatbot.description}
        </p>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => handleFavorite(chatbot.id)}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
        >
          <Star
            className={`w-4 h-4 ${
              chatbot.isFavorite
                ? "text-yellow-500 fill-yellow-500"
                : "text-muted-foreground"
            }`}
          />
        </button>
        {showActions && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(chatbot)}>
                <Pencil className="w-4 h-4 mr-2" />
                수정
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDelete(chatbot.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                삭제
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">챗봇 서비스 관리</DialogTitle>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as "group" | "personal")}
          className="flex-1 flex flex-col min-h-0"
        >
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="group" className="gap-2">
              <Users className="w-4 h-4" />
              그룹
              {groupChatbots.length > 0 && (
                <span className="text-xs bg-muted-foreground/20 px-1.5 py-0.5 rounded-full">
                  {groupChatbots.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="personal" className="gap-2">
              <User className="w-4 h-4" />
              개인
              {personalChatbots.length > 0 && (
                <span className="text-xs bg-muted-foreground/20 px-1.5 py-0.5 rounded-full">
                  {personalChatbots.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="group" className="flex-1 overflow-y-auto space-y-3 mt-0">
            {groupChatbots.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>공유받은 챗봇이 없습니다</p>
                <p className="text-sm mt-1">팀원이 챗봇을 공유하면 여기에 표시됩니다</p>
              </div>
            ) : (
              groupChatbots.map((chatbot) => renderChatbotItem(chatbot, false))
            )}
          </TabsContent>

          <TabsContent value="personal" className="flex-1 overflow-y-auto mt-0">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-muted-foreground">
                내가 만든 챗봇
              </span>
              <Button onClick={onCreateClick} className="gap-2">
                <Plus className="w-4 h-4" />
                챗봇생성
              </Button>
            </div>
            <div className="space-y-3">
              {personalChatbots.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <User className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>만든 챗봇이 없습니다</p>
                  <p className="text-sm mt-1">위의 버튼을 눌러 나만의 챗봇을 만들어보세요</p>
                </div>
              ) : (
                personalChatbots.map((chatbot) => renderChatbotItem(chatbot, true))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
