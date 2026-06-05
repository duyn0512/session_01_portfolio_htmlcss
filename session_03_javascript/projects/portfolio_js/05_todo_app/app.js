// ===== STATE =====
let todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentFilter = 'all';

// ===== DOM ELEMENTS =====
const todoInput = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');
const todoCount = document.getElementById('todo-count');
const clearCompletedBtn = document.getElementById('clear-completed');
const emptyState = document.getElementById('empty-state');
const currentDate = document.getElementById('current-date');
const filterBtns = document.querySelectorAll('.filter-btn');

// Hiển thị ngày hiện tại
currentDate.textContent = new Date().toLocaleDateString('vi-VN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
});

function createTodo(text) {
    return {
        id: Date.now(),                    // Unique ID từ timestamp
        text: text.trim(),                 // Nội dung
        completed: false,                  // Trạng thái
        createdAt: new Date().toISOString() // Ngày tạo
    };
}

// ===== CREATE =====
function addTodo() {
    const text = todoInput.value.trim();
    if (!text) {
        todoInput.classList.add('shake');
        setTimeout(() => todoInput.classList.remove('shake'), 500);
        return;
    }

    const todo = createTodo(text);
    todos.unshift(todo);    // Thêm vào đầu mảng
    saveTodos();
    render();
    todoInput.value = '';
    todoInput.focus();
}

// ===== READ (render) =====
function render() {
    const filtered = getFilteredTodos();

    todoList.innerHTML = '';

    if (filtered.length === 0) {
        emptyState.hidden = false;
        todoList.hidden = true;
    } else {
        emptyState.hidden = true;
        todoList.hidden = false;
        filtered.forEach(todo => todoList.appendChild(createTodoElement(todo)));
    }

    updateCount();
    updateClearButton();
}

// ===== UPDATE =====
function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        saveTodos();
        render();
    }
}

function editTodo(id) {
    const todo = todos.find(t => t.id === id);
    const li = todoList.querySelector(`[data-id="${id}"]`);
    const textSpan = li.querySelector('.todo-text');

    // Tạo input inline
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'todo-edit-input';
    input.value = todo.text;

    textSpan.replaceWith(input);
    input.focus();
    input.select();

    // Enter → lưu
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const newText = input.value.trim();
            if (newText) {
                todo.text = newText;
                saveTodos();
            }
            render();
        }
        if (e.key === 'Escape') {
            render(); // Hủy, render lại
        }
    });

    // Blur → lưu
    input.addEventListener('blur', () => {
        const newText = input.value.trim();
        if (newText) {
            todo.text = newText;
            saveTodos();
        }
        render();
    });
}

// ===== DELETE =====
function deleteTodo(id) {
    const confirmed = confirm('Xác nhận xóa công việc này?');
    if (confirmed) {
        todos = todos.filter(t => t.id !== id);
        saveTodos();
        render();
    }
}

function clearCompleted() {
    const confirmed = confirm('Xóa tất cả công việc đã hoàn thành?');
    if (confirmed) {
        todos = todos.filter(t => !t.completed);
        saveTodos();
        render();
    }
}

function getFilteredTodos() {
    switch (currentFilter) {
        case 'active':    return todos.filter(t => !t.completed);
        case 'completed': return todos.filter(t => t.completed);
        default:          return todos;
    }
}

function updateCount() {
    const activeCount = todos.filter(t => !t.completed).length;
    todoCount.textContent = `${activeCount} việc chưa hoàn thành`;
}

function updateClearButton() {
    const hasCompleted = todos.some(t => t.completed);
    clearCompletedBtn.hidden = !hasCompleted;
}

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function formatDate(isoString) {
    return new Date(isoString).toLocaleDateString('vi-VN', {
        day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
    });
}

function createTodoElement(todo) {
    const li = document.createElement('li');
    li.className = `todo-item${todo.completed ? ' completed' : ''}`;
    li.dataset.id = todo.id;

    li.innerHTML = `
        <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
        <span class="todo-text">${escapeHtml(todo.text)}</span>
        <span class="todo-date">${formatDate(todo.createdAt)}</span>
        <div class="todo-actions">
            <button class="action-btn edit-btn" title="Sửa">✏️</button>
            <button class="action-btn delete-btn" title="Xóa">🗑️</button>
        </div>
    `;

    // Event delegation cho checkbox
    li.querySelector('.todo-checkbox').addEventListener('change', () => toggleTodo(todo.id));
    li.querySelector('.edit-btn').addEventListener('click', () => editTodo(todo.id));
    li.querySelector('.delete-btn').addEventListener('click', () => deleteTodo(todo.id));

    return li;
}

// Escape HTML để tránh XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Thêm todo
addBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addTodo();
});

// Filter tabs
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        render();
    });
});

// Clear completed
clearCompletedBtn.addEventListener('click', clearCompleted);

// Render lần đầu
render();