const sgMail = require('@sendgrid/mail');

// Display environment variables (with API key partially masked)
const apiKey = process.env.SENDGRID_API_KEY || 'Not set';
const maskedApiKey = apiKey === 'Not set' ? 'Not set' : 
  apiKey.substring(0, 4) + '...' + apiKey.substring(apiKey.length - 4);

console.log('Environment check:');
console.log('- SENDGRID_API_KEY:', maskedApiKey);
console.log('- EMAIL_FROM:', process.env.EMAIL_FROM || 'Not set');

// Set SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Very simple email with minimal content
const msg = {
  to: 'ahsanishfaq222277@gmail.com',
  from: process.env.EMAIL_FROM || 'ahsanglobalbusiness@gmail.com',
  subject: 'Simple Test - Please Check',
  text: 'This is a very simple test. No HTML. Please confirm receipt.',
};

// Function to send the test email
async function sendSimpleTest() {
  console.log(`Sending simple email to ${msg.to} from ${msg.from}...`);
  
  try {
    const response = await sgMail.send(msg);
    console.log('Send successful! Status code:', response[0].statusCode);
    
    // Check if we got a message ID (which confirms it was queued for delivery)
    const messageId = response[0].headers['x-message-id'];
    if (messageId) {
      console.log('Message ID:', messageId, '(confirms message was accepted by SendGrid)');
    }
    
    console.log('\nIMPORTANT: If you don\'t see the email:');
    console.log('1. Check your spam/junk folder');
    console.log('2. Verify that ahsanglobalbusiness@gmail.com is authorized in SendGrid');
    console.log('3. Check for any sending restrictions on your SendGrid account');
    
  } catch (error) {
    console.error('Send failed with error:');
    console.error(error);
    
    if (error.response) {
      console.error('API Error Details:');
      console.error('- Status code:', error.response.statusCode);
      console.error('- Error body:', JSON.stringify(error.response.body, null, 2));
    }
  }
}

// Run the test
sendSimpleTest();