import { useState } from "react";
import { Check, Crown, Palette, PlusCircle, Sparkles, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Template interface
export interface PresentationTemplate {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  logoPosition: "top-left" | "top-center" | "top-right";
  layout: "modern" | "classic" | "minimal" | "premium" | "elegant" | "corporate";
  showBranding: boolean;
  brandName?: string;
  fontFamily?: string;
  backgroundPattern?: string;
  textureOverlay?: string;
  cornerStyle?: "rounded" | "sharp" | "fancy";
  photoFrameStyle?: "simple" | "shadow" | "border" | "polaroid";
  premium?: boolean;
}

// Default templates
const defaultTemplates: PresentationTemplate[] = [
  {
    id: "default-1",
    name: "FOOTprint Classic",
    primaryColor: "#7c3aed", // Purple
    secondaryColor: "#e9d5ff", // Light purple
    accentColor: "#f9fafb", // Off-white
    logoPosition: "top-left",
    layout: "classic",
    showBranding: true
  },
  {
    id: "default-2",
    name: "FOOTprint Modern",
    primaryColor: "#7c3aed", // Purple
    secondaryColor: "#1e1b4b", // Dark navy
    accentColor: "#f3f4f6", // Light gray
    logoPosition: "top-center",
    layout: "modern",
    showBranding: true
  },
  {
    id: "default-3",
    name: "FOOTprint Minimal",
    primaryColor: "#7c3aed", // Purple
    secondaryColor: "#ffffff", // White
    accentColor: "#f3f4f6", // Light gray 
    logoPosition: "top-right",
    layout: "minimal",
    showBranding: true
  }
];

// Premium branded templates
const premiumTemplates: PresentationTemplate[] = [
  {
    id: "premium-1",
    name: "Luxury Gold",
    primaryColor: "#b7791f", // Gold
    secondaryColor: "#1a202c", // Dark gray
    accentColor: "#fffaf0", // Ivory
    logoPosition: "top-center",
    layout: "premium",
    showBranding: true,
    brandName: "FOOTprint VIP",
    fontFamily: "'Playfair Display', serif",
    backgroundPattern: "dots",
    textureOverlay: "grain",
    cornerStyle: "fancy",
    photoFrameStyle: "border",
    premium: true
  },
  {
    id: "premium-2",
    name: "Corporate Blue",
    primaryColor: "#2563eb", // Royal blue
    secondaryColor: "#1e293b", // Slate
    accentColor: "#f8fafc", // Light gray
    logoPosition: "top-left",
    layout: "corporate",
    showBranding: true,
    brandName: "FOOTprint CORPORATE",
    fontFamily: "'Montserrat', sans-serif",
    backgroundPattern: "lines",
    textureOverlay: "none",
    cornerStyle: "sharp",
    photoFrameStyle: "shadow",
    premium: true
  },
  {
    id: "premium-3",
    name: "Elegant Rose",
    primaryColor: "#be185d", // Pink
    secondaryColor: "#4a044e", // Deep purple
    accentColor: "#fbfbfb", // Off-white
    logoPosition: "top-right",
    layout: "elegant",
    showBranding: true,
    brandName: "FOOTprint ELITE",
    fontFamily: "'Cormorant Garamond', serif",
    backgroundPattern: "waves",
    textureOverlay: "paper",
    cornerStyle: "rounded",
    photoFrameStyle: "polaroid",
    premium: true
  }
];

interface PresentationTemplatesProps {
  onSelectTemplate: (template: PresentationTemplate) => void;
  selectedTemplateId: string;
}

export function PresentationTemplates({ onSelectTemplate, selectedTemplateId }: PresentationTemplatesProps) {
  const [templates, setTemplates] = useState<PresentationTemplate[]>(() => {
    // Load custom templates from localStorage if available
    const savedTemplates = localStorage.getItem("presentation-templates");
    if (savedTemplates) {
      try {
        const parsed = JSON.parse(savedTemplates);
        return [...defaultTemplates, ...premiumTemplates, ...parsed];
      } catch (e) {
        console.error("Failed to parse saved templates", e);
      }
    }
    return [...defaultTemplates, ...premiumTemplates];
  });
  
  const [newTemplate, setNewTemplate] = useState<Partial<PresentationTemplate>>({
    name: "",
    primaryColor: "#7c3aed",
    secondaryColor: "#e9d5ff",
    accentColor: "#f9fafb",
    logoPosition: "top-left",
    layout: "modern",
    showBranding: true
  });
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const saveTemplate = () => {
    if (!newTemplate.name) return;
    
    const template: PresentationTemplate = {
      id: `custom-${Date.now()}`,
      name: newTemplate.name,
      primaryColor: newTemplate.primaryColor || "#7c3aed",
      secondaryColor: newTemplate.secondaryColor || "#e9d5ff",
      accentColor: newTemplate.accentColor || "#f9fafb",
      logoPosition: newTemplate.logoPosition || "top-left",
      layout: newTemplate.layout || "modern",
      showBranding: newTemplate.showBranding !== undefined ? newTemplate.showBranding : true
    };
    
    const updatedTemplates = [...templates, template];
    setTemplates(updatedTemplates);
    
    // Save custom templates to localStorage
    const customTemplates = updatedTemplates.filter(t => !t.id.startsWith("default-"));
    localStorage.setItem("presentation-templates", JSON.stringify(customTemplates));
    
    // Reset form and close dialog
    setNewTemplate({
      name: "",
      primaryColor: "#7c3aed",
      secondaryColor: "#e9d5ff",
      accentColor: "#f9fafb",
      logoPosition: "top-left",
      layout: "modern",
      showBranding: true
    });
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-medium">Presentation Templates</h3>
          <p className="text-sm text-gray-500">Choose a template for your promoter presentation</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="border-purple-200 hover:bg-purple-50">
              <PlusCircle className="mr-2 h-4 w-4 text-purple-600" />
              Create Template
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Template</DialogTitle>
              <DialogDescription>
                Design your own branded presentation template with custom colors and layout.
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="colors" className="mt-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="colors">Colors</TabsTrigger>
                <TabsTrigger value="layout">Layout</TabsTrigger>
                <TabsTrigger value="branding">Branding</TabsTrigger>
              </TabsList>
              
              <TabsContent value="colors" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="templateName">Template Name</Label>
                  <Input
                    id="templateName"
                    value={newTemplate.name || ""}
                    onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
                    placeholder="My Custom Template"
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="primaryColor">Primary Color</Label>
                    <div className="flex">
                      <Input
                        id="primaryColor"
                        type="color"
                        value={newTemplate.primaryColor || "#7c3aed"}
                        onChange={(e) => setNewTemplate({...newTemplate, primaryColor: e.target.value})}
                        className="w-full"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="secondaryColor">Secondary Color</Label>
                    <div className="flex">
                      <Input
                        id="secondaryColor"
                        type="color"
                        value={newTemplate.secondaryColor || "#e9d5ff"}
                        onChange={(e) => setNewTemplate({...newTemplate, secondaryColor: e.target.value})}
                        className="w-full"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="accentColor">Accent Color</Label>
                    <div className="flex">
                      <Input
                        id="accentColor"
                        type="color"
                        value={newTemplate.accentColor || "#f9fafb"}
                        onChange={(e) => setNewTemplate({...newTemplate, accentColor: e.target.value})}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="layout" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Layout Style</Label>
                  <RadioGroup
                    value={newTemplate.layout || "modern"}
                    onValueChange={(value) => setNewTemplate({...newTemplate, layout: value as "modern" | "classic" | "minimal" | "premium" | "elegant" | "corporate"})}
                    className="grid grid-cols-3 gap-4"
                  >
                    <div>
                      <RadioGroupItem
                        value="modern"
                        id="layout-modern"
                        className="sr-only"
                      />
                      <Label
                        htmlFor="layout-modern"
                        className={cn(
                          "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground",
                          newTemplate.layout === "modern" && "border-purple-500"
                        )}
                      >
                        <div className="mb-2 h-6 w-20 rounded bg-purple-200"></div>
                        <div className="h-12 w-full rounded bg-purple-100 mb-2"></div>
                        <div className="h-24 w-full rounded bg-gray-100"></div>
                        <span className="mt-2 text-xs">Modern</span>
                      </Label>
                    </div>
                    
                    <div>
                      <RadioGroupItem
                        value="classic"
                        id="layout-classic"
                        className="sr-only"
                      />
                      <Label
                        htmlFor="layout-classic"
                        className={cn(
                          "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground",
                          newTemplate.layout === "classic" && "border-purple-500"
                        )}
                      >
                        <div className="mb-2 h-6 w-10 rounded bg-purple-200"></div>
                        <div className="h-12 w-full rounded bg-purple-100 mb-2"></div>
                        <div className="h-24 w-full rounded bg-gray-100"></div>
                        <span className="mt-2 text-xs">Classic</span>
                      </Label>
                    </div>
                    
                    <div>
                      <RadioGroupItem
                        value="minimal"
                        id="layout-minimal"
                        className="sr-only"
                      />
                      <Label
                        htmlFor="layout-minimal"
                        className={cn(
                          "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground",
                          newTemplate.layout === "minimal" && "border-purple-500"
                        )}
                      >
                        <div className="mb-2 h-6 w-10 rounded bg-purple-200 float-right"></div>
                        <div className="h-36 w-full rounded bg-gray-100"></div>
                        <span className="mt-2 text-xs">Minimal</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="space-y-2">
                  <Label>Logo Position</Label>
                  <RadioGroup
                    value={newTemplate.logoPosition || "top-left"}
                    onValueChange={(value) => setNewTemplate({...newTemplate, logoPosition: value as "top-left" | "top-center" | "top-right"})}
                    className="grid grid-cols-3 gap-4"
                  >
                    <div>
                      <RadioGroupItem
                        value="top-left"
                        id="logo-top-left"
                        className="sr-only"
                      />
                      <Label
                        htmlFor="logo-top-left"
                        className={cn(
                          "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground",
                          newTemplate.logoPosition === "top-left" && "border-purple-500"
                        )}
                      >
                        <div className="w-full h-20 bg-gray-100 relative">
                          <div className="absolute top-2 left-2 h-5 w-10 rounded bg-purple-400"></div>
                        </div>
                        <span className="mt-2 text-xs">Top Left</span>
                      </Label>
                    </div>
                    
                    <div>
                      <RadioGroupItem
                        value="top-center"
                        id="logo-top-center"
                        className="sr-only"
                      />
                      <Label
                        htmlFor="logo-top-center"
                        className={cn(
                          "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground",
                          newTemplate.logoPosition === "top-center" && "border-purple-500"
                        )}
                      >
                        <div className="w-full h-20 bg-gray-100 relative">
                          <div className="absolute top-2 left-0 right-0 mx-auto h-5 w-10 rounded bg-purple-400"></div>
                        </div>
                        <span className="mt-2 text-xs">Top Center</span>
                      </Label>
                    </div>
                    
                    <div>
                      <RadioGroupItem
                        value="top-right"
                        id="logo-top-right"
                        className="sr-only"
                      />
                      <Label
                        htmlFor="logo-top-right"
                        className={cn(
                          "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground",
                          newTemplate.logoPosition === "top-right" && "border-purple-500"
                        )}
                      >
                        <div className="w-full h-20 bg-gray-100 relative">
                          <div className="absolute top-2 right-2 h-5 w-10 rounded bg-purple-400"></div>
                        </div>
                        <span className="mt-2 text-xs">Top Right</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </TabsContent>
              
              <TabsContent value="branding" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Show FOOTprint Branding</Label>
                  <RadioGroup
                    value={newTemplate.showBranding ? "yes" : "no"}
                    onValueChange={(value) => setNewTemplate({...newTemplate, showBranding: value === "yes"})}
                    className="grid grid-cols-2 gap-4"
                  >
                    <div>
                      <RadioGroupItem
                        value="yes"
                        id="branding-yes"
                        className="sr-only"
                      />
                      <Label
                        htmlFor="branding-yes"
                        className={cn(
                          "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground",
                          newTemplate.showBranding && "border-purple-500"
                        )}
                      >
                        <div className="w-full h-20 bg-gray-100 relative mb-2">
                          <div className="absolute bottom-2 right-2 h-5 w-24 rounded bg-purple-400 flex items-center justify-center">
                            <span className="text-[9px] text-white">FOOTprint TALENT</span>
                          </div>
                        </div>
                        <span className="text-xs">Show Branding</span>
                      </Label>
                    </div>
                    
                    <div>
                      <RadioGroupItem
                        value="no"
                        id="branding-no"
                        className="sr-only"
                      />
                      <Label
                        htmlFor="branding-no"
                        className={cn(
                          "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground",
                          !newTemplate.showBranding && "border-purple-500"
                        )}
                      >
                        <div className="w-full h-20 bg-gray-100 relative mb-2"></div>
                        <span className="text-xs">No Branding</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </TabsContent>
            </Tabs>
            
            <DialogFooter className="mt-6">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={saveTemplate} className="bg-purple-600 hover:bg-purple-700">
                Save Template
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <Card 
            key={template.id} 
            className={cn(
              "cursor-pointer transition-all hover:shadow-md transform hover:-translate-y-1",
              selectedTemplateId === template.id && "ring-2 ring-purple-500",
              template.premium && "border border-amber-300"
            )}
            onClick={() => onSelectTemplate(template)}
          >
            <CardContent className="p-0">
              <div 
                className="h-32 relative" 
                style={{ 
                  background: `linear-gradient(135deg, ${template.primaryColor} 0%, ${template.secondaryColor} 100%)` 
                }}
              >
                {/* Logo representation */}
                <div 
                  className={cn(
                    "absolute h-8 w-16 bg-white rounded flex items-center justify-center",
                    template.logoPosition === "top-left" && "top-3 left-3",
                    template.logoPosition === "top-center" && "top-3 left-1/2 transform -translate-x-1/2",
                    template.logoPosition === "top-right" && "top-3 right-3",
                  )}
                >
                  <span className="text-[10px] font-bold" style={{ color: template.primaryColor }}>
                    LOGO
                  </span>
                </div>
                
                {/* Layout representation */}
                {template.layout === "modern" && (
                  <div className="absolute bottom-3 left-3 right-3 h-12 bg-white/80 backdrop-blur-sm rounded"></div>
                )}
                
                {template.layout === "classic" && (
                  <div className="absolute bottom-3 left-3 right-3 h-12 bg-white/90 rounded border-l-4" style={{ borderColor: template.primaryColor }}></div>
                )}
                
                {template.layout === "minimal" && (
                  <div className="absolute bottom-3 left-3 right-3 h-8 bg-white/70 backdrop-blur-sm rounded-full"></div>
                )}
                
                {template.layout === "premium" && (
                  <div className="absolute bottom-3 left-3 right-3 h-12 bg-white/90 backdrop-blur-sm rounded shadow-lg border" style={{ borderColor: template.primaryColor }}></div>
                )}
                
                {template.layout === "elegant" && (
                  <div className="absolute bottom-3 left-3 right-3 h-10 bg-white/80 backdrop-blur-sm rounded-lg" style={{ borderBottom: `2px solid ${template.primaryColor}` }}></div>
                )}
                
                {template.layout === "corporate" && (
                  <div className="absolute bottom-3 left-3 right-3 h-12 bg-white/90 rounded-sm border-t-4" style={{ borderColor: template.primaryColor }}></div>
                )}
                
                {/* Branding */}
                {template.showBranding && (
                  <div 
                    className="absolute bottom-1 right-1 text-[9px] font-medium px-1.5 rounded"
                    style={{ 
                      backgroundColor: template.primaryColor,
                      color: template.accentColor
                    }}
                  >
                    FOOTprint
                  </div>
                )}
                
                {/* Premium indicator */}
                {template.premium && (
                  <>
                    <div className="absolute top-0 left-0 w-24 h-24 overflow-hidden">
                      <div className="absolute top-0 left-0 transform -translate-x-12 -translate-y-6 rotate-45 bg-gradient-to-r from-amber-400 to-yellow-500 text-white text-[10px] font-bold py-1 w-32 text-center shadow-md">
                        PREMIUM
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-3 flex items-center gap-1 bg-white/80 px-1.5 rounded-full shadow-sm">
                      <Sparkles className="h-3 w-3 text-amber-400" />
                      <span className="text-[8px] font-medium text-gray-700">
                        Premium Features
                      </span>
                    </div>
                  </>
                )}
                
                {/* Selected indicator */}
                {selectedTemplateId === template.id && (
                  <div className="absolute top-2 right-2 h-6 w-6 bg-white rounded-full flex items-center justify-center">
                    <Check className="h-4 w-4 text-purple-600" />
                  </div>
                )}
              </div>
              
              <div className="p-3 flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-sm">{template.name}</h4>
                  <p className="text-xs text-gray-500">{template.layout.charAt(0).toUpperCase() + template.layout.slice(1)} layout</p>
                  
                  {/* Premium features display */}
                  {template.premium && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {template.cornerStyle && (
                        <span className="inline-flex items-center rounded-full bg-purple-50 px-2 py-0.5 text-[9px] text-purple-600">
                          {template.cornerStyle} corners
                        </span>
                      )}
                      {template.photoFrameStyle && (
                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-[9px] text-blue-600">
                          {template.photoFrameStyle} frames
                        </span>
                      )}
                    </div>
                  )}
                </div>
                
                {template.id.startsWith("default") && (
                  <div className="flex items-center">
                    <Palette className="h-4 w-4 text-purple-500" />
                  </div>
                )}
                
                {template.id.startsWith("premium") && (
                  <div className="flex items-center">
                    <div className="relative group">
                      <div className="flex items-center gap-1">
                        <Sparkles className="h-4 w-4 text-amber-400" />
                        <Crown className="h-4 w-4 text-amber-500" />
                      </div>
                      <span className="absolute opacity-0 group-hover:opacity-100 bottom-full right-0 mb-2 px-2 py-1 text-xs bg-black/80 text-white rounded whitespace-nowrap transition-opacity">
                        Premium Template with Enhanced Features
                      </span>
                    </div>
                  </div>
                )}
                
                {!template.id.startsWith("default") && !template.id.startsWith("premium") && (
                  <div className="flex items-center">
                    <Palette className="h-4 w-4 text-purple-500" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}