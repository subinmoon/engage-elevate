import WelcomeHeader from "@/components/WelcomeHeader";
import RecentInterests from "@/components/RecentInterests";
import HRHelper from "@/components/HRHelper";
import QuickActions from "@/components/QuickActions";
import ChatInput from "@/components/ChatInput";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <WelcomeHeader userName="은선" />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <RecentInterests />
          </div>
          <div className="lg:col-span-1">
            <HRHelper />
          </div>
        </div>
        
        <div className="mb-6">
          <QuickActions />
        </div>
        
        <ChatInput />
      </div>
    </div>
  );
};

export default Index;
