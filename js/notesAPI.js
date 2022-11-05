// this file is responsible for interacting with website local storage
export default class notesAPI {
    static getAllNotes() {
        const notes = JSON.parse(localStorage.getItem("notesapp-notes") || "[]");

        // sort notes by time
        return notes.sort((a, b) => {
            return new Date(a.time) > new Date(b.time) ? -1 : 1;
        });
    }

    static saveNote(noteToSave) {
        const notes = notesAPI.getAllNotes();
        const existing = notes.find(note => note.id == noteToSave.id);

        // if note exists, update the info but don't create a new note
        if (existing) {
            existing.title = noteToSave.title;
            existing.body = noteToSave.body;
            existing.time = new Date().toISOString();

        } else {
            noteToSave.id = Math.floor(Math.random() * 1_000_000);
            noteToSave.time = new Date().toISOString();
            notes.push(noteToSave);
        }



        localStorage.setItem("notesapp-notes", JSON.stringify(notes)); //replace notes with updated notes
    }

    static deleteNote(id) {
        const notes = notesAPI.getAllNotes();
        const newNotes = notes.filter(note => note.id != id); //filter notes by removing the one woth same id

        localStorage.setItem("notesapp-notes", JSON.stringify(newNotes));
    }
}