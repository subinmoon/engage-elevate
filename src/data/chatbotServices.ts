export interface ChatbotService {
  id: string;
  name: string;
  description: string;
  icon: string;
  isFavorite: boolean;
  url?: string;
}

export const chatbotServices: ChatbotService[] = [
  {
    id: "1",
    name: "이수시스템 사규 챗봇",
    description: "회사 규정 및 정책에 대해 질문하세요",
    icon: "📊",
    isFavorite: true,
  },
  {
    id: "2",
    name: "코딩 도우미",
    description: "개발 관련 질문과 코드 리뷰를 도와드립니다",
    icon: "💻",
    isFavorite: true,
  },
  {
    id: "3",
    name: "AI 기술 정보",
    description: "최신 AI 트렌드와 기술 정보를 제공합니다",
    icon: "🤖",
    isFavorite: true,
  },
  {
    id: "4",
    name: "HR 상담 챗봇",
    description: "인사 관련 질문에 답변해드립니다",
    icon: "👥",
    isFavorite: false,
  },
  {
    id: "5",
    name: "IT 헬프데스크",
    description: "IT 관련 문제 해결을 도와드립니다",
    icon: "🔧",
    isFavorite: false,
  },
];
