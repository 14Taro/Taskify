import { apiFetch, setToken, API_BASE_URL } from './api.js';

export function setupAuth(onSuccess) {
    const loginForm = document.getElementById('login-form');
    const toggleAuthBtn = document.getElementById('toggle-auth');
    const authTitle = document.querySelector('#login-form h2');
    const authSubmitBtn = loginForm.querySelector('button[type="submit"]');
    
    const emailInput = document.getElementById('login-email');
    const rememberEmailCheckbox = document.getElementById('remember-email');
    const rememberMeContainer = document.getElementById('remember-me-container');

    const aliasContainer = document.getElementById('register-alias-container');
    const aliasInput = document.getElementById('register-alias');

    let isRegisterMode = false;

    const savedEmail = localStorage.getItem('saved_email');
    if (savedEmail && emailInput && rememberEmailCheckbox) {
        emailInput.value = savedEmail;
        rememberEmailCheckbox.checked = true;
    }

    if (toggleAuthBtn) {
        toggleAuthBtn.addEventListener('click', (e) => {
            e.preventDefault();
            isRegisterMode = !isRegisterMode;

            if (isRegisterMode) {
                authTitle.textContent = 'Crear Cuenta';
                authSubmitBtn.textContent = 'Registrarse';
                toggleAuthBtn.textContent = '¿Ya tienes cuenta? Inicia sesión';
                if(aliasContainer) aliasContainer.classList.remove('hidden');
                if(aliasInput) aliasInput.required = true;
                if(rememberMeContainer) rememberMeContainer.classList.add('hidden');
            } else {
                authTitle.textContent = 'Iniciar Sesión';
                authSubmitBtn.textContent = 'Ingresar';
                toggleAuthBtn.textContent = '¿No tienes cuenta? Regístrate aquí';
                if(aliasContainer) aliasContainer.classList.add('hidden');
                if(aliasInput) aliasInput.required = false;
                if(rememberMeContainer) rememberMeContainer.classList.remove('hidden');
            }
        });
    }

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = emailInput.value.trim();
        const password = document.getElementById('login-password').value.trim();
        const rememberMe = rememberEmailCheckbox ? rememberEmailCheckbox.checked : false;
        
        const alias = aliasInput ? aliasInput.value.trim() : '';

        try {
            if (isRegisterMode) {
                await apiFetch('/auth/register', {
                    method: 'POST',
                    body: JSON.stringify({ email, password, alias })
                });
                alert('¡Registro exitoso! Iniciando sesión...');
            }

            const formData = new URLSearchParams();
            formData.append('username', email);
            formData.append('password', password);

            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formData
            });

            if (!response.ok) {
                // TICKET 1.5 MEJORA: Capturamos el mensaje (detail) exacto enviado desde el Backend
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || 'Credenciales incorrectas o usuario no encontrado.');
            }

            const data = await response.json();

            if (rememberMe) {
                localStorage.setItem('saved_email', email);
            } else {
                localStorage.removeItem('saved_email');
            }

            setToken(data.access_token);
            loginForm.reset();
            
            if (rememberMe && !isRegisterMode) {
                emailInput.value = email;
                rememberEmailCheckbox.checked = true;
            }

            if (isRegisterMode) {
                isRegisterMode = false;
                authTitle.textContent = 'Iniciar Sesión';
                authSubmitBtn.textContent = 'Ingresar';
                toggleAuthBtn.textContent = '¿No tienes cuenta? Regístrate aquí';
                if(aliasContainer) aliasContainer.classList.add('hidden');
                if(aliasInput) aliasInput.required = false;
                if(rememberMeContainer) rememberMeContainer.classList.remove('hidden');
            }

            onSuccess();

        } catch (error) {
            alert(error.message || 'Ocurrió un error en la autenticación.');
        }
    });
}