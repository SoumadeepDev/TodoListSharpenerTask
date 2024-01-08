import { renderNotes } from "./app.js";
const title = document.querySelector(".title");
const note = document.querySelector(".note");
const addButton = document.querySelector(".add-btn");
const notesDisplay = document.querySelector(".notes-display");
const showCompletedNotes = document.querySelector(".pinned-notes-container");
const showOtherNotes = document.querySelector(".notes-container");
const pinTitle = document.querySelector(".pin-title");
const otherTitle = document.querySelector(".other-title");

// Load notes from localStorage or take an empty array
let arrayofNotes = JSON.parse(localStorage.getItem("todokey")) || [];
// Separate completed and other notes for rendering
const completedNotes = arrayofNotes.filter(({ isCompleted }) => isCompleted);
const otherNotes = arrayofNotes.filter(({ isCompleted }) => !isCompleted);

// Render notes on page load
showCompletedNotes.innerHTML = renderNotes(completedNotes);
showOtherNotes.innerHTML = renderNotes(otherNotes);

// Toggle visibility of title elements based on notes existence
function toggleTitleVisibility() {
  if (arrayofNotes.length > 0) {
    pinTitle.classList.remove("d-none");
    otherTitle.classList.remove("d-none");
  } else {
    pinTitle.classList.add("d-none");
    otherTitle.classList.add("d-none");
  }
}

// Initial toggle on page load
window.addEventListener("DOMContentLoaded", () => {
  toggleTitleVisibility();
});

addButton.addEventListener("click", () => {
  if (title.value.trim().length > 0 || note.value.trim().length > 0) {
    const newNote = {
      title: title.value.trim(),
      note: note.value.trim(),
      id: Date.now(),
      isCompleted: false,
    };

    arrayofNotes = [...arrayofNotes, newNote];

    if (newNote.isCompleted) {
      showCompletedNotes.innerHTML = renderNotes([
        ...arrayofNotes.filter(({ isCompleted }) => isCompleted),
      ]);
    } else {
      showOtherNotes.innerHTML = renderNotes([
        ...arrayofNotes.filter(({ isCompleted }) => !isCompleted),
      ]);
    }

    localStorage.setItem("todokey", JSON.stringify(arrayofNotes));
  }

  title.value = "";
  note.value = "";
  toggleTitleVisibility();
});

notesDisplay.addEventListener("click", (e) => {
  let type = e.target.dataset.type;
  let noteId = e.target.dataset.id;

  switch (type) {
    case "del":
      const noteToDelete = arrayofNotes.find(
        ({ id }) => id.toString() === noteId
      );
      if (noteToDelete && !noteToDelete.isCompleted) {
        arrayofNotes = arrayofNotes.filter(
          ({ id }) => id.toString() !== noteId
        );
        showOtherNotes.innerHTML = renderNotes(
          arrayofNotes.filter(({ isCompleted }) => !isCompleted)
        );
        localStorage.setItem("todokey", JSON.stringify(arrayofNotes));
        toggleTitleVisibility();
      }
      break;
    case "completed_todo":
      arrayofNotes = arrayofNotes.map((note) =>
        note.id.toString() === noteId
          ? { ...note, isCompleted: !note.isCompleted }
          : note
      );
      localStorage.setItem("todokey", JSON.stringify(arrayofNotes));

      // Update the rendered notes based on completed status
      const updatedCompletedTodos = arrayofNotes.filter(
        ({ isCompleted }) => isCompleted
      );
      const updatedOtherNotes = arrayofNotes.filter(
        ({ isCompleted }) => !isCompleted
      );

      showCompletedNotes.innerHTML = renderNotes(updatedCompletedTodos);
      showOtherNotes.innerHTML = renderNotes(updatedOtherNotes);
      toggleTitleVisibility();
      break;
  }
});
