const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const addBtn = document.getElementById("add-btn");
const emptyMessage = document.getElementById("empty-message");

let currentEditElement = null;
let currentStatusFilter = "all";

function addTask() {
  if (inputBox.value.trim() === "") {
    alert("Tuliskan sesuatu terlebih dahulu");
    return;
  }

  if (currentEditElement) {
    currentEditElement.firstChild.textContent = inputBox.value;
    addBtn.innerText = "Add";
    currentEditElement = null;
  } else {
    let li = document.createElement("li");

    let textNode = document.createTextNode(inputBox.value);
    li.appendChild(textNode);
    listContainer.appendChild(li);

    let editSpan = document.createElement("span");
    editSpan.innerHTML = "&#9998;";
    editSpan.className = "edit-btn";
    li.appendChild(editSpan);

    let deleteSpan = document.createElement("span");
    deleteSpan.innerHTML = "\u00d7";
    deleteSpan.className = "delete-btn";
    li.appendChild(deleteSpan);
  }

  inputBox.value = "";
  saveData();

  const activeBtn = document.querySelector(".filter-btn.active");
  filterTask(currentStatusFilter, activeBtn);
}

listContainer.addEventListener(
  "click",
  function (e) {
    if (e.target.tagName === "LI") {
      e.target.classList.toggle("centang");
      saveData();
      updateFilterDisplay();
    } else if (e.target.classList.contains("edit-btn")) {
      // Aksi tombol Edit
      let li = e.target.parentElement;
      inputBox.value = li.firstChild.textContent;
      inputBox.focus();
      addBtn.innerText = "Save";
      currentEditElement = li;
    } else if (e.target.classList.contains("delete-btn")) {
      let li = e.target.parentElement;
      if (currentEditElement === li) {
        inputBox.value = "";
        addBtn.innerText = "Add";
        currentEditElement = null;
      }
      li.remove();
      saveData();
      updateFilterDisplay();
    }
  },
  false,
);

function saveData() {
  localStorage.setItem("data", listContainer.innerHTML);
}

function showTask() {
  listContainer.innerHTML = localStorage.getItem("data") || "";
  updateFilterDisplay();
}

function updateFilterDisplay() {
  const activeBtn = document.querySelector(".filter-btn.active");
  filterTask(currentStatusFilter, activeBtn);
}

function filterTask(status, element) {
  currentStatusFilter = status;
  let buttons = document.querySelectorAll(".filter-btn");
  buttons.forEach((btn) => btn.classList.remove("active"));
  element.classList.add("active");

  let items = listContainer.getElementsByTagName("li");
  let visibleCount = 0;
  let totalCount = items.length;

  for (let i = 0; i < items.length; i++) {
    switch (status) {
      case "all":
        items[i].style.display = "block";
        visibleCount++;
        break;
      case "pending":
        if (!items[i].classList.contains("centang")) {
          items[i].style.display = "block";
          visibleCount++;
        } else {
          items[i].style.display = "none";
        }
        break;
      case "completed":
        if (items[i].classList.contains("centang")) {
          items[i].style.display = "block";
          visibleCount++;
        } else {
          items[i].style.display = "none";
        }
        break;
    }
  }

  if (totalCount === 0) {
    emptyMessage.innerText = "Belum ada tugas baru.";
    emptyMessage.style.display = "block";
  } else if (visibleCount === 0) {
    if (status === "pending") {
      emptyMessage.innerText = "Belum ada tugas yang dipending.";
    } else if (status === "completed") {
      emptyMessage.innerText = "Belum ada tugas yang selesai.";
    }
    emptyMessage.style.display = "block";
  } else {
    emptyMessage.style.display = "none";
  }
}

showTask();
