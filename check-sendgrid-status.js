// Import axios for making API requests
import axios from 'axios';

const apiKey = process.env.SENDGRID_API_KEY;

if (!apiKey) {
  console.error('SendGrid API key not found. Please set SENDGRID_API_KEY environment variable.');
  process.exit(1);
}

// Function to get account information from SendGrid
async function checkSendGridAccount() {
  try {
    console.log('Checking SendGrid account status...');
    
    const response = await axios.get('https://api.sendgrid.com/v3/user/profile', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('SendGrid Account Status:');
    console.log(JSON.stringify(response.data, null, 2));
    
    return response.data;
  } catch (error) {
    console.error('Error checking SendGrid account:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error(error.message);
    }
    return null;
  }
}

// Run the check
checkSendGridAccount();