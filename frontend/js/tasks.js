import { apiFetch } from './api.js';

export async function loadTasks() {
    try {
        const [pendingTasks, historyTasks] = await Promise.all([
            apiFetch('/tasks'),
            apiFetch('/tasks/history')
        ]);

        renderPendingTasks(pendingTasks);
        renderHistoryTasks(historyTasks);
    } catch (error) {
        console.error('Error al cargar tareas:', error);
    }
}

function renderPendingTasks(tasks) {
    const list = document.getElementById('pending-tasks-list');
    const count = document.getElementById('pending-count');
    count.textContent = tasks.length;

    if (tasks.length === 0) {
        list.innerHTML = `<li class="text-gray-400 dark:text-gray-500 text-sm text-center py-4">No hay tareas pendientes. ¡Buen trabajo! 🎉</li>`;
        return;
    }

    const priorityBadges = {
        ALTA: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 border-red-200',
        MEDIA: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300 border-yellow-200',
        BAJA: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 border-green-200'
    };

    list.innerHTML = tasks.map(task => `
        <li class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-700 transition">
            <div class="flex items-center gap-3">
                <span class="text-xs px-2 py-0.5 rounded-full font-semibold border ${priorityBadges[task.priority]}">
                    ${task.priority}
                </span>
                <span class="text-gray-800 dark:text-gray-200 font-medium">${task.title}</span>
            </div>
            <button data-id="${task.id}" class="complete-btn bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-3 py-1.5 rounded-lg transition font-medium">
                ✓ Completar
            </button>
        </li>
    `).join('');

    // Agregar evento a los botones de completar
    document.querySelectorAll('.complete-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const taskId = e.target.getAttribute('data-id');
            await completeTask(taskId);
        });
    });
}

function renderHistoryTasks(tasks) {
    const list = document.getElementById('history-tasks-list');
    const count = document.getElementById('history-count');
    count.textContent = tasks.length;

    if (tasks.length === 0) {
        list.innerHTML = `<li class="text-gray-400 dark:text-gray-500 text-sm text-center py-4">Sin tareas completadas recientemente.</li>`;
        return;
    }

    list.innerHTML = tasks.map(task => {
        const fecha = new Date(task.completed_at).toLocaleDateString();
        return `
            <li class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-100 dark:border-gray-700/50">
                <span class="line-through text-gray-500 dark:text-gray-400 text-sm">${task.title}</span>
                <span class="text-xs text-gray-400 dark:text-gray-500">✓ ${fecha}</span>
            </li>
        `;
    }).join('');
}

async function completeTask(taskId) {
    try {
        await apiFetch(`/tasks/${taskId}/complete`, { method: 'PATCH' });
        await loadTasks();
    } catch (error) {
        alert('Error al completar la tarea.');
    }
}

export function setupTaskForm() {
    const form = document.getElementById('create-task-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const titleInput = document.getElementById('task-title');
        const priorityInput = document.getElementById('task-priority');

        const title = titleInput.value.trim();
        const priority = priorityInput.value;

        if (!title) return;

        try {
            await apiFetch('/tasks', {
                method: 'POST',
                body: JSON.stringify({ title, priority })
            });

            titleInput.value = '';
            await loadTasks();
        } catch (error) {
            alert('Error al crear la tarea.');
        }
    });
}