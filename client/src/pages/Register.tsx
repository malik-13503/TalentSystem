import { useState } from "react";
import { Link } from "wouter";
import { RegistrationFormSteps } from "@/components/form/RegistrationFormSteps";
import { PersonalInfoForm } from "@/components/form/PersonalInfoForm";
import { ProfessionalDetailsForm } from "@/components/form/ProfessionalDetailsForm";
import { DocumentsForm } from "@/components/form/DocumentsForm";
import { ReviewForm } from "@/components/form/ReviewForm";
import {
  PersonalInfo,
  ProfessionalDetails,
  DocumentUpload,
} from "@shared/schema";
import { Button } from "@/components/ui/button";
import logoPath from "@assets/logo.avif";

export default function Register() {
  const [currentStep, setCurrentStep] = useState(1);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
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
  });
  const [professionalDetails, setProfessionalDetails] =
    useState<ProfessionalDetails>({
      yearsExperience: 0,
      talentType: "",
      artistPerformerDetails: "",
      previousExperience: "",
      brandsWorkedFor: "",
    });
  const [documents, setDocuments] = useState<DocumentUpload[]>([]);

  const handlePersonalInfoSubmit = (data: PersonalInfo) => {
    setPersonalInfo(data);
    setCurrentStep(2);
  };

  const handleProfessionalDetailsSubmit = (data: ProfessionalDetails) => {
    setProfessionalDetails(data);
    setCurrentStep(3);
  };

  const handleDocumentsSubmit = (data: DocumentUpload[]) => {
    setDocuments(data);
    setCurrentStep(4);
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalInfoForm
            onSubmit={handlePersonalInfoSubmit}
            defaultValues={personalInfo}
          />
        );
      case 2:
        return (
          <ProfessionalDetailsForm
            onSubmit={handleProfessionalDetailsSubmit}
            onPrevious={handlePrevStep}
            defaultValues={professionalDetails}
          />
        );
      case 3:
        return (
          <DocumentsForm
            onSubmit={handleDocumentsSubmit}
            onPrevious={handlePrevStep}
            documents={documents}
          />
        );
      case 4:
        return (
          <ReviewForm
            personalInfo={personalInfo}
            professionalDetails={professionalDetails}
            documents={documents}
            onPrevious={handlePrevStep}
          />
        );
      default:
        return (
          <PersonalInfoForm
            onSubmit={handlePersonalInfoSubmit}
            defaultValues={personalInfo}
          />
        );
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Simple white and #262626 (30%) background */}
      <div className="fixed inset-0 bg-white -z-10"></div>
      <div className="fixed inset-0 bg-[#262626]/[0.03] -z-10"></div>
      <div
        className="fixed inset-0"
        style={{
          backgroundImage: "var(--noise-texture)",
          opacity: 0.3,
          mixBlendMode: "overlay",
          zIndex: -9,
        }}
      ></div>

      {/* Subtle pattern overlay */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNMCAwaDQwdjQwSDB6IiBmaWxsPSJub25lIiBzdHJva2U9IiMyNjI2MjYiIHN0cm9rZS1vcGFjaXR5PSIwLjAyIiBzdHJva2Utd2lkdGg9IjAuNSIvPjwvcGF0dGVybj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-70 -z-10"></div>

      {/* Elegant accent elements */}
      <div className="fixed top-1/3 right-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#262626]/[0.05] to-transparent -z-8"></div>
      <div className="fixed bottom-1/3 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#262626]/[0.05] to-transparent -z-8"></div>
      {/* Header */}
      <header className="bg-gradient-to-r from-[#262626] to-[#262626] py-6 px-6 shadow-xl relative overflow-hidden">
        <div
          className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB4PSIwIiB5PSIwIiB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InNrZXdYKDIwKSI+PHBhdGggZD0iTTAgMCBMNjAgNjAgTTYwIDAgTDAgNjAiIHN0cm9rZT0iI0ZGNjcxMyIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjcGF0dGVybikiLz48ZGl2IGNsYXNzPSJhYnNvbHV0ZSB0b3AtMCByaWdodC0wIGgtNjQgdy02NCBiZy1ncmFkaWVudC10by1ibCBmcm9tLVtcI0ZGNjcxM10vNTAgdG8tdHJhbnNwYXJlbnQgcm91bmRlZC1ibC1mdWxsIGJsdXItMnhsIG9wYWNpdHktMjAiLz48L3N2Zz4=')]"
          style={{ opacity: 0.4 }}
        ></div>
        <div className="absolute top-0 right-0 h-32 w-32 bg-gradient-to-bl from-[#FF6713]/10 to-transparent rounded-bl-full blur-xl"></div>
        <div className="absolute bottom-0 left-0 h-24 w-24 bg-gradient-to-tr from-[#FF6713]/10 to-transparent rounded-tr-full blur-xl"></div>
        <div className="max-w-7xl mx-auto flex items-center justify-between relative z-10">
          <div className="flex items-center space-x-4">
            <img
              src={logoPath}
              alt="Footprint Advertising Solutions LLC Logo"
              className="h-12 w-auto"
            />

            <div className="flex flex-col">
              <h1 className="text-3xl font-medium text-white tracking-tight">
                <span className="text-white">Footprint</span>
                <span className="text-white"> Advertising</span>
                <span className="text-white"> Solutions</span>
              </h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {/* Admin button removed as requested */}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 sm:py-16">
        <div className="mb-8 sm:mb-12 text-center">
          <div className="inline-block mb-4 sm:mb-6 relative">
            {/* Outer glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-[#FF6713]/20 via-[#FF600A]/20 to-[#FF6713]/20 rounded-full blur-xl opacity-70 animate-pulse"></div>

            {/* Title with advanced gradient */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#FF6713]/40 to-[#FF600A]/40 rounded-lg blur"></div>
              <h1 className="relative text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight bg-gradient-to-br from-[#FF6713] via-[#FF600A] to-[#FF6713] bg-clip-text text-transparent px-4 sm:px-10 py-4">
                Talent Registration
              </h1>

              {/* Decorative line */}
              <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-16 sm:w-24 h-1 bg-gradient-to-r from-[#FF6713]/80 to-[#FF600A]/80 rounded-full"></div>
            </div>
          </div>

          {/* Subtitle with style */}
          <p className="text-[#262626] text-base sm:text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed px-2">
            <span className="relative inline-block">
              <span className="relative z-10">
                Handpicked talent. Iconic brands. Exceptional experiences.
              </span>
              <span className="absolute bottom-0 left-0 w-full h-2 bg-[#262626]/5 rounded-sm transform -rotate-1"></span>
            </span>
          </p>
        </div>

        <div className="relative">
          {/* Decorative elements */}
          <div className="absolute -top-10 -left-10 w-64 h-64 bg-[#262626]/3 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-[#262626]/3 rounded-full blur-3xl"></div>
          <div className="absolute top-1/4 right-1/4 w-20 h-20 bg-[#262626]/2 rounded-full blur-lg"></div>

          {/* Outer glow */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#262626]/10 to-[#262626]/5 rounded-2xl blur"></div>
          <div className="absolute -inset-2 bg-gradient-to-b from-white via-transparent to-white rounded-3xl opacity-50 pointer-events-none"></div>

          {/* Main form container */}
          <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 mb-10 border border-[#262626]/10 relative overflow-hidden font-light">
            {/* Inner decorative elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-[#262626]/[0.02] via-[#262626]/[0.01] to-transparent rounded-bl-full"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-[#262626]/[0.02] via-[#262626]/[0.01] to-transparent rounded-tr-full"></div>
            <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#262626]/10 to-transparent"></div>
            <div className="absolute bottom-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#262626]/10 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#262626]/[0.01] to-transparent opacity-50"></div>

            {/* Steps indicator */}
            <RegistrationFormSteps currentStep={currentStep} />

            {/* Form content with inner glow */}
            <div className="relative z-10 mt-6 sm:mt-8 md:mt-10 px-0 sm:px-1">
              <div className="relative">
                {currentStep === 1 && (
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#262626]/5 to-[#262626]/5 rounded-lg blur-sm"></div>
                )}
                <div className="relative bg-white p-2 sm:p-4 rounded-lg shadow-sm font-light text-[#262626]">
                  {renderStepContent()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-[#262626] py-12 mt-10 text-white relative overflow-hidden">
        <div
          className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB4PSIwIiB5PSIwIiB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InNrZXdYKDIwKSI+PHBhdGggZD0iTTAgMCBMNjAgNjAgTTYwIDAgTDAgNjAiIHN0cm9rZT0iI0ZGNjcxMyIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjcGF0dGVybikiLz48ZGl2IGNsYXNzPSJhYnNvbHV0ZSB0b3AtMCByaWdodC0wIGgtNjQgdy02NCBiZy1ncmFkaWVudC10by1ibCBmcm9tLVtcI0ZGNjcxM10vNTAgdG8tdHJhbnNwYXJlbnQgcm91bmRlZC1ibC1mdWxsIGJsdXItMnhsIG9wYWNpdHktMjAiLz48L3N2Zz4=')]"
          style={{ opacity: 0.4 }}
        ></div>
        <div className="absolute top-0 right-0 h-32 w-32 bg-gradient-to-bl from-[#FF6713]/10 to-transparent rounded-bl-full blur-xl"></div>
        <div className="absolute bottom-0 left-0 h-24 w-24 bg-gradient-to-tr from-[#FF6713]/10 to-transparent rounded-tr-full blur-xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center border-b border-white/10 pb-8 mb-8">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="p-3 rounded-xl mr-4">
                <img
                  src={logoPath}
                  alt="Footprint Advertising Solutions LLC Logo"
                  className="h-10 w-auto"
                />
              </div>
              <div>
                <h2 className="font-medium text-2xl tracking-tight">
                  <span className="text-white">Footprint</span>
                  <span className="text-white"> Advertising</span>
                  <span className="text-white"> Solutions</span>
                </h2>
              </div>
            </div>

            <div className="flex space-x-4">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#FF6713]/80 transition-colors cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#FF6713]/80 transition-colors cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#FF6713]/80 transition-colors cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-gray-400 text-sm font-light">
              &copy; {new Date().getFullYear()} Footprint Advertising Solutions
              LLC. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
