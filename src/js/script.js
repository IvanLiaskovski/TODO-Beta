"use strict";

//Array to get tasks object from localstorage
let localStorageArr = JSON.parse(localStorage.getItem("task")) || [];

const todoBody = selectElement(".todo-body");

// Counts Active items
let count = todoBody.children.length;


//Functions to get element/elements

function selectElement(selector) {
	return document.querySelector(selector);
}
function selectElements(selector) {
	return document.querySelectorAll(selector);
}

selectElement("#todo-val").addEventListener("keydown", event => {
	if (event.keyCode == 13) addTask();
});


//Add events to Buttons

selectElement("#todo-add").onclick = addTask;
selectElement("#check-all").onclick = checkAll;
selectElement("#clear-completed").onclick = clearCompleteTask;


//Set count in active items

function setCount() {
	const activeItems = selectElement("#active-items");
	let word = count > 1 ? "aktywnych" : "aktywny";
	activeItems.textContent = `${count} ${word}`;
}


function addTask() {
	let todoVal = selectElement("#todo-val");
	const container = selectElement(".todo-container");

	//Check if value is not failed
	if (todoVal.value == "") {
		container.classList.add("active");
		setTimeout(() => {
			container.classList.remove("active");
		}, 800);
		return false;
	}
	createTask(todoVal);
	mark();
	close();
	checkEmpty();
	checkTab();
	setCount();
}

function checkAll() {
	const checkMark = selectElements(".check-mark");
	const todoTitle = selectElements(".todo-title");

	for (let i = 0; i < checkMark.length; i++) {
		checkMark[i].classList.add("active");
		todoTitle[i].classList.add("active");
		localStorageArr[i].check = true;
	}
	count = 0;
	setCount();
}

function clearCompleteTask() {
	const checkMark = selectElements(".check-mark");

	for (let i = 0; i < checkMark.length; i++) {
		if (checkMark[i].classList.contains("active")) {
			checkMark[i].parentElement.parentElement.remove();
			localStorageArr.splice(i, 1, "");
		}
	}
	filterStorage();
	close();
	mark();
	checkEmpty();
}


selectElement("#choose-all").onclick = chooseAll;
selectElement("#choose-active").onclick = chooseActive;
selectElement("#choose-completed").onclick = chooseCompleted;


//Functions for Tabs 

function chooseAll() {
	const task = selectElements(".task");
	for (let t of task) {
		t.style.display = "flex";
	}
}

function chooseActive() {
	const checkMark = selectElements(".check-mark");

	for (let mark of checkMark) {
		if (!mark.classList.contains("active")) {
			mark.parentElement.parentElement.style.display = "flex";
		}
		else if (mark.classList.contains("active")) {
			mark.parentElement.parentElement.style.display = "none";
		}
	}
}

function chooseCompleted() {
	const checkMark = selectElements(".check-mark");

	for (let mark of checkMark) {
		if (mark.classList.contains("active")) {
			mark.parentElement.parentElement.style.display = "flex";
		}
		else if (!mark.classList.contains("active")) {
			mark.parentElement.parentElement.style.display = "none";
		}
	}
}

function createTask(val) {
	let newElement = document.createElement("div");
	newElement.innerHTML = `<div><a class="check-mark">&#10004;</a><p class="todo-title">${val.value}</p>
	</div><div><button class="close">&times;</button></div>`;
	newElement.className = "task";
	todoBody.append(newElement);

	//Update localStorage
	let obj = new Task(val.value, false);
	localStorageArr.push(obj);
	count++;
	val.value = "";
	val.focus();
}


/*Function to event when you add task and tabs is mark on compleate,
result you add active task to compleate, this function fix it.*/

function checkTab() {
	let activeTab = selectElement(".active-sort");

	if (activeTab.id == "choose-active") {
		chooseActive();
	}
	else if (activeTab.id == "choose-completed") {
		chooseCompleted();
	}
}


//Function to give functional check marks 

function mark() {
	let checkMark = selectElements(".check-mark");
	let todoTitle = selectElements(".todo-title");

	for (let i = 0; i < checkMark.length; i++) {
		checkMark[i].onclick = function () {
			this.classList.toggle("active");

			if (todoTitle[i].classList.contains("active")) {
				todoTitle[i].classList.remove("active");
				localStorageArr[i].check = false;
				count++;
			}
			else {
				todoTitle[i].classList.add("active");
				localStorageArr[i].check = true;
				count--;
			}
			checkTab();
			setCount();
		}
	}
}

//Function to give functional close buttons

function close() {
	let todoClose = selectElements(".close");

	for (let i = 0; i < todoClose.length; i++) {
		todoClose[i].onclick = function () {
			if (this.parentElement.previousElementSibling.getElementsByTagName("a")[0]
				.classList.contains("active")) {
				count = count;
			}
			else count--;

			this.parentElement.parentElement.remove();
			localStorageArr.splice(i, 1, "");

			filterStorage();
			checkEmpty();
			close();
			mark();
			setCount();
		}
	}
}


//Check active Tabs function

function markTabs() {
	const tabs = selectElements(".sort-task li");
	for (let tab of tabs) {
		tab.addEventListener("click", function () {
			const activeTab = selectElement(".active-sort");
			activeTab.classList.remove("active-sort");
			this.classList.add("active-sort");
		})
	}
}


//Check if todo body is empty

function checkEmpty() {
	const todoFooter = selectElement(".todo-footer");

	if (todoBody.children.length == 0) {
		todoFooter.style.display = "none";
	}
	else {
		todoFooter.style.display = "flex";
	}
}


//Use data from localStorage

document.addEventListener("DOMContentLoaded", () => {
	for (let i = 0; i < localStorageArr.length; i++) {
		let newElement = document.createElement("div");
		let check = (localStorageArr[i].check == true) ? "active" : "";

		newElement.innerHTML = `<div><a class="check-mark ${check}">&#10004;</a><p class="todo-title ${check}">${localStorageArr[i].value}</p>
	</div><div><button class="close">&times;</button></div>`;
		newElement.className = "task";
		todoBody.append(newElement);

		if (check == "") count++;
	}
	mark();
	close();
	checkEmpty();
	setCount();
	markTabs();
});

function filterStorage() {
	localStorageArr = localStorageArr.filter(item => item != "");
}


//Save localStorage

window.onunload = () => {
	filterStorage();
	localStorage.task = JSON.stringify(localStorageArr);
}

