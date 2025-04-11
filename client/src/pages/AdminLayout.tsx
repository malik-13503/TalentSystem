import React from 'react';
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { Bell, HelpCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
        <MobileHeader />
        
        {/* Enhanced Header with FOOTprint TALENT branding */}
        <header className="hidden md:block bg-gradient-to-r from-purple-900 to-purple-700 shadow-md py-4 px-6 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600 rounded-full opacity-10 transform translate-x-1/2 -translate-y-2/3"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 rounded-full opacity-10 transform -translate-x-1/2 translate-y-1/3"></div>
          
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center">
              <div className="mr-4">
                <h1 className="text-2xl font-extrabold text-white tracking-tight">
                  <span className="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">FOOT</span>
                  <span className="text-white">print</span>
                  <span className="text-yellow-300 font-light tracking-wider ml-1">TALENT</span>
                </h1>
                <div className="mt-1 text-xs text-purple-200 font-medium tracking-wide">ADMIN CONTROL PANEL</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Search box */}
              <div className="relative hidden lg:block">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-purple-300" />
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-purple-800/50 text-white placeholder-purple-300 pl-10 pr-4 py-2 rounded-lg border border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent text-sm"
                />
              </div>
              
              <Button variant="ghost" size="icon" className="text-purple-200 hover:text-white hover:bg-purple-800/50">
                <HelpCircle className="h-5 w-5" />
              </Button>
              
              <Button variant="ghost" size="icon" className="text-purple-200 hover:text-white hover:bg-purple-800/50 relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-yellow-400 rounded-full"></span>
              </Button>
              
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center text-purple-900 font-bold text-sm shadow-md">
                A
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 pt-16 md:pt-6 pb-20">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}