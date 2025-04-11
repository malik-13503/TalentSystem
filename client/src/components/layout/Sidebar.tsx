import { useState } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  File,
  Settings,
  LogOut,
  LineChart
} from "lucide-react";

interface SidebarLinkProps {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  current: boolean;
  badge?: number | string;
}

const SidebarLink = ({ href, icon, children, current, badge }: SidebarLinkProps) => (
  <Link href={href}>
    <a
      className={cn(
        "flex items-center py-2.5 px-4 rounded-lg transition-all duration-200 relative group overflow-hidden",
        current
          ? "bg-gradient-to-r from-[#FF6713] to-[#FF600A] text-white shadow-md"
          : "text-gray-600 hover:bg-orange-50 hover:text-[#FF6713]"
      )}
    >
      <div className={cn(
        "absolute inset-0 bg-gradient-to-r from-orange-600/20 to-orange-400/10 opacity-0 transition-opacity group-hover:opacity-100",
        current ? "opacity-20" : ""
      )} />
      <div className="mr-3 flex-shrink-0">
        {icon}
      </div>
      <span className={cn(
        "font-medium relative z-10",
        current ? "text-white" : ""
      )}>
        {children}
      </span>
      {badge && (
        <span className="ml-auto bg-gray-100 text-[#FF6713] text-xs font-bold px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
      {current && <div className="absolute right-0 top-0 bottom-0 w-1 bg-gray-100"/> }
    </a>
  </Link>
);

export function Sidebar() {
  const [location] = useLocation();
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch (e) {
      return {};
    }
  });

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <aside className="hidden md:flex md:flex-col md:w-64 bg-white border-r border-gray-200 overflow-y-auto shadow-md">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-center">
          <h1 className="text-xl font-extrabold text-center">
            <span className="bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">Footprint</span>
            <span className="text-gray-800"> Advertising Solutions</span>
            <span className="text-gray-500 font-light block text-xs ml-1">LLC</span>
          </h1>
        </div>
      </div>

      <div className="px-3 py-4">
        <div className="px-3 mb-3">
          <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Main</div>
        </div>
        <nav className="space-y-1.5">
          <SidebarLink
            href="/dashboard"
            icon={<LayoutDashboard className="h-5 w-5 text-orange-600" />}
            current={location === "/dashboard"}
          >
            Dashboard
          </SidebarLink>

          <SidebarLink
            href="/talents"
            icon={<Users className="h-5 w-5 text-orange-600" />}
            current={location === "/talents"}
            badge="3"
          >
            Talent
          </SidebarLink>

          <SidebarLink
            href="/presentations"
            icon={<File className="h-5 w-5 text-orange-600" />}
            current={location === "/presentations"}
          >
            Presentations
          </SidebarLink>
          
          <SidebarLink
            href="/analytics"
            icon={<LineChart className="h-5 w-5 text-orange-600" />}
            current={location === "/analytics"}
          >
            Analytics
          </SidebarLink>
        </nav>
        
        {/* Management section removed as requested */}
        
        <div className="px-3 pt-5 pb-2 mt-4">
          <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold">System</div>
        </div>
        <nav className="space-y-1.5">
          <SidebarLink
            href="/settings"
            icon={<Settings className="h-5 w-5 text-orange-600" />}
            current={location === "/settings"}
          >
            Settings
          </SidebarLink>
          
          {/* Help Center link removed */}
        </nav>
      </div>

      <div className="mt-auto p-4">
        {user.username && (
          <div className="flex items-center p-3 bg-orange-50 rounded-lg shadow-sm">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-600 to-orange-500 flex items-center justify-center text-white font-bold">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{user.username}</p>
              <p className="text-xs text-orange-600">Admin</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="ml-auto text-gray-500 hover:text-red-500"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </aside>
  );
}
