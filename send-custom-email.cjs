// Custom test script to send an email to a specific address
// Run this with: node send-custom-email.js

const sgMail = require('@sendgrid/mail');

async function sendCustomEmail() {
  if (!process.env.SENDGRID_API_KEY) {
    console.error('Error: SENDGRID_API_KEY environment variable is not set');
    process.exit(1);
  }

  if (!process.env.EMAIL_FROM) {
    console.error('Error: EMAIL_FROM environment variable is not set');
    process.exit(1);
  }

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  
  const senderEmail = process.env.EMAIL_FROM;
  // The recipient email address
  const recipientEmail = 'ahsanishfaq222277@gmail.com';
  
  console.log(`Sender email: ${senderEmail}`);
  console.log(`Recipient email: ${recipientEmail}`);

  const msg = {
    to: recipientEmail,
    from: {
      email: senderEmail,
      name: 'FOOTprint TALENT System'
    },
    subject: 'Testing FOOTprint TALENT Email Template',
    text: 'This is a test email from the FOOTprint TALENT application. At the top: Manan Harami',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 5px;">
        <h1 style="color: #4b0082; text-align: center;">Manan Harami</h1>
        <hr style="border: 0; height: 1px; background-image: linear-gradient(to right, rgba(75, 0, 130, 0), rgba(75, 0, 130, 0.75), rgba(75, 0, 130, 0));">
        
        <div style="background: linear-gradient(135deg, #8a2be2 0%, #4b0082 100%); padding: 20px; text-align: center; border-radius: 10px; margin: 20px 0;">
          <h2 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <span style="background: linear-gradient(to right, #ffffff, #f8d12f, #ffffff); -webkit-background-clip: text; background-clip: text; color: transparent;">FOOT</span><span style="color: #ffffff;">print</span>
            <span style="color: #f8d12f; font-weight: 300; letter-spacing: 2px;"> TALENT</span>
          </h2>
        </div>
        
        <h2 style="color: #4b0082; margin-top: 30px;">FOOTprint TALENT - Email Template Test</h2>
        <p>This is a test email sent at: ${new Date().toLocaleString()}</p>
        <p>This email demonstrates the styling and format of our confirmation emails. When you register as a promoter, you'll receive a similar but more detailed email with your unique ID and registration details.</p>
        
        <div style="background: linear-gradient(to right, rgba(138, 43, 226, 0.05), rgba(75, 0, 130, 0.05)); border-left: 4px solid #8a2be2; border-radius: 8px; padding: 20px; margin-top: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.03);">
          <h3 style="margin: 0 0 15px; color: #4b0082; font-size: 18px; font-weight: 600;">Sample Registration Details</h3>
          <p><strong style="color: #4b0082;">Unique ID:</strong> <span style="display: inline-block; background: linear-gradient(135deg, #8a2be2 0%, #4b0082 100%); color: white; padding: 5px 10px; border-radius: 4px; font-family: monospace; font-size: 14px; letter-spacing: 0.5px; box-shadow: 0 2px 5px rgba(75, 0, 130, 0.2);">PRO-2025-TEST</span></p>
          <p><strong style="color: #4b0082;">Status:</strong> <span style="display: inline-block; background: linear-gradient(to right, #FFD700, #FFC107); color: #4b0082; padding: 4px 8px; border-radius: 20px; font-size: 12px; font-weight: 700; box-shadow: 0 2px 5px rgba(255, 215, 0, 0.2);">Pending Review</span></p>
        </div>
        
        <div style="background-color: #f9f5ff; border-radius: 8px; padding: 20px; margin-top: 20px; position: relative; overflow: hidden; box-shadow: 0 3px 10px rgba(75, 0, 130, 0.05);">
          <h3 style="margin: 0 0 15px; color: #4b0082; font-size: 18px; font-weight: 600;">Our Email Features</h3>
          <ul style="margin: 0; padding: 0 0 0 20px; color: #555555; line-height: 1.7;">
            <li style="margin-bottom: 8px;"><span style="font-weight: 600; color: #4b0082;">Professional Design:</span> Clean, modern layouts for better readability</li>
            <li style="margin-bottom: 8px;"><span style="font-weight: 600; color: #4b0082;">Important Information:</span> Clearly highlighted key details</li>
            <li style="margin-bottom: 8px;"><span style="font-weight: 600; color: #4b0082;">Brand Consistency:</span> Matching the FOOTprint TALENT website experience</li>
          </ul>
        </div>
        
        <div style="background: linear-gradient(to right, #fff8e1, #fffde7); border-radius: 8px; border: 1px dashed #ffd54f; padding: 15px; margin-top: 20px; text-align: center;">
          <p style="margin: 0; font-style: italic; color: #7b6a34; line-height: 1.5; font-size: 15px;">⭐ This is an example of how we highlight important notes in our emails.</p>
        </div>
        
        <div style="margin-top: 30px; text-align: center;">
          <a href="http://localhost:5000" style="display: inline-block; background: linear-gradient(135deg, #8a2be2 0%, #4b0082 100%); color: white; padding: 12px 24px; border-radius: 5px; text-decoration: none; font-weight: 600; box-shadow: 0 4px 15px rgba(75, 0, 130, 0.3); text-transform: uppercase; letter-spacing: 1px; font-size: 14px;">
            VISIT WEBSITE
          </a>
        </div>
        
        <p style="font-size: 12px; color: #666; margin-top: 30px; text-align: center; padding-top: 20px; border-top: 1px solid #eee;">
          This is an automated test email from FOOTprint TALENT.<br>
          &copy; ${new Date().getFullYear()} FOOTprint TALENT. All rights reserved.
        </p>
      </div>
    `,
  };

  try {
    console.log('Attempting to send custom test email...');
    const response = await sgMail.send(msg);
    console.log('Email sent successfully:', response[0].statusCode);
    console.log('The email has been sent to ahsanishfaq222277@gmail.com with "Manan Harami" at the top.');
    console.log('Please check the inbox (and spam folder) to view the email template.');
  } catch (error) {
    console.error('Error sending test email:');
    console.error(error);
    
    if (error.response) {
      console.error('SendGrid API Error Details:');
      console.error('Status code:', error.response.statusCode);
      console.error('Body:', error.response.body);
      console.error('Headers:', error.response.headers);
    }
  }
}

sendCustomEmail();