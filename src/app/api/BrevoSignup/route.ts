export async function POST(request: Request) {
    console.log('Inside POST /api/BrevoSignup');
  
    try {
      // 1. Parse JSON body: { fullName, email, phone }
      const body = await request.json();
      console.log('Received body:', body);
      const { fullName, email, phone } = body;
  
      // 2. Validate required fields
      if (!email || !fullName || !phone) {
        console.error('Missing required fields:', { email: !!email, fullName: !!fullName, phone: !!phone });
        return new Response(
          JSON.stringify({ error: 'All fields are required.' }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      // Split fullName into firstName and lastName
      const nameParts = fullName.trim().split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ');
  
      const SibApiV3Sdk = require('sib-api-v3-typescript');
      let apiInstance = new SibApiV3Sdk.ContactsApi();
  
      let apiKey = apiInstance.authentications['apiKey'];
  
      if (!process.env.BREVO_API_KEY) {
        console.error('BREVO_API_KEY is missing in environment variables');
        return new Response(
          JSON.stringify({ error: 'Internal server error: missing API key' }),
          {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }
  
      apiKey.apiKey = process.env.BREVO_API_KEY;
  
      let createContact = new SibApiV3Sdk.CreateContact();
  
      // 4. Populate contact fields
      createContact.email = email;
      createContact.listIds = [3]; // Replace with your actual list ID
      createContact.updateEnabled = true; // Update if contact already exists
      createContact.attributes = {
        FIRSTNAME: firstName,
        LASTNAME: lastName,
        SMS: phone,
        EMAIL: email,
      };

      // 5. Use async/await to ensure we wait for the API call
      console.log('Calling createContact in Brevo with data:', createContact);
      const data = await apiInstance.createContact(createContact);
  
      console.log('Brevo API response:', data);
  
      return new Response(
        JSON.stringify({
          message: 'Thanks for signing up!',
          data,
        }),
        {
          status: 201,
          headers: { 'Content-Type': 'application/json' },
        }
      );
  
    } catch (error: any) {
      console.error('Error in POST /api/BrevoSignup:', error);
      console.error('Error details:', {
        message: error.message,
        body: error.body,
        statusCode: error.statusCode,
        stack: error.stack
      });
  
      return new Response(
        JSON.stringify({
          error: error?.body?.message || error.message || 'Something went wrong.',
          details: error?.body || error
        }),
        {
          status: error?.statusCode || 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  }
  