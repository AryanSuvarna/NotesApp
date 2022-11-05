export default class notesView {
    constructor(root, { onNoteSelect, onNoteAdd, onNoteEdit, onNoteDelete } = {}) {
        this.root = root;
        this.onNoteSelect = onNoteSelect;
        this.onNoteEdit = onNoteEdit;
        this.onNoteAdd = onNoteAdd;
        this.onNoteDelete = onNoteDelete;
        this.root.innerHTML = `
            <div class="notes_sidebar">
                <button class="notes_add" type="button">Add Note</button>
                <div class="title"> Your Notes:</div>
                <div class="notes_list"></div>
            </div>
            <div class="notes_preview">
                <input type="text" class="notes_title" placeholder="New Note...">
                <textarea class="notes_body" placeholder="Take Note..."></textarea>
            </div>
        `;

        const addNoteBtn = this.root.querySelector(".notes_add");
        const titleInput = this.root.querySelector(".notes_title");
        const bodyInput = this.root.querySelector(".notes_body");

        addNoteBtn.addEventListener("click", () => {
            this.onNoteAdd();
        })

        titleInput.addEventListener("blur", () => {
            const updatedTitle = titleInput.value.trim();
            const updatedBody = bodyInput.value.trim();
            this.onNoteEdit(updatedTitle, updatedBody);
        });

        bodyInput.addEventListener("blur", () => {
            const updatedTitle = titleInput.value.trim();
            const updatedBody = bodyInput.value.trim();
            this.onNoteEdit(updatedTitle, updatedBody);
        });

        // TODO: hide the note preview by default
        this.updateNotePreviewVisibility(false);
    }

    createListItemHTML(id, title, body, time) {
        const MAX_BODY_LENGTH = 60;

        return `
            <div class="notes_list_item" data-note-id="${id}">
                <div class="note_item_title">${title}</div>
                <div class="note_item_body">
                    ${body.substring(0, MAX_BODY_LENGTH)}
                    ${body.length > MAX_BODY_LENGTH ? "..." : ""}
                </div>
                <div class="note_item_time">
                    ${time.toLocaleString(undefined, { dateStyle: "full", timeStyle: "short" })}
                </div>
            </div>
        `;
    }

    updateNoteList(notes) {
        const notesListContainer = this.root.querySelector(".notes_list");

        // empty list
        notesListContainer.innerHTML = "";

        // insert our html for each note
        for (const note of notes) {
            const html = this.createListItemHTML(note.id, note.title, note.body, new Date(note.time));

            notesListContainer.insertAdjacentHTML("beforeend", html);
        }

        // add select/delete eevents for each list item
        notesListContainer.querySelectorAll(".notes_list_item").forEach(noteListItem => {
            noteListItem.addEventListener("click", () => {
                this.onNoteSelect(noteListItem.dataset.noteId);
            });

            noteListItem.addEventListener("dblclick", () => {
                const doDelete = confirm("Are you sure you want to delete this note?");

                if (doDelete) {
                    this.onNoteDelete(noteListItem.dataset.noteId)
                }
            })
        });

    }

    updateActiveNote(note) {
        // console.log(this.root.querySelector(".notes_title").value)
        this.root.querySelector(".notes_title").value = note.title;
        this.root.querySelector(".notes_body").value = note.body;


        //removes the "selected" class from all the notes in note List
        this.root.querySelectorAll(".notes_list_item").forEach(noteListItem => {
            noteListItem.classList.remove("notes_list_item_selected");
        });

        // adds the "selected" class to the note that is currently active/selected.
        this.root.querySelector(`.notes_list_item[data-note-id= "${note.id}"]`).classList.add("notes_list_item_selected");
    }

    updateNotePreviewVisibility(visible) {
        this.root.querySelector(".notes_preview").style.visibility = visible ? "visible" : "hidden";
    }
}