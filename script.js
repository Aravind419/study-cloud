// Global variables
let currentSubject = "Mobile App Dev Lab";
const subjects = [
  "Mobile App Dev Lab",
  "Object-Oriented Software Engineering",
  "Industrial Engineering",
  "Data Warehousing",
  "Network Security",
  "Multimedia & Animation",
  "3D Printing & Design",
  "Well-Being & Yoga",
];

// Retrieve or initialize study hub data from localStorage
let studyHubData = JSON.parse(localStorage.getItem("studyHubData")) || {};
subjects.forEach((subject) => {
  if (!studyHubData[subject]) {
    studyHubData[subject] = { code: "", pdfs: [], images: [], tasks: [] };
  }
});
localStorage.setItem("studyHubData", JSON.stringify(studyHubData));

// Utility function to update localStorage
function saveData() {
  localStorage.setItem("studyHubData", JSON.stringify(studyHubData));
}

// Function to render subject data
function loadSubjectData() {
  const data = studyHubData[currentSubject];
  // Update code area
  document.getElementById("codeArea").value = data.code || "";
  // Update saved code summary (first 100 characters)
  document.getElementById("savedCodeDisplay").textContent = data.code
    ? data.code.slice(0, 100) + (data.code.length > 100 ? "..." : "")
    : "No code saved yet.";

  // Render PDFs list
  renderFileList("pdfs", data.pdfs, "pdfList");
  // Render Images list
  renderFileList("images", data.images, "imageList", true);
  // Render tasks
  renderTasks(data.tasks);
  // Update subject title
  document.getElementById("subjectTitle").textContent = currentSubject;
}

// Function to render file lists for PDFs and images
// Function to render file lists for PDFs and images
function renderFileList(type, files, listId, isImage = false) {
  const list = document.getElementById(listId);
  list.innerHTML = "";
  files.forEach((file, index) => {
    const li = document.createElement("li");

    if (isImage) {
      const img = document.createElement("img");
      img.src = file.dataUrl;
      img.alt = file.fileName;
      img.style.height = "40px";
      img.style.marginRight = "10px";
      li.appendChild(img);
    }

    const span = document.createElement("span");
    span.textContent = file.fileName;
    li.appendChild(span);

    const link = document.createElement("a");
    link.href = file.dataUrl;
    link.download = file.fileName;
    link.textContent = "Download";
    link.style.color = "#fff";
    link.style.textDecoration = "underline";
    li.appendChild(link);

    // ❌ Add Delete Button ❌
    const delButton = document.createElement("button");
    delButton.textContent = "❌";
    delButton.style.marginLeft = "10px";
    delButton.addEventListener("click", () => {
      studyHubData[currentSubject][type].splice(index, 1);
      saveData();
      renderFileList(type, studyHubData[currentSubject][type], listId, isImage);
    });

    li.appendChild(delButton);
    list.appendChild(li);
  });
}


// Function to render tasks list
function renderTasks(tasks) {
  const list = document.getElementById("taskList");
  list.innerHTML = "";
  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    const span = document.createElement("span");
    span.textContent = task;
    li.appendChild(span);
    const delButton = document.createElement("button");
    delButton.textContent = "❌";
    delButton.dataset.index = index;
    delButton.addEventListener("click", () => {
      studyHubData[currentSubject].tasks.splice(index, 1);
      saveData();
      renderTasks(studyHubData[currentSubject].tasks);
    });
    li.appendChild(delButton);
    list.appendChild(li);
  });
}

// Event Listeners for Tabs
document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document
      .querySelectorAll(".tab")
      .forEach((btn) => btn.classList.remove("active"));
    document
      .querySelectorAll(".tab-content")
      .forEach((content) => content.classList.remove("active"));
    tab.classList.add("active");
    document
      .getElementById(tab.getAttribute("data-tab"))
      .classList.add("active");
  });
});

// Event Listeners for Sidebar Subjects
document.querySelectorAll("#subjectList li").forEach((li) => {
  li.addEventListener("click", () => {
    document
      .querySelectorAll("#subjectList li")
      .forEach((item) => item.classList.remove("active"));
    li.classList.add("active");
    currentSubject = li.getAttribute("data-subject");
    loadSubjectData();
  });
});

// Save Code button
document.getElementById("saveCode").addEventListener("click", () => {
  const codeText = document.getElementById("codeArea").value;
  studyHubData[currentSubject].code = codeText;
  saveData();
  document.getElementById("savedCodeDisplay").textContent = codeText
    ? codeText.slice(0, 100) + (codeText.length > 100 ? "..." : "")
    : "No code saved yet.";
  alert("Code saved! 💾");
});

