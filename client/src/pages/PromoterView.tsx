import { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Promoter, Document as PromoterDocument } from "@shared/schema";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { ArrowLeft, Download, Eye, FileText, Mail, MapPin, Phone, Share2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { generatePromoterPDF, getNationalityDisplay, getAreaDisplay } from "@/lib/presentation";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

export default function PromoterView() {
  const [, params] = useRoute<{ id: string }>("/talent/:id");
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const promoterId = params?.id ? parseInt(params.id) : null;
  
  // Document preview state
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<PromoterDocument | null>(null);
  
  // Check if user is logged in
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      setLocation("/admin");
    }
  }, [setLocation]);
  
  // Fetch promoter data
  const { 
    data: promoter, 
    isLoading: isPromoterLoading, 
    isError: isPromoterError 
  } = useQuery<Promoter>({
    queryKey: [`/api/talents/${promoterId}`],
    queryFn: () => {
      if (!promoterId) return Promise.reject(new Error("Invalid ID"));
      return fetch(`/api/talents/${promoterId}`).then(res => {
        if (!res.ok) throw new Error("Failed to fetch promoter");
        return res.json();
      });
    },
    enabled: !!promoterId,
  });
  
  // Fetch documents
  const { 
    data: documents = [], 
    isLoading: isDocumentsLoading 
  } = useQuery<PromoterDocument[]>({
    queryKey: [`/api/talents/${promoterId}/documents`],
    queryFn: async () => {
      if (!promoterId) return Promise.resolve([]);
      const res = await fetch(`/api/talents/${promoterId}/documents`);
      const data = await res.json();
      return data;
    },
    enabled: !!promoterId,
  });
  
  // Handle generating PDF
  const handleGeneratePDF = async () => {
    if (!promoter) return;
    
    try {
      // Create a temp div to render the content for PDF
      const tempDiv = document.createElement("div");
      tempDiv.id = "promoter-profile-export";
      tempDiv.style.position = "absolute";
      tempDiv.style.left = "-9999px";
      tempDiv.style.top = "0";
      tempDiv.style.width = "800px";
      tempDiv.style.padding = "20px";
      tempDiv.style.backgroundColor = "#ffffff";
      document.body.appendChild(tempDiv);
      
      // Create profile content
      tempDiv.innerHTML = `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <div style="text-align: center; margin-bottom: 20px; border-bottom: 2px solid #f0f0f0; padding-bottom: 20px;">
            <h1 style="color: #2563eb; margin-bottom: 5px; font-size: 24px;">Promoter Profile</h1>
            <p style="font-size: 16px;">${promoter.uniqueId}</p>
          </div>
          
          <div style="margin-bottom: 30px;">
            <h2 style="font-size: 20px; margin-bottom: 15px; color: #1e40af; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px;">Personal Information</h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
              <div>
                <p style="font-weight: bold; margin-bottom: 5px;">Full Name:</p>
                <p>${promoter.firstName} ${promoter.lastName}</p>
              </div>
              <div>
                <p style="font-weight: bold; margin-bottom: 5px;">Gender:</p>
                <p style="text-transform: capitalize">${promoter.gender}</p>
              </div>
              <div>
                <p style="font-weight: bold; margin-bottom: 5px;">Date of Birth:</p>
                <p>${formatDate(promoter.dateOfBirth)}</p>
              </div>
              <div>
                <p style="font-weight: bold; margin-bottom: 5px;">Mobile Number:</p>
                <p>${promoter.mobileNumber}</p>
              </div>
              <div>
                <p style="font-weight: bold; margin-bottom: 5px;">Nationality:</p>
                <p>${getNationalityDisplay(promoter.nationality)}</p>
              </div>
              <div>
                <p style="font-weight: bold; margin-bottom: 5px;">Area:</p>
                <p>${getAreaDisplay(promoter.area)}</p>
              </div>
            </div>
          </div>
          
          <div style="margin-bottom: 30px;">
            <h2 style="font-size: 20px; margin-bottom: 15px; color: #1e40af; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px;">Professional Details</h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
              <div>
                <p style="font-weight: bold; margin-bottom: 5px;">Years of Experience:</p>
                <p>${promoter.yearsExperience || 0} years</p>
              </div>
              <div>
                <p style="font-weight: bold; margin-bottom: 5px;">Height:</p>
                <p>${promoter.height ? `${promoter.height} cm` : 'Not specified'}</p>
              </div>
              <div>
                <p style="font-weight: bold; margin-bottom: 5px;">T-Shirt Size:</p>
                <p>${promoter.tShirtSize || 'Not specified'}</p>
              </div>
              <div>
                <p style="font-weight: bold; margin-bottom: 5px;">Shirt Size:</p>
                <p>${promoter.shirtSize || 'Not specified'}</p>
              </div>
            </div>
            
            <div style="margin-top: 20px;">
              <p style="font-weight: bold; margin-bottom: 5px;">Previous Experience:</p>
              <p style="white-space: pre-line">${promoter.previousExperience || 'None specified'}</p>
            </div>
            
            <div style="margin-top: 20px;">
              <p style="font-weight: bold; margin-bottom: 5px;">Brands Worked For:</p>
              <p style="white-space: pre-line">${promoter.brandsWorkedFor || 'None specified'}</p>
            </div>
          </div>
          
          <div style="margin-top: 20px; font-size: 12px; text-align: center; color: #6b7280; border-top: 1px solid #e5e7eb; padding-top: 10px;">
            <p>Generated on ${new Date().toLocaleString()} | PromoterPro</p>
          </div>
        </div>
      `;
      
      // Generate and download the PDF
      await generatePromoterPDF(promoter, documents, "promoter-profile-export", {
        includeContact: true,
        includeExperience: true,
        includeLanguages: false,
        pageSize: "a4",
        orientation: "portrait"
      });
      
      // Clean up
      document.body.removeChild(tempDiv);
      
      toast({
        title: "PDF Generated",
        description: "The promoter profile has been downloaded as PDF."
      });
    } catch (error) {
      console.error("PDF generation error:", error);
      toast({
        title: "PDF Generation Failed",
        description: "Could not generate the PDF. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // If loading
  if (isPromoterLoading) {
    return (
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <MobileHeader />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 pt-16 md:pt-6">
            <div className="flex items-center mb-4">
              <Button variant="ghost" onClick={() => setLocation("/talents")} className="mr-2">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <h1 className="text-2xl font-bold">Loading Promoter...</h1>
            </div>
            <div className="animate-pulse space-y-4">
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </main>
        </div>
      </div>
    );
  }
  
  // If error
  if (isPromoterError || !promoter) {
    return (
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <MobileHeader />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 pt-16 md:pt-6">
            <div className="flex items-center mb-4">
              <Button variant="ghost" onClick={() => setLocation("/talents")} className="mr-2">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <h1 className="text-2xl font-bold">Promoter Not Found</h1>
            </div>
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-gray-500">
                  The promoter you are looking for could not be found or you don't have permission to view it.
                </p>
                <div className="flex justify-center mt-4">
                  <Button onClick={() => setLocation("/talents")}>
                    Return to Talents
                  </Button>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    );
  }
  
  // Handle share promoter profile
  const handleShareProfile = async () => {
    if (!promoter) return;
    
    try {
      // Generate the URL to share
      const shareUrl = `${window.location.origin}/promoter/${promoter.id}`;
      
      // Check if Web Share API is available
      if (navigator.share) {
        await navigator.share({
          title: `Promoter Profile: ${promoter.firstName} ${promoter.lastName}`,
          text: `Check out this promoter profile for ${promoter.firstName} ${promoter.lastName}`,
          url: shareUrl,
        });
        
        toast({
          title: "Shared Successfully",
          description: "The promoter profile has been shared."
        });
      } else {
        // Fallback for browsers that don't support Web Share API
        navigator.clipboard.writeText(shareUrl);
        toast({
          title: "Link Copied",
          description: "Profile link copied to clipboard. You can now share it manually."
        });
      }
    } catch (error) {
      console.error("Sharing error:", error);
      
      // Try clipboard fallback if sharing fails
      try {
        const shareUrl = `${window.location.origin}/promoter/${promoter.id}`;
        navigator.clipboard.writeText(shareUrl);
        toast({
          title: "Link Copied",
          description: "Profile link copied to clipboard. You can now share it manually."
        });
      } catch {
        toast({
          title: "Sharing Failed",
          description: "Could not share the profile. Please try again.",
          variant: "destructive"
        });
      }
    }
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (e) {
      return dateString;
    }
  };
  
  // Render document types
  const documentsByType = documents.reduce((acc, doc) => {
    if (!acc[doc.type]) {
      acc[doc.type] = [];
    }
    acc[doc.type].push(doc);
    return acc;
  }, {} as Record<string, PromoterDocument[]>);
  
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <MobileHeader />
        <header className="hidden md:block bg-white border-b border-gray-200 py-4 px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button variant="ghost" onClick={() => setLocation("/talents")} className="mr-2">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <h1 className="text-2xl font-bold text-gray-800">Talent Details</h1>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" onClick={handleGeneratePDF}>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Button onClick={handleShareProfile}>
                <Share2 className="h-4 w-4 mr-2" />
                Share Profile
              </Button>
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pt-16 md:pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Promoter Summary Card */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Talent Profile</CardTitle>
                <CardDescription>Basic information and status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                      {promoter.firstName.charAt(0)}{promoter.lastName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-bold">{promoter.firstName} {promoter.lastName}</h2>
                  <p className="text-sm text-gray-500">{promoter.uniqueId}</p>
                  <div className="mt-2">
                    {promoter.status === "complete" ? (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200">
                        Approved
                      </Badge>
                    ) : promoter.status === "pending" ? (
                      <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200">
                        Pending Review
                      </Badge>
                    ) : (
                      <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-200">
                        {promoter.status}
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="space-y-3 border-t pt-3">
                  <div className="flex items-start">
                    <Phone className="h-4 w-4 mr-2 mt-0.5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Mobile</p>
                      <p className="text-sm text-gray-500">{promoter.mobileNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 mr-2 mt-0.5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Location</p>
                      <p className="text-sm text-gray-500">{getAreaDisplay(promoter.area)}, {getNationalityDisplay(promoter.nationality)}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <FileText className="h-4 w-4 mr-2 mt-0.5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Experience</p>
                      <p className="text-sm text-gray-500">{promoter.yearsExperience || 0} years</p>
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-3">
                  <p className="text-sm font-medium mb-2">Registration Date</p>
                  <p className="text-sm text-gray-500">{formatDate(promoter.createdAt.toString())}</p>
                </div>
              </CardContent>
            </Card>
            
            {/* Details Tabs Card */}
            <Card className="lg:col-span-2">
              <CardContent className="pt-6">
                <Tabs defaultValue="personal">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="personal">Personal Info</TabsTrigger>
                    <TabsTrigger value="professional">Professional</TabsTrigger>
                    <TabsTrigger value="documents">Documents</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="personal" className="pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                        <p>{promoter.firstName} {promoter.lastName}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Date of Birth</h3>
                        <p>{formatDate(promoter.dateOfBirth)}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Gender</h3>
                        <p className="capitalize">{promoter.gender}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Mobile Number</h3>
                        <p>{promoter.mobileNumber}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Nationality</h3>
                        <p>{getNationalityDisplay(promoter.nationality)}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Area</h3>
                        <p>{getAreaDisplay(promoter.area)}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Height</h3>
                        <p>{promoter.height ? `${promoter.height} cm` : 'Not specified'}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">T-Shirt Size</h3>
                        <p>{promoter.tShirtSize || 'Not specified'}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Shirt Size</h3>
                        <p>{promoter.shirtSize || 'Not specified'}</p>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="professional" className="pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Talent Type</h3>
                        <p className="capitalize">{promoter.talentType || 'Not specified'}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Years of Experience</h3>
                        <p>{promoter.yearsExperience || 0} years</p>
                      </div>
                      {promoter.artistPerformerDetails && (
                        <div className="md:col-span-2">
                          <h3 className="text-sm font-medium text-gray-500">Artist/Performer Details</h3>
                          <p className="whitespace-pre-line">{promoter.artistPerformerDetails}</p>
                        </div>
                      )}
                      <div className="md:col-span-2">
                        <h3 className="text-sm font-medium text-gray-500">Previous Experience</h3>
                        <p className="whitespace-pre-line">{promoter.previousExperience || 'None specified'}</p>
                      </div>
                      <div className="md:col-span-2">
                        <h3 className="text-sm font-medium text-gray-500">Brands Worked For</h3>
                        <p className="whitespace-pre-line">{promoter.brandsWorkedFor || 'None specified'}</p>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="documents" className="pt-4">
                    {documents.length === 0 ? (
                      <div className="text-center py-10 text-gray-500">
                        <p>No documents found for this talent.</p>
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Document Type</TableHead>
                            <TableHead>Date Uploaded</TableHead>
                            <TableHead>Expiry Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {documents.map((doc) => (
                            <TableRow key={doc.id}>
                              <TableCell className="capitalize">{doc.type}</TableCell>
                              <TableCell>{formatDate(doc.createdAt.toString())}</TableCell>
                              <TableCell>{doc.expiryDate ? formatDate(doc.expiryDate) : 'N/A'}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-200">
                                  Valid
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-8 w-8 p-0"
                                  onClick={() => {
                                    setSelectedDocument(doc);
                                    setPreviewOpen(true);
                                  }}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-8 w-8 p-0"
                                  onClick={() => {
                                    // Download the actual file using base64 data
                                    if (!doc.fileData || !doc.mimeType) {
                                      toast({
                                        title: "Download Failed",
                                        description: "Document data is not available",
                                        variant: "destructive"
                                      });
                                      return;
                                    }
                                    
                                    try {
                                      // Convert base64 to blob
                                      const byteCharacters = atob(doc.fileData);
                                      const byteArrays = [];
                                      
                                      for (let offset = 0; offset < byteCharacters.length; offset += 512) {
                                        const slice = byteCharacters.slice(offset, offset + 512);
                                        
                                        const byteNumbers = new Array(slice.length);
                                        for (let i = 0; i < slice.length; i++) {
                                          byteNumbers[i] = slice.charCodeAt(i);
                                        }
                                        
                                        const byteArray = new Uint8Array(byteNumbers);
                                        byteArrays.push(byteArray);
                                      }
                                      
                                      const blob = new Blob(byteArrays, { type: doc.mimeType });
                                      const url = URL.createObjectURL(blob);
                                      
                                      // Create download link
                                      const link = document.createElement('a');
                                      link.href = url;
                                      link.download = doc.fileName || `${doc.type}-${doc.id}`;
                                      document.body.appendChild(link);
                                      link.click();
                                      document.body.removeChild(link);
                                      
                                      // Clean up the URL
                                      setTimeout(() => URL.revokeObjectURL(url), 100);
                                      
                                      // Show success notification
                                      toast({
                                        title: "Document Downloaded",
                                        description: `${doc.fileName || doc.type} has been downloaded.`
                                      });
                                    } catch (error) {
                                      console.error("Download error:", error);
                                      toast({
                                        title: "Download Failed",
                                        description: "There was an error downloading the document",
                                        variant: "destructive"
                                      });
                                    }
                                  }}
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
      
      {/* Document Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Document Preview</DialogTitle>
            <DialogDescription>
              {selectedDocument?.type && (
                <span className="capitalize">
                  {selectedDocument.type} document details
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 overflow-y-auto flex-1">
            <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center mb-4 overflow-auto">
              {selectedDocument ? (
                <div className="w-full">
                  {selectedDocument.fileData && selectedDocument.mimeType ? (
                    selectedDocument.mimeType.startsWith('image/') ? (
                      <div className="overflow-auto max-h-[50vh] flex items-center justify-center">
                        <img 
                          src={`data:${selectedDocument.mimeType};base64,${selectedDocument.fileData}`}
                          alt={selectedDocument.type}
                          className="object-contain border border-dashed border-gray-300"
                          onError={(e) => {
                            console.error("Image failed to load:", e);
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                    ) : selectedDocument.mimeType.startsWith('video/') ? (
                      <div className="overflow-auto max-h-[50vh]">
                        <video 
                          controls 
                          className="max-w-full"
                        >
                          <source src={`data:${selectedDocument.mimeType};base64,${selectedDocument.fileData}`} type={selectedDocument.mimeType} />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center p-8">
                        <FileText className="h-16 w-16 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">{selectedDocument.fileName}</p>
                      </div>
                    )
                  ) : (
                    <div className="text-center p-4">
                      <p className="text-red-500 mb-2">Document data is missing</p>
                      <FileText className="h-16 w-16 text-gray-400 mx-auto" />
                    </div>
                  )}
                </div>
              ) : (
                <FileText className="h-16 w-16 text-gray-400" />
              )}
            </div>
            
            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Document Type</h3>
                <p className="capitalize">{selectedDocument?.type}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">File Name</h3>
                <p>{selectedDocument?.fileName || 'N/A'}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Upload Date</h3>
                <p>{selectedDocument?.createdAt ? formatDate(selectedDocument.createdAt.toString()) : 'N/A'}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Expiry Date</h3>
                <p>{selectedDocument?.expiryDate ? formatDate(selectedDocument.expiryDate) : 'N/A'}</p>
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex justify-between sm:justify-between">
            <Button variant="outline" onClick={() => setPreviewOpen(false)}>
              Close
            </Button>
            {selectedDocument && (
              <Button onClick={() => {
                // Download the actual file using base64 data
                if (!selectedDocument.fileData || !selectedDocument.mimeType) {
                  toast({
                    title: "Download Failed",
                    description: "Document data is not available",
                    variant: "destructive"
                  });
                  return;
                }
                
                try {
                  // Convert base64 to blob
                  const byteCharacters = atob(selectedDocument.fileData);
                  const byteArrays = [];
                  
                  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
                    const slice = byteCharacters.slice(offset, offset + 512);
                    
                    const byteNumbers = new Array(slice.length);
                    for (let i = 0; i < slice.length; i++) {
                      byteNumbers[i] = slice.charCodeAt(i);
                    }
                    
                    const byteArray = new Uint8Array(byteNumbers);
                    byteArrays.push(byteArray);
                  }
                  
                  const blob = new Blob(byteArrays, { type: selectedDocument.mimeType });
                  const url = URL.createObjectURL(blob);
                  
                  // Create download link
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = selectedDocument.fileName || `${selectedDocument.type}-${selectedDocument.id}`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  
                  // Clean up the URL
                  setTimeout(() => URL.revokeObjectURL(url), 100);
                  
                  // Show success notification
                  toast({
                    title: "Document Downloaded",
                    description: `${selectedDocument.fileName || selectedDocument.type} has been downloaded.`
                  });
                } catch (error) {
                  console.error("Download error:", error);
                  toast({
                    title: "Download Failed",
                    description: "There was an error downloading the document",
                    variant: "destructive"
                  });
                }
              }}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}