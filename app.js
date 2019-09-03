
// Global Array that will aid in task manipulation
let TASK_ARRAY = [];
let dragged;
let droppedOn;

class Task {

	constructor(description, taskColor = '#4EB9cd') {
		this.description = description;
		this.taskColor = taskColor;
		this.taskList = document.getElementById('taskList');
		this.listItem = this.createListItem(description);
		this.addEditButton();
		this.addDeleteButton();
		this.addReOrdering();
		this.updateLocalStorage();
	}

	createListItem(description) {
		let li = document.createElement('li');
		li.setAttribute('draggable', 'true');
		let liText = document.createElement('span');
		liText.appendChild(document.createTextNode(description))
		li.appendChild(liText);
		return li;
	}

	addDeleteButton() {
		let deleteBtn = document.createElement('button');
		deleteBtn.appendChild(document.createTextNode('X'));
		deleteBtn.addEventListener('click', (event) => {
			let taskDescription = event.target.parentNode.querySelector('span').textContent;

			for(let i = 0; i < TASK_ARRAY.length; ++i) {
				if(taskDescription == TASK_ARRAY[i].description) {
					TASK_ARRAY.splice(i,1);
					break;
				}
			}
			localStorage.setItem('tasks', JSON.stringify(TASK_ARRAY));
			event.target.parentNode.remove();
		});
		this.listItem.appendChild(deleteBtn);
	}

	addEditButton() {
		this.listItem.querySelector('span').addEventListener('click', (event) => {
				let editModal = document.querySelector('.editTaskModal');
				editModal.style.display = 'block';
				let newDescription = editModal.querySelector('.modal-content input');
				newDescription.style.backgroundColor = this.taskColor;
				newDescription.addEventListener('change', (event) => {
						this.listItem.querySelector('span').textContent = event.target.value;
						editModal.style.display = 'none';
						restoreEditModal();
				});
		});
	}

	addReOrdering() {


		this.listItem.addEventListener('dragover', (e) => {
			e.preventDefault();

		});

		this.listItem.addEventListener('dragstart', (event) => {
			dragged = event.target.textContent;
			dragged = dragged.split('X');
			dragged = dragged[0];
			console.log(`dragging from ${dragged}`);
			for(let i = 0; i < TASK_ARRAY.length; ++i) {
				if(dragged == TASK_ARRAY[i].description) {
					dragged = i;
					console.log('found dragged');
					console.log(dragged);
				}

			}



		});

		this.listItem.addEventListener('drop', (event) => {

			droppedOn = event.target.textContent;
			droppedOn = droppedOn.split('X');
			droppedOn = droppedOn[0]
			console.log(`dropped on ${droppedOn}`);
			//console.log(droppedOn);

			for(let j = 0; j < TASK_ARRAY.length; ++j) {
				if(droppedOn == TASK_ARRAY[j].description) {
					droppedOn = j;
					console.log('found dropped');
					console.log(droppedOn);

				}


			}

			let tmp = TASK_ARRAY[dragged];
			TASK_ARRAY[dragged] = TASK_ARRAY[droppedOn];
			TASK_ARRAY[droppedOn] = tmp;

			console.log(TASK_ARRAY);
			console.log(dragged);
			console.log(droppedOn);

			//console.log(TASK_ARRAY);

			localStorage.setItem('tasks', JSON.stringify(TASK_ARRAY));
			window.location = './index.html';


		});
	}

	async updateLocalStorage() {

		let obj = {
			'category': this.taskColor,
			'description': this.description
		};

		TASK_ARRAY.push(obj);
		await localStorage.setItem('tasks', JSON.stringify(TASK_ARRAY));


	}

	addTask() {
		this.listItem.setAttribute('style', 'background-color: ##4EB9cd');
		this.taskList.appendChild(this.listItem);

	}


} // Task class end

class SchoolTask extends Task {
	constructor(description) {
		super(description, '#ffb6c1');
		//console.log(this.taskColor);
	}
	addSchoolTask() {
		this.listItem.setAttribute('style', 'background-color: #ffb6c1');
		this.taskList.appendChild(this.listItem);

	}
}

class WorkTask extends Task {
	constructor(description) {
		super(description, 'black');
		//console.log(this.taskColor);
	}
	addWorkTask() {
		this.listItem.setAttribute('style', 'background-color: black');
		this.taskList.appendChild(this.listItem);

	}
}

function renderTask(description) {
	let task = new Task(description);
	task.addTask();
}

function renderSchoolTask(description) {
	let task = new SchoolTask(description);
	task.addSchoolTask();
}

function renderWorkTask(description) {
	let task = new WorkTask(description);
	task.addWorkTask();
}

