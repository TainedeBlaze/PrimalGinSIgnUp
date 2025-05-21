export async function POST(request: Request) {
    const body = await request.json();
    const { fullName, email, phone } = body;
  
    if (!email || !fullName || !phone) {
      return new Response(JSON.stringify({ error: 'All fields are required.' }), { status: 400 });
    }
  
    const nameParts = fullName.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || '';
  
    const API_KEY = process.env.BREVO_API_KEY;
    if (!API_KEY) {
      return new Response(JSON.stringify({ error: 'Missing API key' }), { status: 500 });
    }
  
    const res = await fetch('https://api.sendinblue.com/v3/contacts', {
      method: 'POST',
      headers: {
        'api-key': API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        email,
        updateEnabled: true,
        listIds: [3],
        attributes: {
          FIRSTNAME: firstName,
          LASTNAME: lastName,
          SMS: phone,
          EMAIL: email,
        },
      }),
    });
  
    if (!res.ok) {
      const errorData = await res.json();
      console.error('Brevo error:', errorData);
      return new Response(JSON.stringify({ error: errorData.message || 'API error' }), {
        status: res.status,
      });
    }
  
    return new Response(JSON.stringify({ message: 'Thanks for signing up!' }), { status: 201 });
  }
  