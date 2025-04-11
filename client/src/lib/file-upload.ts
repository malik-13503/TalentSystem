/**
 * File upload utility functions
 */

/**
 * Converts a file to base64 encoding
 * 
 * @param file The file to convert
 * @returns Promise resolving to base64 string
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };
    
    reader.onerror = (error) => {
      reject(error);
    };
  });
}

/**
 * Validates file size is within limits
 * 
 * @param file The file to validate
 * @param maxSizeMB Maximum size in MB
 * @returns Boolean indicating if file is valid
 */
export function validateFileSize(file: File, maxSizeMB: number = 5): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
}

/**
 * Validates file type is in allowed types
 * 
 * @param file The file to validate
 * @param allowedTypes Array of allowed MIME types
 * @returns Boolean indicating if file type is valid
 */
export function validateFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.some(type => file.type.startsWith(type));
}

/**
 * Returns human-readable file size
 * 
 * @param bytes Size in bytes
 * @returns Formatted string with appropriate unit
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Gets allowed file types for each document type
 * 
 * @param documentType The type of document
 * @returns Array of allowed MIME types
 */
export function getAllowedFileTypes(documentType: string): string[] {
  switch (documentType) {
    case 'passport':
    case 'visa':
    case 'emiratesId':
      return ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    case 'photo':
      return ['image/jpeg', 'image/png', 'image/jpg'];
    case 'video':
      return ['video/mp4', 'video/quicktime', 'video/x-msvideo'];
    default:
      return ['image/jpeg', 'image/png', 'application/pdf'];
  }
}

/**
 * Gets max file size for each document type
 * 
 * @param documentType The type of document
 * @returns Maximum file size in MB
 */
export function getMaxFileSize(documentType: string): number {
  switch (documentType) {
    case 'video':
      return 100; // 100MB for videos
    case 'photo':
      return 10; // 10MB for photos
    default:
      return 5; // 5MB for documents
  }
}

/**
 * Validate if a document has valid expiry date
 * 
 * @param expiryDate The expiry date to validate
 * @returns Boolean indicating if expiry date is valid
 */
export function validateExpiryDate(expiryDate: string): boolean {
  if (!expiryDate) return false;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);
  
  return expiry >= today;
}
