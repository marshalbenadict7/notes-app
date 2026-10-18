// 1. Get HTML Elements

const noteForm = document.getElementById("noteForm");
const noteTitle = document.getElementById("noteTitle");
const noteContent = document.getElementById("noteContent");

const notesContainer = document.getElementById("notesContainer");
const searchInput = document.getElementById("searchInput");

const notesCount = document.getElementById("notesCount");
const emptyMessage = document.getElementById("emptyMessage");

const formHeading = document.getElementById("formHeading");
const saveButton = document.getElementById("saveButton");
const cancelButton = document.getElementById("cancelButton");


// 2. Load Notes from LocalStorage

let notes = [];

try {
    const savedNotes = JSON.parse(localStorage.getItem("myNotes"));
    notes = Array.isArray(savedNotes) ? savedNotes : [];
} catch (error) {
    notes = [];
}

let editingId = null;


// 3. Save Notes to LocalStorage

function saveNotes() {
    localStorage.setItem("myNotes", JSON.stringify(notes));
}


// 4. Display and Search Notes

function displayNotes(searchText = "") {

    // Clear previously displayed notes
    notesContainer.innerHTML = "";

    // Convert search text to lowercase
    const searchValue = searchText.trim().toLowerCase();

    // Filter notes by title or content
    const filteredNotes = notes.filter(function (note) {

        const title = String(note.title || "").toLowerCase();
        const content = String(note.content || "").toLowerCase();

        return (
            title.includes(searchValue) ||
            content.includes(searchValue)
        );
    });

    // Show total saved notes count
    notesCount.textContent =
        `${notes.length} ${notes.length === 1 ? "Note" : "Notes"}`;

    // Show message when no matching notes exist
    if (filteredNotes.length === 0) {

        emptyMessage.hidden = false;

        if (searchValue !== "") {
            emptyMessage.textContent = "No matching notes found.";
        } else {
            emptyMessage.textContent =
                "No notes yet. Create your first note!";
        }

        return;

    } else {

        emptyMessage.hidden = true;
    }

    // Display only matching notes
    filteredNotes.forEach(function (note) {

        // Create note card
        const card = document.createElement("article");
        card.className = "note-card";

        // Create note title
        const title = document.createElement("h3");
        title.textContent = note.title;

        // Create note content
        const content = document.createElement("p");
        content.textContent = note.content;

        // Create action buttons container
        const actions = document.createElement("div");
        actions.className = "note-actions";

        // Edit button
        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.textContent = "Edit";
        editButton.className = "edit-btn";

        editButton.addEventListener("click", function () {
            editNote(note.id);
        });

        // Delete button
        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-btn";

        deleteButton.addEventListener("click", function () {
            deleteNote(note.id);
        });

        // Add buttons to container
        actions.append(editButton, deleteButton);

        // Add elements to note card
        card.append(title, content, actions);

        // Display card on page
        notesContainer.appendChild(card);
    });
}


// 5. Add or Update Note

noteForm.addEventListener("submit", function (event) {

    // Prevent page refresh
    event.preventDefault();

    // Get user input
    const title = noteTitle.value.trim();
    const content = noteContent.value.trim();

    // Validate input
    if (title === "" || content === "") {
        alert("Please enter both title and content.");
        return;
    }

    // Update existing note
    if (editingId !== null) {

        notes = notes.map(function (note) {

            if (note.id === editingId) {
                return {
                    ...note,
                    title: title,
                    content: content
                };
            }

            return note;
        });

        editingId = null;

    } else {

        // Create new note
        const newNote = {
            id: Date.now(),
            title: title,
            content: content
        };

        // Add new note to beginning
        notes.unshift(newNote);
    }

    // Save changes
    saveNotes();

    // Reset form
    resetForm();

    // Refresh notes using current search
    displayNotes(searchInput.value);
});


// 6. Delete Note

function deleteNote(id) {

    const confirmed = confirm(
        "Are you sure you want to delete this note?"
    );

    if (!confirmed) {
        return;
    }

    // Remove selected note
    notes = notes.filter(function (note) {
        return note.id !== id;
    });

    // Reset form if the edited note was deleted
    if (editingId === id) {
        resetForm();
    }

    // Save and display updated notes
    saveNotes();
    displayNotes(searchInput.value);
}


// 7. Edit Note

function editNote(id) {

    // Find selected note
    const note = notes.find(function (item) {
        return item.id === id;
    });

    if (!note) {
        return;
    }

    // Put existing values into form
    noteTitle.value = note.title;
    noteContent.value = note.content;

    // Set editing ID
    editingId = id;

    // Update form appearance
    formHeading.textContent = "Edit Your Note";
    saveButton.textContent = "Update Note";
    cancelButton.hidden = false;

    // Focus title input
    noteTitle.focus();

    // Scroll to form
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// 8. Reset Form

function resetForm() {

    noteForm.reset();

    editingId = null;

    formHeading.textContent = "Create a New Note";
    saveButton.textContent = "+ Add Note";
    cancelButton.hidden = true;
}


// 9. Cancel Edit

cancelButton.addEventListener("click", function () {
    resetForm();
});


// 10. Search Notes

searchInput.addEventListener("input", function () {

    // Display notes matching the typed text
    displayNotes(searchInput.value);
});


// 11. Initial Display

displayNotes();