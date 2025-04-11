import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { PromoterProfile } from "@/components/presentation/PromoterProfile";
import { Button } from "@/components/ui/button";
import { Share, ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Promoter, Document } from "@shared/schema";


export default function Presentation() {
  const { toast } = useToast();
  const [_, setLocation] = useLocation();
  const [match, params] = useRoute("/presentation/:id");
  const promoterId = match ? params.id : undefined;


  // Fetch promoter data
  const {
    data: promoter,
    isLoading: isLoadingPromoter,
    isError: isErrorPromoter,
  } = useQuery<Promoter>({
    queryKey: [`/api/talents/${promoterId}`],
    queryFn: async () => {
      if (!promoterId) return Promise.reject(new Error("Invalid ID"));
      const res = await fetch(`/api/talents/${promoterId}`);
      if (!res.ok) throw new Error("Failed to fetch promoter");
      return res.json();
    },
    enabled: !!promoterId,
  });

  // Fetch promoter documents
  const {
    data: documents = [],
    isLoading: isLoadingDocuments,
    isError: isErrorDocuments,
  } = useQuery<Document[]>({
    queryKey: [`/api/talents/${promoterId}/documents`],
    queryFn: async () => {
      if (!promoterId) return Promise.resolve([]);
      const res = await fetch(`/api/talents/${promoterId}/documents`);
      if (!res.ok) throw new Error("Failed to fetch documents");
      return res.json();
    },
    enabled: !!promoterId,
  });

  const isLoading = isLoadingPromoter || isLoadingDocuments;
  const isError = isErrorPromoter || isErrorDocuments;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Talent Profile: ${promoter?.firstName} ${promoter?.lastName}`,
        text: `Check out this talent profile for ${promoter?.firstName} ${promoter?.lastName}`,
        url: window.location.href,
      })
      .then(() => {
        toast({
          title: "Shared successfully",
          description: "The profile has been shared",
        });
      })
      .catch((error) => {
        console.error("Sharing failed:", error);
        toast({
          variant: "destructive",
          title: "Sharing failed",
          description: "Could not share the profile",
        });
      });
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "The profile link has been copied to clipboard",
      });
    }
  };



  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Profile</h2>
          <p className="text-gray-600 mb-4">Failed to load the talent profile.</p>
          <Button onClick={() => setLocation("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <MobileHeader />
        <header className="hidden md:block bg-white border-b border-gray-200 py-4 px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => setLocation("/dashboard")}
                className="flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-2xl font-bold text-gray-800">Talent Presentation</h1>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={handleShare}
                className="flex items-center"
                disabled={isLoading}
              >
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>

            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 pt-16 md:pt-6">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">
                  {isLoading ? (
                    <Skeleton className="h-7 w-40" />
                  ) : (
                    `${promoter?.firstName} ${promoter?.lastName}'s Profile`
                  )}
                </h2>
                <div className="flex items-center space-x-3 md:hidden">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleShare}
                    disabled={isLoading}
                  >
                    <Share className="h-4 w-4" />
                  </Button>

                </div>
              </div>
            </div>

            <div className="p-6">
              {isLoading ? (
                <div className="space-y-6">
                  <div className="text-center">
                    <Skeleton className="h-8 w-64 mx-auto mb-2" />
                    <Skeleton className="h-5 w-32 mx-auto" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Skeleton className="h-60 w-full" />
                    <Skeleton className="h-60 w-full" />
                    <Skeleton className="h-60 w-full" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Skeleton className="h-40 w-full" />
                    <Skeleton className="h-40 w-full" />
                  </div>
                </div>
              ) : promoter ? (
                <PromoterProfile promoter={promoter} documents={documents} />
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-500">No talent profile found</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
