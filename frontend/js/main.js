import { getToken, removeToken, apiFetch } from './api.js';
import { setupAuth } from './auth.js';
import { loadTasks, setupTaskForm } from './tasks.js';
import { setupTheme } from './theme.js';

document.addEventListener('DOMContentLoaded', () => {
    const authSection = document.getElementById('auth-section');
    const dashboardSection = document.getElementById('dashboard-section');
    const logoutBtn = document.getElementById('logout-btn');
    const userEmailDisplay = document.getElementById('user-email-display');

    setupTheme();

    async function checkAuth() {
        const token = getToken();
        if (token) {
            try {
                // Verificar que el token sea válido y obtener datos del usuario
                const user = await apiFetch('/auth/me');
                if (userEmailDisplay) userEmailDisplay.textContent = user.email;

                authSection.classList.add('hidden');
                dashboardSection.classList.remove('hidden');

                // Cargar tareas pendientes e historial desde la API
                await loadTasks();
            } catch (err) {
                removeToken();
                showLogin();
            }
        } else {
            showLogin();
        }
    }

    function showLogin() {
        authSection.classList.remove('hidden');
        dashboardSection.classList.add('hidden');
    }

    setupAuth(() => {
        checkAuth();
    });

    setupTaskForm();

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            removeToken();
            showLogin();
        });
    }

    checkAuth();
});