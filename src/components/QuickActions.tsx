import iconDocumentSummary from "@/assets/icons/icon-document-summary.png";
import iconBrainstorm from "@/assets/icons/icon-brainstorm.png";
import iconEditText from "@/assets/icons/icon-edit-text.png";
import iconEmail from "@/assets/icons/icon-email.png";
import iconQuickStart from "@/assets/icons/icon-quick-start.png";

interface QuickAction {
  id: string;
  icon: string;
  label: string;
  promptTemplate?: string;
}

const actions: QuickAction[] = [
  {
    id: "summary",
    icon: iconDocumentSummary,
    label: "문서/회의 요약",
    promptTemplate: "다음 내용을 요약해주세요:\n\n[여기에 문서나 회의 내용을 붙여넣으세요]",
  },
  {
    id: "brainstorm",
    icon: iconBrainstorm,
    label: "브레인스토밍",
    promptTemplate: "다음 주제에 대해 브레인스토밍을 도와주세요:\n\n주제: [주제를 입력하세요]\n목적: [브레인스토밍의 목적을 입력하세요]",
  },
  {
    id: "tone",
    icon: iconEditText,
    label: "글 다듬기",
    promptTemplate: "다음 글을 더 자연스럽고 전문적으로 다듬어주세요:\n\n[여기에 다듬고 싶은 글을 붙여넣으세요]",
  },
  {
    id: "email",
    icon: iconEmail,
    label: "메일 초안 생성",
    promptTemplate: "다음 조건에 맞는 이메일 초안을 작성해주세요:\n\n받는 사람: [예: 팀장님, 고객사 담당자]\n목적: [예: 회의 일정 조율, 프로젝트 진행 상황 공유]\n주요 내용: [전달하고 싶은 핵심 내용]\n톤앤매너: [예: 공식적, 친근한, 정중한]",
  },
];

interface QuickActionsProps {
  onSelectAction?: (promptTemplate: string) => void;
}

const QuickActions = ({ onSelectAction }: QuickActionsProps) => {
  const handleActionClick = (action: QuickAction) => {
    if (action.promptTemplate && onSelectAction) {
      onSelectAction(action.promptTemplate);
    }
  };

  return (
    <div className="bg-card rounded-2xl p-5 shadow-soft border border-border">
      <h2 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
        <img src={iconQuickStart} alt="Quick Start" className="w-5 h-5 object-contain" />
        빠른 시작
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => handleActionClick(action)}
            className="bg-blue-light rounded-2xl py-3 px-4 flex items-center gap-3 transition-all duration-200 hover:shadow-soft hover:scale-[1.02] active:scale-[0.98]"
          >
            <img 
              src={action.icon} 
              alt={action.label} 
              className="w-8 h-8 object-contain rounded-xl"
            />
            <span className="text-sm font-medium text-foreground text-left">
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
