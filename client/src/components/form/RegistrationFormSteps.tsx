import { cn } from "@/lib/utils";

interface RegistrationFormStepsProps {
  currentStep: number;
}

export function RegistrationFormSteps({
  currentStep,
}: RegistrationFormStepsProps) {
  return (
    <div className="bg-gradient-to-r from-white to-white rounded-xl p-4 sm:p-6 mb-4 sm:mb-8 shadow-lg border border-[#FF6713]/10">
      <div className="flex items-center justify-between">
        {/* Step 1 */}
        <div className="flex flex-col items-center relative group">
          <div
            className={cn(
              "w-8 h-8 sm:w-12 md:w-14 sm:h-12 md:h-14 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-base md:text-lg shadow-md transition-all duration-300 transform",
              currentStep >= 1
                ? "bg-gradient-to-br from-[#FF6713] to-[#FF600A] scale-100"
                : "bg-gray-200 text-gray-500 scale-90",
            )}
          >
            {currentStep === 1 && (
              <div className="absolute -inset-1 bg-[#FF6713]/20 rounded-full animate-pulse"></div>
            )}
            1
          </div>
          <div
            className={cn(
              "mt-1 sm:mt-2 md:mt-3 font-medium transition-all duration-300",
              currentStep >= 1 ? "text-[#FF6713]" : "text-gray-400",
            )}
          >
            <span className="text-[10px] sm:text-xs md:text-sm truncate min-w-[60px] text-center max-w-[80px]">
              Personal Information
            </span>
          </div>
        </div>

        <div
          className={cn(
            "h-1 sm:h-2 flex-1 mx-1 sm:mx-2 md:mx-3 rounded-full relative overflow-hidden",
            currentStep >= 2 ? "bg-gray-200" : "bg-gray-200",
          )}
        >
          <div
            className={cn(
              "absolute top-0 left-0 h-full bg-gradient-to-r from-[#FF6713]/90 to-[#FF600A] transition-all duration-700",
              currentStep >= 2 ? "w-full" : "w-0",
            )}
          ></div>
        </div>

        {/* Step 2 */}
        <div className="flex flex-col items-center relative group">
          <div
            className={cn(
              "w-8 h-8 sm:w-12 md:w-14 sm:h-12 md:h-14 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-base md:text-lg shadow-md transition-all duration-300 transform",
              currentStep >= 2
                ? "bg-gradient-to-br from-[#FF6713] to-[#FF600A] scale-100"
                : "bg-gray-200 text-gray-500 scale-90",
            )}
          >
            {currentStep === 2 && (
              <div className="absolute -inset-1 bg-[#FF6713]/20 rounded-full animate-pulse"></div>
            )}
            2
          </div>
          <div
            className={cn(
              "mt-1 sm:mt-2 md:mt-3 font-medium transition-all duration-300",
              currentStep >= 2 ? "text-[#FF6713]" : "text-gray-400",
            )}
          >
            <span className="text-[10px] sm:text-xs md:text-sm truncate min-w-[60px] text-center max-w-[80px]">
              Professional Information
            </span>
          </div>
        </div>

        <div
          className={cn(
            "h-1 sm:h-2 flex-1 mx-1 sm:mx-2 md:mx-3 rounded-full relative overflow-hidden",
            currentStep >= 3 ? "bg-gray-200" : "bg-gray-200",
          )}
        >
          <div
            className={cn(
              "absolute top-0 left-0 h-full bg-gradient-to-r from-[#FF6713]/90 to-[#FF600A] transition-all duration-700",
              currentStep >= 3 ? "w-full" : "w-0",
            )}
          ></div>
        </div>

        {/* Step 3 */}
        <div className="flex flex-col items-center relative group">
          <div
            className={cn(
              "w-8 h-8 sm:w-12 md:w-14 sm:h-12 md:h-14 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-base md:text-lg shadow-md transition-all duration-300 transform",
              currentStep >= 3
                ? "bg-gradient-to-br from-[#FF6713] to-[#FF600A] scale-100"
                : "bg-gray-200 text-gray-500 scale-90",
            )}
          >
            {currentStep === 3 && (
              <div className="absolute -inset-1 bg-[#FF6713]/20 rounded-full animate-pulse"></div>
            )}
            3
          </div>
          <div
            className={cn(
              "mt-1 sm:mt-2 md:mt-3 font-medium transition-all duration-300",
              currentStep >= 3 ? "text-[#FF6713]" : "text-gray-400",
            )}
          >
            <span className="text-[10px] sm:text-xs md:text-sm truncate min-w-[60px] text-center max-w-[80px]">Documents</span>
          </div>
        </div>

        <div
          className={cn(
            "h-1 sm:h-2 flex-1 mx-1 sm:mx-2 md:mx-3 rounded-full relative overflow-hidden",
            currentStep >= 4 ? "bg-gray-200" : "bg-gray-200",
          )}
        >
          <div
            className={cn(
              "absolute top-0 left-0 h-full bg-gradient-to-r from-[#FF6713]/90 to-[#FF600A] transition-all duration-700",
              currentStep >= 4 ? "w-full" : "w-0",
            )}
          ></div>
        </div>

        {/* Step 4 */}
        <div className="flex flex-col items-center relative group">
          <div
            className={cn(
              "w-8 h-8 sm:w-12 md:w-14 sm:h-12 md:h-14 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-base md:text-lg shadow-md transition-all duration-300 transform",
              currentStep >= 4
                ? "bg-gradient-to-br from-[#FF6713] to-[#FF600A] scale-100"
                : "bg-gray-200 text-gray-500 scale-90",
            )}
          >
            {currentStep === 4 && (
              <div className="absolute -inset-1 bg-[#FF6713]/20 rounded-full animate-pulse"></div>
            )}
            4
          </div>
          <div
            className={cn(
              "mt-1 sm:mt-2 md:mt-3 font-medium transition-all duration-300",
              currentStep >= 4 ? "text-[#FF6713]" : "text-gray-400",
            )}
          >
            <span className="text-[10px] sm:text-xs md:text-sm truncate min-w-[60px] text-center max-w-[80px]">Review</span>
          </div>
        </div>
      </div>
    </div>
  );
}
