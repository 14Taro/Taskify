const API_BASE_URL = 'http://localhost:8000/api/v1';

export function getToken() {
    return localStorage.getItem('access_token');
}

export function setToken(token) {
    localStorage.setItem('access_token', token);
}

export function removeToken() {
    localStorage.removeItem('access_token');
}

export async function apiFetch(endpoint, options = {}) {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (response.status === 401) {
        removeToken();
        window.location.reload();
        throw new Error('Sesión expirada o no autorizada.');
    }

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Ocurrió un error en la solicitud.');
    }

    return response.json();
}