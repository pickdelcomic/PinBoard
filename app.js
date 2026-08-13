const board =
    document.getElementById("board");

const workspace =
    document.getElementById("workspace");


const textButton =
    document.getElementById("textButton");

const imageButton =
    document.getElementById("imageButton");

const stickerButton =
    document.getElementById("stickerButton");


const imageInput =
    document.getElementById("imageInput");


const contextMenu =
    document.getElementById("contextMenu");

const deleteObject =
    document.getElementById("deleteObject");

const duplicateObject =
    document.getElementById("duplicateObject");


const zoomDisplay =
    document.getElementById("zoomDisplay");



/* =========================
   OBJECT COUNTER
========================= */

let noteNumber = 1;


/* =========================
   SELECTED OBJECT
========================= */

let selectedObject = null;



/* =========================
   CAMERA
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



board.addEventListener(
    "mousedown",
    function(event) {

        if (
            event.button === 1 ||
            (
                event.button === 0 &&
                event.shiftKey
            )
        ) {

            panning = true;

            panStartX =
                event.clientX;

            panStartY =
                event.clientY;

            cameraStartX =
                cameraX;

            cameraStartY =
                cameraY;

            board.style.cursor =
                "grabbing";

            event.preventDefault();
        }

    }
);



document.addEventListener(
    "mousemove",
    function(event) {

        if (!panning) return;


        cameraX =
            cameraStartX +
            (
                event.clientX -
                panStartX
            );


        cameraY =
            cameraStartY +
            (
                event.clientY -
                panStartY
            );


        updateCamera();

    }
);



document.addEventListener(
    "mouseup",
    function() {

        panning = false;

        board.style.cursor =
            "default";

    }
);



/* =========================
   CAMERA
========================= */

function updateCamera() {

    workspace.style.transform =
        `translate(${cameraX}px, ${cameraY}px) scale(${zoom})`;


    zoomDisplay.textContent =
        Math.round(
            zoom * 100
        ) + "%";
}



/* =========================
   ZOOM
========================= */

board.addEventListener(
    "wheel",
    function(event) {

        event.preventDefault();


        if (event.deltaY < 0) {

            zoom += 0.1;

        } else {

            zoom -= 0.1;

        }


        if (zoom < 0.3) {

            zoom = 0.3;

        }


        if (zoom > 3) {

            zoom = 3;

        }


        updateCamera();

    },
    {
        passive: false
    }
);



/* =========================
   CREATE NOTE
========================= */

function createNote(x, y) {

    const note =
        document.createElement(
            "div"
        );


    note.className =
        "note";


    note.style.left =
        x + "px";


    note.style.top =
        y + "px";


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


    setupObject(note);


    note.querySelector(
        ".note-title"
    ).focus();

}



/* =========================
   CREATE IMAGE
========================= */

function createImage(
    file,
    x,
    y
) {

    const reader =
        new FileReader();


    reader.onload =
        function(event) {

            const imageObject =
                document.createElement(
                    "div"
                );


            imageObject.className =
                "image-object";


            imageObject.style.left =
                x + "px";


            imageObject.style.top =
                y + "px";


            imageObject.innerHTML = `

                <div
                    class="image-title"
                    contenteditable="true"
                >
                    Image ${noteNumber}
                </div>

                <div class="image-content">

                    <img
                        src="${event.target.result}"
                    >

                </div>

            `;


            workspace.appendChild(
                imageObject
            );


            noteNumber++;


            setupObject(
                imageObject
            );


            imageObject.querySelector(
                ".image-title"
            ).focus();

        };


    reader.readAsDataURL(file);

}



/* =========================
   CREATE STICKER
========================= */

function createSticker(
    file,
    x,
    y
) {

    const reader =
        new FileReader();


    reader.onload =
        function(event) {

            const sticker =
                document.createElement(
                    "div"
                );


            sticker.className =
                "sticker";


            sticker.style.left =
                x + "px";


            sticker.style.top =
                y + "px";


            sticker.innerHTML = `

                <img
                    src="${event.target.result}"
                >

            `;


            workspace.appendChild(
                sticker
            );


            setupObject(
                sticker
            );

        };


    reader.readAsDataURL(file);

}



