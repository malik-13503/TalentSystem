const sgMail = require('@sendgrid/mail');
const fs = require('fs');
const path = require('path');

// Set SendGrid API key from environment variable
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// We need to manually create the email content since we can't directly import ES modules
function createTestConfirmationEmail() {
  const currentYear = new Date().getFullYear();
  const dateFormatted = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  return {
    subject: "Test Email - Footprint Advertising Solutions LLC",
    html: `
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
                        <p style="margin: 0; color: #ffffff; font-size: 14px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase;">TEST EMAIL</p>
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
                <p style="margin: 0; color: white; font-size: 15px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">EMAIL TEMPLATE TEST</p>
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
                        Hello Test User,
                        <span style="position: absolute; bottom: -12px; left: 0; width: 50px; height: 3px; background: linear-gradient(to right, #FF6713, #FF600A);"></span>
                      </span>
                    </h2>
                    <p style="margin: 0; color: #555555; line-height: 1.6; font-size: 16px;">This is a test email to verify the new branding for <strong style="color: #FF6713;">Footprint Advertising Solutions LLC</strong>. This email is being sent to test the updated email templates.</p>
                  </td>
                </tr>
                
                <!-- Test Content -->
                <tr>
                  <td style="padding-bottom: 30px;">
                    <div style="background: linear-gradient(to right, rgba(255, 103, 19, 0.05), rgba(255, 96, 10, 0.05)); border-left: 4px solid #FF6713; border-radius: 8px; padding: 25px; margin-bottom: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.03);">
                      <h3 style="margin: 0 0 15px; color: #FF6713; font-size: 18px; font-weight: 600;">Email Template Details</h3>
                      <ul style="margin: 0; padding: 0 0 0 20px; color: #555555; line-height: 1.7;">
                        <li style="margin-bottom: 10px;"><span style="font-weight: 600; color: #FF6713;">Updated Logo:</span> "Footprint Advertising Solutions LLC"</li>
                        <li style="margin-bottom: 10px;"><span style="font-weight: 600; color: #FF6713;">Brand Colors:</span> #FF6713, #FF600A, #262626</li>
                        <li style="margin-bottom: 10px;"><span style="font-weight: 600; color: #FF6713;">Fonts:</span> Barlow Medium and Barlow ExtraLight</li>
                      </ul>
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
                    <p style="margin: 0 0 10px; color: rgba(255, 255, 255, 0.9); font-size: 14px;">Questions? Contact our support team at <a href="mailto:info@footprinttalent.com" style="color: #262626; text-decoration: none; font-weight: bold;">info@footprinttalent.com</a></p>
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

// Send a test email
async function sendTestEmail() {
  try {
    // Generate email content
    const testEmail = createTestConfirmationEmail();
    
    // Set up email data
    const msg = {
      to: 'ahsanishfaq222277@gmail.com', // User's email address
      from: 'ahsanglobalbusiness@gmail.com', // Verified SendGrid sender
      subject: testEmail.subject,
      html: testEmail.html,
    };
    
    // Log configuration info 
    console.log('SendGrid Configuration:');
    console.log('- API Key set:', !!process.env.SENDGRID_API_KEY);
    console.log('- API Key length:', process.env.SENDGRID_API_KEY ? process.env.SENDGRID_API_KEY.length : 0);
    console.log('- EMAIL_FROM set:', !!process.env.EMAIL_FROM);
    console.log('- EMAIL_FROM value used:', msg.from);
    console.log('- Recipient:', msg.to);
    
    // Send the email
    console.log('Sending test email...');
    const response = await sgMail.send(msg);
    console.log('SendGrid Response:', JSON.stringify(response, null, 2));
    console.log('Test email sent successfully to the recipient!');
  } catch (error) {
    console.error('Error sending test email:', error);
    
    // More detailed error logging
    if (error.response) {
      console.error('SendGrid API Response Error:');
      console.error('Status code:', error.response.statusCode);
      console.error('Body:', JSON.stringify(error.response.body, null, 2));
      console.error('Headers:', JSON.stringify(error.response.headers, null, 2));
    } else {
      console.error('Unknown error type:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    // Check SendGrid configuration
    console.log('SendGrid API Key set:', !!process.env.SENDGRID_API_KEY);
    console.log('SendGrid API Key length:', process.env.SENDGRID_API_KEY ? process.env.SENDGRID_API_KEY.length : 0);
    console.log('EMAIL_FROM set:', !!process.env.EMAIL_FROM);
    console.log('EMAIL_FROM value:', process.env.EMAIL_FROM || 'ahsanglobalbusiness@gmail.com');
  }
}

// Execute the function
sendTestEmail();