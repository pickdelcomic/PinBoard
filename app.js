const board = document.getElementById("board");
const textButton = document.querySelector("#toolbar button:nth-child(2)");

let noteNumber = 1;
let draggingNote = null;
let offsetX = 0;
let offsetY = 0;


/* -------------------------
   CREATE A NOTE
------------------------- */

function createNote(x, y) {

    const note = document.createElement("div");

    note.className = "note";

    note.style.left = x + "px";
    note.style.top = y + "px";

    note.innerHTML = `
        <div class="note-title">
            Note ${noteNumber}
        </div>

        <div class="note-content" contenteditable="true">
            Type something...
        </div>
    `;

    board.appendChild(note);

    noteNumber++;

    makeDraggable(note);

    note.querySelector(".note-content").focus();
}


/* -------------------------
   DRAG NOTES
------------------------- */

function makeDraggable(note) {

    const title = note.querySelector(".note-title");

    title.addEventListener("mousedown", function(event) {

        draggingNote = note;

        offsetX = event.clientX - note.offsetLeft;
        offsetY = event.clientY - note.offsetTop;

        note.style.zIndex = 100;
    });
}


/* -------------------------
   MOVE NOTE
------------------------- */

document.addEventListener("mousemove", function(event) {

    if (!draggingNote) return;

    draggingNote.style.left =
        (event.clientX - offsetX) + "px";

    draggingNote.style.top =
        (event.clientY - offsetY) + "px";
});


document.addEventListener("mouseup", function() {

    draggingNote = null;

});


/* -------------------------
   TEXT BUTTON
------------------------- */

textButton.addEventListener("click", function() {

    createNote(
        150 + Math.random() * 200,
        100 + Math.random() * 150
    );

});
