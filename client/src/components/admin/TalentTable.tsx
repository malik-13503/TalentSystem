import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { 
  Eye, 
  File, 
  MoreVertical, 
  Download, 
  Trash, 
  ArrowUpDown, 
  ChevronUp, 
  ChevronDown,
  Filter,
  SlidersHorizontal
} from "lucide-react";
import { Promoter } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

interface TalentTableProps {
  promoters: Promoter[];
  isLoading: boolean;
  isError: boolean;
}

export function TalentTable({ promoters, isLoading, isError }: TalentTableProps) {
  const [_, setLocation] = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [talentToDelete, setTalentToDelete] = useState<Promoter | null>(null);
  const [sortField, setSortField] = useState<string>("lastName");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const { toast } = useToast();
  const itemsPerPage = 10;
  
  // Handle sorting
  const handleSort = (field: string) => {
    // If the same field is clicked, toggle direction
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // New field selected, default to ascending
      setSortField(field);
      setSortDirection("asc");
    }
    
    // Reset to first page when sorting changes
    setCurrentPage(1);
  };

  // Sort the promoters based on current sort settings
  const sortedPromoters = useMemo(() => {
    if (!promoters.length) return [];
    
    // Make a copy to avoid mutating the original array
    return [...promoters].sort((a, b) => {
      // Default values
      let aValue: string | number = '';
      let bValue: string | number = '';
      
      switch (sortField) {
        case "firstName":
          aValue = a.firstName?.toLowerCase() || '';
          bValue = b.firstName?.toLowerCase() || '';
          break;
        case "lastName":
          aValue = a.lastName?.toLowerCase() || '';
          bValue = b.lastName?.toLowerCase() || '';
          break;
        case "talentType":
          aValue = a.talentType?.toLowerCase() || 'promoter/hostess';
          bValue = b.talentType?.toLowerCase() || 'promoter/hostess';
          break;
        case "nationality":
          aValue = a.nationality?.toLowerCase() || '';
          bValue = b.nationality?.toLowerCase() || '';
          break;
        case "area":
          aValue = a.area?.toLowerCase() || '';
          bValue = b.area?.toLowerCase() || '';
          break;
        case "experience":
          aValue = a.yearsExperience || 0;
          bValue = b.yearsExperience || 0;
          break;
        case "status":
          aValue = a.status?.toLowerCase() || '';
          bValue = b.status?.toLowerCase() || '';
          break;
        case "id":
          aValue = a.uniqueId || '';
          bValue = b.uniqueId || '';
          break;
        default:
          aValue = a.lastName?.toLowerCase() || '';
          bValue = b.lastName?.toLowerCase() || '';
      }
      
      if (sortDirection === "asc") {
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return aValue.localeCompare(bValue);
        }
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return bValue.localeCompare(aValue);
        }
        return bValue > aValue ? 1 : bValue < aValue ? -1 : 0;
      }
    });
  }, [promoters, sortField, sortDirection]);
  
  // Handle pagination
  const totalPages = Math.ceil(sortedPromoters.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPromoters = sortedPromoters.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const handleViewPromoter = (id: number) => {
    setLocation(`/talent/${id}`);
  };

  const handleGeneratePresentation = (id: number) => {
    setLocation(`/presentation/${id}`);
  };
  
  // Delete promoter handlers
  const handleDeleteClick = (promoter: Promoter) => {
    setTalentToDelete(promoter);
    setDeleteDialogOpen(true);
  };
  
  const handleDeleteConfirm = async () => {
    if (!talentToDelete) return;
    
    try {
      const response = await fetch(`/api/talents/${talentToDelete.id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        // Success - invalidate the talents query to refresh the data
        queryClient.invalidateQueries({ queryKey: ['/api/talents'] });
        
        toast({
          title: "Talent deleted",
          description: `${talentToDelete.firstName} ${talentToDelete.lastName} has been removed from the system.`,
        });
        
        // If we're on the last page and there's only one item, go to previous page
        if (currentPage > 1 && currentPromoters.length === 1) {
          setCurrentPage(currentPage - 1);
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete talent');
      }
    } catch (error: any) {
      toast({
        title: "Error deleting talent",
        description: error.message || "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setTalentToDelete(null);
    }
  };
  
  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setTalentToDelete(null);
  };

  // Render document status badge
  const renderStatus = (status: string) => {
    switch (status) {
      case "complete":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-200">
            Complete
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
            Pending
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-200">
            {status}
          </Badge>
        );
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Talent</TableHead>
                <TableHead>Talent Type</TableHead>
                <TableHead>Nationality</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Area</TableHead>
                <TableHead>Documents</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array(5).fill(0).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="flex items-center">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="ml-4">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-16 mt-1" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-9 w-24 ml-auto" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="py-8 text-center">
        <div className="text-red-500 mb-2">Error loading talent data</div>
        <Button onClick={() => window.location.reload()} variant="outline" size="sm">
          Retry
        </Button>
      </div>
    );
  }

  // Empty state
  if (promoters.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="text-gray-500 mb-4">No talent found</div>
        <p className="text-gray-400 text-sm mb-4">Start by adding new talent to the system</p>
        <Button onClick={() => setLocation("/register")}>
          Add New Talent
        </Button>
      </div>
    );
  }

  // Sort toolbar dropdown handlers
  const handleSortOptionSelect = (field: string) => {
    handleSort(field);
  };
  
  // Render sort dropdown
  const renderSortDropdown = () => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            className="ml-2 text-sm gap-1 border-purple-200 text-purple-700"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Sort By
            <ChevronDown className="h-3.5 w-3.5 ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[180px]">
          <DropdownMenuLabel>Sort Options</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={sortField} onValueChange={handleSortOptionSelect}>
            <DropdownMenuRadioItem value="lastName">Name</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="talentType">Talent Type</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="nationality">Nationality</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="experience">Experience</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="area">Area</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="status">Document Status</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="id">ID</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
          
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}>
              {sortDirection === "asc" ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-2" />
                  Ascending
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-2" />
                  Descending
                </>
              )}
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <div>
      {/* Sort toolbar */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex-1">
          <div className="text-sm text-gray-500">
            {promoters.length} total talent{promoters.length !== 1 ? 's' : ''}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="text-sm text-gray-600">
            Sorted by <span className="font-medium capitalize">{sortField}</span> ({sortDirection === "asc" ? "A-Z" : "Z-A"})
          </div>
          {renderSortDropdown()}
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort("lastName")}>
                  <span>Talent</span>
                  {sortField === "lastName" ? (
                    sortDirection === "asc" ? (
                      <ChevronUp className="h-4 w-4 text-purple-600" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-purple-600" />
                    )
                  ) : (
                    <ArrowUpDown className="h-4 w-4 opacity-30" />
                  )}
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort("talentType")}>
                  <span>Talent Type</span>
                  {sortField === "talentType" ? (
                    sortDirection === "asc" ? (
                      <ChevronUp className="h-4 w-4 text-purple-600" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-purple-600" />
                    )
                  ) : (
                    <ArrowUpDown className="h-4 w-4 opacity-30" />
                  )}
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort("nationality")}>
                  <span>Nationality</span>
                  {sortField === "nationality" ? (
                    sortDirection === "asc" ? (
                      <ChevronUp className="h-4 w-4 text-purple-600" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-purple-600" />
                    )
                  ) : (
                    <ArrowUpDown className="h-4 w-4 opacity-30" />
                  )}
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort("experience")}>
                  <span>Experience</span>
                  {sortField === "experience" ? (
                    sortDirection === "asc" ? (
                      <ChevronUp className="h-4 w-4 text-purple-600" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-purple-600" />
                    )
                  ) : (
                    <ArrowUpDown className="h-4 w-4 opacity-30" />
                  )}
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort("area")}>
                  <span>Area</span>
                  {sortField === "area" ? (
                    sortDirection === "asc" ? (
                      <ChevronUp className="h-4 w-4 text-purple-600" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-purple-600" />
                    )
                  ) : (
                    <ArrowUpDown className="h-4 w-4 opacity-30" />
                  )}
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort("status")}>
                  <span>Documents</span>
                  {sortField === "status" ? (
                    sortDirection === "asc" ? (
                      <ChevronUp className="h-4 w-4 text-purple-600" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-purple-600" />
                    )
                  ) : (
                    <ArrowUpDown className="h-4 w-4 opacity-30" />
                  )}
                </div>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentPromoters.map((promoter) => (
              <TableRow key={promoter.id}>
                <TableCell>
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                      <span className="text-gray-500 font-medium">
                        {promoter.firstName.charAt(0) + promoter.lastName.charAt(0)}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {promoter.firstName} {promoter.lastName}
                      </div>
                      <div className="text-sm text-gray-500">{promoter.uniqueId}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-gray-900 capitalize">
                    {promoter.talentType || 'Promoter/Hostess'}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-gray-900 capitalize">
                    {promoter.nationality}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-gray-900">
                    {promoter.yearsExperience} years
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-gray-900 capitalize">
                    {promoter.area}
                  </div>
                </TableCell>
                <TableCell>
                  {renderStatus(promoter.status)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Button 
                      variant="ghost" 
                      className="h-8 px-2 text-primary-600 hover:text-primary-900"
                      onClick={() => handleViewPromoter(promoter.id)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="h-8 px-2 text-primary-600 hover:text-primary-900"
                      onClick={() => handleGeneratePresentation(promoter.id)}
                    >
                      <File className="h-4 w-4 mr-1" />
                      Present
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0" aria-label="Open menu">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleViewPromoter(promoter.id)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleGeneratePresentation(promoter.id)}>
                          <File className="h-4 w-4 mr-2" />
                          Generate Presentation
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="h-4 w-4 mr-2" />
                          Download Documents
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => handleDeleteClick(promoter)}
                        >
                          <Trash className="h-4 w-4 mr-2" />
                          Delete Talent
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {promoters.length > itemsPerPage && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
            <span className="font-medium">
              {Math.min(endIndex, promoters.length)}
            </span>{" "}
            of <span className="font-medium">{promoters.length}</span> talents
          </div>
          <div className="flex items-center space-x-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              {talentToDelete && (
                <>
                  Are you sure you want to delete {talentToDelete.firstName} {talentToDelete.lastName}?
                  <br /><br />
                  This action cannot be undone and all associated data including documents will also be deleted.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDeleteCancel}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
