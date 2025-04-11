import { useState } from "react";
import { useForm } from "react-hook-form";
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
import { DocumentUpload } from "@shared/schema";
import { cn } from "@/lib/utils";
import { FileUp, Image, Video, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface DocumentsFormProps {
  onSubmit: (data: DocumentUpload[]) => void;
  onPrevious: () => void;
  documents: DocumentUpload[];
}

type DocumentType =
  | "passport"
  | "visa"
  | "emiratesId"
  | "laborCard"
  | "photo"
  | "video";

interface DocumentUploadProps {
  type: DocumentType;
  title: string;
  description: string;
  icon: React.ReactNode;
  acceptFiles: string;
  onFileUpload: (file: File, expiryDate?: string) => void;
  hasExpiryDate?: boolean;
  multiple?: boolean;
}

const DocumentUploadField = ({
  type,
  title,
  description,
  icon,
  acceptFiles,
  onFileUpload,
  hasExpiryDate = false,
  multiple = false,
}: DocumentUploadProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [expiryDate, setExpiryDate] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileList = Array.from(e.target.files);
      setFiles(multiple ? [...files, ...fileList] : [fileList[0]]);
      
      if (!multiple) {
        onFileUpload(fileList[0], expiryDate);
      } else {
        // For multiple files, upload each file individually
        fileList.forEach(file => {
          onFileUpload(file, expiryDate);
        });
      }
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExpiryDate(e.target.value);
    if (files.length > 0 && !multiple) {
      onFileUpload(files[0], e.target.value);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files) {
      const fileList = Array.from(e.dataTransfer.files);
      setFiles(multiple ? [...files, ...fileList] : [fileList[0]]);
      
      if (!multiple) {
        onFileUpload(fileList[0], expiryDate);
      } else {
        // For multiple files, upload each file individually
        fileList.forEach(file => {
          onFileUpload(file, expiryDate);
        });
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const submitMultipleFiles = () => {
    if (multiple && files.length > 0) {
      files.forEach(file => {
        onFileUpload(file, expiryDate);
      });
      // Show a visual confirmation that files are being uploaded
      toast({
        title: "Uploading files...",
        description: `${files.length} files are being processed.`,
      });
    }
  };

  return (
    <div className="space-y-3">
      <FormLabel>{title}</FormLabel>
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center transition-colors",
          isDragging ? "border-primary-400 bg-primary-50" : "border-gray-200 hover:border-primary-400 hover:bg-gray-50"
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {files.length === 0 ? (
          <>
            {icon}
            <p className="text-sm text-gray-500 mb-2">{description}</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => document.getElementById(`file-${type}`)?.click()}
            >
              Select File{multiple ? "s" : ""}
            </Button>
            <input
              id={`file-${type}`}
              type="file"
              className="hidden"
              accept={acceptFiles}
              onChange={handleFileChange}
              multiple={multiple}
            />
          </>
        ) : (
          <div className="w-full">
            <div className="flex flex-col gap-2 w-full">
              {files.map((file, index) => (
                <div key={`${type}-${index}-${file.lastModified}`} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <div className="flex items-center">
                    {file.type.includes("image") ? (
                      <Image className="h-5 w-5 text-gray-500 mr-2" />
                    ) : file.type.includes("video") ? (
                      <Video className="h-5 w-5 text-gray-500 mr-2" />
                    ) : (
                      <FileUp className="h-5 w-5 text-gray-500 mr-2" />
                    )}
                    <span className="text-sm text-gray-700 truncate max-w-[200px]">
                      {file.name}
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFile(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            {multiple && (
              <div className="mt-2 flex justify-center">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById(`file-${type}`)?.click()}
                >
                  Add More Files
                </Button>
                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  className="ml-2"
                  onClick={submitMultipleFiles}
                >
                  Upload All
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
      {hasExpiryDate && (
        <div className="flex items-center space-x-3">
          <FormLabel htmlFor={`${type}-expiry`} className="flex-shrink-0">Expiry Date:</FormLabel>
          <Input
            id={`${type}-expiry`}
            type="date"
            value={expiryDate}
            onChange={handleExpiryChange}
          />
        </div>
      )}
    </div>
  );
};

export function DocumentsForm({
  onSubmit,
  onPrevious,
  documents,
}: DocumentsFormProps) {
  const [uploadedDocuments, setUploadedDocuments] = useState<DocumentUpload[]>(documents);
  const form = useForm({});

  const handleFileUpload = (
    type: DocumentType,
    file: File,
    expiryDate?: string
  ) => {
    // Convert file to base64
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const fileData = reader.result as string;
      
      const newDocument: DocumentUpload = {
        type,
        fileName: file.name,
        fileData,
        mimeType: file.type,
        expiryDate,
      };
      
      // Remove any existing documents of the same type (except for photos)
      const filteredDocuments = type === "photo" 
        ? uploadedDocuments 
        : uploadedDocuments.filter(doc => doc.type !== type);
      
      setUploadedDocuments([...filteredDocuments, newDocument]);
    };
  };

  const handleSubmit = () => {
    onSubmit(uploadedDocuments);
  };

  const handleSaveDraft = () => {
    localStorage.setItem("documentsDraft", JSON.stringify(uploadedDocuments));
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all hover:shadow-lg">
      <div className="bg-gradient-to-r from-gray-50 to-white p-6 border-b border-gray-100 relative">
        {/* Title decoration */}
        <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[#FF6713]/60 to-[#FF600A]/60"></div>
        
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <span className="inline-block mr-2 text-[#FF6713]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </span>
          Upload Documents
        </h2>
        <p className="text-sm text-gray-500 mt-1 ml-7">
          Please upload all required documents and media files.
        </p>
      </div>

      <div className="p-6">
        <Form {...form}>
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-8">
            <DocumentUploadField
              type="passport"
              title="Passport Copy"
              description="Drag and drop your passport copy or click to browse"
              icon={<FileUp className="h-10 w-10 text-gray-400 mb-2" />}
              acceptFiles="*"
              onFileUpload={(file, expiryDate) => handleFileUpload("passport", file, expiryDate)}
              hasExpiryDate
            />
            
            <DocumentUploadField
              type="visa"
              title="Visa Copy"
              description="Drag and drop your visa copy or click to browse"
              icon={<FileUp className="h-10 w-10 text-gray-400 mb-2" />}
              acceptFiles="*"
              onFileUpload={(file, expiryDate) => handleFileUpload("visa", file, expiryDate)}
              hasExpiryDate
            />
            
            <DocumentUploadField
              type="emiratesId"
              title="Emirates ID Copy"
              description="Drag and drop your Emirates ID copy or click to browse"
              icon={<FileUp className="h-10 w-10 text-gray-400 mb-2" />}
              acceptFiles="*"
              onFileUpload={(file, expiryDate) => handleFileUpload("emiratesId", file, expiryDate)}
              hasExpiryDate
            />
            
            <div className="relative">
              <div className="absolute -top-2 right-0 bg-amber-50 px-2 py-0.5 rounded text-xs text-amber-600 border border-amber-200">
                Only if applicable
              </div>
              <DocumentUploadField
                type="laborCard"
                title="Labor Card (Optional)"
                description="Drag and drop your Labor Card copy or click to browse"
                icon={<FileUp className="h-10 w-10 text-gray-400 mb-2" />}
                acceptFiles="*"
                onFileUpload={(file, expiryDate) => handleFileUpload("laborCard", file, expiryDate)}
                hasExpiryDate
              />
            </div>
            
            <DocumentUploadField
              type="photo"
              title="Professional Photos (3-4)"
              description="Drag and drop your professional photos or click to browse"
              icon={<Image className="h-10 w-10 text-gray-400 mb-2" />}
              acceptFiles="*"
              onFileUpload={(file) => handleFileUpload("photo", file)}
              multiple
            />
            
            <DocumentUploadField
              type="video"
              title="Introductory Video"
              description="Drag and drop your introductory video or click to browse"
              icon={<Video className="h-10 w-10 text-gray-400 mb-2" />}
              acceptFiles="*"
              onFileUpload={(file) => handleFileUpload("video", file)}
            />

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
              
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSaveDraft}
                  className="group relative px-4 sm:px-6 py-3 sm:py-5 text-sm transition-all duration-300 overflow-hidden border-gray-300 hover:border-gray-800 hover:bg-white hover:text-gray-800"
                >
                  <span className="absolute inset-0 w-3 bg-gray-800/10 transition-all duration-500 ease-out group-hover:w-full"></span>
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
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
