// ====== DOM Elements ======
const phasesContainer = document.getElementById("phasesContainer");
const addPhaseBtn = document.getElementById("addPhaseBtn");
const addResourceBtn = document.getElementById("addResourceBtn");
const resourcesList = document.getElementById("resourcesList");
const mainTitle = document.getElementById("mainTitle");
const currentYear = document.getElementById("currentYear");
const phaseSelect = document.getElementById("phaseSelect");
const exportPhaseBtn = document.getElementById("exportPhaseBtn");
const importPhaseBtn = document.getElementById("importPhaseBtn");

// ====== Initialize Current Year ======
currentYear.textContent = new Date().getFullYear();

// ====== Load Data from LocalStorage ======
let appData = JSON.parse(localStorage.getItem("progressTrackerData")) || {
  title: "My Progress Tracker",
  phases: [],
  resources: [],
};

// ====== Color Options for Task Categories ======
const colorOptions = [
  "blue",
  "purple",
  "green",
  "red",
  "yellow",
  "pink",
  "teal",
  "orange",
  "indigo",
];

// ====== Render Existing Data ======
function renderData() {
  mainTitle.textContent = appData.title;
  phasesContainer.innerHTML = "";
  resourcesList.innerHTML = "";
  appData.phases.forEach((phase, i) =>
    phasesContainer.appendChild(createPhaseElement(phase, i))
  );
  appData.resources.forEach((r, i) =>
    resourcesList.appendChild(createResourceElement(r, i))
  );
  refreshPhaseSelect();
}

function refreshPhaseSelect() {
  phaseSelect.innerHTML = "";
  if (appData.phases.length === 0) {
    const option = document.createElement("option");
    option.textContent = "No phases available";
    option.disabled = true;
    phaseSelect.appendChild(option);
    phaseSelect.disabled = true;
  } else {
    phaseSelect.disabled = false;
    appData.phases.forEach((phase, i) => {
      const option = document.createElement("option");
      option.value = i;
      option.textContent = phase.name;
      phaseSelect.appendChild(option);
    });
  }
}

function createPhaseElement(phase, phaseIndex) {
  const el = document.createElement("div");
  el.className =
    "bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 mb-8 phase-container";
  el.dataset.phaseIndex = phaseIndex;
  const total = phase.tasks.reduce((s, t) => s + t.items.length, 0);
  const done = phase.tasks.reduce(
    (s, t) => s + t.items.filter((x) => x.completed).length,
    0
  );
  const percent = total ? Math.round((done / total) * 100) : 0;
  el.innerHTML = `
    <div class="flex items-center mb-14">
      <input type="text" value="${phase.name}" class="phase-name-input bg-transparent border-b border-dashed border-blue-400 text-xl font-medium text-white focus:outline-none focus:border-solid px-2 w-[70%]">
      <button class="delete-phase-btn ml-4 text-red-400 hover:text-red-300">🗑️</button>
      <span class="ml-auto text-sm font-medium px-3 py-1 bg-gray-700 rounded-full text-blue-400 phase-progress">${done}/${total} (${percent}%)</span>
    </div>
    <div class="grid md:grid-cols-2 gap-4 tasks-container">
      ${phase.tasks
        .map(
          (t, taskIndex) => `
        <div class="border-l-4 border-${t.color}-500 pl-4 task-category" data-task-index="${taskIndex}">
          <div class="flex justify-between mb-2">
            <input type="text" value="${t.category}" class="task-category-input bg-transparent border-b border-dashed border-gray-500 text-white font-semibold focus:outline-none">
            <button class="delete-task-category-btn text-red-400">✖</button>
          </div>
          <ul class="space-y-3 task-items-list">
            ${t.items
              .map(
                (item, itemIndex) => `
              <li class="flex items-center task-item">
                <input type="checkbox" ${
                  item.completed ? "checked" : ""
                } class="task-checkbox form-checkbox h-5 w-5 text-${t.color}-500 rounded border-gray-600 focus:ring-${t.color}-500 bg-gray-700" data-item-index="${itemIndex}">
                <input type="text" value="${item.text}" class="task-item-input ml-2 bg-transparent border-b border-dashed border-gray-500 focus:outline-none focus:border-gray-400 w-full">
                <button class="delete-task-item-btn ml-2 text-gray-400 hover:text-red-400">🗑️</button>
              </li>
            `
              )
              .join("")}
          </ul>
          <button class="add-task-item-btn mt-2 text-xs text-gray-400 hover:text-blue-400">➕ Add Item</button>
        </div>
      `
        )
        .join("")}
    </div>
    <div class="flex justify-end mt-4">
      <button class="add-task-category-btn bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">➕ Add New Task Category</button>
    </div>
  `;
  return el;
}