function loadTasks() {
	// New user
	if(localStorage.getItem('tasks')) {
		let tasks = JSON.parse(localStorage.getItem('tasks'));
		//console.log(tasks[0].category);
		for(let i = 0; i < tasks.length; ++i) {

			switch (tasks[i].category) {

				case '#4EB9cd':
					renderTask(tasks[i].description);
					break;

				case '#ffb6c1':
					renderSchoolTask(tasks[i].description);
					break;

				case 'black':
					renderWorkTask(tasks[i].description);
					break;

				default: alert('NOT FOUND');

			}
		}
	}
}

loadTasks();


function restoreModal() {
		let addTaskModal = document.querySelector('.addTaskModal');
		//console.log(addTaskModal);

		addTaskModal.innerHTML = `<div class="modal-content col-6">
			<span class="close">&times;</span>
			<br>

			<select class="col-12">
				<option value=""> Select the task's category </option>
				<option value="1"> Generic </option>
				<option value="2"> School </option>
				<option value="3"> Work </option>

			</select>
			<br>

		</div>`;
}

function restoreEditModal() {
	let editTaskModal = document.querySelector('.editTaskModal');
	editTaskModal.innerHTML = `<!-- Modal content -->
			<div class="modal-content col-6">
				<span class="close">&times;</span>
				<br>
				<input class="col-12">
				<br>

			</div>`;
}

function closeEditModal() {
	let editModal = document.querySelector('.editTaskModal');
	editModal.style.display = 'none';
}

function openModal() {
	// Get modal HTML
	let addTaskModal = document.querySelector('.addTaskModal');

	// Activate the modal
	addTaskModal.style.display = 'block';

	// Close modal through button
	let closeBtn = addTaskModal.querySelector('span');
	closeBtn.addEventListener('click', () => {
		addTaskModal.style.display = 'none'
		restoreModal();
	});

	// Selection HMTL
	let taskSelection = addTaskModal.querySelector('select');

	// I'm tired
	taskSelection.addEventListener('change',
	(event) => {
		if(event.target.options.selectedIndex > 0)
		createModalFields(event.target.parentNode, event.target.options.selectedIndex)
	});


}

function createModalFields(form, category) {

	switch (category) {
		case 1:
			genericFields(form);
			break;
		case 2:
			schoolFields(form);
			break;
		case 3:
			workFields(form);
			break;
		default:
			alert('Choose a valid option!');

	}
	//console.log(form);
}

function genericFields(form){
	//console.log(form);

	// remove task selection
	form.querySelector('select').remove();

	// create title
	let taskTitle = document.createElement('h2');
	taskTitle.textContent = 'Generic Task';
	taskTitle.style.color = '#4EB9cd';
	form.appendChild(taskTitle);

	// create input
	let input = document.createElement('input');
	input.style.backgroundColor = '#4EB9cd';
	input.style.color = 'white';

	// by pressing enter the user creates a task
	input.addEventListener('change', (e) => {
	event.target.parentNode.parentNode.style.display = 'none';

	// Create class instance and use its methods to add tasks
	let task = new Task(e.srcElement.value);
	task.addTask();

	restoreModal();
	});
	form.appendChild(input);



}


function schoolFields(form) {
	//console.log(form);
	// remove task selection
	form.querySelector('select').remove();

	// create title
	let taskTitle = document.createElement('h2');
	taskTitle.textContent = 'School Task';
	taskTitle.style.color = '#ffb6c1';
	form.appendChild(taskTitle);

	// create input
	let input = document.createElement('input');
	input.style.backgroundColor = '#ffb6c1';
	input.style.color = 'white';
	form.appendChild(input);

	// by pressing enter the user creates a task
	input.addEventListener('change', (e) => {
	event.target.parentNode.parentNode.style.display = 'none';
	let task = new SchoolTask(e.srcElement.value);
	task.addSchoolTask();

	restoreModal();
	});

	form.appendChild(input);
}

function workFields(form) {
	console.log(form);
	// remove task selection
	form.querySelector('select').remove();

	// create title
	let taskTitle = document.createElement('h2');
	taskTitle.textContent = 'Work Task';
	taskTitle.style.color = 'black';
	form.appendChild(taskTitle);

	// create input
	let input = document.createElement('input');
	input.style.backgroundColor = 'black';
	input.style.color = 'white';
	form.appendChild(input);

	// by pressing enter the user creates a task
	input.addEventListener('change', (e) => {
	event.target.parentNode.parentNode.style.display = 'none';
	let task = new WorkTask(e.srcElement.value);
	task.addWorkTask();
	restoreModal();
	});

	form.appendChild(input);
}


async function deleteToDoList() {

	localStorage.clear();
	await localStorage.setItem('tasks', '');
	let toDoList = document.getElementById('taskList');
	toDoList.innerHTML = '';

}
