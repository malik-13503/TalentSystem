import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Admin() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [_, setLocation] = useLocation();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      setIsLoading(true);
      const response = await apiRequest("POST", "/api/auth/login", data);
      
      if (response.ok) {
        const userData = await response.json();
        
        // Store user data in localStorage or context if needed
        localStorage.setItem("user", JSON.stringify(userData));
        
        toast({
          title: "Login successful",
          description: "Welcome to the admin dashboard",
        });
        
        // Redirect to dashboard
        setLocation("/dashboard");
      } else {
        const errorData = await response.json();
        toast({
          variant: "destructive",
          title: "Login failed",
          description: errorData.message || "Invalid credentials",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#262626] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#FF6713]/10 to-purple-600/10 opacity-50"></div>
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#FF6713]/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
      
      <Card className="w-full max-w-md border-0 shadow-2xl relative z-10 overflow-hidden bg-white/95 backdrop-blur-sm">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF6713] to-purple-600"></div>
        <CardHeader className="space-y-4 pb-2">
          <div className="flex items-center justify-center my-4">
            <div className="bg-white rounded-full p-2 shadow-md">
              <div className="w-24 h-24 rounded-full flex items-center justify-center bg-gradient-to-br from-[#FF6713] to-[#FF600A] p-1">
                <div className="bg-white rounded-full w-full h-full flex items-center justify-center">
                  <span className="text-[#FF6713] font-bold text-2xl">FA</span>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold text-[#262626]">Admin Portal</CardTitle>
            <CardDescription className="text-gray-500">
              Footprint Advertising Solutions LLC
            </CardDescription>
          </div>
        </CardHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6 px-8 pt-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-700 font-medium">Username</Label>
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#FF6713]/20 to-purple-500/20 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000"></div>
                <div className="relative">
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    className="border-gray-300 focus:border-[#FF6713] focus:ring-[#FF6713]/30 py-5 px-4"
                    {...form.register("username")}
                  />
                </div>
              </div>
              {form.formState.errors.username && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.username.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#FF6713]/20 to-purple-500/20 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000"></div>
                <div className="relative">
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className="border-gray-300 focus:border-[#FF6713] focus:ring-[#FF6713]/30 py-5 px-4"
                    {...form.register("password")}
                  />
                </div>
              </div>
              {form.formState.errors.password && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.password.message}</p>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="px-8 pb-8">
            <Button 
              type="submit" 
              className="w-full group relative py-5 bg-gradient-to-r from-[#FF6713] to-[#FF600A] hover:from-[#FF600A] hover:to-[#FF6713] text-white shadow-md hover:shadow-lg transition-all duration-300 font-medium text-base"
              disabled={isLoading}
            >
              <span className="absolute -inset-0.5 bg-gradient-to-r from-[#FF6713]/0 via-[#FF6713]/30 to-[#FF6713]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 rounded-md blur"></span>
              <span className="relative flex items-center justify-center">
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Authenticating...
                  </>
                ) : (
                  <>
                    Sign In to Dashboard
                  </>
                )}
              </span>
            </Button>
          </CardFooter>
        </form>
        
        <div className="px-8 pb-6 text-center">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Footprint Advertising Solutions LLC. All rights reserved.
          </p>
        </div>
      </Card>
      
      <div className="absolute bottom-4 text-center w-full text-white/60 text-xs">
        <p>Creating powerful brand impressions through exceptional talent</p>
      </div>
    </div>
  );
}
