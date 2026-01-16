const BASE_URL = 'http://localhost:3000';

async function main() {
  console.log('--- STARTING DEBUG SESSION ---');
  
  // 1. Register
  const username = `DebugUser_${Date.now()}`;
  const password = 'password123';
  
  console.log(`\n1. Registering user: ${username}`);
  const regRes = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  
  const regData = await regRes.json();
  console.log('Register Status:', regRes.status);
  console.log('Register Response:', regData);
  
  if (!regRes.ok && regRes.status !== 400) { // 400 might mean exists, which is fine
      console.error('Registration failed unexpectedly');
      return;
  }

  // 2. Login
  console.log(`\n2. Logging in as: ${username}`);
  const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  
  console.log('Login Status:', loginRes.status);
  const cookieHeader = loginRes.headers.get('set-cookie');
  console.log('Set-Cookie Header:', cookieHeader);
  
  if (!loginRes.ok) {
     const loginData = await loginRes.json();
     console.error('Login failed:', loginData);
     return;
  }
  
  // 3. Get Me
  console.log(`\n3. Fetching /api/users/me`);
  const meRes = await fetch(`${BASE_URL}/api/users/me`, {
    headers: {
        'Cookie': cookieHeader // Pass the cookie manually
    }
  });
  
  console.log('Me Status:', meRes.status);
  const meText = await meRes.text();
  console.log('Me Response BODY:', meText); // Label it clearly
  
  console.log('\n--- END DEBUG SESSION ---');
}

main();
