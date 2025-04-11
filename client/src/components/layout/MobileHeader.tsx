import { useState } from "react";
import { Link } from "wouter";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Bell } from "lucide-react";
import { Sidebar } from "./Sidebar";

export function MobileHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden fixed top-0 left-0 right-0 bg-gradient-to-r from-orange-600 to-orange-500 border-b border-orange-400 z-10 shadow-md">
      <div className="px-4 py-3 flex items-center justify-between relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-orange-400 rounded-full opacity-10 transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-orange-300 rounded-full opacity-10 transform -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="flex items-center space-x-2 relative z-10">
          <Link href="/">
            <a className="flex items-center">
              <h1 className="text-lg font-extrabold tracking-tight">
                <span className="bg-gradient-to-r from-white to-orange-200 bg-clip-text text-transparent">Footprint</span>
                <span className="text-white"> Advertising Solutions</span>
                <span className="text-gray-200 font-light tracking-wider text-xs ml-0.5 block">LLC</span>
              </h1>
            </a>
          </Link>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="text-orange-100 hover:text-white hover:bg-orange-700/50 relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-yellow-300 rounded-full"></span>
          </Button>
          
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-orange-700/50">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
              <Sidebar />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
}
