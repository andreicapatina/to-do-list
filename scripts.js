document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
    const allButton = document.getElementById('all-button');
    const finishedButton = document.getElementById('finished-button');
    const unfinishedButton = document.getElementById('unfinished-button');

    //---------------------------//
    //----Inițializare----------//
    //---------------------------//

    // Încarcă sarcinile din localStorage când pagina se încarcă
    loadTasksFromLocalStorage();

    //---------------------------//
    //---Gestionarea Formularului//
    //---------------------------//

    // Gestionează trimiterea formularului
    taskForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Previne comportamentul implicit al formularului
        
        const taskName = taskInput.value.trim();
        if (!taskName) return; // Ignoră sarcinile goale

        const newTask = { id: Date.now(), name: taskName, completed: false };
        addTaskToDOM(newTask);
        saveTaskToLocalStorage(newTask);
        taskInput.value = ''; // Golește câmpul de introducere
    });

    //---------------------------//
    //---Adăugarea Sarcinii-----//
    //---------------------------//

    // Adaugă sarcina în DOM
    function addTaskToDOM(task) {
        const li = document.createElement('li');
        li.innerHTML = `
            <input type="checkbox" id="checkbox-${task.id}" class="custom-checkbox"  ${task.completed ? 'checked' : ''}>
            <label for="checkbox-${task.id}">${task.name}</label>
            <button type="button" data-id="${task.id}">x</button>
        `;
        taskList.appendChild(li);
    }

    //---------------------------//
    //--Salvarea și Încărcarea--//
    //---------------------------//

    // Salvează sarcina în localStorage
    function saveTaskToLocalStorage(task) {
        const tasks = getTasksFromLocalStorage();
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Încarcă sarcinile din localStorage și le afișează
    function loadTasksFromLocalStorage() {
        const tasks = getTasksFromLocalStorage();
        tasks.forEach(addTaskToDOM);
    }

    // Obține sarcinile din localStorage
    function getTasksFromLocalStorage() {
        return JSON.parse(localStorage.getItem('tasks')) || [];
    }

    //---------------------------//
    //---Actualizarea și Eliminarea//
    //---------------------------//

    // Elimină sarcina
    function removeTask(taskId) {
        let tasks = getTasksFromLocalStorage();
        tasks = tasks.filter(task => task.id !== taskId);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        // Re-aplică filtrul curent
        filterTasks(currentFilter);
    }

    // Actualizează starea de completare a sarcinii
    function updateTaskCompletion(taskId, isCompleted) {
        let tasks = getTasksFromLocalStorage();
        tasks = tasks.map(task => {
            if (task.id === taskId) {
                task.completed = isCompleted;
            }
            return task;
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    //---------------------------//
    //--Gestionarea Evenimentelor--//
    //---------------------------//

    // Delegare de evenimente pentru checkbox-uri și butoane de ștergere
    taskList.addEventListener('change', (event) => {
        if (event.target.type === 'checkbox') {
            const taskId = parseInt(event.target.id.replace('checkbox-', ''));
            updateTaskCompletion(taskId, event.target.checked);
        }
    });

    taskList.addEventListener('click', (event) => {
        if (event.target.tagName === 'BUTTON') {
            const taskId = parseInt(event.target.dataset.id);
            removeTask(taskId);
        }
    });

    //---------------------------//
    //-----Filtrarea Sarcinilor---//
    //---------------------------//

    // Filtrează sarcinile pe baza unei condiții
    function filterTasks(predicate) {
        taskList.innerHTML = ''; // Golește lista
        const tasks = getTasksFromLocalStorage();
        tasks.filter(predicate).forEach(addTaskToDOM);
    }

    // Definește funcția de filtrare curentă
    let currentFilter = () => true; // Implicit, arată toate sarcinile

    // Afișează toate sarcinile
    allButton.addEventListener('click', () => {
        currentFilter = () => true; // Afișează toate sarcinile
        filterTasks(currentFilter);
    });

    // Afișează sarcinile finalizate
    finishedButton.addEventListener('click', () => {
        currentFilter = task => task.completed; // Afișează sarcinile finalizate
        filterTasks(currentFilter);
    });

    // Afișează sarcinile nefinalizate
    unfinishedButton.addEventListener('click', () => {
        currentFilter = task => !task.completed; // Afișează sarcinile nefinalizate
        filterTasks(currentFilter);
    });
});
