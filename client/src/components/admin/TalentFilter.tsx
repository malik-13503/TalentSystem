import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Filter, X, Check, ChevronDown } from "lucide-react";

interface TalentFilterProps {
  onChange: (key: string, value: string) => void;
}

export function TalentFilter({ onChange }: TalentFilterProps) {
  const [nationality, setNationality] = useState("all");
  const [area, setArea] = useState("all");
  const [experience, setExperience] = useState("all");
  const [status, setStatus] = useState("all");
  const [gender, setGender] = useState("all");
  const [height, setHeight] = useState("all");
  const [ageRange, setAgeRange] = useState("all");
  
  // Track active filters count
  const [activeFilters, setActiveFilters] = useState(0);
  const [showFilterPopover, setShowFilterPopover] = useState(false);

  // Predefined filter options
  const nationalityOptions = [
    { value: "all", label: "All Nationalities" },
    { value: "ae", label: "UAE" },
    { value: "us", label: "USA" },
    { value: "uk", label: "UK" },
    { value: "in", label: "India" },
    { value: "ph", label: "Philippines" },
    { value: "pk", label: "Pakistan" },
    { value: "sa", label: "Saudi Arabia" },
    { value: "eg", label: "Egypt" },
    { value: "lb", label: "Lebanon" },
    { value: "other", label: "Other" },
  ];

  const areaOptions = [
    { value: "all", label: "All Areas" },
    { value: "dubai", label: "Dubai" },
    { value: "abu-dhabi", label: "Abu Dhabi" },
    { value: "al-ain", label: "Al Ain" },
    { value: "sharjah", label: "Sharjah" },
    { value: "ajman", label: "Ajman" },
    { value: "fujairah", label: "Fujairah" },
    { value: "ras-al-khaimah", label: "Ras Al Khaimah" },
    { value: "umm-al-quwain", label: "Umm Al Quwain" },
    { value: "other", label: "Other" },
  ];

  const experienceOptions = [
    { value: "all", label: "All Experience" },
    { value: "1", label: "1+ Year" },
    { value: "3", label: "3+ Years" },
    { value: "5", label: "5+ Years" },
    { value: "10", label: "10+ Years" },
  ];
  
  const statusOptions = [
    { value: "all", label: "All Statuses" },
    { value: "complete", label: "Complete" },
    { value: "pending", label: "Pending" },
    { value: "rejected", label: "Rejected" },
  ];
  
  const genderOptions = [
    { value: "all", label: "All Genders" },
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
  ];
  
  const heightOptions = [
    { value: "all", label: "All Heights" },
    { value: "140-150", label: "140-150 cm" },
    { value: "151-160", label: "151-160 cm" },
    { value: "161-170", label: "161-170 cm" },
    { value: "171-180", label: "171-180 cm" },
    { value: "181-190", label: "181-190 cm" },
    { value: "191+", label: "191+ cm" },
  ];
  
  const ageRangeOptions = [
    { value: "all", label: "All Ages" },
    { value: "18-25", label: "18-25 years" },
    { value: "26-30", label: "26-30 years" },
    { value: "31-35", label: "31-35 years" },
    { value: "36-40", label: "36-40 years" },
    { value: "41+", label: "41+ years" },
  ];

  // Calculate number of active filters 
  useEffect(() => {
    let count = 0;
    if (nationality !== "all") count++;
    if (area !== "all") count++;
    if (experience !== "all") count++;
    if (status !== "all") count++;
    if (gender !== "all") count++;
    if (height !== "all") count++;
    if (ageRange !== "all") count++;
    setActiveFilters(count);
  }, [nationality, area, experience, status, gender, height, ageRange]);

  // Trigger the onChange event when filters change
  useEffect(() => {
    onChange("nationality", nationality);
  }, [nationality, onChange]);

  useEffect(() => {
    onChange("area", area);
  }, [area, onChange]);

  useEffect(() => {
    onChange("experience", experience);
  }, [experience, onChange]);
  
  useEffect(() => {
    onChange("status", status);
  }, [status, onChange]);
  
  useEffect(() => {
    onChange("gender", gender);
  }, [gender, onChange]);
  
  useEffect(() => {
    onChange("height", height);
  }, [height, onChange]);
  
  useEffect(() => {
    onChange("ageRange", ageRange);
  }, [ageRange, onChange]);

  const clearAllFilters = () => {
    setNationality("all");
    setArea("all");
    setExperience("all");
    setStatus("all");
    setGender("all");
    setHeight("all");
    setAgeRange("all");
  };
  
  const getSelectedLabel = (options: {value: string, label: string}[], value: string) => {
    const option = options.find(opt => opt.value === value);
    return option ? option.label : "All";
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-wrap gap-3 items-start">
        {/* Main filters in the first row */}
        <div className="flex flex-wrap w-full gap-2 sm:gap-3">
          <div className="flex-1 min-w-[140px] w-full sm:w-auto sm:max-w-[180px]">
            <label className="text-xs text-purple-700 font-medium mb-1.5 block ml-1">Nationality</label>
            <Select
              value={nationality}
              onValueChange={(value) => setNationality(value)}
            >
              <SelectTrigger className="w-full border-purple-200 bg-white focus:ring-purple-500 focus:border-purple-500 shadow-sm">
                <SelectValue placeholder="All Nationalities" />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {nationalityOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 min-w-[140px] w-full sm:w-auto sm:max-w-[180px]">
            <label className="text-xs text-purple-700 font-medium mb-1.5 block ml-1">Area</label>
            <Select
              value={area}
              onValueChange={(value) => setArea(value)}
            >
              <SelectTrigger className="w-full border-purple-200 bg-white focus:ring-purple-500 focus:border-purple-500 shadow-sm">
                <SelectValue placeholder="All Areas" />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {areaOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 min-w-[140px] w-full sm:w-auto sm:max-w-[180px]">
            <label className="text-xs text-purple-700 font-medium mb-1.5 block ml-1">Experience</label>
            <Select
              value={experience}
              onValueChange={(value) => setExperience(value)}
            >
              <SelectTrigger className="w-full border-purple-200 bg-white focus:ring-purple-500 focus:border-purple-500 shadow-sm">
                <SelectValue placeholder="All Experience" />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {experienceOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Advanced filters popover */}
          <div className="flex-1 min-w-[140px] w-full sm:w-auto sm:max-w-[180px]">
            <label className="text-xs text-purple-700 font-medium mb-1.5 block ml-1">More Filters</label>
            <Popover open={showFilterPopover} onOpenChange={setShowFilterPopover} modal={true}>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline"
                  className="w-full justify-between border-purple-200 bg-white hover:bg-purple-50"
                >
                  <div className="flex items-center">
                    <Filter className="mr-2 h-4 w-4 text-purple-600" />
                    <span>Advanced Filters</span>
                    {activeFilters > 0 && (
                      <Badge variant="secondary" className="ml-2 bg-purple-100 text-purple-800">
                        {activeFilters}
                      </Badge>
                    )}
                  </div>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent 
                className="w-[280px] p-3 z-50 filter-popover" 
                align="end"
                side="bottom"
                alignOffset={-10}
                sideOffset={5}
                forceMount
                sticky="always">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">Advanced Filters</h4>
                    {activeFilters > 0 && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={clearAllFilters} 
                        className="h-7 px-2 text-xs"
                      >
                        <X className="h-3 w-3 mr-1" />
                        Clear all
                      </Button>
                    )}
                  </div>
                  
                  <div className="space-y-2.5">
                    {/* Status filter */}
                    <div className="space-y-1">
                      <Label className="text-xs font-medium">Status</Label>
                      <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger className="w-full h-9">
                          <SelectValue placeholder="All Statuses" />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Gender filter */}
                    <div className="space-y-1">
                      <Label className="text-xs font-medium">Gender</Label>
                      <Select value={gender} onValueChange={setGender}>
                        <SelectTrigger className="w-full h-9">
                          <SelectValue placeholder="All Genders" />
                        </SelectTrigger>
                        <SelectContent>
                          {genderOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Height filter */}
                    <div className="space-y-1">
                      <Label className="text-xs font-medium">Height Range</Label>
                      <Select value={height} onValueChange={setHeight}>
                        <SelectTrigger className="w-full h-9">
                          <SelectValue placeholder="All Heights" />
                        </SelectTrigger>
                        <SelectContent>
                          {heightOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Age filter */}
                    <div className="space-y-1">
                      <Label className="text-xs font-medium">Age Range</Label>
                      <Select value={ageRange} onValueChange={setAgeRange}>
                        <SelectTrigger className="w-full h-9">
                          <SelectValue placeholder="All Ages" />
                        </SelectTrigger>
                        <SelectContent>
                          {ageRangeOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="pt-1.5 border-t">
                    <Button 
                      className="w-full bg-purple-600 hover:bg-purple-700 h-9 text-sm"
                      onClick={() => setShowFilterPopover(false)}
                    >
                      <Check className="mr-1.5 h-3.5 w-3.5" /> Apply Filters
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        {/* Active filter chips */}
        {activeFilters > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {nationality !== "all" && (
              <Badge 
                variant="outline" 
                className="bg-purple-50 border-purple-200 text-purple-800 hover:bg-purple-100 rounded-full px-3"
              >
                {getSelectedLabel(nationalityOptions, nationality)}
                <button 
                  className="ml-2 hover:text-purple-900"
                  onClick={() => setNationality("all")}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            
            {area !== "all" && (
              <Badge 
                variant="outline" 
                className="bg-purple-50 border-purple-200 text-purple-800 hover:bg-purple-100 rounded-full px-3"
              >
                {getSelectedLabel(areaOptions, area)}
                <button 
                  className="ml-2 hover:text-purple-900"
                  onClick={() => setArea("all")}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            
            {experience !== "all" && (
              <Badge 
                variant="outline" 
                className="bg-purple-50 border-purple-200 text-purple-800 hover:bg-purple-100 rounded-full px-3"
              >
                {getSelectedLabel(experienceOptions, experience)}
                <button 
                  className="ml-2 hover:text-purple-900"
                  onClick={() => setExperience("all")}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            
            {status !== "all" && (
              <Badge 
                variant="outline" 
                className="bg-purple-50 border-purple-200 text-purple-800 hover:bg-purple-100 rounded-full px-3"
              >
                {getSelectedLabel(statusOptions, status)}
                <button 
                  className="ml-2 hover:text-purple-900"
                  onClick={() => setStatus("all")}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            
            {gender !== "all" && (
              <Badge 
                variant="outline" 
                className="bg-purple-50 border-purple-200 text-purple-800 hover:bg-purple-100 rounded-full px-3"
              >
                {getSelectedLabel(genderOptions, gender)}
                <button 
                  className="ml-2 hover:text-purple-900"
                  onClick={() => setGender("all")}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            
            {height !== "all" && (
              <Badge 
                variant="outline" 
                className="bg-purple-50 border-purple-200 text-purple-800 hover:bg-purple-100 rounded-full px-3"
              >
                {getSelectedLabel(heightOptions, height)}
                <button 
                  className="ml-2 hover:text-purple-900"
                  onClick={() => setHeight("all")}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            
            {ageRange !== "all" && (
              <Badge 
                variant="outline" 
                className="bg-purple-50 border-purple-200 text-purple-800 hover:bg-purple-100 rounded-full px-3"
              >
                {getSelectedLabel(ageRangeOptions, ageRange)}
                <button 
                  className="ml-2 hover:text-purple-900"
                  onClick={() => setAgeRange("all")}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            
            {activeFilters > 1 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearAllFilters} 
                className="h-7 px-2 py-0 text-xs text-purple-700"
              >
                Clear all
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
