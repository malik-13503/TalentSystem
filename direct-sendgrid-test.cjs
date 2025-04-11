const sgMail = require('@sendgrid/mail');

// Set the API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Simple test message
const msg = {
  to: 'ahsanishfaq222277@gmail.com',
  from: 'ahsanglobalbusiness@gmail.com', // Must be a verified sender
  subject: 'Direct SendGrid Test - Please Check',
  text: 'This is a direct test of the SendGrid API. If you receive this, please confirm.',
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
      <h1 style="color: #FF6713;">Direct SendGrid Test</h1>
      <p>This is a direct test of the SendGrid API to verify email delivery.</p>
      <p>If you receive this email, please confirm that it arrived in your inbox.</p>
      <p>Time sent: ${new Date().toISOString()}</p>
      <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
      <p style="color: #666; font-size: 12px;">This is a test email from the Footprint Advertising Solutions system.</p>
    </div>
  `
};

async function sendDirectTest() {
  try {
    console.log('Sending direct test email to:', msg.to);
    console.log('From:', msg.from);
    
    const response = await sgMail.send(msg);
    console.log('Response:', response[0].statusCode);
    console.log('Headers:', JSON.stringify(response[0].headers, null, 2));
    console.log('Email sent successfully! Please check your inbox (and spam folder).');
  } catch (error) {
    console.error('Error details:');
    console.error(error);
    
    if (error.response) {
      console.error('API Error Response:');
      console.error('Status code:', error.response.statusCode);
      console.error('Body:', JSON.stringify(error.response.body, null, 2));
    }
  }
}

sendDirectTest();