/* =========================
   OBJECT SETUP
========================= */

function setupObject(object) {


    object.addEventListener(
        "mousedown",
        function() {

            selectedObject =
                object;

        }
    );


    object.addEventListener(
        "contextmenu",
        function(event) {

            event.preventDefault();


            selectedObject =
                object;


            showContextMenu(
                event.clientX,
                event.clientY
            );

        }
    );


    makeDraggable(object);

}



/* =========================
   DRAG OBJECT
========================= */

function makeDraggable(object) {


    let handle;


    if (
        object.classList.contains(
            "note"
        )
    ) {

        handle =
            object.querySelector(
                ".note-title"
            );

    }


    else if (
        object.classList.contains(
            "image-object"
        )
    ) {

        handle =
            object.querySelector(
                ".image-title"
            );

    }


    else {

        handle =
            object;

    }


    handle.addEventListener(
        "mousedown",
        function(event) {

            if (
                event.button !== 0
            ) return;


            /*
               Don't drag while
               editing a title.
            */

            if (
                handle.isContentEditable &&
                document.activeElement ===
                handle
            ) {

                return;

            }


            selectedObject =
                object;


            const startX =
                event.clientX;

            const startY =
                event.clientY;


            const originalX =
                object.offsetLeft;

            const originalY =
                object.offsetTop;


            function move(event) {

                const dx =
                    (
                        event.clientX -
                        startX
                    ) / zoom;


                const dy =
                    (
                        event.clientY -
                        startY
                    ) / zoom;


                object.style.left =
                    (
                        originalX + dx
                    ) + "px";


                object.style.top =
                    (
                        originalY + dy
                    ) + "px";

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

        }
    );

}



/* =========================
   TEXT BUTTON
========================= */

textButton.addEventListener(
    "click",
    function() {

        createNote(

            200 -
            cameraX / zoom,

            150 -
            cameraY / zoom

        );

    }
);



/* =========================
   IMAGE BUTTON
========================= */

let currentImageType =
    "image";


imageButton.addEventListener(
    "click",
    function() {

        currentImageType =
            "image";

        imageInput.click();

    }
);



/* =========================
   STICKER BUTTON
========================= */

stickerButton.addEventListener(
    "click",
    function() {

        currentImageType =
            "sticker";

        imageInput.click();

    }
);



/* =========================
   IMAGE SELECTED
========================= */

imageInput.addEventListener(
    "change",
    function() {

        const file =
            imageInput.files[0];


        if (!file) return;


        const x =
            200 -
            cameraX / zoom;


        const y =
            150 -
            cameraY / zoom;


        if (
            currentImageType ===
            "image"
        ) {

            createImage(
                file,
                x,
                y
            );

        }


        else {

            createSticker(
                file,
                x,
                y
            );

        }


        /*
           Allow selecting
           the same image again.
        */

        imageInput.value = "";

    }
);



/* =========================
   CONTEXT MENU
========================= */

function showContextMenu(
    x,
    y
) {

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

            selectedObject =
                null;

        }


        contextMenu.style.display =
            "none";

    }
);



/* =========================
   DUPLICATE
========================= */

duplicateObject.addEventListener(
    "click",
    function(event) {

        event.stopPropagation();


        if (!selectedObject) {
            return;
        }


        const copy =
            selectedObject.cloneNode(
                true
            );


        copy.style.left =
            (
                selectedObject.offsetLeft +
                30
            ) + "px";


        copy.style.top =
            (
                selectedObject.offsetTop +
                30
            ) + "px";


        workspace.appendChild(
            copy
        );


        setupObject(copy);


        selectedObject =
            copy;


        contextMenu.style.display =
            "none";

    }
);



/* =========================
   START
========================= */

updateCamera();
