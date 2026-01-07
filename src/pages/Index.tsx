import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import SidebarTrigger from "@/components/SidebarTrigger";
import WelcomeHeader from "@/components/WelcomeHeader";
import RecentInterests from "@/components/RecentInterests";
import HRHelper from "@/components/HRHelper";
import QuickActions from "@/components/QuickActions";
import ChatInput from "@/components/ChatInput";

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(false)} />
      
      {/* Sidebar Trigger when closed */}
      {!sidebarOpen && <SidebarTrigger onClick={() => setSidebarOpen(true)} />}

      {/* Main Content */}
      <main className="flex-1 min-h-screen bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          <WelcomeHeader userName="은선" />
          
          {/* Quick Actions - Now at top */}
          <div className="mb-4">
            <QuickActions />
          </div>
          
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
            <div className="lg:col-span-3">
              <RecentInterests />
            </div>
            <div className="lg:col-span-2">
              <HRHelper />
            </div>
          </div>
          
          {/* Chat Input */}
          <ChatInput />
        </div>
      </main>
    </div>
  );
};

export default Index;
