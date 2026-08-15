import { getToken, removeToken, apiFetch } from './api.js';
import { setupAuth } from './auth.js';
import { loadTasks, setupTaskForm } from './tasks.js';
import { setupTheme } from './theme.js';

document.addEventListener('DOMContentLoaded', () => {
    const authSection = document.getElementById('auth-section');
    const dashboardSection = document.getElementById('dashboard-section');
    const logoutBtn = document.getElementById('logout-btn');
    const userEmailDisplay = document.getElementById('user-email-display');
    const globalLoader = document.getElementById('global-loader');

    setupTheme();

    function hideLoader() {
        if (globalLoader) {
            globalLoader.classList.add('opacity-0');
            setTimeout(() => globalLoader.classList.add('hidden'), 300);
        }
    }

    async function checkAuth() {
        const token = getToken();
        if (token) {
            try {
                const user = await apiFetch('/auth/me');
                
                // TICKET 1.4: Si tiene alias, mostramos un saludo bonito. Si es una cuenta muy vieja y no tiene, mostramos el email.
                if (userEmailDisplay) {
                    userEmailDisplay.textContent = user.alias ? `Hola, ${user.alias} 👋` : user.email;
                }

                hideLoader();
                authSection.classList.add('hidden');
                dashboardSection.classList.remove('hidden');

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
        hideLoader();
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