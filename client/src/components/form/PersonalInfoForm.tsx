import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { personalInfoSchema, type PersonalInfo } from "@shared/schema";

interface PersonalInfoFormProps {
  onSubmit: (data: PersonalInfo) => void;
  defaultValues?: PersonalInfo;
}

export function PersonalInfoForm({
  onSubmit,
  defaultValues = {
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
    gender: "",
    mobileNumber: "",
    nationality: "",
    area: "",
    height: 170,
    tShirtSize: "",
    shirtSize: "",
  },
}: PersonalInfoFormProps) {
  const form = useForm<PersonalInfo>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues,
  });

  const handleSaveDraft = () => {
    // Save the current form values as draft
    const currentValues = form.getValues();
    localStorage.setItem("personalInfoDraft", JSON.stringify(currentValues));
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all hover:shadow-lg">
      <div className="bg-gradient-to-r from-gray-50 to-white p-4 sm:p-6 border-b border-gray-100 relative">
        {/* Title decoration */}
        <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-primary/60 to-primary-600/60"></div>
        
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center">
          <span className="inline-block mr-2 text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </span>
          Personal Information
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-1 ml-6 sm:ml-7">
          Please provide your personal details to get started.
        </p>
      </div>

      <div className="p-4 sm:p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="space-y-1 sm:space-y-2 transition-all duration-200 hover:translate-y-[-2px]">
                    <FormLabel className="text-xs sm:text-sm font-medium text-gray-700">
                      First Name
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                          </svg>
                        </div>
                        <Input
                          className="pl-10 bg-gray-50/50 border-gray-200 focus:bg-white transition-all text-sm h-9 sm:h-10"
                          placeholder="John"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="space-y-1 sm:space-y-2 transition-all duration-200 hover:translate-y-[-2px]">
                    <FormLabel className="text-xs sm:text-sm font-medium text-gray-700">
                      Last Name
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                          </svg>
                        </div>
                        <Input
                          className="pl-10 bg-gray-50/50 border-gray-200 focus:bg-white transition-all text-sm h-9 sm:h-10"
                          placeholder="Doe"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-1 sm:space-y-2 transition-all duration-200 hover:translate-y-[-2px]">
                  <FormLabel className="text-xs sm:text-sm font-medium text-gray-700">
                    Email Address
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 2H2v20h20V2zM2 6l10 7 10-7"></path>
                        </svg>
                      </div>
                      <Input
                        className="pl-10 bg-gray-50/50 border-gray-200 focus:bg-white transition-all text-sm h-9 sm:h-10"
                        type="email"
                        placeholder="your.email@example.com"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* Date of Birth and Gender */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem className="space-y-1 sm:space-y-2 transition-all duration-200 hover:translate-y-[-2px]">
                    <FormLabel className="text-xs sm:text-sm font-medium text-gray-700">
                      Date of Birth
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                          </svg>
                        </div>
                        <Input 
                          type="date" 
                          className="pl-10 bg-gray-50/50 border-gray-200 focus:bg-white transition-all text-sm h-9 sm:h-10" 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem className="space-y-1 sm:space-y-2 transition-all duration-200 hover:translate-y-[-2px]">
                    <FormLabel className="text-xs sm:text-sm font-medium text-gray-700">
                      Gender
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400 z-10">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="10"></circle>
                              <path d="M16 16v-3a2 2 0 0 0-4 0"></path>
                              <path d="M8 16v-3a2 2 0 0 1 2-2h4"></path>
                            </svg>
                          </div>
                          <SelectTrigger className="pl-10 bg-gray-50/50 border-gray-200 focus:bg-white transition-all h-9 sm:h-10 text-sm">
                            <SelectValue placeholder="Select your gender" />
                          </SelectTrigger>
                        </div>
                      </FormControl>
                      <SelectContent className="bg-white border border-gray-100 shadow-lg animate-in fade-in-80">
                        <SelectItem value="male" className="hover:bg-gray-50 cursor-pointer text-sm">Male</SelectItem>
                        <SelectItem value="female" className="hover:bg-gray-50 cursor-pointer text-sm">Female</SelectItem>
                        <SelectItem value="other" className="hover:bg-gray-50 cursor-pointer text-sm">Other</SelectItem>
                        <SelectItem value="prefer-not-to-say" className="hover:bg-gray-50 cursor-pointer text-sm">
                          Prefer not to say
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            {/* Mobile and Nationality */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <FormField
                control={form.control}
                name="mobileNumber"
                render={({ field }) => (
                  <FormItem className="space-y-1 sm:space-y-2 transition-all duration-200 hover:translate-y-[-2px]">
                    <FormLabel className="text-xs sm:text-sm font-medium text-gray-700">
                      Mobile Number
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                          </svg>
                        </div>
                        <Input
                          className="pl-10 bg-gray-50/50 border-gray-200 focus:bg-white transition-all text-sm h-9 sm:h-10"
                          placeholder="+971 XX XXX XXXX"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="nationality"
                render={({ field }) => (
                  <FormItem className="space-y-1 sm:space-y-2 transition-all duration-200 hover:translate-y-[-2px]">
                    <FormLabel className="text-xs sm:text-sm font-medium text-gray-700">
                      Nationality
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400 z-10">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="10"></circle>
                              <line x1="2" y1="12" x2="22" y2="12"></line>
                              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                            </svg>
                          </div>
                          <SelectTrigger className="pl-10 bg-gray-50/50 border-gray-200 focus:bg-white transition-all h-9 sm:h-10 text-sm">
                            <SelectValue placeholder="Select your nationality" />
                          </SelectTrigger>
                        </div>
                      </FormControl>
                      <SelectContent className="bg-white border border-gray-100 shadow-lg animate-in fade-in-80">
                        <SelectItem value="ae" className="hover:bg-gray-50 cursor-pointer text-sm">United Arab Emirates</SelectItem>
                        <SelectItem value="us" className="hover:bg-gray-50 cursor-pointer text-sm">United States</SelectItem>
                        <SelectItem value="uk" className="hover:bg-gray-50 cursor-pointer text-sm">United Kingdom</SelectItem>
                        <SelectItem value="in" className="hover:bg-gray-50 cursor-pointer text-sm">India</SelectItem>
                        <SelectItem value="ph" className="hover:bg-gray-50 cursor-pointer text-sm">Philippines</SelectItem>
                        <SelectItem value="pk" className="hover:bg-gray-50 cursor-pointer text-sm">Pakistan</SelectItem>
                        <SelectItem value="other" className="hover:bg-gray-50 cursor-pointer text-sm">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            {/* Area */}
            <FormField
              control={form.control}
              name="area"
              render={({ field }) => (
                <FormItem className="space-y-1 sm:space-y-2 transition-all duration-200 hover:translate-y-[-2px]">
                  <FormLabel className="text-xs sm:text-sm font-medium text-gray-700">
                    Area
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400 z-10">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                          </svg>
                        </div>
                        <SelectTrigger className="pl-10 bg-gray-50/50 border-gray-200 focus:bg-white transition-all h-9 sm:h-10 text-sm">
                          <SelectValue placeholder="Select your area" />
                        </SelectTrigger>
                      </div>
                    </FormControl>
                    <SelectContent className="bg-white border border-gray-100 shadow-lg animate-in fade-in-80">
                      <SelectItem value="dubai" className="hover:bg-gray-50 cursor-pointer text-sm">Dubai</SelectItem>
                      <SelectItem value="abu-dhabi" className="hover:bg-gray-50 cursor-pointer text-sm">Abu Dhabi</SelectItem>
                      <SelectItem value="al-ain" className="hover:bg-gray-50 cursor-pointer text-sm">Al Ain</SelectItem>
                      <SelectItem value="sharjah" className="hover:bg-gray-50 cursor-pointer text-sm">Sharjah</SelectItem>
                      <SelectItem value="ajman" className="hover:bg-gray-50 cursor-pointer text-sm">Ajman</SelectItem>
                      <SelectItem value="fujairah" className="hover:bg-gray-50 cursor-pointer text-sm">Fujairah</SelectItem>
                      <SelectItem value="ras-al-khaimah" className="hover:bg-gray-50 cursor-pointer text-sm">Ras Al Khaimah</SelectItem>
                      <SelectItem value="umm-al-quwain" className="hover:bg-gray-50 cursor-pointer text-sm">Umm Al Quwain</SelectItem>
                      <SelectItem value="other" className="hover:bg-gray-50 cursor-pointer text-sm">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* Height, T-Shirt Size, Shirt Size */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              <FormField
                control={form.control}
                name="height"
                render={({ field }) => (
                  <FormItem className="space-y-1 sm:space-y-2 transition-all duration-200 hover:translate-y-[-2px]">
                    <FormLabel className="text-xs sm:text-sm font-medium text-gray-700">
                      Height (cm)
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M8 3v18m0-11l4-4m0 0l4 4m-4-4v18"></path>
                          </svg>
                        </div>
                        <Input
                          className="pl-10 bg-gray-50/50 border-gray-200 focus:bg-white transition-all text-sm h-9 sm:h-10"
                          type="number"
                          min={120}
                          max={220}
                          {...field}
                          onChange={(e) => field.onChange(e.target.value === "" ? 170 : parseInt(e.target.value))}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tShirtSize"
                render={({ field }) => (
                  <FormItem className="space-y-1 sm:space-y-2 transition-all duration-200 hover:translate-y-[-2px]">
                    <FormLabel className="text-xs sm:text-sm font-medium text-gray-700">
                      T-Shirt Size
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400 z-10">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                              <line x1="3" y1="6" x2="21" y2="6"></line>
                              <path d="M16 10a4 4 0 0 1-8 0"></path>
                            </svg>
                          </div>
                          <SelectTrigger className="pl-10 bg-gray-50/50 border-gray-200 focus:bg-white transition-all h-9 sm:h-10 text-sm">
                            <SelectValue placeholder="Select size" />
                          </SelectTrigger>
                        </div>
                      </FormControl>
                      <SelectContent className="bg-white border border-gray-100 shadow-lg animate-in fade-in-80">
                        <SelectItem value="xs" className="hover:bg-gray-50 cursor-pointer text-sm">XS</SelectItem>
                        <SelectItem value="s" className="hover:bg-gray-50 cursor-pointer text-sm">S</SelectItem>
                        <SelectItem value="m" className="hover:bg-gray-50 cursor-pointer text-sm">M</SelectItem>
                        <SelectItem value="l" className="hover:bg-gray-50 cursor-pointer text-sm">L</SelectItem>
                        <SelectItem value="xl" className="hover:bg-gray-50 cursor-pointer text-sm">XL</SelectItem>
                        <SelectItem value="xxl" className="hover:bg-gray-50 cursor-pointer text-sm">XXL</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="shirtSize"
                render={({ field }) => (
                  <FormItem className="space-y-1 sm:space-y-2 transition-all duration-200 hover:translate-y-[-2px]">
                    <FormLabel className="text-xs sm:text-sm font-medium text-gray-700">
                      Shirt Size
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400 z-10">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                              <polygon points="12 2 19 8 19 16 12 22 5 16 5 8 12 2"></polygon>
                              <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                          </div>
                          <SelectTrigger className="pl-10 bg-gray-50/50 border-gray-200 focus:bg-white transition-all h-9 sm:h-10 text-sm">
                            <SelectValue placeholder="Select size" />
                          </SelectTrigger>
                        </div>
                      </FormControl>
                      <SelectContent className="bg-white border border-gray-100 shadow-lg animate-in fade-in-80">
                        <SelectItem value="xs" className="hover:bg-gray-50 cursor-pointer text-sm">XS</SelectItem>
                        <SelectItem value="s" className="hover:bg-gray-50 cursor-pointer text-sm">S</SelectItem>
                        <SelectItem value="m" className="hover:bg-gray-50 cursor-pointer text-sm">M</SelectItem>
                        <SelectItem value="l" className="hover:bg-gray-50 cursor-pointer text-sm">L</SelectItem>
                        <SelectItem value="xl" className="hover:bg-gray-50 cursor-pointer text-sm">XL</SelectItem>
                        <SelectItem value="xxl" className="hover:bg-gray-50 cursor-pointer text-sm">XXL</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 sm:pt-8">
              <Button
                type="button"
                variant="outline"
                onClick={handleSaveDraft}
                className="group relative px-4 sm:px-6 py-3 sm:py-5 text-sm transition-all duration-300 overflow-hidden border-gray-300 hover:border-gray-800 hover:bg-white hover:text-gray-800"
              >
                <span className="absolute inset-0 w-3 bg-[#262626]/10 transition-all duration-500 ease-out group-hover:w-full"></span>
                <span className="relative flex items-center justify-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                    <polyline points="17 21 17 13 7 13 7 21"></polyline>
                    <polyline points="7 3 7 8 15 8"></polyline>
                  </svg>
                  Save as Draft
                </span>
              </Button>
              
              <Button 
                type="submit"
                className="group relative px-5 sm:px-8 py-3 sm:py-5 text-sm bg-gradient-to-r from-[#FF6713] to-[#FF600A] hover:from-[#FF600A] hover:to-[#262626] transition-all duration-300 text-white shadow-md hover:shadow-lg hover:scale-[1.03] animate-shimmer"
              >
                <span className="absolute -inset-0.5 bg-gradient-to-r from-[#FF6713]/0 via-[#FF6713]/30 to-[#FF6713]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 rounded-md blur"></span>
                <span className="relative flex items-center justify-center gap-2">
                  Next Step
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </span>
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
