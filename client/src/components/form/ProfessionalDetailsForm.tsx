import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProfessionalDetails, professionalDetailsSchema } from "@shared/schema";

interface ProfessionalDetailsFormProps {
  onSubmit: (data: ProfessionalDetails) => void;
  onPrevious: () => void;
  defaultValues?: ProfessionalDetails;
}

export function ProfessionalDetailsForm({
  onSubmit,
  onPrevious,
  defaultValues = {
    yearsExperience: 0,
    talentType: "",
    artistPerformerDetails: "",
    previousExperience: "",
    brandsWorkedFor: "",
  },
}: ProfessionalDetailsFormProps) {
  const form = useForm<ProfessionalDetails>({
    resolver: zodResolver(professionalDetailsSchema),
    defaultValues,
  });

  const [showArtistDetails, setShowArtistDetails] = useState(
    defaultValues.talentType === "artist" ||
      defaultValues.talentType === "performer",
  );

  const watchTalentType = form.watch("talentType");

  // Update conditional fields visibility when talent type changes
  useState(() => {
    if (watchTalentType === "artist" || watchTalentType === "performer") {
      setShowArtistDetails(true);
    } else {
      setShowArtistDetails(false);
    }
  });

  const handleSaveDraft = () => {
    // Save the current form values as draft
    const currentValues = form.getValues();
    localStorage.setItem(
      "professionalDetailsDraft",
      JSON.stringify(currentValues),
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all hover:shadow-lg">
      <div className="bg-gradient-to-r from-gray-50 to-white p-4 sm:p-6 border-b border-gray-100 relative">
        {/* Title decoration */}
        <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[#FF6713]/60 to-[#FF600A]/60"></div>

        <h2 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center">
          <span className="inline-block mr-2 text-[#FF6713]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 sm:h-5 sm:w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
              <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>
          </span>
          Professional Details
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-1 ml-6 sm:ml-7">
          Tell us about your professional experience and attributes.
        </p>
      </div>

      <div className="p-4 sm:p-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 sm:space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <FormField
                control={form.control}
                name="yearsExperience"
                render={({ field }) => (
                  <FormItem className="space-y-1 sm:space-y-2 transition-all duration-200 hover:translate-y-[-2px]">
                    <FormLabel className="text-xs sm:text-sm font-medium text-gray-700">
                      Years of Experience
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 sm:h-5 sm:w-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                          </svg>
                        </div>
                        <Input
                          className="pl-10 bg-gray-50/50 border-gray-200 focus:bg-white transition-all text-sm h-9 sm:h-10"
                          type="number"
                          min={0}
                          max={50}
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === ""
                                ? 0
                                : parseInt(e.target.value),
                            )
                          }
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="talentType"
                render={({ field }) => (
                  <FormItem className="space-y-1 sm:space-y-2 transition-all duration-200 hover:translate-y-[-2px]">
                    <FormLabel className="text-xs sm:text-sm font-medium text-gray-700">
                      Talent Type
                    </FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        setShowArtistDetails(
                          value === "artist" || value === "performer",
                        );
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400 z-10">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 sm:h-5 sm:w-5"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                              <circle cx="9" cy="7" r="4"></circle>
                              <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                            </svg>
                          </div>
                          <SelectTrigger className="pl-10 bg-gray-50/50 border-gray-200 focus:bg-white transition-all h-9 sm:h-10 text-sm">
                            <SelectValue placeholder="Select your talent type" />
                          </SelectTrigger>
                        </div>
                      </FormControl>
                      <SelectContent className="bg-white border border-gray-100 shadow-lg animate-in fade-in-80">
                        <SelectItem
                          value="promoter"
                          className="hover:bg-gray-50 cursor-pointer text-sm"
                        >
                          Promoter/Hostess
                        </SelectItem>
                        <SelectItem
                          value="artist"
                          className="hover:bg-gray-50 cursor-pointer text-sm"
                        >
                          Artist
                        </SelectItem>
                        <SelectItem
                          value="performer"
                          className="hover:bg-gray-50 cursor-pointer text-sm"
                        >
                          Performer
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            {showArtistDetails && (
              <FormField
                control={form.control}
                name="artistPerformerDetails"
                render={({ field }) => (
                  <FormItem className="space-y-1 sm:space-y-2 transition-all duration-200 hover:translate-y-[-2px]">
                    <FormLabel className="text-xs sm:text-sm font-medium text-gray-700">
                      {form.getValues("talentType") === "artist"
                        ? "Artist Details"
                        : "Performer Details"}
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute top-3 left-3 text-gray-400">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 sm:h-5 sm:w-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                            <path d="M14.5 8a3.001 3.001 0 0 0-3-3"></path>
                            <path d="M16.5 19a3.001 3.001 0 0 0-3-3"></path>
                            <path d="M8 14.5a3.001 3.001 0 0 0 3 3"></path>
                            <path d="M5 8a3.001 3.001 0 0 0 3 3"></path>
                          </svg>
                        </div>
                        <Textarea
                          placeholder={
                            form.getValues("talentType") === "artist"
                              ? "Describe your artistic specialties, medium, style, etc..."
                              : "Describe your performance type, style, special skills, etc..."
                          }
                          className="pl-10 pt-2 bg-gray-50/50 border-gray-200 focus:bg-white transition-all resize-none text-sm"
                          rows={3}
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="previousExperience"
              render={({ field }) => (
                <FormItem className="space-y-1 sm:space-y-2 transition-all duration-200 hover:translate-y-[-2px]">
                  <FormLabel className="text-xs sm:text-sm font-medium text-gray-700 flex items-center gap-2">
                    <span>Previous Experience</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <div className="absolute top-3 left-3 text-gray-400">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 sm:h-5 sm:w-5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                        </svg>
                      </div>
                      <Textarea
                        placeholder="• 2 years at Dubai Mall events
• Worked at Abu Dhabi F1 Grand Prix
• Product launch events"
                        className="pl-10 pt-2 bg-gray-50/50 border-gray-200 focus:bg-white transition-all resize-none text-sm"
                        rows={4}
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
              name="brandsWorkedFor"
              render={({ field }) => (
                <FormItem className="space-y-1 sm:space-y-2 transition-all duration-200 hover:translate-y-[-2px]">
                  <FormLabel className="text-xs sm:text-sm font-medium text-gray-700">
                    Brands Worked For
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 sm:h-5 sm:w-5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                          <rect
                            x="8"
                            y="2"
                            width="8"
                            height="4"
                            rx="1"
                            ry="1"
                          ></rect>
                        </svg>
                      </div>
                      <Input
                        className="pl-10 bg-gray-50/50 border-gray-200 focus:bg-white transition-all text-sm h-9 sm:h-10"
                        placeholder="E.g., Nike, Adidas, Samsung (comma separated)"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row justify-between pt-4 sm:pt-6 space-y-4 sm:space-y-0">
              <Button
                type="button"
                variant="outline"
                onClick={onPrevious}
                className="group relative px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm transition-all duration-300 overflow-hidden border-gray-300 hover:border-[#262626] hover:bg-white hover:text-[#262626]"
              >
                <span className="absolute inset-0 w-3 bg-[#262626]/10 transition-all duration-500 ease-out group-hover:w-full"></span>
                <span className="relative flex items-center justify-center gap-1.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 sm:h-5 sm:w-5 group-hover:-translate-x-1 transition-transform duration-300"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                  Previous Step
                </span>
              </Button>

              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSaveDraft}
                  className="group relative px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm transition-all duration-300 overflow-hidden border-gray-300 hover:border-[#262626] hover:bg-white hover:text-[#262626]"
                >
                  <span className="absolute inset-0 w-3 bg-[#262626]/10 transition-all duration-500 ease-out group-hover:w-full"></span>
                  <span className="relative flex items-center justify-center gap-1.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                      <polyline points="17 21 17 13 7 13 7 21"></polyline>
                      <polyline points="7 3 7 8 15 8"></polyline>
                    </svg>
                    Save as Draft
                  </span>
                </Button>

                <Button
                  type="submit"
                  className="group relative px-5 sm:px-8 py-2 sm:py-3 text-xs sm:text-sm bg-gradient-to-r from-[#FF6713] to-[#FF600A] hover:from-[#FF600A] hover:to-[#262626] transition-all duration-300 text-white shadow-md hover:shadow-lg hover:scale-[1.03] animate-shimmer"
                >
                  <span className="absolute -inset-0.5 bg-gradient-to-r from-[#FF6713]/0 via-[#FF6713]/30 to-[#FF6713]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 rounded-md blur"></span>
                  <span className="relative flex items-center justify-center gap-2">
                    Next Step
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform duration-300"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </span>
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
