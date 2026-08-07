import { apiFetch, setToken } from './api.js';

export function setupAuth(onSuccess) {
    const loginForm = document.getElementById('login-form');
    const toggleAuthBtn = document.getElementById('toggle-auth');
    const authTitle = document.querySelector('#login-form h2');
    const authSubmitBtn = loginForm.querySelector('button[type="submit"]');

    let isRegisterMode = false;

    // Alternar entre modo Login y Registro
    if (toggleAuthBtn) {
        toggleAuthBtn.addEventListener('click', (e) => {
            e.preventDefault();
            isRegisterMode = !isRegisterMode;

            if (isRegisterMode) {
                authTitle.textContent = 'Crear Cuenta';
                authSubmitBtn.textContent = 'Registrarse';
                toggleAuthBtn.textContent = '¿Ya tienes cuenta? Inicia sesión';
            } else {
                authTitle.textContent = 'Iniciar Sesión';
                authSubmitBtn.textContent = 'Ingresar';
                toggleAuthBtn.textContent = '¿No tienes cuenta? Regístrate aquí';
            }
        });
    }

    // Enviar formulario
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value.trim();

        try {
            if (isRegisterMode) {
                // 1. Registrar usuario
                await apiFetch('/auth/register', {
                    method: 'POST',
                    body: JSON.stringify({ email, password })
                });
                alert('¡Registro exitoso! Iniciando sesión...');
            }

            // 2. Iniciar sesión (Obtener Token)
            const formData = new URLSearchParams();
            formData.append('username', email);
            formData.append('password', password);

            const response = await fetch('https://taskify-api-z3wn.onrender.com/api/v1/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formData
            });

            if (!response.ok) {
                throw new Error('Credenciales incorrectas o usuario no encontrado.');
            }

            const data = await response.json();

            setToken(data.access_token);
            loginForm.reset();
            onSuccess();

        } catch (error) {
            alert(error.message || 'Ocurrió un error en la autenticación.');
        }
    });
}