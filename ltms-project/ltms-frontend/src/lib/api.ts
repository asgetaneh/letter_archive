const API_BASE = import.meta.env.VITE_API_URL;

function getCsrfToken(): string | null {
  const match = document.cookie
    .split('; ')
    .find((c) => c.startsWith('XSRF-TOKEN='));
  return match ? decodeURIComponent(match.split('=')[1]) : null;
}

async function ensureCsrf(): Promise<void> {
  await fetch(`${API_BASE}/sanctum/csrf-cookie`, { credentials: 'include' });
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const method = (options.method || 'GET').toUpperCase();
  const stateful = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };

  if (stateful) {
    const token = getCsrfToken();
    if (token) headers['X-XSRF-TOKEN'] = token;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: 'include',
    headers,
  });

  if (res.status === 401) {
    window.dispatchEvent(new Event('auth:unauthorized'));
    throw Object.assign(new Error('UNAUTHENTICATED'), { status: 401 });
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw Object.assign(
      new Error(body.message || `Request failed (${res.status})`),
      { status: res.status, errors: body.errors }
    );
  }

  return res.json();
}

export async function apiLogin(email: string, password: string) {
  await ensureCsrf();
  const token = getCsrfToken();
  const res = await fetch(`${API_BASE}/api/login`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token ? { 'X-XSRF-TOKEN': token } : {}),
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw Object.assign(new Error(body.message || 'Login failed'), {
      status: res.status,
      errors: body.errors,
    });
  }

  return res.json();
}