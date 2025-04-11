import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertUserSchema, 
  insertPromoterSchema, 
  insertDocumentSchema,
  registrationFormSchema,
  personalInfoSchema,
  professionalDetailsSchema,
  documentSchema
} from "@shared/schema";
import sgMail from "@sendgrid/mail";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  const apiRouter = app.route('/api');
  
  // User routes
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
      }
      
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      return res.status(200).json({ 
        id: user.id,
        username: user.username,
        role: user.role
      });
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // Promoter routes
  app.get('/api/talents', async (req, res) => {
    try {
      const search = req.query.search as string;
      const nationality = req.query.nationality as string;
      const area = req.query.area as string;
      const experience = req.query.experience as string;
      const status = req.query.status as string;
      const gender = req.query.gender as string;
      const height = req.query.height as string;
      const ageRange = req.query.ageRange as string;
      
      let promoters = await storage.getAllPromoters();
      
      // Apply search filter if provided
      if (search) {
        promoters = await storage.searchPromoters(search);
      }
      
      // Apply additional filters
      if (nationality && nationality !== 'all') {
        promoters = promoters.filter(p => p.nationality === nationality);
      }
      
      if (area && area !== 'all') {
        promoters = promoters.filter(p => p.area === area);
      }
      
      if (experience && experience !== 'all') {
        const years = parseInt(experience);
        if (!isNaN(years)) {
          promoters = promoters.filter(p => p.yearsExperience && p.yearsExperience >= years);
        }
      }
      
      if (status && status !== 'all') {
        promoters = promoters.filter(p => p.status === status);
      }
      
      if (gender && gender !== 'all') {
        promoters = promoters.filter(p => p.gender.toLowerCase() === gender);
      }
      
      if (height && height !== 'all') {
        if (height.includes('-')) {
          // Handle range format like "140-150"
          const [min, max] = height.split('-').map(h => parseInt(h));
          if (!isNaN(min) && !isNaN(max)) {
            promoters = promoters.filter(p => p.height && p.height >= min && p.height <= max);
          }
        } else if (height.endsWith('+')) {
          // Handle format like "191+"
          const min = parseInt(height.replace('+', ''));
          if (!isNaN(min)) {
            promoters = promoters.filter(p => p.height && p.height >= min);
          }
        }
      }
      
      if (ageRange && ageRange !== 'all') {
        // Calculate age based on birth date
        const calculateAge = (birthDateStr: string) => {
          const today = new Date();
          const birthDate = new Date(birthDateStr);
          let age = today.getFullYear() - birthDate.getFullYear();
          const m = today.getMonth() - birthDate.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
          }
          return age;
        };
        
        if (ageRange.includes('-')) {
          // Handle range format like "18-25"
          const [minAge, maxAge] = ageRange.split('-').map(a => parseInt(a));
          if (!isNaN(minAge) && !isNaN(maxAge)) {
            promoters = promoters.filter(p => {
              if (!p.dateOfBirth) return false;
              const age = calculateAge(p.dateOfBirth);
              return age >= minAge && age <= maxAge;
            });
          }
        } else if (ageRange.endsWith('+')) {
          // Handle format like "41+"
          const minAge = parseInt(ageRange.replace('+', ''));
          if (!isNaN(minAge)) {
            promoters = promoters.filter(p => {
              if (!p.dateOfBirth) return false;
              const age = calculateAge(p.dateOfBirth);
              return age >= minAge;
            });
          }
        }
      }
      
      return res.status(200).json(promoters);
    } catch (error) {
      console.error('Get promoters error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  app.get('/api/talents/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid promoter ID' });
      }
      
      const promoter = await storage.getPromoter(id);
      if (!promoter) {
        return res.status(404).json({ message: 'Promoter not found' });
      }
      
      return res.status(200).json(promoter);
    } catch (error) {
      console.error('Get promoter error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // Delete promoter endpoint
  app.delete('/api/talents/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid promoter ID' });
      }
      
      // Check if promoter exists first
      const promoter = await storage.getPromoter(id);
      if (!promoter) {
        return res.status(404).json({ message: 'Promoter not found' });
      }
      
      // Delete promoter and their documents
      const success = await storage.deletePromoter(id);
      
      if (success) {
        return res.status(200).json({ 
          message: 'Promoter deleted successfully',
          success: true,
          promoterId: id
        });
      } else {
        return res.status(500).json({ 
          message: 'Failed to delete promoter',
          success: false
        });
      }
    } catch (error) {
      console.error('Delete promoter error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // Test email route (temporary)
  app.get('/api/test-email/:email', async (req, res) => {
    try {
      const email = req.params.email;
      
      // Create a sample promoter object with test data
      const samplePromoter = {
        id: 9999,
        uniqueId: "PRO-2025-TEST",
        firstName: "Test",
        lastName: "User",
        email: email,
        gender: "Female",
        dateOfBirth: "1990-01-01",
        mobile: "+971501234567",
        nationality: "FR",
        area: "Dubai Marina",
        yearsExperience: 5,
        height: 175,
        waist: 70,
        chest: 90,
        hips: 95,
        shoeSize: 39,
        dressSize: "M",
        hairColor: "Brown",
        eyeColor: "Blue",
        languages: ["English", "French"],
        previousBrands: "Nike, Adidas, Puma",
        status: "pending",
        createdAt: new Date()
      };
      
      // Send both email types
      try {
        // Send confirmation email
        const confirmationResult = await sendConfirmationEmail(samplePromoter);
        console.log('Test confirmation email sent:', confirmationResult ? 'Success' : 'Failed');
        
        // Send admin notification
        const adminResult = await sendAdminNotificationEmail(samplePromoter);
        console.log('Test admin email sent:', adminResult ? 'Success' : 'Failed');
        
        return res.status(200).json({ 
          message: 'Test emails sent successfully. Please check your inbox for both the confirmation and admin notification emails.',
          success: true
        });
      } catch (error: any) {
        console.error('Test email sending error:', error);
        return res.status(500).json({ 
          message: 'Error sending test emails', 
          error: error.message 
        });
      }
    } catch (error: any) {
      console.error('Test route error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Document routes
  app.get('/api/talents/:promoterId/documents', async (req, res) => {
    try {
      const promoterId = parseInt(req.params.promoterId);
      if (isNaN(promoterId)) {
        return res.status(400).json({ message: 'Invalid promoter ID' });
      }
      
      const documents = await storage.getDocumentsByPromoterId(promoterId);
      
      // Process each document to ensure fileData is properly formatted
      for (let doc of documents) {
        if (doc.fileData) {
          // Make sure fileData is a valid base64 string, remove any prefix if present
          if (doc.fileData.includes(',')) {
            const parts = doc.fileData.split(',');
            doc.fileData = parts[parts.length - 1];
          }
          
          // Log the first 100 characters of fileData for debugging
          console.log(`Document ${doc.id} fileData prefix: ${doc.fileData.substring(0, 100)}`);
        } else {
          console.log(`Document ${doc.id} has no fileData`);
        }
      }
      
      return res.status(200).json(documents);
    } catch (error) {
      console.error('Get documents error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  app.get('/api/documents/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid document ID' });
      }
      
      const document = await storage.getDocument(id);
      if (!document) {
        return res.status(404).json({ message: 'Document not found' });
      }
      
      return res.status(200).json(document);
    } catch (error) {
      console.error('Get document error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // Registration route
  app.post('/api/register', async (req, res) => {
    try {
      // Validate the registration data
      const validationResult = registrationFormSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: 'Invalid registration data',
          errors: validationResult.error.format() 
        });
      }
      
      // Register the promoter
      const promoter = await storage.registerPromoter(validationResult.data);
      
      // Send confirmation email to the promoter (only if email credentials are available)
      try {
        // Validate email format before attempting to send
        if (promoter.email && promoter.email.includes('@')) {
          // Log detailed information for troubleshooting
          console.log('Attempting to send confirmation email to:', promoter.email);
          
          const emailResult = await sendConfirmationEmail(promoter);
          console.log('Confirmation email sending attempt completed:', emailResult ? 'Success' : 'Failed');
          
          // Send notification email to admin
          const adminEmailResult = await sendAdminNotificationEmail(promoter);
          console.log('Admin notification email sending attempt completed:', adminEmailResult ? 'Success' : 'Failed');
        } else {
          console.error('Invalid email format detected:', promoter.email);
          console.log('Skipping email sending due to invalid email format');
        }
      } catch (error: any) {
        console.log('Email sending error caught in registration route:', error.message || 'Unknown error');
        console.log('Email sending skipped or failed, but registration was successful');
      }
      
      return res.status(201).json({
        message: 'Registration completed successfully',
        promoter
      });
    } catch (error: any) {
      console.error('Registration error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // Initialize SendGrid with API key
  if (process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    console.log('SendGrid initialized successfully');
  } else {
    console.warn('SENDGRID_API_KEY is not set, email functionality will be disabled');
  }
  
  // Email sending functions using SendGrid
  async function sendConfirmationEmail(promoter: any) {
    if (!process.env.SENDGRID_API_KEY) {
      throw new Error('SendGrid API key not configured');
    }
    
    try {
      // Validate email format
      if (!promoter.email || !promoter.email.includes('@')) {
        console.error('Invalid email format:', promoter.email);
        throw new Error('Invalid email format');
      }

      console.log('Sending confirmation email to:', promoter.email);
      
      const currentYear = new Date().getFullYear();
      const now = new Date();
      const dateFormatted = now.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric'
      });
      
      const fullName = `${promoter.firstName} ${promoter.lastName}`;
      
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f9f9; color: #333333;">
          <table cellpadding="0" cellspacing="0" width="100%" style="max-width: 650px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05); border-radius: 10px; overflow: hidden;">
            <!-- Header with Logo -->
            <tr>
              <td>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding: 0;">
                      <div style="background: linear-gradient(135deg, #8a2be2 0%, #4b0082 100%); padding: 35px 20px; text-align: center; border-radius: 0 0 30% 30%/40px; position: relative; overflow: hidden;">
                        <!-- Decorative Elements -->
                        <div style="position: absolute; top: -20px; right: -20px; width: 150px; height: 150px; background: rgba(255, 255, 255, 0.1); border-radius: 50%;"></div>
                        <div style="position: absolute; bottom: -40px; left: -40px; width: 200px; height: 200px; background: rgba(255, 255, 255, 0.05); border-radius: 50%;"></div>
                        <div style="position: absolute; top: 30px; left: 30px; width: 20px; height: 20px; background: rgba(255, 255, 255, 0.2); border-radius: 50%;"></div>
                        <div style="position: absolute; top: 50px; right: 50px; width: 15px; height: 15px; background: rgba(255, 255, 255, 0.15); border-radius: 50%;"></div>
                        
                        <!-- Logo Text with Shimmer Effect -->
                        <div style="position: relative; display: inline-block;">
                          <h1 style="margin: 0; color: #ffffff; font-size: 36px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                            <span style="background: linear-gradient(to right, #ffffff, #f8d12f, #ffffff); -webkit-background-clip: text; background-clip: text; color: transparent;">FOOT</span><span style="color: #ffffff;">print</span>
                            <span style="color: #f8d12f; font-weight: 300; letter-spacing: 2px;"> TALENT</span>
                          </h1>
                        </div>
                        
                        <!-- Confirmation Badge -->
                        <div style="display: inline-block; margin-top: 12px; background: rgba(255, 255, 255, 0.15); backdrop-filter: blur(5px); padding: 6px 16px; border-radius: 20px; border: 1px solid rgba(255, 255, 255, 0.3);">
                          <p style="margin: 0; color: #ffffff; font-size: 14px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase;">REGISTRATION CONFIRMATION</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            
            <!-- Success Banner -->
            <tr>
              <td>
                <div style="background: linear-gradient(to right, #FF6713, #FF600A); padding: 12px; text-align: center; position: relative; overflow: hidden;">
                  <div style="position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(to right, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0));"></div>
                  <p style="margin: 0; color: white; font-size: 15px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">REGISTRATION SUCCESSFUL</p>
                  <div style="position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: linear-gradient(to right, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0));"></div>
                </div>
              </td>
            </tr>
            
            <!-- Registration Date -->
            <tr>
              <td>
                <div style="background-color: #f0f0f0; padding: 8px 15px; text-align: right; font-size: 12px; color: #666;">
                  <p style="margin: 0;">Registration Date: ${dateFormatted}</p>
                </div>
              </td>
            </tr>
            
            <!-- Main Content -->
            <tr>
              <td style="padding: 40px 30px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <!-- Greeting -->
                  <tr>
                    <td style="padding-bottom: 30px;">
                      <h2 style="margin: 0 0 15px; color: #262626; font-size: 24px; font-weight: 600; border-bottom: 2px solid rgba(138, 43, 226, 0.2); padding-bottom: 8px;">
                        <span style="display: inline-block; position: relative;">
                          Hello ${fullName},
                          <span style="position: absolute; bottom: -12px; left: 0; width: 50px; height: 3px; background: linear-gradient(to right, #FF6713, #FF600A);"></span>
                        </span>
                      </h2>
                      <p style="margin: 0; color: #555555; line-height: 1.6; font-size: 16px;">Thank you for registering with <strong style="color: #FF6713;">Footprint Advertising Solutions LLC</strong>. Your profile has been successfully created and is now being processed by our talent management team.</p>
                    </td>
                  </tr>
                  
                  <!-- Registration Details -->
                  <tr>
                    <td style="padding-bottom: 30px;">
                      <div style="background: linear-gradient(to right, rgba(255, 103, 19, 0.05), rgba(255, 96, 10, 0.05)); border-left: 4px solid #FF6713; border-radius: 8px; padding: 25px; margin-bottom: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.03);">
                        <h3 style="margin: 0 0 15px; color: #262626; font-size: 18px; font-weight: 600;">Your Registration Details</h3>
                        <table width="100%" cellpadding="10" cellspacing="0" style="color: #555555; border-collapse: collapse;">
                          <tr style="border-bottom: 1px solid rgba(0,0,0,0.05);">
                            <td width="40%" style="font-weight: 600; color: #262626;">Unique ID:</td>
                            <td>
                              <div style="display: inline-block; background: linear-gradient(135deg, #FF6713 0%, #FF600A 100%); color: white; padding: 8px 15px; border-radius: 4px; font-family: monospace; font-size: 14px; letter-spacing: 0.5px; box-shadow: 0 2px 5px rgba(255, 103, 19, 0.2);">${promoter.uniqueId}</div>
                            </td>
                          </tr>
                          <tr>
                            <td style="font-weight: 600; color: #262626;">Status:</td>
                            <td>
                              <div style="display: inline-block; background: linear-gradient(to right, #FFD700, #FFC107); color: #262626; padding: 6px 12px; border-radius: 20px; font-size: 13px; font-weight: 700; box-shadow: 0 2px 5px rgba(255, 215, 0, 0.2);">Pending Review</div>
                            </td>
                          </tr>
                        </table>
                      </div>
                    </td>
                  </tr>
                  
                  <!-- What's Next -->
                  <tr>
                    <td style="padding-bottom: 30px;">
                      <div style="background-color: #FFF5F0; border-radius: 8px; padding: 25px; position: relative; overflow: hidden; box-shadow: 0 3px 10px rgba(255, 103, 19, 0.05);">
                        <!-- Decorative Element -->
                        <div style="position: absolute; top: -15px; right: -15px; width: 80px; height: 80px; background: linear-gradient(135deg, rgba(255, 103, 19, 0.05), rgba(255, 96, 10, 0.05)); border-radius: 50%;"></div>
                        
                        <h3 style="margin: 0 0 15px; color: #262626; font-size: 18px; font-weight: 600; position: relative; z-index: 1;">What's Next?</h3>
                        <ul style="margin: 0; padding: 0 0 0 20px; color: #555555; line-height: 1.7; position: relative; z-index: 1;">
                          <li style="margin-bottom: 10px;"><span style="font-weight: 600; color: #FF6713;">Document Review:</span> Our team will validate all your submitted documents.</li>
                          <li style="margin-bottom: 10px;"><span style="font-weight: 600; color: #FF6713;">Profile Verification:</span> Your professional details will be verified by our talent specialists.</li>
                          <li style="margin-bottom: 10px;"><span style="font-weight: 600; color: #FF6713;">Activation:</span> Once approved, your profile will be activated and available for promotional opportunities.</li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                  
                  <!-- Important Note -->
                  <tr>
                    <td style="padding-bottom: 20px;">
                      <div style="background: linear-gradient(to right, #fff8e1, #fffde7); border-radius: 8px; border: 1px dashed #ffd54f; padding: 15px; text-align: center;">
                        <p style="margin: 0; font-style: italic; color: #7b6a34; line-height: 1.5; font-size: 15px;">⭐ Please save your Unique ID for future reference. You'll need it when communicating with our team.</p>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            
            <!-- Footer -->
            <tr>
              <td>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="background: linear-gradient(135deg, #FF6713 0%, #FF600A 100%); padding: 25px; text-align: center; position: relative; overflow: hidden;">
                      <!-- Decorative Elements -->
                      <div style="position: absolute; bottom: -15px; right: -15px; width: 80px; height: 80px; background: rgba(255, 255, 255, 0.05); border-radius: 50%;"></div>
                      <div style="position: absolute; top: -20px; left: -20px; width: 100px; height: 100px; background: rgba(255, 255, 255, 0.03); border-radius: 50%;"></div>
                      
                      <p style="margin: 0 0 10px; color: rgba(255, 255, 255, 0.9); font-size: 14px;">Questions? Contact our support team at <a href="mailto:info@footprinttalent.com" style="color: #f8d12f; text-decoration: none; font-weight: bold;">support@footprinttalent.com</a></p>
                      <p style="margin: 0; color: rgba(255, 255, 255, 0.7); font-size: 12px;">&copy; ${currentYear} Footprint Advertising Solutions LLC. All rights reserved.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `;
      
      // Use a verified sender email for SendGrid (this is crucial)
      // We need to use an email that's been verified with SendGrid to avoid 403 errors
      const defaultSenderEmail = 'ahsanglobalbusiness@gmail.com';
      // Try to use EMAIL_FROM environment variable if set, otherwise use the default
      const senderEmail = process.env.EMAIL_FROM || defaultSenderEmail;
      
      console.log('Using sender email:', senderEmail);
      
      const msg = {
        to: promoter.email, // Send to the promoter's email address
        from: {
          email: senderEmail,
          name: 'Footprint Advertising Solutions LLC'
        },
        subject: 'Registration Confirmation - Footprint Advertising Solutions LLC',
        text: `Hello ${fullName}, Thank you for registering with Footprint Advertising Solutions LLC. Your registration has been received and is being processed. Your Unique ID is: ${promoter.uniqueId}`,
        html: htmlContent,
      };
      
      const response = await sgMail.send(msg);
      console.log('Email sent successfully', response[0].statusCode);
      return response;
    } catch (error: any) {
      console.error('SendGrid email sending error:', error);
      
      // Add more detailed error logging
      if (error.response) {
        console.error('SendGrid API Error Details:');
        console.error('Status code:', error.response.statusCode);
        console.error('Error body:', error.response.body);
        console.error('Error headers:', error.response.headers);
      }
      
      // Log but don't fail the registration process
      console.log('Email sending failed, but registration was successful');
      return null;
    }
  }

  // Admin notification email function
  async function sendAdminNotificationEmail(promoter: any) {
    if (!process.env.SENDGRID_API_KEY) {
      throw new Error('SendGrid API key not configured');
    }
    
    try {
      // Make sure we have a valid admin email
      if (!process.env.EMAIL_FROM) {
        console.error('EMAIL_FROM environment variable not set. Cannot send admin notification.');
        throw new Error('Admin email not configured');
      }
      
      console.log('Sending admin notification email');
      
      const currentYear = new Date().getFullYear();
      const now = new Date();
      const dateFormatted = now.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit'
      });
      
      const fullName = `${promoter.firstName} ${promoter.lastName}`;
      
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f9f9; color: #333333;">
          <table cellpadding="0" cellspacing="0" width="100%" style="max-width: 650px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05); border-radius: 10px; overflow: hidden;">
            <!-- Header with Logo -->
            <tr>
              <td>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding: 0;">
                      <div style="background: linear-gradient(to right, #262626, #262626); padding: 30px 20px; text-align: center; position: relative; overflow: hidden;">
                        <!-- Background pattern for header -->
                        <div style="position: absolute; inset: 0; background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB4PSIwIiB5PSIwIiB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InNrZXdYKDIwKSI+PHBhdGggZD0iTTAgMCBMNjAgNjAgTTYwIDAgTDAgNjAiIHN0cm9rZT0iI0ZGNjcxMyIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjcGF0dGVybikiLz48L3N2Zz4='); opacity: 0.4;"></div>
                        
                        <!-- Decorative elements -->
                        <div style="position: absolute; top: 0; right: 0; height: 32px; width: 32px; background: linear-gradient(to bottom-left, rgba(255, 103, 19, 0.1), transparent); border-bottom-left-radius: 100%; filter: blur(10px);"></div>
                        <div style="position: absolute; bottom: 0; left: 0; height: 24px; width: 24px; background: linear-gradient(to top-right, rgba(255, 103, 19, 0.1), transparent); border-top-right-radius: 100%; filter: blur(10px);"></div>
                        
                        <!-- Main Logo and Text Area -->
                        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 500px; margin: 0 auto;">
                          <tr>
                            <td style="width: 70px; padding-right: 15px; vertical-align: middle;">
                              <!-- Logo Container -->
                              <div style="background: rgba(255, 103, 19, 0.1); padding: 10px; border-radius: 12px; display: inline-block;">
                                <!-- FA Logo Circle -->
                                <div style="width: 48px; height: 48px; background-color: #FF6713; border-radius: 50%; color: white; font-weight: bold; font-size: 20px; text-align: center; line-height: 48px;">
                                  FA
                                </div>
                              </div>
                            </td>
                            <td style="vertical-align: middle; text-align: left;">
                              <!-- Company Name -->
                              <h1 style="margin: 0; font-size: 28px; font-weight: 500; line-height: 1.2; letter-spacing: 0.5px;">
                                <span style="color: #FFFFFF;">Footprint</span>
                                <span style="color: #FF6713;"> Advertising</span>
                                <span style="color: #FFFFFF;"> Solutions</span>
                                <span style="color: #FF6713;"> LLC</span>
                              </h1>
                            </td>
                          </tr>
                        </table>
                        
                        <!-- Admin Badge -->
                        <div style="display: inline-block; margin-top: 12px; background: rgba(255, 255, 255, 0.15); backdrop-filter: blur(5px); padding: 6px 16px; border-radius: 20px; border: 1px solid rgba(255, 255, 255, 0.3);">
                          <p style="margin: 0; color: #ffffff; font-size: 14px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase;">ADMIN NOTIFICATION</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            
            <!-- Alert Banner -->
            <tr>
              <td>
                <div style="background: linear-gradient(to right, #FF6713, #FF600A); padding: 12px; text-align: center; position: relative; overflow: hidden;">
                  <div style="position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(to right, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0));"></div>
                  <p style="margin: 0; color: white; font-size: 15px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">NEW TALENT REGISTRATION RECEIVED</p>
                  <div style="position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: linear-gradient(to right, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0));"></div>
                </div>
              </td>
            </tr>
            
            <!-- Timestamp -->
            <tr>
              <td>
                <div style="background-color: #f0f0f0; padding: 8px 15px; text-align: right; font-size: 12px; color: #666;">
                  <p style="margin: 0;">Received: ${dateFormatted}</p>
                </div>
              </td>
            </tr>
            
            <!-- Main Content -->
            <tr>
              <td style="padding: 40px 30px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <!-- Greeting -->
                  <tr>
                    <td style="padding-bottom: 25px;">
                      <h2 style="margin: 0 0 15px; color: #262626; font-size: 24px; font-weight: 600; border-bottom: 2px solid rgba(138, 43, 226, 0.2); padding-bottom: 8px;">
                        <span style="display: inline-block; position: relative;">
                          New Talent Registration Alert
                          <span style="position: absolute; bottom: -12px; left: 0; width: 50px; height: 3px; background: linear-gradient(to right, #8a2be2, #4b0082);"></span>
                        </span>
                      </h2>
                      <p style="margin: 0; color: #555555; line-height: 1.6; font-size: 16px;">A new talent has registered with <strong style="color: #FF6713;">Footprint Advertising Solutions LLC</strong>. This registration requires your review and approval.</p>
                    </td>
                  </tr>
                  
                  <!-- Registration Details -->
                  <tr>
                    <td style="padding-bottom: 30px;">
                      <div style="background: linear-gradient(to right, rgba(138, 43, 226, 0.05), rgba(75, 0, 130, 0.05)); border-left: 4px solid #FF6713; border-radius: 8px; padding: 25px; box-shadow: 0 2px 10px rgba(0,0,0,0.03);">
                        <h3 style="margin: 0 0 15px; color: #262626; font-size: 18px; font-weight: 600;">Registration Details</h3>
                        
                        <table width="100%" cellpadding="12" cellspacing="0" style="color: #555555; border-collapse: collapse;">
                          <tr style="border-bottom: 1px solid rgba(0,0,0,0.05);">
                            <td width="30%" style="font-weight: 600; color: #262626;">Name:</td>
                            <td style="font-size: 15px;">${fullName}</td>
                          </tr>
                          <tr style="border-bottom: 1px solid rgba(0,0,0,0.05);">
                            <td style="font-weight: 600; color: #262626;">Unique ID:</td>
                            <td>
                              <div style="display: inline-block; background: linear-gradient(135deg, #FF6713 0%, #FF600A 100%); color: white; padding: 8px 15px; border-radius: 4px; font-family: monospace; font-size: 14px; letter-spacing: 0.5px; box-shadow: 0 2px 5px rgba(255, 103, 19, 0.2);">${promoter.uniqueId}</div>
                            </td>
                          </tr>
                          <tr style="border-bottom: 1px solid rgba(0,0,0,0.05);">
                            <td style="font-weight: 600; color: #262626;">Email:</td>
                            <td style="font-size: 15px;">${promoter.email}</td>
                          </tr>
                          <tr>
                            <td style="font-weight: 600; color: #262626;">Status:</td>
                            <td>
                              <div style="display: inline-block; background: linear-gradient(to right, #FFD700, #FFC107); color: #4b0082; padding: 6px 12px; border-radius: 20px; font-size: 13px; font-weight: 700; box-shadow: 0 2px 5px rgba(255, 215, 0, 0.2);">Pending Review</div>
                            </td>
                          </tr>
                        </table>
                      </div>
                    </td>
                  </tr>
                  
                  <!-- Action Required -->
                  <tr>
                    <td style="padding-bottom: 30px;">
                      <div style="background-color: #f9f5ff; border-radius: 8px; padding: 30px; text-align: center; position: relative; overflow: hidden; box-shadow: 0 3px 10px rgba(75, 0, 130, 0.05);">
                        <!-- Decorative Element -->
                        <div style="position: absolute; top: -15px; right: -15px; width: 80px; height: 80px; background: linear-gradient(135deg, rgba(255, 103, 19, 0.05), rgba(255, 96, 10, 0.05)); border-radius: 50%;"></div>
                        
                        <h3 style="margin: 0 0 15px; color: #262626; font-size: 20px; font-weight: 700;">Action Required</h3>
                        <p style="margin: 0 0 25px; color: #555555; line-height: 1.6;">Please review this registration in the admin dashboard. The talent has uploaded documents that require verification.</p>
                        
                        <div style="text-align: center;">
                          <a href="http://localhost:5000/dashboard" style="display: inline-block; background: linear-gradient(135deg, #8a2be2 0%, #4b0082 100%); color: white; padding: 14px 28px; border-radius: 5px; text-decoration: none; font-weight: 600; box-shadow: 0 4px 15px rgba(255, 103, 19, 0.3); transition: all 0.3s; text-transform: uppercase; letter-spacing: 1px; font-size: 14px;">
                            <span style="display: flex; align-items: center; justify-content: center; gap: 8px;">
                              VIEW IN DASHBOARD
                            </span>
                          </a>
                        </div>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            
            <!-- Footer -->
            <tr>
              <td>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="background: linear-gradient(135deg, #FF6713 0%, #FF600A 100%); padding: 25px; text-align: center; position: relative; overflow: hidden;">
                      <!-- Decorative Elements -->
                      <div style="position: absolute; bottom: -15px; right: -15px; width: 80px; height: 80px; background: rgba(255, 255, 255, 0.05); border-radius: 50%;"></div>
                      <div style="position: absolute; top: -20px; left: -20px; width: 100px; height: 100px; background: rgba(255, 255, 255, 0.03); border-radius: 50%;"></div>
                      
                      <p style="margin: 0 0 10px; color: rgba(255, 255, 255, 0.9); font-size: 14px;">This is an automated message from the Footprint Advertising Solutions LLC system.</p>
                      <p style="margin: 0; color: rgba(255, 255, 255, 0.7); font-size: 12px;">&copy; ${currentYear} Footprint Advertising Solutions LLC. All rights reserved.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `;
      
      // Use a verified sender email for SendGrid (this is crucial)
      const defaultSenderEmail = 'ahsanglobalbusiness@gmail.com';
      const senderEmail = process.env.EMAIL_FROM || defaultSenderEmail;
      
      // Get admin email - in a real application this would be from a config or database
      // For this example, we're using the same email which could be the "From" address
      // In production, this should be changed to the actual admin email(s)
      const adminEmail = process.env.EMAIL_FROM || 'ahsanglobalbusiness@gmail.com';
      
      const msg = {
        to: adminEmail, 
        from: {
          email: senderEmail,
          name: 'Footprint Advertising Solutions LLC Admin'
        },
        subject: 'New Talent Registration - Footprint Advertising Solutions LLC',
        text: `A new talent has registered: ${fullName} (${promoter.uniqueId}). Please log in to review their details.`,
        html: htmlContent,
      };
      
      const response = await sgMail.send(msg);
      console.log('Admin notification email sent successfully', response[0].statusCode);
      return response;
    } catch (error: any) {
      console.error('SendGrid admin email sending error:', error);
      
      // Add more detailed error logging
      if (error.response) {
        console.error('SendGrid API Error Details:');
        console.error('Status code:', error.response.statusCode);
        console.error('Error body:', error.response.body);
        console.error('Error headers:', error.response.headers);
      }
      
      // Log but don't fail the registration process
      console.log('Admin notification email sending failed, but registration process continues');
      return null;
    }
  }

  const httpServer = createServer(app);
  return httpServer;
}
