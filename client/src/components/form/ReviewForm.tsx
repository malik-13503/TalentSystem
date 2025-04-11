import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  PersonalInfo,
  ProfessionalDetails,
  DocumentUpload,
} from "@shared/schema";
import { Loader2, Check, File, Image, Video } from "lucide-react";

interface ReviewFormProps {
  personalInfo: PersonalInfo;
  professionalDetails: ProfessionalDetails;
  documents: DocumentUpload[];
  onPrevious: () => void;
}

export function ReviewForm({
  personalInfo,
  professionalDetails,
  documents,
  onPrevious,
}: ReviewFormProps) {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [promoterId, setPromoterId] = useState<string>("");

  const registerMutation = useMutation({
    mutationFn: async (data: {
      personalInfo: PersonalInfo;
      professionalDetails: ProfessionalDetails;
      documents: DocumentUpload[];
    }) => {
      const response = await apiRequest("POST", "/api/register", data);
      return response.json();
    },
    onSuccess: (data) => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setPromoterId(data.promoter.uniqueId);
      toast({
        title: "Registration successful!",
        description: `Your promoter ID is ${data.promoter.uniqueId}. A confirmation email has been sent.`,
        variant: "default",
      });
      
      // Clear draft data
      localStorage.removeItem("personalInfoDraft");
      localStorage.removeItem("professionalDetailsDraft");
      localStorage.removeItem("documentsDraft");
      
      // Navigate to success view
    },
    onError: (error) => {
      setIsSubmitting(false);
      toast({
        title: "Registration failed",
        description: "There was an error submitting your registration. Please try again.",
        variant: "destructive",
      });
      console.error("Registration error:", error);
    },
  });

  const handleSubmit = async () => {
    setIsSubmitting(true);
    registerMutation.mutate({
      personalInfo,
      professionalDetails,
      documents,
    });
  };

  // Helper function to display filename with icon
  const renderFileItem = (doc: DocumentUpload, index: number) => {
    let Icon = File;
    if (doc.mimeType.includes("image")) Icon = Image;
    if (doc.mimeType.includes("video")) Icon = Video;

    // Create a truly unique key
    // Combined with document properties, section name, timestamp and random ID to ensure uniqueness
    const randomPartId = Math.random().toString(36).substring(2, 8);
    const timestamp = Date.now();
    const uniqueKey = `${doc.type}-${randomPartId}-${timestamp}-${index}`;
    
    return (
      <div key={uniqueKey} className="flex items-center space-x-2 text-sm">
        <Icon className="h-4 w-4 text-gray-500" />
        <span className="text-gray-700">{doc.fileName}</span>
        {doc.expiryDate && (
          <span className="text-gray-500 text-xs">
            (Expires: {new Date(doc.expiryDate).toLocaleDateString()})
          </span>
        )}
      </div>
    );
  };

  if (isSuccess) {
    return (
      <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all max-w-full mx-auto">
        <div className="relative overflow-hidden bg-gradient-to-r from-purple-500/20 to-primary/20 p-4 sm:p-6 md:p-8">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/20 to-transparent opacity-70"></div>
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
          
          <div className="relative flex flex-col sm:flex-row items-center text-center sm:text-left">
            <div className="flex-shrink-0 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-md mb-4 sm:mb-0">
              <Check className="h-8 w-8 sm:h-10 sm:w-10 text-green-500" />
            </div>
            <div className="sm:ml-5">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Registration Complete!</h2>
              <p className="text-base sm:text-lg text-gray-700">Thank you for registering with Footprint Advertising Solutions LLC!</p>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 md:p-8 relative overflow-hidden">
          <div className="absolute -top-[300px] left-1/2 w-[600px] h-[600px] bg-gradient-to-b from-purple-500/5 to-transparent rounded-full blur-3xl -translate-x-1/2"></div>
          
          <div className="relative text-center mb-6 sm:mb-10 max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-400 to-green-500 rounded-full mb-4 sm:mb-6 shadow-lg shadow-green-200">
              <Check className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
            </div>
            
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">Registration Successful</h3>
            
            <p className="text-gray-600 mb-4 sm:mb-6 text-base sm:text-lg px-2 sm:px-0">
              Your talent profile has been created successfully. Your unique ID is shown below and has been sent to your email address.
            </p>
            
            <div className="relative group mx-2 sm:mx-auto max-w-full">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-primary rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
              <div className="py-3 px-4 sm:px-6 bg-white rounded-lg shadow-md relative flex justify-center items-center flex-wrap">
                <p className="font-mono text-lg sm:text-xl font-semibold text-gray-700 tracking-wide break-all">{promoterId}</p>
                <div className="ml-2 text-gray-500 hover:text-gray-700 cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                  </svg>
                </div>
              </div>
            </div>
            
            <p className="text-gray-500 mt-4 text-sm sm:text-base px-4 sm:px-0">
              A confirmation email has been sent to <span className="font-semibold text-gray-700 break-all">{personalInfo.email}</span> with all your registration details.
            </p>
          </div>

          <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center mt-6 sm:mt-8 px-2 sm:px-0">
            <Button 
              onClick={() => window.location.href = "/"}
              className="group relative px-4 sm:px-6 py-4 sm:py-5 bg-gradient-to-r from-primary to-purple-500 hover:from-purple-500 hover:to-primary transition-all duration-300 text-white shadow-md hover:shadow-lg hover:scale-[1.02] w-full sm:w-auto"
            >
              <span className="absolute -inset-0.5 bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 rounded-md blur"></span>
              <span className="relative flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
                Return to Home
              </span>
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => window.location.href = "/register"}
              className="group relative px-4 sm:px-6 py-4 sm:py-5 transition-all duration-300 overflow-hidden border-gray-300 hover:border-purple-500/50 hover:bg-white hover:text-purple-500 w-full sm:w-auto"
            >
              <span className="absolute inset-0 w-3 bg-purple-500/10 transition-all duration-500 ease-out group-hover:w-full"></span>
              <span className="relative flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="8.5" cy="7" r="4"></circle>
                  <line x1="20" y1="8" x2="20" y2="14"></line>
                  <line x1="23" y1="11" x2="17" y2="11"></line>
                </svg>
                Register Another Talent
              </span>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="bg-gray-50 p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Review Your Information</h2>
        <p className="text-sm text-gray-500 mt-1">
          Please review all your information before submitting the registration.
        </p>
      </div>

      <div className="p-6 space-y-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Personal Information</CardTitle>
            <CardDescription>Your basic personal details</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                <dd className="text-sm text-gray-900">{personalInfo.firstName} {personalInfo.lastName}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Date of Birth</dt>
                <dd className="text-sm text-gray-900">{new Date(personalInfo.dateOfBirth).toLocaleDateString()}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Email Address</dt>
                <dd className="text-sm text-gray-900">{personalInfo.email}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Gender</dt>
                <dd className="text-sm text-gray-900 capitalize">{personalInfo.gender}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Mobile Number</dt>
                <dd className="text-sm text-gray-900">{personalInfo.mobileNumber}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Nationality</dt>
                <dd className="text-sm text-gray-900 capitalize">{personalInfo.nationality}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Area</dt>
                <dd className="text-sm text-gray-900 capitalize">{personalInfo.area}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Height</dt>
                <dd className="text-sm text-gray-900">{personalInfo.height} cm</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">T-Shirt Size</dt>
                <dd className="text-sm text-gray-900 uppercase">{personalInfo.tShirtSize}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Shirt Size</dt>
                <dd className="text-sm text-gray-900 uppercase">{personalInfo.shirtSize}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Professional Details</CardTitle>
            <CardDescription>Your professional experience and attributes</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 mb-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Years of Experience</dt>
                <dd className="text-sm text-gray-900">{professionalDetails.yearsExperience} years</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Talent Type</dt>
                <dd className="text-sm text-gray-900 capitalize">{professionalDetails.talentType}</dd>
              </div>
              {professionalDetails.artistPerformerDetails && (
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Artist/Performer Details</dt>
                  <dd className="text-sm text-gray-900">{professionalDetails.artistPerformerDetails}</dd>
                </div>
              )}
            </dl>
            
            <Separator className="my-2" />
            
            <div className="mt-4">
              <dt className="text-sm font-medium text-gray-500 mb-1">Brands Worked For</dt>
              <dd className="text-sm text-gray-900">
                {professionalDetails.brandsWorkedFor || "None specified"}
              </dd>
            </div>
            
            <div className="mt-4">
              <dt className="text-sm font-medium text-gray-500 mb-1">Previous Experience</dt>
              <dd className="text-sm text-gray-900">
                {professionalDetails.previousExperience || "None specified"}
              </dd>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Uploaded Documents</CardTitle>
            <CardDescription>Your identification and media files</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Identification Documents</h4>
                <div className="space-y-1">
                  {documents
                    .filter(doc => ["passport", "visa", "emiratesId", "laborCard"].includes(doc.type))
                    .map((doc, index) => renderFileItem(doc, index))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Professional Photos</h4>
                <div className="space-y-1">
                  {documents
                    .filter(doc => doc.type === "photo")
                    .map((doc, index) => renderFileItem(doc, index))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Introductory Video</h4>
                <div className="space-y-1">
                  {documents
                    .filter(doc => doc.type === "video")
                    .map((doc, index) => renderFileItem(doc, index))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row justify-between pt-6 sm:pt-8 space-y-4 sm:space-y-0">
          <Button
            type="button"
            variant="outline"
            onClick={onPrevious}
            className="group relative px-4 sm:px-6 py-3 sm:py-5 text-sm transition-all duration-300 overflow-hidden border-gray-300 hover:border-gray-800 hover:bg-white hover:text-gray-800"
          >
            <span className="absolute inset-0 w-3 bg-gray-800/10 transition-all duration-500 ease-out group-hover:w-full"></span>
            <span className="relative flex items-center justify-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 group-hover:-translate-x-1 transition-transform duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              Previous Step
            </span>
          </Button>
          
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`group relative px-5 sm:px-8 py-3 sm:py-5 text-sm ${isSubmitting ? 'bg-gray-400' : 'bg-gradient-to-r from-[#FF6713] to-[#FF600A] hover:from-[#FF600A] hover:to-[#262626]'} transition-all duration-300 text-white shadow-md hover:shadow-lg hover:scale-[1.03] min-w-[150px] sm:min-w-[180px] animate-shimmer`}
          >
            <span className="absolute -inset-0.5 bg-gradient-to-r from-[#FF6713]/0 via-[#FF6713]/30 to-[#FF6713]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 rounded-md blur"></span>
            <span className="relative flex items-center justify-center gap-2">
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit Registration
                  <Check className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                </>
              )}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
