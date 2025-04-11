import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <header className="bg-white border-b border-gray-200 py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-primary-600 w-8 h-8 rounded-md flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold">PromoterPro</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/register">
              <Button className="bg-primary-600 hover:bg-primary-700">
                Register Now
              </Button>
            </Link>
            <Link href="/admin">
              <Button variant="outline">
                Admin Login
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Streamlined Promoter Registration System
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Our powerful platform helps you manage promoter registrations, documentation, and client presentations in one place.
            </p>
            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-primary-600 mr-3 flex-shrink-0" />
                <p className="text-gray-700">Easy promoter registration with all required details</p>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-primary-600 mr-3 flex-shrink-0" />
                <p className="text-gray-700">Document management with expiry tracking</p>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-primary-600 mr-3 flex-shrink-0" />
                <p className="text-gray-700">One-click professional presentations for clients</p>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-primary-600 mr-3 flex-shrink-0" />
                <p className="text-gray-700">Advanced search and filter capabilities</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <Link href="/register">
                <Button className="bg-primary-600 hover:bg-primary-700 w-full sm:w-auto flex items-center justify-center">
                  Start Registration
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/admin">
                <Button variant="outline" className="w-full sm:w-auto">
                  Admin Dashboard
                </Button>
              </Link>
            </div>
          </div>
          <div className="rounded-lg overflow-hidden shadow-lg">
            <div className="bg-white p-8 border border-gray-100">
              <h3 className="text-2xl font-semibold mb-6 text-center text-gray-800">Registration Process</h3>
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 mr-4">
                    <div className="bg-primary-100 text-primary-700 rounded-full w-10 h-10 flex items-center justify-center font-bold">1</div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Personal Information</h4>
                    <p className="text-sm text-gray-600">Provide your basic personal and contact details</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="flex-shrink-0 mr-4">
                    <div className="bg-primary-100 text-primary-700 rounded-full w-10 h-10 flex items-center justify-center font-bold">2</div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Professional Details</h4>
                    <p className="text-sm text-gray-600">Add your experience, measurements, and work history</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="flex-shrink-0 mr-4">
                    <div className="bg-primary-100 text-primary-700 rounded-full w-10 h-10 flex items-center justify-center font-bold">3</div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Document Upload</h4>
                    <p className="text-sm text-gray-600">Upload required documents and media files</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="flex-shrink-0 mr-4">
                    <div className="bg-primary-100 text-primary-700 rounded-full w-10 h-10 flex items-center justify-center font-bold">4</div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Review & Submit</h4>
                    <p className="text-sm text-gray-600">Verify your information and complete registration</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} PromoterPro. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
