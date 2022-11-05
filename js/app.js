import notesAPI from "./notesAPI.js";
import notesView from "./notesView.js";

export default class app {
    constructor(root) {
        this.notes = [];
        this.activeNote = null;
        this.view = new notesView(root, this.handlers());

        this.refreshNotes();
    }

    refreshNotes() {
        const notes = notesAPI.getAllNotes();

        this.setNotes(notes);

        if (notes.length > 0) {
            this.setActiveNote(notes[0]);
        }
    }

    setNotes(notes) {
        this.notes = notes;
        this.view.updateNoteList(notes);
        this.view.updateNotePreviewVisibility(notes.length > 0);
    }

    setActiveNote(note) {
        this.activeNote = note;
        this.view.updateActiveNote(note);
    }

    handlers() {
        return {
            onNoteSelect: noteId => {
                const selectedNote = this.notes.find(note => note.id == noteId);
                this.setActiveNote(selectedNote);
            },
            onNoteAdd: () => {
                const newNote = {
                    title: "New Note",
                    body: "Take Note..."
                };

                notesAPI.saveNote(newNote);
                this.refreshNotes();
            },
            onNoteEdit: (title, body) => {
                notesAPI.saveNote({
                    id: this.activeNote.id,
                    title: title,
                    body: body
                });

                this.refreshNotes();
            },
            onNoteDelete: noteId => {
                notesAPI.deleteNote(noteId);
                this.refreshNotes();
            }
        }
    }
}