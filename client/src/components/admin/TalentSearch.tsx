import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Search, ChevronDown, Clock, X } from "lucide-react";

interface TalentSearchProps {
  onSearch: (query: string) => void;
}

export function TalentSearch({ onSearch }: TalentSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const savedSearches = localStorage.getItem("recentSearches");
      if (savedSearches) {
        setRecentSearches(JSON.parse(savedSearches));
      }
    } catch (error) {
      console.error("Failed to load recent searches:", error);
    }
  }, []);
  
  // Save recent searches to localStorage
  const saveRecentSearch = (query: string) => {
    if (!query.trim()) return;
    
    const updatedSearches = [
      query,
      ...recentSearches.filter(s => s !== query)
    ].slice(0, 5); // Keep only 5 most recent searches
    
    setRecentSearches(updatedSearches);
    
    try {
      localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
    } catch (error) {
      console.error("Failed to save recent searches:", error);
    }
  };
  
  const clearRecentSearches = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem("recentSearches");
    } catch (error) {
      console.error("Failed to clear recent searches:", error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    onSearch(searchQuery);
    saveRecentSearch(searchQuery);
    setDropdownOpen(false);
  };
  
  const handleSearchSelect = (selected: string) => {
    setSearchQuery(selected);
    onSearch(selected);
    saveRecentSearch(selected);
    setDropdownOpen(false);
  };
  
  const handleInputFocus = () => {
    setIsSearchFocused(true);
  };
  
  const handleInputBlur = () => {
    // Delay to allow dropdown clicks to register
    setTimeout(() => {
      setIsSearchFocused(false);
    }, 100);
  };
  
  const handleClearSearch = () => {
    setSearchQuery("");
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit} className="flex items-center space-x-2 relative">
        <div className="relative flex-1 group">
          <div className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-purple-400">
            <Search className="h-4 w-4" />
          </div>
          <Input
            ref={searchInputRef}
            type="text"
            placeholder="Search by name, ID, nationality..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            className="pl-9 py-2 border-purple-200 focus:ring-purple-500 focus:border-purple-500 shadow-sm transition-all pr-8"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        
        <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button 
              type="button"
              variant="outline"
              className="border-purple-200 bg-white text-purple-700"
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[240px]">
            <div className="px-2 py-1.5 text-sm font-medium text-gray-700">Search Options</div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setSearchQuery("")}>
              Clear search
            </DropdownMenuItem>
            
            {recentSearches.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <div className="px-2 py-1.5 text-xs text-gray-500 flex items-center justify-between">
                  <span>Recent Searches</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 px-2 text-xs"
                    onClick={clearRecentSearches}
                  >
                    Clear
                  </Button>
                </div>
                {recentSearches.map((search, index) => (
                  <DropdownMenuItem 
                    key={index} 
                    className="flex items-center gap-2"
                    onClick={() => handleSearchSelect(search)}
                  >
                    <Clock className="h-3.5 w-3.5 text-gray-400" />
                    <span className="truncate">{search}</span>
                  </DropdownMenuItem>
                ))}
              </>
            )}
            
            <DropdownMenuSeparator />
            <div className="px-2 py-1.5 text-xs text-gray-500">Search Tips</div>
            <div className="px-2 py-1.5 text-xs text-gray-600">
              Search by name, ID, nationality, or area. Use quotation marks for exact matches.
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button 
          type="submit" 
          className="bg-purple-700 hover:bg-purple-800 text-white shadow-md"
        >
          Search
        </Button>
      </form>
      
      {/* Recent searches popover */}
      {isSearchFocused && recentSearches.length > 0 && (
        <div className="absolute z-50 bg-white shadow-lg rounded-md border border-gray-200 w-full max-w-md mt-1 overflow-hidden">
          <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-500">Recent Searches</span>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 px-2 text-xs"
              onClick={clearRecentSearches}
            >
              Clear All
            </Button>
          </div>
          <div className="max-h-60 overflow-y-auto">
            {recentSearches.map((search, index) => (
              <button
                key={index}
                className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                onClick={() => handleSearchSelect(search)}
                type="button"
              >
                <Clock className="h-3.5 w-3.5 text-gray-400" />
                <span className="truncate">{search}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
