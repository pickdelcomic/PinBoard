const board = document.getElementById("board");
const workspace = document.getElementById("workspace");

const textButton = document.getElementById("textButton");

const contextMenu = document.getElementById("contextMenu");
const deleteObject = document.getElementById("deleteObject");

const zoomDisplay = document.getElementById("zoomDisplay");


let noteNumber = 1;

let selectedObject = null;


/* =========================
   BOARD CAMERA
========================= */

let cameraX = 0;
let cameraY = 0;

let zoom = 1;


/* =========================
   PANNING
========================= */

let panning = false;

let panStartX = 0;
let panStartY = 0;

let cameraStartX = 0;
let cameraStartY = 0;


board.addEventListener("mousedown", function(event) {

    /*
       Middle mouse button
       OR
       Space + left mouse
    */

    if (
        event.button === 1 ||
        (event.button === 0 && event.shiftKey)
    ) {

        panning = true;

        panStartX = event.clientX;
        panStartY = event.clientY;

        cameraStartX = cameraX;
        cameraStartY = cameraY;

        board.style.cursor = "grabbing";

        event.preventDefault();
    }

});


document.addEventListener("mousemove", function(event) {

    if (!panning) return;

    cameraX =
        cameraStartX +
        (event.clientX - panStartX);

    cameraY =
        cameraStartY +
        (event.clientY - panStartY);

    updateCamera();

});


document.addEventListener("mouseup", function() {

    panning = false;

    board.style.cursor = "default";

});


/* =========================
   CAMERA UPDATE
========================= */

function updateCamera() {

    workspace.style.transform =
        `translate(${cameraX}px, ${cameraY}px) scale(${zoom})`;

    zoomDisplay.textContent =
        Math.round(zoom * 100) + "%";
}


/* =========================
   ZOOM
========================= */

board.addEventListener("wheel", function(event) {

    event.preventDefault();

    if (event.deltaY < 0) {

        zoom += 0.1;

    } else {

        zoom -= 0.1;

    }


    /* Limits */

    if (zoom < 0.3) {
        zoom = 0.3;
    }

    if (zoom > 3) {
        zoom = 3;
    }


    updateCamera();

}, { passive: false });


/* =========================
   CREATE NOTE
========================= */

function createNote(x, y) {

    const note = document.createElement("div");

    note.className = "note";

    note.style.left = x + "px";
    note.style.top = y + "px";


    note.innerHTML = `

        <div
            class="note-title"
            contenteditable="true"
        >
            Note ${noteNumber}
        </div>

        <div
            class="note-content"
            contenteditable="true"
        >
            Type something...
        </div>

    `;


    workspace.appendChild(note);


    noteNumber++;


    makeDraggable(note);


    /* Select note */

    note.addEventListener("mousedown", function(event) {

        selectedObject = note;

    });


    /* Right click */

    note.addEventListener("contextmenu", function(event) {

        event.preventDefault();

        selectedObject = note;

        showContextMenu(
            event.clientX,
            event.clientY
        );

    });


    /* Automatically select title */

    note.querySelector(".note-title").focus();

}


/* =========================
   DRAG NOTE
========================= */

function makeDraggable(note) {

    const title =
        note.querySelector(".note-title");


    title.addEventListener("mousedown", function(event) {

        if (event.button !== 0) return;


        /*
           Don't drag while editing
        */

        if (
            document.activeElement === title
        ) {

            return;

        }


        selectedObject = note;


        const startX = event.clientX;
        const startY = event.clientY;


        const originalX =
            note.offsetLeft;

        const originalY =
            note.offsetTop;


        function move(event) {

            const dx =
                (event.clientX - startX) / zoom;

            const dy =
                (event.clientY - startY) / zoom;


            note.style.left =
                (originalX + dx) + "px";

            note.style.top =
                (originalY + dy) + "px";

        }


        function stop() {

            document.removeEventListener(
                "mousemove",
                move
            );

            document.removeEventListener(
                "mouseup",
                stop
            );

        }


        document.addEventListener(
            "mousemove",
            move
        );

        document.addEventListener(
            "mouseup",
            stop
        );


        event.preventDefault();

    });

}


/* =========================
   TEXT BUTTON
========================= */

textButton.addEventListener(
    "click",
    function() {

        createNote(

            200 - cameraX / zoom,

            150 - cameraY / zoom

        );

    }
);


/* =========================
   RIGHT CLICK MENU
========================= */

function showContextMenu(x, y) {

    contextMenu.style.display =
        "block";

    contextMenu.style.left =
        x + "px";

    contextMenu.style.top =
        y + "px";

}


document.addEventListener(
    "click",
    function() {

        contextMenu.style.display =
            "none";

    }
);


/* =========================
   DELETE
========================= */

deleteObject.addEventListener(
    "click",
    function(event) {

        event.stopPropagation();


        if (selectedObject) {

            selectedObject.remove();

            selectedObject = null;

        }


        contextMenu.style.display =
            "none";

    }
);


/* =========================
   START CAMERA
========================= */

updateCamera();
