import { renderNotes } from "./app.js";

const API_URL = "https://crudcrud.com/api/dc232b33d43741fea57737a10227e03b";

const title = document.querySelector(".title");
const note = document.querySelector(".note");
const addButton = document.querySelector(".add-btn");
const notesDisplay = document.querySelector(".notes-display");
const showCompletedNotes = document.querySelector(".pinned-notes-container");
const showOtherNotes = document.querySelector(".notes-container");
const pinTitle = document.querySelector(".pin-title");
const otherTitle = document.querySelector(".other-title");
let arrayofNotes = [];
// Load notes from the CRUD CRUD API
async function fetchNotes() {
  try {
    const response = await axios.get(`${API_URL}/todokey`);
    return response.data || [];
  } catch (error) {
    console.error("Error fetching notes:", error);
    return [];
  }
}

// Save notes to the CRUD CRUD API
async function saveNotes(notes) {
  try {
    await axios.put(`${API_URL}/todokey`, notes);
  } catch (error) {
    console.error("Error saving notes:", error);
  }
}

// Separate completed and other notes for rendering
async function separateNotes() {
  const arrayofNotes = await fetchNotes();
  const completedNotes = arrayofNotes.filter(({ isCompleted }) => isCompleted);
  const otherNotes = arrayofNotes.filter(({ isCompleted }) => !isCompleted);
  return { arrayofNotes, completedNotes, otherNotes };
}

// Render notes on page load
(async () => {
  const { completedNotes, otherNotes } = await separateNotes();
  showCompletedNotes.innerHTML = renderNotes(completedNotes);
  showOtherNotes.innerHTML = renderNotes(otherNotes);
  toggleTitleVisibility();
})();

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

addButton.addEventListener("click", async () => {
  if (title.value.trim().length > 0 || note.value.trim().length > 0) {
    const newNote = {
      title: title.value.trim(),
      note: note.value.trim(),
      id: Date.now(),
      isCompleted: false,
    };

    arrayofNotes = [...arrayofNotes, newNote];

    if (newNote.isCompleted) {
      showCompletedNotes.innerHTML = renderNotes(
        arrayofNotes.filter(({ isCompleted }) => isCompleted)
      );
    } else {
      showOtherNotes.innerHTML = renderNotes(
        arrayofNotes.filter(({ isCompleted }) => !isCompleted)
      );
    }

    await saveNotes(arrayofNotes);
  }

  title.value = "";
  note.value = "";
  toggleTitleVisibility();
});

notesDisplay.addEventListener("click", async (e) => {
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
        await saveNotes(arrayofNotes);
        toggleTitleVisibility();
      }
      break;
    case "completed_todo":
      arrayofNotes = arrayofNotes.map((note) =>
        note.id.toString() === noteId
          ? { ...note, isCompleted: !note.isCompleted }
          : note
      );
      await saveNotes(arrayofNotes);

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
