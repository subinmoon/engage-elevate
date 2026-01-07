import WelcomeHeader from "@/components/WelcomeHeader";
import RecentInterests from "@/components/RecentInterests";
import HRHelper from "@/components/HRHelper";
import QuickActions from "@/components/QuickActions";
import ChatInput from "@/components/ChatInput";

const Index = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Beautiful mesh gradient background */}
      <div className="fixed inset-0 bg-mesh-gradient" />
      <div className="fixed inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
      
      {/* Floating decorative orbs */}
      <div className="fixed top-20 left-10 w-72 h-72 bg-gradient-to-br from-primary/10 to-violet/5 rounded-full blur-3xl animate-float" />
      <div className="fixed bottom-20 right-10 w-96 h-96 bg-gradient-to-tl from-mint/15 to-accent/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-primary/5 via-transparent to-transparent rounded-full" />
      
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <WelcomeHeader userName="은선" />
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 mb-5">
          <div className="lg:col-span-3">
            <RecentInterests />
          </div>
          <div className="lg:col-span-2">
            <HRHelper />
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="mb-5">
          <QuickActions />
        </div>
        
        {/* Chat Input */}
        <ChatInput />
      </div>
    </div>
  );
};

export default Index;
