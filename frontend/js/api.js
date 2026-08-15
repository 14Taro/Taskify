// URL base dinámica (puedes cambiarla entre local y Render cuando gustes)
export const API_BASE_URL = 'https://taskify-api-z3wn.onrender.com/api/v1';

/**
 * Obtiene el token de autenticación guardado en el navegador
 */
export function getToken() {
    return localStorage.getItem('token');
}

/**
 * Guarda el token de autenticación en el navegador
 */
export function setToken(token) {
    localStorage.setItem('token', token);
}

/**
 * Elimina el token de autenticación del navegador
 */
export function removeToken() {
    localStorage.removeItem('token');
}

/**
 * Función centralizada para realizar peticiones HTTP a la API
 */
export async function apiFetch(endpoint, options = {}) {
    const token = getToken();

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (response.status === 401) {
        removeToken();
        window.location.reload();
        throw new Error('Sesión expirada o no autorizada');
    }

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Error en la petición a la API');
    }

    if (response.status === 204) {
        return {};
    }

    return await response.json();
}