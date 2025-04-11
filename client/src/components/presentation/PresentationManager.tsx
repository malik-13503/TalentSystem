import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Share, AlertOctagon, Settings, Crown, Sparkles, Eye, Filter, Search, FileSpreadsheet } from "lucide-react";
import { PromoterProfile } from "./PromoterProfile";
import { PresentationTemplates, type PresentationTemplate } from "./PresentationTemplates";
import { sharePromoterProfile } from "@/lib/presentation";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Promoter } from "@shared/schema";

export function PresentationManager() {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  
  // Filter and search state
  const [searchQuery, setSearchQuery] = useState("");
  const [filterNationality, setFilterNationality] = useState("all");
  const [filterArea, setFilterArea] = useState("all");
  const [selectedPromoterId, setSelectedPromoterId] = useState<number | null>(null);
  
  // Template and settings state
  const [selectedTemplate, setSelectedTemplate] = useState<PresentationTemplate>({
    id: "default-1",
    name: "FOOTprint Classic",
    primaryColor: "#7c3aed", // Purple
    secondaryColor: "#e9d5ff", // Light purple
    accentColor: "#f9fafb", // Off-white
    logoPosition: "top-left",
    layout: "classic",
    showBranding: true
  });
  
  const [includeContact, setIncludeContact] = useState(true);
  const [includeExperience, setIncludeExperience] = useState(true);
  const [includeLanguages, setIncludeLanguages] = useState(true);
  const [pageSize, setPageSize] = useState<'a4' | 'letter'>('a4');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  
  // Query to fetch all talents
  const promotersQuery = useQuery<Promoter[]>({
    queryKey: ["/api/talents"],
  });
  
  // Filtered promoters based on search and filters
  const filteredPromoters = promotersQuery.data ? promotersQuery.data.filter(promoter => {
    const matchesSearch = searchQuery === "" || 
      `${promoter.firstName} ${promoter.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      promoter.uniqueId.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesNationality = filterNationality === "all" || filterNationality === "" || promoter.nationality === filterNationality;
    const matchesArea = filterArea === "all" || filterArea === "" || promoter.area === filterArea;
    
    return matchesSearch && matchesNationality && matchesArea;
  }) : [];
  
  const isLoading = promotersQuery.isLoading;
  const isError = promotersQuery.isError;
  

  
  const handleShareProfile = async (promoterId: number) => {
    try {
      // Fetch the specific talent data
      const response = await fetch(`/api/talents/${promoterId}`);
      if (!response.ok) throw new Error("Failed to fetch talent");
      const promoter = await response.json();
      
      const currentUrl = `${window.location.origin}/presentation/${promoterId}`;
      const success = await sharePromoterProfile(promoter, currentUrl);
      
      if (success) {
        toast({
          title: "Shared Successfully",
          description: "Talent profile has been shared."
        });
      } else {
        // Copy the URL to clipboard as fallback
        await navigator.clipboard.writeText(currentUrl);
        toast({
          title: "URL Copied",
          description: "Profile URL has been copied to clipboard."
        });
      }
    } catch (error) {
      console.error("Error sharing profile:", error);
      toast({
        title: "Error",
        description: "Failed to share profile. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Function to download all talents data as CSV
  const handleDownloadAllData = () => {
    if (!promotersQuery.data || promotersQuery.data.length === 0) {
      toast({
        title: "No Data",
        description: "There are no talents to download.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Create CSV headers
      const headers = [
        "ID", "Unique ID", "First Name", "Last Name", "Email", 
        "Date of Birth", "Gender", "Mobile Number", "Nationality", 
        "Area", "Years Experience", "Height", "Status"
      ];
      
      // Convert data to CSV rows
      const rows = promotersQuery.data.map(promoter => [
        promoter.id,
        promoter.uniqueId,
        promoter.firstName,
        promoter.lastName,
        promoter.email,
        promoter.dateOfBirth,
        promoter.gender,
        promoter.mobileNumber,
        promoter.nationality,
        promoter.area,
        promoter.yearsExperience || "",
        promoter.height || "",
        promoter.status
      ]);
      
      // Combine headers and rows
      const csvContent = [
        headers.join(","),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
      ].join("\n");
      
      // Create and download the file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `talents_data_${new Date().toISOString().slice(0, 10)}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download Complete",
        description: "All talents data has been downloaded as CSV."
      });
    } catch (error) {
      console.error("Error downloading data:", error);
      toast({
        title: "Error",
        description: "Failed to download talents data. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Error state
  if (isError) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertOctagon className="h-4 w-4" />
        <AlertDescription>
          Failed to load talent data. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }
  
  // Apply template styles to the profile element
  const applyTemplateStyles = () => {
    const profileElement = document.getElementById('promoter-profile');
    if (!profileElement) return;
    
    // Reset classes
    profileElement.classList.remove(
      'template-modern', 'template-classic', 'template-minimal', 
      'template-premium', 'template-elegant', 'template-corporate'
    );
    profileElement.classList.remove('logo-top-left', 'logo-top-center', 'logo-top-right');
    profileElement.classList.remove('premium-template');
    profileElement.classList.remove(
      'corner-rounded', 'corner-sharp', 'corner-fancy',
      'frame-simple', 'frame-shadow', 'frame-border', 'frame-polaroid',
      'pattern-dots', 'pattern-lines', 'pattern-waves',
      'texture-paper', 'texture-grain', 'texture-none'
    );
    
    // Add new template classes
    profileElement.classList.add(`template-${selectedTemplate.layout}`);
    profileElement.classList.add(`logo-${selectedTemplate.logoPosition}`);
    
    // Add premium template classes if available
    if (selectedTemplate.premium) {
      profileElement.classList.add('premium-template');
    }
    
    // Add corner style classes if available
    if (selectedTemplate.cornerStyle) {
      profileElement.classList.add(`corner-${selectedTemplate.cornerStyle}`);
    }
    
    // Add photo frame style classes if available
    if (selectedTemplate.photoFrameStyle) {
      profileElement.classList.add(`frame-${selectedTemplate.photoFrameStyle}`);
    }
    
    // Add background pattern classes if available
    if (selectedTemplate.backgroundPattern) {
      profileElement.classList.add(`pattern-${selectedTemplate.backgroundPattern}`);
    }
    
    // Add texture overlay classes if available
    if (selectedTemplate.textureOverlay) {
      profileElement.classList.add(`texture-${selectedTemplate.textureOverlay}`);
    }
    
    if (selectedTemplate.showBranding) {
      profileElement.classList.add('show-branding');
    } else {
      profileElement.classList.remove('show-branding');
    }
    
    // Add template styles
    const existingStyle = document.getElementById('presentation-template-style');
    if (existingStyle) {
      document.head.removeChild(existingStyle);
    }
    
    const templateStyles = document.createElement('style');
    templateStyles.id = 'presentation-template-style';
    templateStyles.innerHTML = `
      #promoter-profile {
        --primary-color: ${selectedTemplate.primaryColor};
        --secondary-color: ${selectedTemplate.secondaryColor};
        --accent-color: ${selectedTemplate.accentColor};
        ${selectedTemplate.fontFamily ? `--font-family: ${selectedTemplate.fontFamily};` : ''}
      }
      
      ${selectedTemplate.premium ? `
      #promoter-profile .premium-feature {
        display: block;
      }
      
      #promoter-profile .profile-header {
        background: linear-gradient(135deg, ${selectedTemplate.primaryColor}, ${selectedTemplate.secondaryColor});
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        border-radius: ${selectedTemplate.cornerStyle === 'rounded' ? '12px' : 
                         selectedTemplate.cornerStyle === 'fancy' ? '12px 0 12px 0' : '0'};
      }
      
      #promoter-profile .profile-card {
        border-radius: ${selectedTemplate.cornerStyle === 'rounded' ? '8px' : 
                         selectedTemplate.cornerStyle === 'fancy' ? '16px 0 16px 0' : '0'};
        overflow: hidden;
        box-shadow: ${selectedTemplate.photoFrameStyle === 'shadow' ? '0 12px 24px rgba(0, 0, 0, 0.15)' : 
                     selectedTemplate.photoFrameStyle === 'border' ? '0 0 0 3px ' + selectedTemplate.accentColor : 'none'};
      }
      
      ${selectedTemplate.textureOverlay ? `
      #promoter-profile::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-image: url('/textures/${selectedTemplate.textureOverlay}.png');
        opacity: 0.05;
        pointer-events: none;
        z-index: 1;
      }
      ` : ''}
      
      ${selectedTemplate.backgroundPattern ? `
      #promoter-profile {
        background-image: url('/patterns/${selectedTemplate.backgroundPattern}.svg');
        background-size: ${selectedTemplate.backgroundPattern === 'dots' ? '20px 20px' : 
                           selectedTemplate.backgroundPattern === 'lines' ? '40px 40px' : '100px 100px'};
        background-repeat: repeat;
        background-color: rgba(255, 255, 255, 0.98);
      }
      ` : ''}
      ` : ''}
    `;
    document.head.appendChild(templateStyles);
  };
  
  // When template changes, apply styles
  const handleTemplateChange = (template: PresentationTemplate) => {
    setSelectedTemplate(template);
    setTimeout(applyTemplateStyles, 0);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-medium">Presentation</h3>
          <p className="text-sm text-gray-500">Generate and share professional talent presentations</p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => setLocation("/register")}
            className="border-purple-200 hover:bg-purple-50"
          >
            <Eye className="mr-2 h-4 w-4 text-purple-600" />
            Create New Talent
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full max-w-md grid grid-cols-2 mb-6">
          <TabsTrigger value="profile" className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-900">
            Profile View
          </TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-900">
            Settings
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="mt-0">
          <Card className="border-0 shadow-xl">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h3 className="text-lg font-medium">Talents Database</h3>
                
                <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleDownloadAllData}
                    className="flex items-center gap-1"
                  >
                    <FileSpreadsheet className="h-3.5 w-3.5 text-purple-600" />
                    Download All
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search by name or ID..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <div className="flex gap-2 flex-wrap">
                    <div className="w-full sm:w-auto">
                      <Select 
                        value={filterNationality} 
                        onValueChange={setFilterNationality}
                      >
                        <SelectTrigger className="w-full sm:w-[180px]">
                          <SelectValue placeholder="Nationality" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Nationalities</SelectItem>
                          {promotersQuery.data && Array.from(new Set(promotersQuery.data.map(p => p.nationality))).map(nat => (
                            <SelectItem key={nat} value={nat}>{nat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="w-full sm:w-auto">
                      <Select 
                        value={filterArea} 
                        onValueChange={setFilterArea}
                      >
                        <SelectTrigger className="w-full sm:w-[180px]">
                          <SelectValue placeholder="Area" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Areas</SelectItem>
                          {promotersQuery.data && Array.from(new Set(promotersQuery.data.map(p => p.area))).map(area => (
                            <SelectItem key={area} value={area}>{area}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {((filterNationality && filterNationality !== "all") || (filterArea && filterArea !== "all")) && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => {
                          setFilterNationality("all");
                          setFilterArea("all");
                        }}
                        className="text-gray-500"
                      >
                        Clear Filters
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : (
                <div className="grid gap-4">
                  {filteredPromoters.length > 0 ? (
                    filteredPromoters.map((promoter) => (
                      <div 
                        key={promoter.id} 
                        className="border rounded-lg p-4 hover:bg-purple-50 transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
                      >
                        <div>
                          <h4 className="font-medium text-purple-900">{promoter.firstName} {promoter.lastName}</h4>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                              {promoter.uniqueId}
                            </Badge>
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                              {promoter.nationality}
                            </Badge>
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              {promoter.area}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-auto">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleShareProfile(promoter.id)}
                            className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                          >
                            <Share className="h-3.5 w-3.5" />
                          </Button>

                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setLocation(`/presentation/${promoter.id}`)}
                            className="bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            View
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      {searchQuery || (filterNationality && filterNationality !== "all") || (filterArea && filterArea !== "all") ? 
                        "No talents found with the current filters" : 
                        "No talents found in the database"}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="templates" className="mt-0">
          <PresentationTemplates 
            selectedTemplateId={selectedTemplate.id}
            onSelectTemplate={handleTemplateChange}
          />
        </TabsContent>
        
        <TabsContent value="settings" className="mt-0">
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Presentation Settings</h3>
                <Settings className="h-5 w-5 text-purple-500" />
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Content Settings</h4>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="include-contact" 
                      checked={includeContact}
                      onCheckedChange={(checked) => setIncludeContact(checked as boolean)}
                    />
                    <Label htmlFor="include-contact" className="text-sm">Include Contact Information</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="include-experience" 
                      checked={includeExperience}
                      onCheckedChange={(checked) => setIncludeExperience(checked as boolean)}
                    />
                    <Label htmlFor="include-experience" className="text-sm">Include Professional Experience</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="include-languages" 
                      checked={includeLanguages}
                      onCheckedChange={(checked) => setIncludeLanguages(checked as boolean)}
                    />
                    <Label htmlFor="include-languages" className="text-sm">Include Languages</Label>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h4 className="font-medium text-sm">PDF Settings</h4>
                
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label className="text-sm">Page Size</Label>
                    <RadioGroup 
                      defaultValue={pageSize} 
                      onValueChange={(value) => setPageSize(value as 'a4' | 'letter')}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="a4" id="a4" />
                        <Label htmlFor="a4" className="text-sm">A4</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="letter" id="letter" />
                        <Label htmlFor="letter" className="text-sm">Letter</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm">Page Orientation</Label>
                    <RadioGroup 
                      defaultValue={orientation} 
                      onValueChange={(value) => setOrientation(value as 'portrait' | 'landscape')}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="portrait" id="portrait" />
                        <Label htmlFor="portrait" className="text-sm">Portrait</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="landscape" id="landscape" />
                        <Label htmlFor="landscape" className="text-sm">Landscape</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>
              
              {/* Premium template settings - only shown when a premium template is selected */}
              {selectedTemplate.premium && (
                <>
                  <Separator />
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm flex items-center">
                        Premium Template Settings
                        <Crown className="h-3 w-3 ml-2 text-amber-500" />
                      </h4>
                      <div className="bg-gradient-to-r from-amber-400 to-yellow-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                        PREMIUM
                      </div>
                    </div>
                    
                    {selectedTemplate.cornerStyle && (
                      <div className="space-y-2">
                        <Label className="text-sm">Corner Style</Label>
                        <div className="grid grid-cols-3 gap-2">
                          <div className={`border rounded-md p-2 text-center text-xs ${selectedTemplate.cornerStyle === 'rounded' ? 'bg-purple-50 border-purple-200' : 'border-gray-200'}`}>
                            <div className="w-full h-10 rounded-xl bg-gray-100 mx-auto mb-1"></div>
                            Rounded
                          </div>
                          <div className={`border rounded-md p-2 text-center text-xs ${selectedTemplate.cornerStyle === 'sharp' ? 'bg-purple-50 border-purple-200' : 'border-gray-200'}`}>
                            <div className="w-full h-10 rounded-none bg-gray-100 mx-auto mb-1"></div>
                            Sharp
                          </div>
                          <div className={`border rounded-md p-2 text-center text-xs ${selectedTemplate.cornerStyle === 'fancy' ? 'bg-purple-50 border-purple-200' : 'border-gray-200'}`}>
                            <div className="w-full h-10 rounded-tl-xl rounded-br-xl bg-gray-100 mx-auto mb-1"></div>
                            Fancy
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {selectedTemplate.photoFrameStyle && (
                      <div className="space-y-2">
                        <Label className="text-sm">Photo Frame Style</Label>
                        <div className="grid grid-cols-4 gap-2">
                          <div className={`border rounded-md p-2 text-center text-xs ${selectedTemplate.photoFrameStyle === 'simple' ? 'bg-purple-50 border-purple-200' : 'border-gray-200'}`}>
                            <div className="w-12 h-12 border border-gray-200 bg-gray-100 mx-auto mb-1"></div>
                            Simple
                          </div>
                          <div className={`border rounded-md p-2 text-center text-xs ${selectedTemplate.photoFrameStyle === 'shadow' ? 'bg-purple-50 border-purple-200' : 'border-gray-200'}`}>
                            <div className="w-12 h-12 shadow-lg bg-gray-100 mx-auto mb-1"></div>
                            Shadow
                          </div>
                          <div className={`border rounded-md p-2 text-center text-xs ${selectedTemplate.photoFrameStyle === 'border' ? 'bg-purple-50 border-purple-200' : 'border-gray-200'}`}>
                            <div className="w-12 h-12 border-4 border-white shadow-md bg-gray-100 mx-auto mb-1"></div>
                            Border
                          </div>
                          <div className={`border rounded-md p-2 text-center text-xs ${selectedTemplate.photoFrameStyle === 'polaroid' ? 'bg-purple-50 border-purple-200' : 'border-gray-200'}`}>
                            <div className="w-12 h-12 border-8 border-t-8 border-white rotate-1 shadow-md bg-gray-100 mx-auto mb-1"></div>
                            Polaroid
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
              
              <div className="pt-4">
                <p className="text-sm text-gray-500 mb-2 text-center">Select a talent from the Profile View tab to download their presentation with these settings.</p>
                <Button 
                  onClick={() => setActiveTab("profile")}
                  className="bg-purple-600 hover:bg-purple-700 w-full"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View Talents
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}