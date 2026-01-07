import WelcomeHeader from "@/components/WelcomeHeader";
import RecentInterests from "@/components/RecentInterests";
import HRHelper from "@/components/HRHelper";
import QuickActions from "@/components/QuickActions";
import ChatInput from "@/components/ChatInput";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-lavender-light/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <WelcomeHeader userName="은선" />
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
          {/* Recent Interests - Takes 3 columns */}
          <div className="lg:col-span-3">
            <RecentInterests />
          </div>
          {/* HR Helper - Takes 2 columns */}
          <div className="lg:col-span-2">
            <HRHelper />
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="mb-8">
          <QuickActions />
        </div>
        
        {/* Chat Input - Fixed at bottom on mobile, inline on desktop */}
        <div className="sticky bottom-4 lg:static">
          <ChatInput />
        </div>
      </div>
    </div>
  );
};

export default Index;
