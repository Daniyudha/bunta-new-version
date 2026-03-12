const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testLogin() {
  console.log('Fetching CSRF token...');
  const csrfRes = await fetch('http://localhost:3000/api/auth/csrf');
  const cookies = csrfRes.headers.raw()['set-cookie'];
  console.log('Cookies:', cookies);
  const { csrfToken } = await csrfRes.json();
  console.log('CSRF token:', csrfToken);

  // Build cookie header for subsequent request
  const cookieHeader = cookies ? cookies.join('; ') : '';

  const params = new URLSearchParams({
    email: 'su.admin@irigasibunta.com',
    password: 'Buntamengalir25!',
    csrfToken,
    callbackUrl: '/',
    json: 'true'
  });

  console.log('Posting to credentials endpoint...');
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
  };
  if (cookieHeader) {
    headers['Cookie'] = cookieHeader;
  }

  const loginRes = await fetch('http://localhost:3000/api/auth/callback/credentials', {
    method: 'POST',
    headers,
    body: params.toString(),
    redirect: 'manual'
  });

  console.log('Status:', loginRes.status);
  console.log('Headers:', loginRes.headers.raw());
  const body = await loginRes.text();
  console.log('Body:', body);
}

testLogin().catch(err => console.error(err));