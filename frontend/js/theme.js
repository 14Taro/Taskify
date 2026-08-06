export function setupTheme() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    // Leer preferencia previa guardada
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        htmlElement.classList.add('dark');
        if (themeToggleBtn) themeToggleBtn.textContent = '☀️';
    } else {
        htmlElement.classList.remove('dark');
        if (themeToggleBtn) themeToggleBtn.textContent = '🌙';
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            if (htmlElement.classList.contains('dark')) {
                htmlElement.classList.remove('dark');
                localStorage.setItem('theme', 'light');
                themeToggleBtn.textContent = '🌙';
            } else {
                htmlElement.classList.add('dark');
                localStorage.setItem('theme', 'dark');
                themeToggleBtn.textContent = '☀️';
            }
        });
    }
}