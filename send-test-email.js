const sgMail = require('@sendgrid/mail');
const { generateConfirmationEmail, generateAdminNotificationEmail } = require('./client/src/lib/email');

// Set SendGrid API key from environment variable
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Create a test email using our email template
async function sendTestEmail() {
  try {
    // Generate email content using our templates
    const testConfirmationEmail = generateConfirmationEmail('Test User', 'TAL-2025-1234');
    const testAdminEmail = generateAdminNotificationEmail('Test User', 'TAL-2025-1234');
    
    // Set up email data for confirmation email
    const confirmationMsg = {
      to: 'ahsanishfaq222277@gmail.com', // Sending to the specified email
      from: process.env.EMAIL_FROM || 'ahsanglobalbusiness@gmail.com',
      subject: testConfirmationEmail.subject,
      html: testConfirmationEmail.body,
    };
    
    // Set up email data for admin notification email
    const adminMsg = {
      to: 'ahsanishfaq222277@gmail.com',
      from: process.env.EMAIL_FROM || 'ahsanglobalbusiness@gmail.com',
      subject: testAdminEmail.subject,
      html: testAdminEmail.body,
    };

    // Send confirmation email first
    console.log('Sending confirmation test email...');
    await sgMail.send(confirmationMsg);
    console.log('Confirmation test email sent successfully!');
    
    // Wait 2 seconds before sending admin notification
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Send admin notification email
    console.log('Sending admin notification test email...');
    await sgMail.send(adminMsg);
    console.log('Admin notification test email sent successfully!');
    
    console.log('Both test emails were sent to ahsanishfaq222277@gmail.com');
  } catch (error) {
    console.error('Error sending test email:', error);
    if (error.response) {
      console.error(error.response.body);
    }
  }
}

// Execute the function
sendTestEmail();