function createResourceElement(resource, index) {
  const el = document.createElement("div");
  el.className =
    "bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 resource-item";
  el.dataset.resourceIndex = index;
  el.innerHTML = `
    <div class="flex justify-between items-start">
      <div class="flex-1">
        <h3 class="text-xl font-medium mb-2 text-white resource-name" contenteditable="true">${resource.name}</h3>
        <a href="${resource.url}" target="_blank" class="text-blue-400 hover:underline break-all resource-url" contenteditable="true">${resource.url}</a>
      </div>
      <button class="delete-resource-btn text-red-400 hover:text-red-300">🗑️</button>
    </div>
  `;
  return el;
}

function updateProgressCounters() {
  appData.phases.forEach((phase, i) => {
    const total = phase.tasks.reduce((s, t) => s + t.items.length, 0);
    const done = phase.tasks.reduce(
      (s, t) => s + t.items.filter((x) => x.completed).length,
      0
    );
    const percent = total ? Math.round((done / total) * 100) : 0;
    const el = document.querySelector(
      `.phase-container[data-phase-index="${i}"] .phase-progress`
    );
    if (el) el.textContent = `${done}/${total} (${percent}%)`;
  });
}

function saveData() {
  localStorage.setItem("progressTrackerData", JSON.stringify(appData));
  updateProgressCounters();
}

mainTitle.addEventListener("blur", () => {
  appData.title = mainTitle.textContent;
  saveData();
});

addPhaseBtn.addEventListener("click", () => {
  appData.phases.push({
    name: `New Phase ${appData.phases.length + 1}`,
    tasks: [
      {
        category: "New Category",
        color: colorOptions[Math.floor(Math.random() * colorOptions.length)],
        items: [
          { text: "Task 1", completed: false },
          { text: "Task 2", completed: false },
        ],
      },
    ],
  });
  saveData();
  renderData();
});

addResourceBtn.addEventListener("click", () => {
  const name = prompt("Enter resource name:");
  if (!name) return;
  const url = prompt("Enter resource URL:");
  if (!url) return;
  appData.resources.push({ name, url });
  saveData();
  renderData();
});

document.addEventListener("click", (e) => {
  const phaseEl = e.target.closest(".phase-container");
  const phaseIndex = phaseEl ? +phaseEl.dataset.phaseIndex : null;

  if (e.target.closest(".delete-phase-btn")) {
    appData.phases.splice(phaseIndex, 1);
    saveData();
    renderData();
  }

  if (e.target.closest(".add-task-category-btn")) {
    appData.phases[phaseIndex].tasks.push({
      category: "New Category",
      color: colorOptions[Math.floor(Math.random() * colorOptions.length)],
      items: [{ text: "New Task", completed: false }],
    });
    saveData();
    renderData();
  }

  if (e.target.closest(".delete-task-category-btn")) {
    const taskEl = e.target.closest(".task-category");
    const taskIndex = +taskEl.dataset.taskIndex;
    appData.phases[phaseIndex].tasks.splice(taskIndex, 1);
    saveData();
    renderData();
  }

  if (e.target.closest(".add-task-item-btn")) {
    const taskEl = e.target.closest(".task-category");
    const taskIndex = +taskEl.dataset.taskIndex;
    appData.phases[phaseIndex].tasks[taskIndex].items.push({
      text: "New Item",
      completed: false,
    });
    saveData();
    renderData();
  }

  if (e.target.closest(".delete-task-item-btn")) {
    const itemEl = e.target.closest(".task-item");
    const taskEl = itemEl.closest(".task-category");
    const taskIndex = +taskEl.dataset.taskIndex;
    const itemIndex = Array.from(taskEl.querySelectorAll(".task-item")).indexOf(
      itemEl
    );
    appData.phases[phaseIndex].tasks[taskIndex].items.splice(itemIndex, 1);
    saveData();
    renderData();
  }

  if (e.target.closest(".delete-resource-btn")) {
    const resEl = e.target.closest(".resource-item");
    const resIndex = +resEl.dataset.resourceIndex;
    appData.resources.splice(resIndex, 1);
    saveData();
    renderData();
  }
});

document.addEventListener("change", (e) => {
  if (e.target.classList.contains("task-checkbox")) {
    const itemEl = e.target.closest(".task-item");
    const taskEl = itemEl.closest(".task-category");
    const phaseIndex = +itemEl.closest(".phase-container").dataset.phaseIndex;
    const taskIndex = +taskEl.dataset.taskIndex;
    const itemIndex = Array.from(taskEl.querySelectorAll(".task-item")).indexOf(
      itemEl
    );
    appData.phases[phaseIndex].tasks[taskIndex].items[itemIndex].completed =
      e.target.checked;
    saveData();
  }
});

