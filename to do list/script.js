document.addEventListener('DOMContentLoaded', () => {
    const authTitle = document.getElementById('auth-title');
    const toggleAuth = document.getElementById('toggle-auth');
    const authSubmit = document.getElementById('auth-submit');
    const securityQuestion = document.getElementById('security-question');
    const users = JSON.parse(localStorage.getItem('users')) || {};
    const themeSelect = document.getElementById('theme-select');
    const taskList = document.getElementById('task-list');

    const currentTheme = localStorage.getItem('theme') || 'light';
    document.body.className = `${currentTheme}-theme`;
    themeSelect.value = currentTheme;

    toggleAuth.addEventListener('click', toggleAuthMode);
    authSubmit.addEventListener('click', handleAuth);
    document.getElementById('forgot-password').addEventListener('click', handleForgotPassword);
    document.getElementById('logout').addEventListener('click', handleLogout);

    themeSelect.addEventListener('change', handleThemeChange);

    document.getElementById('task-form').addEventListener('submit', addTask);
    taskList.addEventListener('click', handleTaskActions);

    document.getElementById('filter-completed').addEventListener('click', filterCompletedTasks);
    document.getElementById('filter-pending').addEventListener('click', filterPendingTasks);

    document.getElementById('backup-data').addEventListener('click', backupData);
    document.getElementById('restore-data').addEventListener('click', restoreData);

    function formatTimeTo12Hour(time) {
        const [hour, minute] = time.split(':').map(Number);
        const period = hour >= 12 ? 'PM' : 'AM';
        const formattedHour = hour % 12 || 12;
        return `${formattedHour}:${minute < 10 ? '0' : ''}${minute} ${period}`;
    }

    function toggleAuthMode() {
        const isLogin = authTitle.textContent === 'Login';
        authTitle.textContent = isLogin ? 'Sign Up' : 'Login';
        document.getElementById('forgot-password').style.display = isLogin ? 'none' : 'block';
        securityQuestion.style.display = isLogin ? 'block' : 'none';
        toggleAuth.textContent = isLogin ? 'Switch to Login' : 'Switch to Sign Up';
    }

    function handleAuth(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const securityAnswer = document.getElementById('security-answer').value;

        if (authTitle.textContent === 'Sign Up') {
            if (!securityAnswer.trim()) {
                alert('Please answer the security question.');
                return;
            }
            users[email] = { password, securityAnswer };
            localStorage.setItem('users', JSON.stringify(users));
            alert('Sign Up successful! You can now log in.');
        } else {
            const user = users[email];
            if (user && user.password === password) {
                document.getElementById('auth').style.display = 'none';
                document.getElementById('todo').style.display = 'block';
                alert('Login successful!');
            } else {
                alert('Invalid email or password.');
            }
        }
    }

    function handleForgotPassword() {
        const email = document.getElementById('email').value;
        const user = users[email];
        if (user) {
            alert(`Your security answer is: ${user.securityAnswer}`);
        } else {
            alert('No account found with that email.');
        }
    }

    function handleLogout() {
        document.getElementById('todo').style.display = 'none';
        document.getElementById('auth').style.display = 'block';
    }

    function handleThemeChange() {
        const selectedTheme = themeSelect.value;
        document.body.className = `${selectedTheme}-theme`;
        localStorage.setItem('theme', selectedTheme);
    }

    function addTask(e) {
        e.preventDefault();
        const taskTitle = document.getElementById('task-input').value.trim();
        const dueDate = document.getElementById('task-date').value;
        const time = document.getElementById('task-time').value;
        const priority = document.getElementById('task-priority').value;
        const reminder = document.getElementById('task-reminder').value;

        if (taskTitle) {
            const formattedTime = time ? formatTimeTo12Hour(time) : '';

            const taskItem = document.createElement('li');
            taskItem.classList.add('task-item');
            taskItem.setAttribute('data-due-date', dueDate);
            taskItem.setAttribute('data-priority', priority);
            taskItem.setAttribute('data-reminder', reminder);
            taskItem.innerHTML = `
                <div class="task-details">
                    <strong class="task-title">${taskTitle}</strong>
                    <div class="task-due">${dueDate ? `Due: ${dueDate}` : ''} ${formattedTime ? `at ${formattedTime}` : ''}</div>
                    <div class="task-priority">Priority: ${priority}</div>
                </div>
                <button class="edit-task">Edit</button>
                <button class="complete-task">Complete</button>
                <button class="delete-task">Delete</button>
            `;
            taskList.appendChild(taskItem);

            document.getElementById('task-input').value = '';
            document.getElementById('task-date').value = '';
            document.getElementById('task-time').value = '';
            document.getElementById('task-priority').value = 'low';
            document.getElementById('task-reminder').value = '';
        } else {
            alert('Please enter a task title.');
        }
    }

    function handleTaskActions(e) {
        const taskItem = e.target.closest('li');

        if (e.target.classList.contains('edit-task')) {
            editTask(taskItem);
        }

        if (e.target.classList.contains('complete-task')) {
            taskItem.classList.toggle('completed');
        }

        if (e.target.classList.contains('delete-task')) {
            taskItem.remove();
        }
    }

    function editTask(taskItem) {
        const taskTitle = taskItem.querySelector('.task-title').textContent;
        const dueDate = taskItem.getAttribute('data-due-date');
        const priority = taskItem.getAttribute('data-priority');
        const reminder = taskItem.getAttribute('data-reminder');

        document.getElementById('task-input').value = taskTitle;
        document.getElementById('task-date').value = dueDate;
        document.getElementById('task-priority').value = priority;
        document.getElementById('task-reminder').value = reminder;

        taskItem.remove();
    }

    function filterCompletedTasks() {
        Array.from(taskList.children).forEach(item => {
            item.style.display = item.classList.contains('completed') ? 'block' : 'none';
        });
    }

    function filterPendingTasks() {
        Array.from(taskList.children).forEach(item => {
            item.style.display = item.classList.contains('completed') ? 'none' : 'block';
        });
    }

    function backupData() {
        const tasks = Array.from(taskList.children).map(item => item.innerHTML);
        localStorage.setItem('tasksBackup', JSON.stringify(tasks));
        alert('Tasks backed up successfully!');
    }

    function restoreData() {
        const tasksBackup = JSON.parse(localStorage.getItem('tasksBackup'));
        if (tasksBackup) {
            taskList.innerHTML = tasksBackup.join('');
            alert('Tasks restored successfully!'); 
        } else {
            alert('No backup found.');
        }
    }
});
