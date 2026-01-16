// Shared schedule data for the application
export interface ScheduleItem {
  type: "vacation" | "business";
  title: string;
  date: string;
  message?: string;
  details?: {
    duration: string;
    location?: string;
    notes?: string;
  };
}

export const scheduleData: ScheduleItem[] = [
  {
    type: "vacation",
    title: "연차 휴가",
    date: "1/20 (월)",
    message: "아이와 좋은 시간 보내고 오세요~",
    details: {
      duration: "1/20 (월) ~ 1/21 (화)",
      notes: "가족 여행",
    },
  },
  {
    type: "business",
    title: "출장",
    date: "1/27 (월)",
    message: "좋은 성과 있길 바랍니다!",
    details: {
      duration: "1/27 (월) ~ 1/28 (화)",
      location: "부산 해운대",
      notes: "고객사 미팅",
    },
  },
];

// Helper function to generate AI response about schedules
export const generateScheduleResponse = (query: string): string | null => {
  const lowerQuery = query.toLowerCase();
  const scheduleKeywords = ["일정", "휴가", "출장", "스케줄", "예정", "계획", "다가오는", "언제"];
  
  const isScheduleRelated = scheduleKeywords.some(keyword => lowerQuery.includes(keyword));
  
  if (!isScheduleRelated) return null;
  
  // Check for specific schedule type queries
  if (lowerQuery.includes("휴가")) {
    const vacation = scheduleData.find(s => s.type === "vacation");
    if (vacation) {
      return `🏝️ **다가오는 휴가 일정**\n\n` +
        `• **${vacation.title}**: ${vacation.details?.duration || vacation.date}\n` +
        (vacation.details?.notes ? `• **메모**: ${vacation.details.notes}\n` : "") +
        `\n💬 ${vacation.message}`;
    }
  }
  
  if (lowerQuery.includes("출장")) {
    const business = scheduleData.find(s => s.type === "business");
    if (business) {
      return `✈️ **다가오는 출장 일정**\n\n` +
        `• **${business.title}**: ${business.details?.duration || business.date}\n` +
        (business.details?.location ? `• **장소**: ${business.details.location}\n` : "") +
        (business.details?.notes ? `• **메모**: ${business.details.notes}\n` : "") +
        `\n💬 ${business.message}`;
    }
  }
  
  // General schedule query
  let response = `📅 **다가오는 일정 안내**\n\n`;
  
  scheduleData.forEach((schedule, index) => {
    const icon = schedule.type === "vacation" ? "🏝️" : "✈️";
    response += `${icon} **${schedule.title}**\n`;
    response += `• 기간: ${schedule.details?.duration || schedule.date}\n`;
    if (schedule.details?.location) {
      response += `• 장소: ${schedule.details.location}\n`;
    }
    if (schedule.details?.notes) {
      response += `• 메모: ${schedule.details.notes}\n`;
    }
    response += `\n`;
  });
  
  response += `총 ${scheduleData.length}개의 일정이 예정되어 있습니다. 특정 일정에 대해 더 자세히 알고 싶으시면 말씀해 주세요! 😊`;
  
  return response;
};
