const taskList = document.getElementById("taskList");
const taskInput = document.getElementById("taskInput");
const prioritySelect = document.getElementById("prioritySelect");

window.onload = () => {
  const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
  tasks.forEach((t) => createTask(t.text, t.done, t.priority));
  if (localStorage.getItem("theme") === "dark")
    document.body.classList.add("dark");
};

function saveTasks() {
  const tasks = Array.from(taskList.children).map((li) => ({
    text: li.querySelector(".text").textContent,
    done: li.querySelector(".text").classList.contains("done"),
    priority: li.dataset.priority,
  }));
  localStorage.setItem("tasks", JSON.stringify(tasks));
  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark") ? "dark" : "light"
  );
}

function createTask(text, done = false, priority = "medium") {
  const li = document.createElement("li");
  li.dataset.priority = priority;

  const textSpan = document.createElement("span");
  textSpan.className = "text";
  textSpan.textContent = text;
  if (done) textSpan.classList.add("done");

  const badge = document.createElement("span");
  badge.className = "badge " + priority;
  const icon =
    priority === "high" ? "⚠️" : priority === "medium" ? "🔹" : "✅";
  badge.textContent =
    icon + " " + priority.charAt(0).toUpperCase() + priority.slice(1);

  li.append(textSpan, badge);

  const icons = document.createElement("div");
  icons.className = "icons";

  const doneBtn = document.createElement("span");
  doneBtn.textContent = "✔";
  doneBtn.onclick = () => {
    textSpan.classList.toggle("done");
    badge.classList.toggle("done");
    doneBtn.style.animation = "checkBounce 0.3s";
    badge.style.animation = "badgeBounce 0.3s";
    setTimeout(() => {
      doneBtn.style.animation = "";
      badge.style.animation = "";
    }, 300);
    saveTasks();
  };

  const editBtn = document.createElement("span");
  editBtn.textContent = "✎";
  editBtn.onclick = () => {
    const n = prompt("Edit task:", textSpan.textContent);
    if (n && n.trim() !== "") {
      textSpan.textContent = n.trim();
      saveTasks();
    }
  };

  const deleteBtn = document.createElement("span");
  deleteBtn.textContent = "🗑";
  deleteBtn.onclick = () => {
    li.style.opacity = 0;
    li.style.transform = "translateX(50px)";
    setTimeout(() => {
      li.remove();
      saveTasks();
    }, 300);
  };

  icons.append(doneBtn, editBtn, deleteBtn);
  li.appendChild(icons);

  taskList.appendChild(li);
  setTimeout(() => li.classList.add("show"), 10);
}

function addTask() {
  const v = taskInput.value.trim();
  if (!v) return;
  createTask(v, false, prioritySelect.value);
  taskInput.value = "";
  saveTasks();
}

function toggleTheme() {
  document.body.classList.toggle("dark");
  saveTasks();
}

taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTask();
});
