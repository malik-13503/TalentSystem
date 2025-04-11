// Simple test script to verify SendGrid email functionality
// Run this with: node email-test.js

import sgMail from '@sendgrid/mail';

async function testSendgrid() {
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
  // Replace this with your own email for testing
  const recipientEmail = process.env.EMAIL_FROM; // Send to the same email for testing
  
  console.log(`Sender email: ${senderEmail}`);
  console.log(`Recipient email: ${recipientEmail}`);

  const msg = {
    to: recipientEmail,
    from: {
      email: senderEmail,
      name: 'FOOTprint TALENT System'
    },
    subject: 'Testing SendGrid Email Delivery',
    text: 'This is a test email from the FOOTprint TALENT application to verify SendGrid configuration.',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 5px;">
        <h2 style="color: #4b0082;">FOOTprint TALENT - Email Test</h2>
        <p>This is a test email sent at: ${new Date().toLocaleString()}</p>
        <p>If you're receiving this email, it means your SendGrid configuration is working correctly.</p>
        <p><strong>Next steps:</strong></p>
        <ul>
          <li>Check that your domain/sender email is properly verified in SendGrid</li>
          <li>Ensure your application is using the correct email addresses</li>
          <li>Verify spam filters are not blocking the emails</li>
        </ul>
        <p style="font-size: 12px; color: #666; margin-top: 30px;">This is an automated test email.</p>
      </div>
    `,
  };

  try {
    console.log('Attempting to send test email...');
    const response = await sgMail.send(msg);
    console.log('Email sent successfully:', response[0].statusCode);
    console.log('If you do not receive the email, check your spam folder or verify your SendGrid configuration.');
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

testSendgrid();