// Upload PDF button
document.getElementById("uploadPDF").addEventListener("click", () => {
  const pdfInput = document.getElementById("pdfInput");
  if (pdfInput.files.length === 0) {
    alert("Please select a PDF file! 📄");
    return;
  }
  const file = pdfInput.files[0];
  const reader = new FileReader();
  reader.onload = function (e) {
    studyHubData[currentSubject].pdfs.push({
      fileName: file.name,
      dataUrl: e.target.result,
    });
    saveData();
    renderFileList("pdfs", studyHubData[currentSubject].pdfs, "pdfList");
    pdfInput.value = "";
    alert("PDF uploaded! 📄");
  };
  reader.readAsDataURL(file);
});

// Upload Image button
document.getElementById("uploadImage").addEventListener("click", () => {
  const imageInput = document.getElementById("imageInput");
  if (imageInput.files.length === 0) {
    alert("Please select an image file! 🖼️");
    return;
  }
  const file = imageInput.files[0];
  const reader = new FileReader();
  reader.onload = function (e) {
    studyHubData[currentSubject].images.push({
      fileName: file.name,
      dataUrl: e.target.result,
    });
    saveData();
    renderFileList(
      "images",
      studyHubData[currentSubject].images,
      "imageList",
      true
    );
    imageInput.value = "";
    alert("Image uploaded! 🖼️");
  };
  reader.readAsDataURL(file);
});

// Task add button
document.getElementById("addTask").addEventListener("click", () => {
  const taskInput = document.getElementById("taskInput");
  const taskText = taskInput.value.trim();
  if (!taskText) {
    alert("Please enter a task! ✅");
    return;
  }
  studyHubData[currentSubject].tasks.push(taskText);
  saveData();
  renderTasks(studyHubData[currentSubject].tasks);
  taskInput.value = "";
  alert("Task added! ✅");
});

// Camera functionality for capturing image
const captureBtn = document.getElementById("captureImage");
const cameraSection = document.getElementById("cameraSection");
const video = document.getElementById("video");
const snapBtn = document.getElementById("snap");
const closeCameraBtn = document.getElementById("closeCamera");
const canvas = document.getElementById("canvas");

captureBtn.addEventListener("click", () => {
  // Show camera section
  cameraSection.style.display = "block";
  // Access camera
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        video.srcObject = stream;
        video.play();
      })
      .catch((err) => {
        alert("Could not access the camera! 📷");
      });
  } else {
    alert("Camera API not supported in your browser! 📷");
  }
});

snapBtn.addEventListener("click", () => {
  const context = canvas.getContext("2d");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  // Stop camera stream
  const stream = video.srcObject;
  const tracks = stream.getTracks();
  tracks.forEach((track) => track.stop());
  video.srcObject = null;
  cameraSection.style.display = "none";
  // Convert canvas to image data URL
  const dataUrl = canvas.toDataURL("image/png");
  // Save captured image
  studyHubData[currentSubject].images.push({
    fileName: "captured_" + new Date().toLocaleString() + ".png",
    dataUrl: dataUrl,
  });
  saveData();
  renderFileList(
    "images",
    studyHubData[currentSubject].images,
    "imageList",
    true
  );
  alert("Image captured and saved! 📷");
});

closeCameraBtn.addEventListener("click", () => {
  if (video.srcObject) {
    const stream = video.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach((track) => track.stop());
    video.srcObject = null;
  }
  cameraSection.style.display = "none";
});

// Initial load
loadSubjectData();

function deletePDF(index) {
  let pdfs = JSON.parse(localStorage.getItem("pdfs") || "[]");
  pdfs.splice(index, 1);
  localStorage.setItem("pdfs", JSON.stringify(pdfs));
  document.querySelector("#pdfList").innerHTML = "";
  displayPDFs();
}

// Delete Image
function deleteImage(index) {
  let images = JSON.parse(localStorage.getItem("images") || "[]");
  images.splice(index, 1);
  localStorage.setItem("images", JSON.stringify(images));
  document.querySelector("#imageList").innerHTML = "";
  displayImages();
}

// Delete Task
function deleteTask(index) {
  let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
  tasks.splice(index, 1);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  document.querySelector("#taskList").innerHTML = "";
  displayTasks();
}