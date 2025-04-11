import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Promoter, Document } from "@shared/schema";

/**
 * Interface for presentation template
 */
export interface PresentationTemplate {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  logoPosition: "top-left" | "top-center" | "top-right";
  layout: "modern" | "classic" | "minimal" | "premium" | "elegant" | "corporate";
  showBranding: boolean;
  brandName?: string;         // Custom brand name to display instead of "FOOTprint TALENT"
  fontFamily?: string;        // Custom font family for the template
  backgroundPattern?: string; // Name of the background pattern to use
  textureOverlay?: string;    // Texture overlay effect (e.g., "paper", "grain", "none")
  cornerStyle?: "rounded" | "sharp" | "fancy"; // Style for corners of elements
  photoFrameStyle?: "simple" | "shadow" | "border" | "polaroid"; // Style for photo frames
  premium?: boolean;          // Indicates this is a premium template
}

/**
 * Interface for presentation options
 */
interface PresentationOptions {
  includeContact?: boolean;
  includeExperience?: boolean;
  includeLanguages?: boolean;
  pageSize?: 'a4' | 'letter';
  orientation?: 'portrait' | 'landscape';
  template?: PresentationTemplate;
}

/**
 * Generates a PDF presentation for a promoter
 * 
 * @param promoter The promoter data
 * @param documents The promoter's documents
 * @param elementId The HTML element ID to capture
 * @param options Optional configuration for the presentation
 * @returns Promise resolving when PDF is created and downloaded
 */
export async function generatePromoterPDF(
  promoter: Promoter,
  documents: Document[],
  elementId: string = 'promoter-profile',
  options: PresentationOptions = {}
): Promise<void> {
  try {
    // Get the element
    const profileElement = document.getElementById(elementId);
    if (!profileElement) {
      throw new Error("Profile element not found");
    }
    
    // Default options
    const defaultOptions = {
      includeContact: true,
      includeExperience: true,
      includeLanguages: true,
      pageSize: 'a4' as const,
      orientation: 'portrait' as const
    };
    
    // Merge options
    const finalOptions = { ...defaultOptions, ...options };
    
    // Apply template if provided
    if (options.template) {
      const template = options.template;
      
      // Apply template properties to the element
      const templateStyles = document.createElement('style');
      templateStyles.innerHTML = `
        #${elementId} {
          --primary-color: ${template.primaryColor};
          --secondary-color: ${template.secondaryColor};
          --accent-color: ${template.accentColor};
          --logo-position: ${template.logoPosition};
          --layout-type: ${template.layout};
          ${template.fontFamily ? `--font-family: ${template.fontFamily};` : ''}
          ${template.backgroundPattern ? `--background-pattern: var(--pattern-${template.backgroundPattern});` : ''}
          ${template.textureOverlay ? `--texture-overlay: var(--texture-${template.textureOverlay});` : ''}
          ${template.cornerStyle ? `--corner-style: var(--corner-${template.cornerStyle});` : ''}
          ${template.photoFrameStyle ? `--photo-frame: var(--frame-${template.photoFrameStyle});` : ''}
          ${template.brandName ? `--brand-name: "${template.brandName}";` : ''}
        }
      `;
      document.head.appendChild(templateStyles);
      
      // Add template classes to the element
      profileElement.classList.add(`template-${template.layout}`);
      profileElement.classList.add(`logo-${template.logoPosition}`);
      
      if (template.showBranding) {
        profileElement.classList.add('show-branding');
      } else {
        profileElement.classList.remove('show-branding');
      }
      
      if (template.premium) {
        profileElement.classList.add('premium-template');
      }
      
      // Add specific style classes
      if (template.cornerStyle) {
        profileElement.classList.add(`corner-${template.cornerStyle}`);
      }
      
      if (template.photoFrameStyle) {
        profileElement.classList.add(`frame-${template.photoFrameStyle}`);
      }
      
      if (template.backgroundPattern) {
        profileElement.classList.add(`pattern-${template.backgroundPattern}`);
      }
      
      if (template.textureOverlay) {
        profileElement.classList.add(`texture-${template.textureOverlay}`);
      }
      
      // Clean up afterwards
      setTimeout(() => {
        document.head.removeChild(templateStyles);
      }, 1000);
    }
    
    // Create canvas from the element
    const canvas = await html2canvas(profileElement, {
      scale: 2,
      useCORS: true,
      logging: false,
      allowTaint: true,
    });
    
    // Convert canvas to PDF
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: finalOptions.orientation,
      unit: 'mm',
      format: finalOptions.pageSize,
    });
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const ratio = canvas.width / canvas.height;
    const imgWidth = pdfWidth;
    const imgHeight = imgWidth / ratio;
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    
    // Add footer with timestamp and template name if available
    const timestamp = new Date().toLocaleString();
    pdf.setFontSize(8);
    pdf.setTextColor(128, 128, 128);
    const templateName = options.template ? ` | Template: ${options.template.name}` : '';
    pdf.text(`Generated on: ${timestamp} | FOOTprint TALENT${templateName}`, 10, pdfHeight - 5);
    
    // Save the PDF
    pdf.save(`promoter-profile-${promoter.uniqueId}.pdf`);
    
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
}

/**
 * Share a promoter profile using the Web Share API if available
 * 
 * @param promoter The promoter to share
 * @param url The URL to share
 * @returns Promise resolving to success/failure of sharing
 */
export async function sharePromoterProfile(
  promoter: Promoter,
  url: string
): Promise<boolean> {
  try {
    if (!navigator.share) {
      throw new Error("Web Share API not supported");
    }
    
    await navigator.share({
      title: `Promoter Profile: ${promoter.firstName} ${promoter.lastName}`,
      text: `Check out this promoter profile for ${promoter.firstName} ${promoter.lastName}`,
      url: url,
    });
    
    return true;
  } catch (error) {
    console.error("Error sharing profile:", error);
    return false;
  }
}

/**
 * Get the nationality display name from code
 * 
 * @param code The nationality code
 * @returns Display name for the nationality
 */
export function getNationalityDisplay(code: string): string {
  const nationalityMap: Record<string, string> = {
    ae: "United Arab Emirates",
    us: "United States",
    uk: "United Kingdom",
    in: "India",
    ph: "Philippines",
    pk: "Pakistan",
    other: "Other"
  };
  
  return nationalityMap[code] || code;
}

/**
 * Get the area display name from code
 * 
 * @param code The area code
 * @returns Display name for the area
 */
export function getAreaDisplay(code: string): string {
  const areaMap: Record<string, string> = {
    dubai: "Dubai",
    "abu-dhabi": "Abu Dhabi",
    sharjah: "Sharjah",
    ajman: "Ajman",
    fujairah: "Fujairah",
    "ras-al-khaimah": "Ras Al Khaimah",
    "umm-al-quwain": "Umm Al Quwain",
    other: "Other"
  };
  
  return areaMap[code] || code;
}
