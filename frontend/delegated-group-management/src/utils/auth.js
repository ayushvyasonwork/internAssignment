// src/utils/auth.js
export const loginUser = async (email, password) => {
  const response = await fetch('http://localhost:8000/api/auth/login/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || 'Login failed');

  localStorage.setItem('access', data.access);
  localStorage.setItem('refresh', data.refresh);
  return data;
};
// src/utils/auth.js

export function getUserIdFromToken() {
  const token = localStorage.getItem('access_token');
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.user_id || payload.id; // depends on your backend
  } catch {
    return null;
  }
}

export const registerUser = async (formData) => {
  const response = await fetch('http://localhost:8000/api/auth/register/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || 'Signup failed');

  return data;
};

export const refreshAccessToken = async () => {
  const refresh = localStorage.getItem('refresh');
  const res = await fetch('http://localhost:8000/api/auth/refresh/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh }),
  });

  const data = await res.json();
  if (res.ok) {
    localStorage.setItem('access', data.access);
    return data.access;
  } else {
    logout();
    throw new Error('Token expired');
  }
};

export const logout = () => {
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
};
