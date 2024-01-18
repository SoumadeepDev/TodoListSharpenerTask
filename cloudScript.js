import { renderNotes } from "./app.js";

const title = document.querySelector(".title");
const note = document.querySelector(".note");
const addButton = document.querySelector(".add-btn");
const notesDisplay = document.querySelector(".notes-display");
const showCompletedNotes = document.querySelector(".pinned-notes-container");
const showOtherNotes = document.querySelector(".notes-container");
const pinTitle = document.querySelector(".pin-title");
const otherTitle = document.querySelector(".other-title");

let arrayofNotes = [];

// Render notes on the page
function updateNotesDisplay() {
  const completedNotes = arrayofNotes.filter(({ isCompleted }) => isCompleted);
  const otherNotes = arrayofNotes.filter(({ isCompleted }) => !isCompleted);

  showCompletedNotes.innerHTML = renderNotes(completedNotes);
  showOtherNotes.innerHTML = renderNotes(otherNotes);

  toggleTitleVisibility();
}
// Toggle visibility of title elements based on notes existence
function toggleTitleVisibility() {
  const hasNotes = arrayofNotes.length > 0;
  pinTitle.classList.toggle("d-none", !hasNotes);
  otherTitle.classList.toggle("d-none", !hasNotes);
}

// Load notes from the API
axios
  .get("https://crudcrud.com/api/4d44cf3be9c54657b31ec13e4cd5acb0/todos")
  .then((res) => {
    arrayofNotes = res.data;
    updateNotesDisplay();
  })
  .catch((error) => {
    console.error("Error fetching notes:", error);
  });

// Initial toggle on page load
window.addEventListener("DOMContentLoaded", () => {
  updateNotesDisplay();
  displayTodo();
});
addButton.addEventListener("click", () => {
  const trimmedTitle = title.value.trim();
  const trimmedNote = note.value.trim();

  if (trimmedTitle.length > 0 || trimmedNote.length > 0) {
    const newNote = {
      title: trimmedTitle,
      note: trimmedNote,
      isCompleted: false,
    };

    axios
      .post(
        "https://crudcrud.com/api/4d44cf3be9c54657b31ec13e4cd5acb0/todos",
        newNote
      )
      .then((res) => {
        // Assuming the API returns the updated note object with an _id property
        const addedNote = res.data;
        if (addedNote && addedNote._id) {
          arrayofNotes = [...arrayofNotes, addedNote];
          updateNotesDisplay();
          displayTodo();

          // Clear input values after successful addition
          title.value = "";
          note.value = "";
        } else {
          console.error("Invalid response from the API:", res);
        }
      })
      .catch((error) => {
        console.error("Error saving note:", error);
      });
  }
});

function displayTodo() {
  notesDisplay.addEventListener("click", (e) => {
    const type = e.target.dataset.type;

    if (type) {
      const noteIndex = e.target.closest(".single-note").dataset.index;

      switch (type) {
        case "del":
          axios
            .delete(
              `https://crudcrud.com/api/4d44cf3be9c54657b31ec13e4cd5acb0/todos/${arrayofNotes[noteIndex]._id}`
            )
            .then(() => {
              // Remove the deleted note from arrayofNotes
              arrayofNotes.splice(noteIndex, 1);
              updateNotesDisplay(); // Update UI after successful delete
            })
            .catch((error) => {
              console.error("Error deleting note:", error);
            });
          break;

        case "completed_todo":
          const currentStatus = arrayofNotes[noteIndex].isCompleted;
          const title = arrayofNotes[noteIndex].title;
          const note = arrayofNotes[noteIndex].note;

          if (currentStatus) {
            // Note is in completed section, move it to incompleted section
            axios
              .put(
                `https://crudcrud.com/api/4d44cf3be9c54657b31ec13e4cd5acb0/todos/${arrayofNotes[noteIndex]._id}`,
                {
                  title: title,
                  note: note,
                  isCompleted: false, // Set isCompleted to false
                }
              )
              .then(() => {
                // Assuming the API returns the updated array of notes
                arrayofNotes[noteIndex].isCompleted = false; // Set isCompleted to false in the local array
                updateNotesDisplay();
              })
              .catch((error) => {
                console.error("Error updating note:", error);
              });
          } else {
            // Note is in incompleted section, move it to completed section
            axios
              .put(
                `https://crudcrud.com/api/4d44cf3be9c54657b31ec13e4cd5acb0/todos/${arrayofNotes[noteIndex]._id}`,
                {
                  title: title,
                  note: note,
                  isCompleted: true, // Set isCompleted to true
                }
              )
              .then(() => {
                // Assuming the API returns the updated array of notes
                arrayofNotes[noteIndex].isCompleted = true; // Set isCompleted to true in the local array
                updateNotesDisplay();
              })
              .catch((error) => {
                console.error("Error updating note:", error);
              });
          }
          break;
      }
    }
  });
}

displayTodo();