document.addEventListener("input", (e) => {
  if (e.target.classList.contains("phase-name-input")) {
    const i = +e.target.closest(".phase-container").dataset.phaseIndex;
    appData.phases[i].name = e.target.value;
    saveData();
    refreshPhaseSelect(); // refresh phaseSelect so name update appears in dropdown
  }
  if (e.target.classList.contains("task-category-input")) {
    const taskEl = e.target.closest(".task-category");
    const phaseIndex = +taskEl.closest(".phase-container").dataset.phaseIndex;
    const taskIndex = +taskEl.dataset.taskIndex;
    appData.phases[phaseIndex].tasks[taskIndex].category = e.target.value;
    saveData();
  }
  if (e.target.classList.contains("task-item-input")) {
    const itemEl = e.target.closest(".task-item");
    const taskEl = itemEl.closest(".task-category");
    const phaseIndex = +itemEl.closest(".phase-container").dataset.phaseIndex;
    const taskIndex = +taskEl.dataset.taskIndex;
    const itemIndex = Array.from(taskEl.querySelectorAll(".task-item")).indexOf(
      itemEl
    );
    appData.phases[phaseIndex].tasks[taskIndex].items[itemIndex].text =
      e.target.value;
    saveData();
  }
});

document.addEventListener("input", (e) => {
  if (e.target.classList.contains("resource-name")) {
    const i = +e.target.closest(".resource-item").dataset.resourceIndex;
    appData.resources[i].name = e.target.textContent;
    saveData();
  }
  if (e.target.classList.contains("resource-url")) {
    const i = +e.target.closest(".resource-item").dataset.resourceIndex;
    appData.resources[i].url = e.target.textContent;
    saveData();
  }
});

// ====== Import/Export Phase Logic ======

// Export phase as downloadable JSON file
exportPhaseBtn.addEventListener("click", () => {
  const selectedIndex = phaseSelect.value;
  if (
    selectedIndex === null ||
    selectedIndex === undefined ||
    appData.phases.length === 0
  ) {
    alert("No phase selected or no phases available.");
    return;
  }
  const phaseData = appData.phases[selectedIndex];
  const json = JSON.stringify(phaseData, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;

  // Clean filename: remove special chars, spaces to underscore
  const safeFileName =
    phaseData.name.replace(/[^\w\s-]/g, "").replace(/\s+/g, "_") + ".json";

  a.download = safeFileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
});

// Import phase JSON from selected file and add or replace phase
importPhaseBtn.addEventListener("click", () => {
  if (appData.phases.length === 0) {
    alert("No phases available to import into. Please add a phase first.");
    return;
  }
  const selectedIndex = phaseSelect.value;
  if (selectedIndex === null || selectedIndex === undefined) {
    alert("Please select a phase to replace.");
    return;
  }

  // Create invisible file input
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = ".json,application/json";
  fileInput.style.display = "none";

  fileInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsedPhase = JSON.parse(e.target.result);
        if (
          typeof parsedPhase.name !== "string" ||
          !Array.isArray(parsedPhase.tasks)
        ) {
          throw new Error("Invalid phase data structure.");
        }
        // Replace phase at selected index
        appData.phases[selectedIndex] = parsedPhase;
        saveData();
        renderData();

        // Set dropdown to the newly imported phase
        phaseSelect.value = selectedIndex;

        alert(`Phase "${parsedPhase.name}" imported successfully!`);
      } catch (err) {
        alert("Failed to import phase: " + err.message);
      }
    };
    reader.readAsText(file);
  });

  document.body.appendChild(fileInput);
  fileInput.click();
  fileInput.remove();
});

// ====== Ctrl + Enter + Backspace shortcut to clear all data ======

const keyState = {
  ctrl: false,
  enter: false,
  backspace: false,
};

document.addEventListener("keydown", (e) => {
  if (e.key === "Control") keyState.ctrl = true;
  if (e.key === "Enter") keyState.enter = true;
  if (e.key === "Backspace") keyState.backspace = true;

  if (keyState.ctrl && keyState.enter && keyState.backspace) {
    if (confirm("Are you sure you want to clear ALL data?")) {
      localStorage.removeItem("progressTrackerData");
      location.reload();
    }
  }
});

document.addEventListener("keyup", (e) => {
  if (e.key === "Control") keyState.ctrl = false;
  if (e.key === "Enter") keyState.enter = false;
  if (e.key === "Backspace") keyState.backspace = false;
});

// ====== Initial render ======
renderData();
