export const renderNotes = (notes) => {
  let newNote = notes.map(({ title, note, id, isCompleted }) => {
    return `<div class="single-note relative shadow">
                    <div class="d-flex align-center title-container">
                        <span class="single-note-title">${title}</span>
                        <button class="button del-btn v-hidden" data-type="del" data-id=${id}>
                            <span class="material-icons-outlined" data-type="del" data-id=${id}>delete</span>
                        </button>
                    </div>
                    <p>${note}</p>  
                    <div class="options d-flex gap-md">
                    <button class="button btn pinned-btn v-hidden" data-type="completed_todo" data-id=${id}><span class="material-icons-outlined ${
      isCompleted ? "green-icon" : "red-icon"
    }" data-type="completed_todo" data-id=${id}>check_circle</span>
</button>

                    </div>   
                </div>`;
  });
  newNote = newNote.join("");
  return newNote;
};
