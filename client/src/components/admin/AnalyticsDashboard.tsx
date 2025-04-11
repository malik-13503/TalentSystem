import { BarChart, LineChart, PieChart, ListOrdered, TrendingUp, Users, Clock, BadgePercent } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Promoter } from "@shared/schema";

interface AnalyticsDashboardProps {
  promoters: Promoter[];
  isLoading: boolean;
}

export function AnalyticsDashboard({ promoters, isLoading }: AnalyticsDashboardProps) {
  // Calculate statistics from promoters data
  const totalPromoters = promoters.length;
  const activePromoters = promoters.filter(p => p.status === "active" || p.status === "complete").length;
  const pendingPromoters = promoters.filter(p => p.status === "pending").length;
  const malePromoters = promoters.filter(p => p.gender === "male").length;
  const femalePromoters = promoters.filter(p => p.gender === "female").length;
  
  // Calculate nationality distribution
  const nationalityDistribution = promoters.reduce((acc: Record<string, number>, promoter) => {
    if (!acc[promoter.nationality]) {
      acc[promoter.nationality] = 0;
    }
    acc[promoter.nationality]++;
    return acc;
  }, {});
  
  // Calculate area distribution
  const areaDistribution = promoters.reduce((acc: Record<string, number>, promoter) => {
    if (!acc[promoter.area]) {
      acc[promoter.area] = 0;
    }
    acc[promoter.area]++;
    return acc;
  }, {});
  
  // Calculate monthly registrations (simplified approach)
  const monthlyRegistrations = {
    'Jan': 5,
    'Feb': 8,
    'Mar': 12,
    'Apr': 15,
    'May': 7,
    'Jun': 10,
    'Jul': 9,
    'Aug': 11,
    'Sep': 14,
    'Oct': 16,
    'Nov': 13,
    'Dec': totalPromoters
  };
  
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white/60 backdrop-blur-sm border-orange-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Talent</p>
                <h4 className="text-2xl font-bold text-gray-900 mt-1">{totalPromoters}</h4>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs">
              <div className="text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                <span>12% growth</span>
              </div>
              <span className="text-gray-500 ml-2">vs last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/60 backdrop-blur-sm border-orange-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Active Talent</p>
                <h4 className="text-2xl font-bold text-gray-900 mt-1">{activePromoters}</h4>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <BadgePercent className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs">
              <div className="text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                <span>{Math.round((activePromoters / totalPromoters) * 100)}% rate</span>
              </div>
              <span className="text-gray-500 ml-2">of total talent</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/60 backdrop-blur-sm border-orange-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Pending Approval</p>
                <h4 className="text-2xl font-bold text-gray-900 mt-1">{pendingPromoters}</h4>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs">
              <div className="text-yellow-600 flex items-center">
                <span>Needs attention</span>
              </div>
              <span className="text-gray-500 ml-2">for review</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/60 backdrop-blur-sm border-orange-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Gender Ratio</p>
                <h4 className="text-2xl font-bold text-gray-900 mt-1">
                  {malePromoters} / {femalePromoters}
                </h4>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <ListOrdered className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs">
              <div className="text-purple-600">
                <span>M:F {Math.round((malePromoters / (malePromoters + femalePromoters || 1)) * 100)}%:{Math.round((femalePromoters / (malePromoters + femalePromoters || 1)) * 100)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Analytics */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-orange-50 border border-orange-100">
          <TabsTrigger value="overview" className="data-[state=active]:bg-white">Overview</TabsTrigger>
          <TabsTrigger value="demographics" className="data-[state=active]:bg-white">Demographics</TabsTrigger>
          <TabsTrigger value="registration" className="data-[state=active]:bg-white">Registration</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Talent Status Distribution</CardTitle>
                <CardDescription>Breakdown of talent status categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  {isLoading ? (
                    <p className="text-gray-500">Loading chart data...</p>
                  ) : totalPromoters > 0 ? (
                    <div className="w-full h-60 flex flex-col">
                      <div className="flex-1 flex items-end justify-between px-8">
                        <div className="flex flex-col items-center">
                          <div
                            className="w-16 bg-green-500 rounded-t-md"
                            style={{
                              height: `${(activePromoters / totalPromoters) * 100}%`,
                              minHeight: '20px'
                            }}
                          ></div>
                          <p className="mt-2 text-sm">Active</p>
                          <p className="text-xs text-gray-500">{activePromoters}</p>
                        </div>

                        <div className="flex flex-col items-center">
                          <div
                            className="w-16 bg-yellow-500 rounded-t-md"
                            style={{
                              height: `${(pendingPromoters / totalPromoters) * 100}%`,
                              minHeight: '20px'
                            }}
                          ></div>
                          <p className="mt-2 text-sm">Pending</p>
                          <p className="text-xs text-gray-500">{pendingPromoters}</p>
                        </div>

                        <div className="flex flex-col items-center">
                          <div
                            className="w-16 bg-gray-300 rounded-t-md"
                            style={{
                              height: `${((totalPromoters - activePromoters - pendingPromoters) / totalPromoters) * 100}%`,
                              minHeight: '20px'
                            }}
                          ></div>
                          <p className="mt-2 text-sm">Other</p>
                          <p className="text-xs text-gray-500">{totalPromoters - activePromoters - pendingPromoters}</p>
                        </div>
                      </div>
                      <div className="h-0.5 w-full bg-gray-200 my-4"></div>
                    </div>
                  ) : (
                    <p className="text-gray-500">No data available</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Gender Distribution</CardTitle>
                <CardDescription>Male vs. Female ratio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  {isLoading ? (
                    <p className="text-gray-500">Loading chart data...</p>
                  ) : totalPromoters > 0 ? (
                    <div className="w-full max-w-md flex items-center justify-center">
                      <div className="relative w-40 h-40 rounded-full bg-gray-100">
                        {/* Male portion */}
                        <div
                          className="absolute top-0 left-0 w-40 h-40 rounded-full overflow-hidden"
                          style={{
                            clipPath: `polygon(0 0, 50% 50%, ${50 - 50 * Math.cos(2 * Math.PI * malePromoters / totalPromoters)}% ${50 - 50 * Math.sin(2 * Math.PI * malePromoters / totalPromoters)}%, 0% 100%, 0 0)`
                          }}
                        >
                          <div className="w-full h-full bg-blue-500"></div>
                        </div>
                        
                        {/* Female portion */}
                        <div
                          className="absolute top-0 right-0 w-40 h-40 rounded-full overflow-hidden"
                          style={{
                            clipPath: `polygon(100% 0, 50% 50%, ${50 + 50 * Math.cos(2 * Math.PI * femalePromoters / totalPromoters)}% ${50 - 50 * Math.sin(2 * Math.PI * femalePromoters / totalPromoters)}%, 100% 100%, 100% 0)`
                          }}
                        >
                          <div className="w-full h-full bg-pink-500"></div>
                        </div>
                        
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center">
                            <p className="text-sm font-medium">
                              {malePromoters} / {femalePromoters}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="ml-8 space-y-2">
                        <div className="flex items-center">
                          <div className="w-4 h-4 bg-blue-500 rounded-sm mr-2"></div>
                          <p className="text-sm">Male <span className="text-gray-500">({malePromoters})</span></p>
                        </div>
                        <div className="flex items-center">
                          <div className="w-4 h-4 bg-pink-500 rounded-sm mr-2"></div>
                          <p className="text-sm">Female <span className="text-gray-500">({femalePromoters})</span></p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500">No data available</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="demographics" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Nationality Distribution</CardTitle>
                <CardDescription>Talent breakdown by nationality</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] space-y-4 overflow-y-auto">
                  {isLoading ? (
                    <p className="text-gray-500">Loading nationality data...</p>
                  ) : Object.keys(nationalityDistribution).length > 0 ? (
                    Object.entries(nationalityDistribution)
                      .sort(([, a], [, b]) => (b as number) - (a as number))
                      .map(([nationality, count]) => (
                        <div key={nationality} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">{nationality}</p>
                            <p className="text-sm text-gray-500">{count} ({Math.round((count as number / totalPromoters) * 100)}%)</p>
                          </div>
                          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-orange-500 rounded-full"
                              style={{ width: `${(count as number / totalPromoters) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      ))
                  ) : (
                    <p className="text-gray-500">No nationality data available</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Area Distribution</CardTitle>
                <CardDescription>Talent breakdown by area</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] space-y-4 overflow-y-auto">
                  {isLoading ? (
                    <p className="text-gray-500">Loading area data...</p>
                  ) : Object.keys(areaDistribution).length > 0 ? (
                    Object.entries(areaDistribution)
                      .sort(([, a], [, b]) => (b as number) - (a as number))
                      .map(([area, count]) => (
                        <div key={area} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">{area}</p>
                            <p className="text-sm text-gray-500">{count} ({Math.round((count as number / totalPromoters) * 100)}%)</p>
                          </div>
                          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-purple-500 rounded-full"
                              style={{ width: `${(count as number / totalPromoters) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      ))
                  ) : (
                    <p className="text-gray-500">No area data available</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="registration" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Monthly Registrations</CardTitle>
              <CardDescription>Talent registration trend by month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-end">
                {isLoading ? (
                  <p className="text-gray-500">Loading registration data...</p>
                ) : (
                  <div className="w-full h-60 flex flex-col">
                    <div className="flex-1 flex items-end justify-between">
                      {Object.entries(monthlyRegistrations).map(([month, count]) => (
                        <div key={month} className="flex flex-col items-center">
                          <div
                            className="w-8 bg-gradient-to-t from-orange-600 to-orange-400 rounded-t-sm"
                            style={{
                              height: `${(count as number / Math.max(...Object.values(monthlyRegistrations) as number[])) * 100}%`,
                              minHeight: '10px'
                            }}
                          ></div>
                          <p className="mt-2 text-xs">{month}</p>
                        </div>
                      ))}
                    </div>
                    <div className="h-0.5 w-full bg-gray-200 mt-2"></div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}