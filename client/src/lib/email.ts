/**
 * Email utility functions for the application
 */

interface EmailTemplate {
  subject: string;
  body: string;
}

/**
 * Generates a confirmation email template for promoter registration
 * 
 * @param promoterName The name of the promoter
 * @param promoterId The unique ID assigned to the promoter
 * @returns Email template with subject and body
 */
export function generateConfirmationEmail(
  promoterName: string,
  promoterId: string
): EmailTemplate {
  const currentYear = new Date().getFullYear();
  const now = new Date();
  const dateFormatted = now.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  return {
    subject: "Registration Confirmation - Footprint Advertising Solutions LLC",
    body: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Barlow-Medium', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f9f9; color: #333333;">
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
                            <p style="margin: 5px 0 0; color: rgba(255, 255, 255, 0.8); font-size: 14px; font-weight: 300;">
                              Connecting exceptional talent with premier brands worldwide
                            </p>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- Confirmation Badge -->
                      <div style="display: inline-block; margin-top: 12px; background: rgba(255, 255, 255, 0.15); backdrop-filter: blur(5px); padding: 6px 16px; border-radius: 20px; border: 1px solid rgba(255, 255, 255, 0.3);">
                        <p style="margin: 0; color: #ffffff; font-size: 14px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase;">TALENT REGISTRATION CONFIRMATION</p>
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
              <div style="background: linear-gradient(to right, #44b700, #38a919); padding: 12px; text-align: center; position: relative; overflow: hidden;">
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
                    <h2 style="margin: 0 0 15px; color: #FF6713; font-size: 24px; font-weight: 600; border-bottom: 2px solid rgba(255, 103, 19, 0.2); padding-bottom: 8px;">
                      <span style="display: inline-block; position: relative;">
                        Hello ${promoterName},
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
                      <h3 style="margin: 0 0 15px; color: #FF6713; font-size: 18px; font-weight: 600;">Your Registration Details</h3>
                      <table width="100%" cellpadding="10" cellspacing="0" style="color: #555555; border-collapse: collapse;">
                        <tr style="border-bottom: 1px solid rgba(0,0,0,0.05);">
                          <td width="40%" style="font-weight: 600; color: #FF6713;">Unique ID:</td>
                          <td>
                            <div style="display: inline-block; background: linear-gradient(135deg, #FF6713 0%, #FF600A 100%); color: white; padding: 8px 15px; border-radius: 4px; font-family: monospace; font-size: 14px; letter-spacing: 0.5px; box-shadow: 0 2px 5px rgba(255, 103, 19, 0.2);">${promoterId}</div>
                          </td>
                        </tr>
                        <tr>
                          <td style="font-weight: 600; color: #FF6713;">Status:</td>
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
                    <div style="background-color: #fff5f0; border-radius: 8px; padding: 25px; position: relative; overflow: hidden; box-shadow: 0 3px 10px rgba(255, 103, 19, 0.05);">
                      <!-- Decorative Element -->
                      <div style="position: absolute; top: -15px; right: -15px; width: 80px; height: 80px; background: linear-gradient(135deg, rgba(255, 103, 19, 0.05), rgba(255, 96, 10, 0.05)); border-radius: 50%;"></div>
                      
                      <h3 style="margin: 0 0 15px; color: #FF6713; font-size: 18px; font-weight: 600; position: relative; z-index: 1;">What's Next?</h3>
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
                    
                    <p style="margin: 0 0 10px; color: rgba(255, 255, 255, 0.9); font-size: 14px;">Questions? Contact our support team at <a href="mailto:info@footprintadvertising.com" style="color: #262626; text-decoration: none; font-weight: bold;">info@footprintadvertising.com</a></p>
                    <p style="margin: 0; color: rgba(255, 255, 255, 0.7); font-size: 12px;">&copy; ${currentYear} Footprint Advertising Solutions LLC. All rights reserved.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `
  };
}

/**
 * Generates an admin notification email for new promoter registration
 * 
 * @param promoterName The name of the promoter
 * @param promoterId The unique ID assigned to the promoter
 * @returns Email template with subject and body
 */
export function generateAdminNotificationEmail(
  promoterName: string,
  promoterId: string
): EmailTemplate {
  const currentYear = new Date().getFullYear();
  const now = new Date();
  const dateFormatted = now.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit'
  });

  return {
    subject: "New Talent Registration - Footprint Advertising Solutions LLC",
    body: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Barlow-Medium', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f9f9; color: #333333;">
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
                            <p style="margin: 5px 0 0; color: rgba(255, 255, 255, 0.8); font-size: 14px; font-weight: 300;">
                              Connecting exceptional talent with premier brands worldwide
                            </p>
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
              <div style="background: linear-gradient(to right, #FFC107, #FF9800); padding: 12px; text-align: center; position: relative; overflow: hidden;">
                <div style="position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(to right, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0));"></div>
                <p style="margin: 0; color: #262626; font-size: 15px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">NEW TALENT REGISTRATION RECEIVED</p>
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
                    <h2 style="margin: 0 0 15px; color: #FF6713; font-size: 24px; font-weight: 600; border-bottom: 2px solid rgba(255, 103, 19, 0.2); padding-bottom: 8px;">
                      <span style="display: inline-block; position: relative;">
                        New Talent Registration Alert
                        <span style="position: absolute; bottom: -12px; left: 0; width: 50px; height: 3px; background: linear-gradient(to right, #FF6713, #FF600A);"></span>
                      </span>
                    </h2>
                    <p style="margin: 0; color: #555555; line-height: 1.6; font-size: 16px;">A new talent has registered with <strong style="color: #FF6713;">Footprint Advertising Solutions LLC</strong>. This registration requires your review and approval.</p>
                  </td>
                </tr>
                
                <!-- Registration Details -->
                <tr>
                  <td style="padding-bottom: 30px;">
                    <div style="background: linear-gradient(to right, rgba(255, 103, 19, 0.05), rgba(255, 96, 10, 0.05)); border-left: 4px solid #FF6713; border-radius: 8px; padding: 25px; box-shadow: 0 2px 10px rgba(0,0,0,0.03);">
                      <h3 style="margin: 0 0 15px; color: #FF6713; font-size: 18px; font-weight: 600;">Registration Details</h3>
                      
                      <table width="100%" cellpadding="12" cellspacing="0" style="color: #555555; border-collapse: collapse;">
                        <tr style="border-bottom: 1px solid rgba(0,0,0,0.05);">
                          <td width="30%" style="font-weight: 600; color: #FF6713;">Name:</td>
                          <td style="font-size: 15px;">${promoterName}</td>
                        </tr>
                        <tr style="border-bottom: 1px solid rgba(0,0,0,0.05);">
                          <td style="font-weight: 600; color: #FF6713;">Unique ID:</td>
                          <td>
                            <div style="display: inline-block; background: linear-gradient(135deg, #FF6713 0%, #FF600A 100%); color: white; padding: 8px 15px; border-radius: 4px; font-family: monospace; font-size: 14px; letter-spacing: 0.5px; box-shadow: 0 2px 5px rgba(255, 103, 19, 0.2);">${promoterId}</div>
                          </td>
                        </tr>
                        <tr>
                          <td style="font-weight: 600; color: #FF6713;">Status:</td>
                          <td>
                            <div style="display: inline-block; background: linear-gradient(to right, #FFD700, #FFC107); color: #262626; padding: 6px 12px; border-radius: 20px; font-size: 13px; font-weight: 700; box-shadow: 0 2px 5px rgba(255, 215, 0, 0.2);">Pending Review</div>
                          </td>
                        </tr>
                      </table>
                    </div>
                  </td>
                </tr>
                
                <!-- Action Required -->
                <tr>
                  <td style="padding-bottom: 30px;">
                    <div style="background-color: #fff5f0; border-radius: 8px; padding: 30px; text-align: center; position: relative; overflow: hidden; box-shadow: 0 3px 10px rgba(255, 103, 19, 0.05);">
                      <!-- Decorative Element -->
                      <div style="position: absolute; top: -15px; right: -15px; width: 80px; height: 80px; background: linear-gradient(135deg, rgba(255, 103, 19, 0.05), rgba(255, 96, 10, 0.05)); border-radius: 50%;"></div>
                      
                      <h3 style="margin: 0 0 15px; color: #FF6713; font-size: 20px; font-weight: 700;">Action Required</h3>
                      <p style="margin: 0 0 25px; color: #555555; line-height: 1.6;">Please review this registration in the admin dashboard. The talent has uploaded documents that require verification.</p>
                      
                      <div style="text-align: center;">
                        <a href="http://localhost:5000/dashboard" style="display: inline-block; background: linear-gradient(135deg, #FF6713 0%, #FF600A 100%); color: white; padding: 14px 28px; border-radius: 5px; text-decoration: none; font-weight: 600; box-shadow: 0 4px 15px rgba(255, 103, 19, 0.3); transition: all 0.3s; text-transform: uppercase; letter-spacing: 1px; font-size: 14px;">
                          VIEW IN DASHBOARD
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
    `
  };
}