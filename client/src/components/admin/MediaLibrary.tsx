import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Document, Promoter } from "@shared/schema";
import { 
  FolderOpen, 
  Image, 
  FileText, 
  Video, 
  Upload, 
  Search, 
  Grid, 
  List, 
  Download,
  Eye,
  Trash2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

interface MediaLibraryProps {
  promoters: Promoter[];
  isLoading: boolean;
}

type MediaType = "all" | "photo" | "video" | "document";
type SortOrder = "newest" | "oldest" | "name_asc" | "name_desc";
type ViewMode = "grid" | "list";

// Extended document type for UI purposes
interface ExtendedDocument extends Document {
  fileSize?: number;
}

export function MediaLibrary({ promoters, isLoading }: MediaLibraryProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedType, setSelectedType] = useState<MediaType>("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  
  // Fetch all documents
  const { data: documents = [], isLoading: isLoadingDocuments, isError } = useQuery<ExtendedDocument[]>({
    queryKey: ["/api/documents"],
    queryFn: async () => {
      try {
        // In a real implementation, we would fetch from the server
        // For now, let's generate sample data based on promoters
        const mockDocuments: ExtendedDocument[] = [];
        
        promoters.forEach(promoter => {
          // Add mock passport
          mockDocuments.push({
            id: promoter.id * 100 + 1,
            promoterId: promoter.id,
            type: "passport",
            fileName: `passport_${promoter.firstName.toLowerCase()}_${promoter.lastName.toLowerCase()}.jpg`,
            fileData: "/assets/document-placeholder.jpg",
            mimeType: "image/jpeg",
            expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 5)).toISOString(),
            createdAt: new Date(),
            fileSize: Math.floor(Math.random() * 2000000) + 500000, // 0.5MB to 2.5MB
          });
          
          // Add mock visa
          mockDocuments.push({
            id: promoter.id * 100 + 2,
            promoterId: promoter.id,
            type: "visa",
            fileName: `visa_${promoter.firstName.toLowerCase()}_${promoter.lastName.toLowerCase()}.pdf`,
            fileData: "/assets/document-placeholder.jpg",
            mimeType: "application/pdf",
            expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 2)).toISOString(),
            createdAt: new Date(),
            fileSize: Math.floor(Math.random() * 1000000) + 200000, // 0.2MB to 1.2MB
          });
          
          // Add mock photo
          mockDocuments.push({
            id: promoter.id * 100 + 3,
            promoterId: promoter.id,
            type: "photo",
            fileName: `photo_${promoter.firstName.toLowerCase()}_${promoter.lastName.toLowerCase()}.jpg`,
            fileData: "/assets/document-placeholder.jpg",
            mimeType: "image/jpeg",
            expiryDate: null,
            createdAt: new Date(),
            fileSize: Math.floor(Math.random() * 5000000) + 1000000, // 1MB to 6MB
          });
          
          // Add mock video
          mockDocuments.push({
            id: promoter.id * 100 + 4,
            promoterId: promoter.id,
            type: "video",
            fileName: `video_${promoter.firstName.toLowerCase()}_${promoter.lastName.toLowerCase()}.mp4`,
            fileData: "/assets/video-placeholder.mp4",
            mimeType: "video/mp4",
            expiryDate: null,
            createdAt: new Date(),
            fileSize: Math.floor(Math.random() * 50000000) + 10000000, // 10MB to 60MB
          });
        });
        
        return mockDocuments;
      } catch (error) {
        console.error("Error fetching documents:", error);
        return [];
      }
    },
    enabled: promoters.length > 0,
  });
  
  // Filter documents based on search and selected type
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = searchQuery === "" || 
      doc.fileName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = selectedType === "all" || doc.type === selectedType;
    
    const matchesTab = activeTab === "all" || 
      (activeTab === "images" && (doc.type === "photo" || doc.mimeType?.startsWith("image/"))) ||
      (activeTab === "videos" && (doc.type === "video" || doc.mimeType?.startsWith("video/"))) ||
      (activeTab === "documents" && (doc.type === "passport" || doc.type === "visa" || doc.mimeType?.startsWith("application/")));
    
    return matchesSearch && matchesType && matchesTab;
  });
  
  // Sort documents
  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    switch (sortOrder) {
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case "name_asc":
        return a.fileName.localeCompare(b.fileName);
      case "name_desc":
        return b.fileName.localeCompare(a.fileName);
      default:
        return 0;
    }
  });
  
  // Toggle selection of an item
  const toggleSelection = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(item => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };
  
  // Format file size for display
  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return "Unknown";
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + " MB";
    else return (bytes / 1073741824).toFixed(1) + " GB";
  };
  
  // Get the promoter name for a document
  const getPromoterName = (promoterId: number): string => {
    const promoter = promoters.find(p => p.id === promoterId);
    return promoter ? `${promoter.firstName} ${promoter.lastName}` : "Unknown";
  };
  
  // Get icon based on document type
  const getDocumentIcon = (doc: Document) => {
    switch(doc.type) {
      case "photo":
        return <Image className="h-5 w-5 text-blue-500" />;
      case "video":
        return <Video className="h-5 w-5 text-purple-500" />;
      case "passport":
      case "visa":
        return <FileText className="h-5 w-5 text-orange-500" />;
      default:
        if (doc.mimeType?.startsWith("image/")) {
          return <Image className="h-5 w-5 text-blue-500" />;
        } else if (doc.mimeType?.startsWith("video/")) {
          return <Video className="h-5 w-5 text-purple-500" />;
        } else {
          return <FileText className="h-5 w-5 text-gray-500" />;
        }
    }
  };
  
  // Preview document (simplified)
  const previewDocument = (doc: Document) => {
    toast({
      title: "Preview Document",
      description: `Previewing: ${doc.fileName}`,
    });
  };
  
  // Download document (simplified)
  const downloadDocument = (doc: Document) => {
    toast({
      title: "Downloading Document",
      description: `Downloading: ${doc.fileName}`,
    });
  };
  
  // Delete document (simplified)
  const deleteDocument = (doc: Document) => {
    toast({
      title: "Delete Document",
      description: `Document ${doc.fileName} would be deleted in a real implementation.`,
      variant: "destructive",
    });
  };
  
  // Handle bulk actions (simplified)
  const handleBulkDownload = () => {
    if (selectedItems.length === 0) {
      toast({
        title: "No Items Selected",
        description: "Please select at least one item to download.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Bulk Download",
      description: `Downloading ${selectedItems.length} files.`,
    });
  };
  
  const handleBulkDelete = () => {
    if (selectedItems.length === 0) {
      toast({
        title: "No Items Selected",
        description: "Please select at least one item to delete.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Bulk Delete",
      description: `${selectedItems.length} files would be deleted in a real implementation.`,
      variant: "destructive",
    });
  };
  
  // Handle file upload (simplified)
  const handleFileUpload = () => {
    toast({
      title: "Upload Feature",
      description: "File upload would be implemented in a real application.",
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-medium">Media Library</h3>
          <p className="text-sm text-gray-500">Manage and organize your talent media assets</p>
        </div>
        
        <Button onClick={handleFileUpload} className="bg-orange-600 hover:bg-orange-700">
          <Upload className="mr-2 h-4 w-4" />
          Upload Files
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="w-full sm:w-auto flex items-center gap-2">
              <div className="relative flex-1 sm:w-72">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedType} onValueChange={(value) => setSelectedType(value as MediaType)}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="File type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="photo">Photos</SelectItem>
                  <SelectItem value="video">Videos</SelectItem>
                  <SelectItem value="document">Documents</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as SortOrder)}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="name_asc">Name (A-Z)</SelectItem>
                  <SelectItem value="name_desc">Name (Z-A)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className={viewMode === "grid" ? "bg-orange-50 border-orange-200" : ""}
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className={viewMode === "list" ? "bg-orange-50 border-orange-200" : ""}
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6 bg-orange-50 border border-orange-100">
              <TabsTrigger value="all" className="data-[state=active]:bg-white">
                <FolderOpen className="h-4 w-4 mr-2" />
                All Files
              </TabsTrigger>
              <TabsTrigger value="images" className="data-[state=active]:bg-white">
                <Image className="h-4 w-4 mr-2" />
                Images
              </TabsTrigger>
              <TabsTrigger value="videos" className="data-[state=active]:bg-white">
                <Video className="h-4 w-4 mr-2" />
                Videos
              </TabsTrigger>
              <TabsTrigger value="documents" className="data-[state=active]:bg-white">
                <FileText className="h-4 w-4 mr-2" />
                Documents
              </TabsTrigger>
            </TabsList>
            
            <div className="mb-4 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                {isLoading || isLoadingDocuments ? (
                  "Loading files..."
                ) : (
                  <>Showing {sortedDocuments.length} of {documents.length} files</>
                )}
              </div>
              
              {selectedItems.length > 0 && (
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-orange-50 border-orange-200 text-orange-800">
                    {selectedItems.length} selected
                  </Badge>
                  <Button variant="outline" size="sm" onClick={handleBulkDownload}>
                    <Download className="h-3.5 w-3.5 mr-1" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm" className="border-red-200 text-red-700 hover:bg-red-50" onClick={handleBulkDelete}>
                    <Trash2 className="h-3.5 w-3.5 mr-1" />
                    Delete
                  </Button>
                </div>
              )}
            </div>
          
            <TabsContent value="all" className="m-0">
              {isLoading || isLoadingDocuments ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <Card key={index} className="border border-gray-100">
                      <CardContent className="p-4 h-40 flex items-center justify-center bg-gray-50 animate-pulse">
                        <div className="w-16 h-16 rounded-full bg-gray-200"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : sortedDocuments.length > 0 ? (
                viewMode === "grid" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {sortedDocuments.map((doc) => (
                      <Card key={doc.id} className="border border-gray-100 group hover:border-orange-200 transition-all">
                        <div className="relative">
                          <CardContent className="p-0">
                            <div className="aspect-video bg-gray-50 flex items-center justify-center p-4 border-b">
                              {doc.type === "photo" || doc.mimeType?.startsWith("image/") ? (
                                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                  <Image className="h-12 w-12 text-gray-400" />
                                </div>
                              ) : doc.type === "video" || doc.mimeType?.startsWith("video/") ? (
                                <div className="w-full h-full bg-purple-50 flex items-center justify-center">
                                  <Video className="h-12 w-12 text-purple-400" />
                                </div>
                              ) : (
                                <div className="w-full h-full bg-orange-50 flex items-center justify-center">
                                  <FileText className="h-12 w-12 text-orange-400" />
                                </div>
                              )}
                            </div>
                            <div className="p-3">
                              <div className="flex items-start justify-between mb-1">
                                <div className="flex items-start gap-2">
                                  <Checkbox 
                                    id={`select-${doc.id}`} 
                                    checked={selectedItems.includes(doc.id.toString())}
                                    onCheckedChange={() => toggleSelection(doc.id.toString())}
                                    className="mt-1"
                                  />
                                  <div className="truncate">
                                    <p className="text-sm font-medium truncate" title={doc.fileName}>
                                      {doc.fileName}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {formatFileSize(doc.fileSize)}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex">
                                  {getDocumentIcon(doc)}
                                </div>
                              </div>
                              <p className="text-xs text-gray-500 truncate">
                                {getPromoterName(doc.promoterId)}
                              </p>
                            </div>
                          </CardContent>
                          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-all">
                            <Button size="sm" variant="outline" onClick={() => previewDocument(doc)}>
                              <Eye className="h-3.5 w-3.5" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => downloadDocument(doc)}>
                              <Download className="h-3.5 w-3.5" />
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700" onClick={() => deleteDocument(doc)}>
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="border rounded-md overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <Checkbox 
                              id="select-all" 
                              checked={selectedItems.length > 0 && selectedItems.length === sortedDocuments.length}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedItems(sortedDocuments.map(doc => doc.id.toString()));
                                } else {
                                  setSelectedItems([]);
                                }
                              }}
                            />
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Talent
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Type
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Size
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Upload Date
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {sortedDocuments.map((doc) => (
                          <tr key={doc.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Checkbox 
                                id={`select-${doc.id}`} 
                                checked={selectedItems.includes(doc.id.toString())}
                                onCheckedChange={() => toggleSelection(doc.id.toString())}
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-md bg-gray-50">
                                  {getDocumentIcon(doc)}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                                    {doc.fileName}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{getPromoterName(doc.promoterId)}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                {doc.type}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatFileSize(doc.fileSize)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(doc.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => previewDocument(doc)}>
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => downloadDocument(doc)}>
                                  <Download className="h-4 w-4" />
                                </Button>
                                <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600 hover:text-red-700" onClick={() => deleteDocument(doc)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              ) : (
                <Alert>
                  <AlertDescription>
                    No files found. Try adjusting your search criteria or upload new files.
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>
            
            {/* Other tabs use the same content with different filters */}
            <TabsContent value="images" className="m-0" />
            <TabsContent value="videos" className="m-0" />
            <TabsContent value="documents" className="m-0" />
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}