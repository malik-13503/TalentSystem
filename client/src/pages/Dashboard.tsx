import { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { TalentTable } from "@/components/admin/TalentTable";
import { TalentSearch } from "@/components/admin/TalentSearch";
import { TalentFilter } from "@/components/admin/TalentFilter";
import { PresentationManager } from "@/components/presentation/PresentationManager";
import { SystemSettings } from "@/components/settings/SystemSettings";
import { AnalyticsDashboard } from "@/components/admin/AnalyticsDashboard";
import { MediaLibrary } from "@/components/admin/MediaLibrary";
import { CalendarView } from "@/components/admin/CalendarView";
import { Promoter } from "@shared/schema";
import { Users, FileText, CheckSquare, BarChart2, Image, Calendar as CalendarIcon, LineChart, Upload } from "lucide-react";

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    nationality: "all",
    area: "all",
    experience: "all",
    status: "all",
    gender: "all",
    height: "all",
    ageRange: "all",
  });
  const [location, setLocation] = useLocation();
  const [isDashboardRoute] = useRoute('/dashboard');
  const [isTalentsRoute] = useRoute('/talents');
  const [isPresentationsRoute] = useRoute('/presentations');
  const [isSettingsRoute] = useRoute('/settings');
  const [isAnalyticsRoute] = useRoute('/analytics');
  const [isMediaRoute] = useRoute('/media');
  const [isCalendarRoute] = useRoute('/calendar');
  
  // Get title based on current route
  const getPageTitle = () => {
    if (isTalentsRoute) return "Talent Management";
    if (isPresentationsRoute) return "Presentations";
    if (isSettingsRoute) return "Settings";
    if (isAnalyticsRoute) return "Analytics Dashboard";
    if (isMediaRoute) return "Media Library";
    if (isCalendarRoute) return "Calendar";
    return "Admin Dashboard";
  };

  // Check if user is logged in
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      setLocation("/admin");
    }
  }, [setLocation]);

  // Fetch promoters with search and filters
  const {
    data: promoters = [],
    isLoading,
    isError,
    refetch,
  } = useQuery<Promoter[]>({
    queryKey: [
      "/api/talents",
      searchQuery,
      filters.nationality,
      filters.area,
      filters.experience,
      filters.status,
      filters.gender,
      filters.height,
      filters.ageRange,
    ],
    queryFn: () => {
      let url = `/api/talents?`;
      
      if (searchQuery) {
        url += `search=${encodeURIComponent(searchQuery)}&`;
      }
      
      // Apply all filters that aren't "all"
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== 'all') {
          url += `${key}=${encodeURIComponent(value)}&`;
        }
      });
      
      return fetch(url).then(res => {
        if (!res.ok) throw new Error("Failed to fetch talents");
        return res.json();
      });
    },
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleExportData = () => {
    if (!promoters.length) return;
    
    // Convert promoters to CSV
    const headers = ["ID", "Name", "Nationality", "Experience", "Area", "Status"];
    const csvRows = [
      headers.join(","),
      ...promoters.map(p => [
        p.uniqueId,
        `${p.firstName} ${p.lastName}`,
        p.nationality,
        p.yearsExperience,
        p.area,
        p.status
      ].join(","))
    ];
    
    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    // Create download link
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "talents.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
        <MobileHeader />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 pt-16 md:pt-6 pb-20">
          {/* Dashboard Header with stats */}
          {isDashboardRoute && (
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-5">Welcome to the Footprint Advertising Solutions Dashboard</h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-orange-600 to-orange-500 rounded-lg shadow-lg p-5 text-white relative overflow-hidden">
                  <div className="absolute right-0 top-0 -mt-4 -mr-12 opacity-30">
                    <Users className="h-32 w-32 text-orange-300" />
                  </div>
                  <p className="text-orange-100 text-sm uppercase font-semibold tracking-wider">Total Talent</p>
                  <h2 className="text-4xl font-bold mt-2">{promoters.length}</h2>
                  <div className="flex items-center mt-3">
                    <span className="text-green-300 text-sm font-medium flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                      12% increase
                    </span>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-yellow-500 to-yellow-300 rounded-lg shadow-lg p-5 text-gray-800 relative overflow-hidden">
                  <div className="absolute right-0 top-0 -mt-4 -mr-12 opacity-30">
                    <CheckSquare className="h-32 w-32 text-yellow-600" />
                  </div>
                  <p className="text-gray-800 text-sm uppercase font-semibold tracking-wider">Active Talent</p>
                  <h2 className="text-4xl font-bold mt-2">{promoters.filter(p => p.status === "complete").length}</h2>
                  <div className="flex items-center mt-3">
                    <span className="text-purple-800 text-sm font-medium flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                      5% increase
                    </span>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-200 to-pink-100 rounded-lg shadow-lg p-5 text-purple-900 relative overflow-hidden">
                  <div className="absolute right-0 top-0 -mt-4 -mr-12 opacity-30">
                    <FileText className="h-32 w-32 text-purple-300" />
                  </div>
                  <p className="text-purple-800 text-sm uppercase font-semibold tracking-wider">Presentations</p>
                  <h2 className="text-4xl font-bold mt-2">12</h2>
                  <div className="flex items-center mt-3">
                    <span className="text-purple-800 text-sm font-medium flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                      18% increase
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 p-6 relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-400 rounded-full opacity-10 transform translate-x-1/3 -translate-y-1/2"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-500 rounded-full opacity-10 transform -translate-x-1/3 translate-y-1/3"></div>
              
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 relative z-10">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {isSettingsRoute 
                      ? "System Settings" 
                      : isPresentationsRoute 
                        ? "Presentation Manager"
                        : isAnalyticsRoute
                          ? "Analytics Dashboard"
                          : isMediaRoute
                            ? "Media Library"
                            : isCalendarRoute
                              ? "Calendar"
                              : isDashboardRoute
                                ? "Recent Talent"
                                : "Talent Database"}
                  </h2>
                  <p className="text-orange-100 text-sm mt-1">
                    {isSettingsRoute 
                      ? "Configure your application preferences"
                      : isPresentationsRoute
                        ? "Create and manage talent presentations"
                        : isAnalyticsRoute
                          ? "Analytics and reporting for talent performance"
                          : isMediaRoute
                            ? "Manage your media files and documents"
                            : isCalendarRoute
                              ? "Schedule and manage events and bookings"
                              : `Showing ${promoters.length} talents in the database`}
                  </p>
                </div>
                <div className="flex flex-col md:flex-row gap-4">
                  {!isSettingsRoute && !isPresentationsRoute && !isAnalyticsRoute && !isMediaRoute && !isCalendarRoute && <TalentSearch onSearch={handleSearch} />}
                  {!isSettingsRoute && !isPresentationsRoute && !isAnalyticsRoute && !isMediaRoute && !isCalendarRoute && (
                    <button
                      onClick={() => setLocation("/register")}
                      className="flex items-center justify-center px-4 py-2 bg-white rounded-md text-orange-600 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent shadow-md transition-colors duration-200"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <span>Add New Talent</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6">
              {(isDashboardRoute || isTalentsRoute) && (
                <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-orange-50 p-4 rounded-lg">
                  <TalentFilter onChange={handleFilterChange} />
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handleExportData}
                      type="button"
                      className="px-3 py-2 border border-orange-200 rounded-md text-orange-700 bg-white hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent shadow-sm flex items-center"
                      title="Export data"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      <span className="hidden sm:inline">Export CSV</span>
                    </button>
                    
                    <div className="dropdown-menu-wrapper relative inline-block">
                      <button
                        onClick={() => refetch()}
                        type="button"
                        className="px-3 py-2 border border-orange-200 rounded-md text-orange-700 bg-white hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent shadow-sm flex items-center"
                        title="Refresh data"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span className="hidden sm:inline">Refresh</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Display appropriate content based on the route */}
              {(isDashboardRoute || isTalentsRoute) && (
                <TalentTable 
                  promoters={promoters} 
                  isLoading={isLoading} 
                  isError={isError} 
                />
              )}
              
              {isPresentationsRoute && (
                <PresentationManager />
              )}
              
              {isSettingsRoute && (
                <SystemSettings />
              )}
              
              {isAnalyticsRoute && (
                <AnalyticsDashboard promoters={promoters} isLoading={isLoading} />
              )}
              
              {isMediaRoute && (
                <MediaLibrary promoters={promoters} isLoading={isLoading} />
              )}
              
              {isCalendarRoute && (
                <CalendarView promoters={promoters} isLoading={isLoading} />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}