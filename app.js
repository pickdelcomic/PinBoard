const board =
    document.getElementById("board");

const workspace =
    document.getElementById("workspace");

const drawingCanvas =
    document.getElementById(
        "drawingCanvas"
    );

const drawingContext =
    drawingCanvas.getContext("2d");


const textButton =
    document.getElementById(
        "textButton"
    );

const imageButton =
    document.getElementById(
        "imageButton"
    );

const stickerButton =
    document.getElementById(
        "stickerButton"
    );

const drawButton =
    document.getElementById(
        "drawButton"
    );

const eraserButton =
    document.getElementById(
        "eraserButton"
    );


const imageInput =
    document.getElementById(
        "imageInput"
    );


const saveButton =
    document.getElementById(
        "saveButton"
    );

const saveAsButton =
    document.getElementById(
        "saveAsButton"
    );

const loadButton =
    document.getElementById(
        "loadButton"
    );

const newButton =
    document.getElementById(
        "newButton"
    );

const boardInput =
    document.getElementById(
        "boardInput"
    );


const contextMenu =
    document.getElementById(
        "contextMenu"
    );

const deleteObject =
    document.getElementById(
        "deleteObject"
    );

const duplicateObject =
    document.getElementById(
        "duplicateObject"
    );


const zoomDisplay =
    document.getElementById(
        "zoomDisplay"
    );



/* =========================
   VARIABLES
========================= */

let objectNumber = 1;

let selectedObject = null;

let currentImageType =
    "image";


let boardName =
    "Untitled Board";


let cameraX = 0;

let cameraY = 0;

let zoom = 1;



/* =========================
   DRAWING
========================= */

let drawingMode = false;

let eraserMode = false;

let drawing = false;



drawingCanvas.width =
    10000;

drawingCanvas.height =
    10000;



function setDrawingMode(
    mode
) {

    drawingMode =
        mode === "draw";

    eraserMode =
        mode === "erase";


    if (drawingMode) {

        drawingCanvas.style.pointerEvents =
            "auto";

        board.style.cursor =
            "crosshair";

    }

    else if (eraserMode) {

        drawingCanvas.style.pointerEvents =
            "auto";

        board.style.cursor =
            "crosshair";

    }

    else {

        drawingCanvas.style.pointerEvents =
            "none";

        board.style.cursor =
            "default";

    }

}



/* =========================
   DRAW
========================= */

drawingCanvas.addEventListener(
    "mousedown",
    function(event) {

        if (
            !drawingMode &&
            !eraserMode
        ) {
            return;
        }


        drawing = true;


        const position =
            getCanvasPosition(
                event
            );


        drawingContext.beginPath();


        drawingContext.moveTo(
            position.x,
            position.y
        );


        drawingContext.lineWidth =
            eraserMode
                ? 30
                : 4;


        drawingContext.lineCap =
            "round";


        drawingContext.lineJoin =
            "round";


        if (eraserMode) {

            drawingContext.globalCompositeOperation =
                "destination-out";

        }

        else {

            drawingContext.globalCompositeOperation =
                "source-over";

        }

    }
);



drawingCanvas.addEventListener(
    "mousemove",
    function(event) {

        if (!drawing) {
            return;
        }


        const position =
            getCanvasPosition(
                event
            );


        drawingContext.lineTo(
            position.x,
            position.y
        );


        drawingContext.stroke();

    }
);



document.addEventListener(
    "mouseup",
    function() {

        drawing = false;

    }
);



function getCanvasPosition(
    event
) {

    return {

        x:
            (
                event.clientX -
                board.getBoundingClientRect().left -
                cameraX
            ) / zoom,

        y:
            (
                event.clientY -
                board.getBoundingClientRect().top -
                cameraY
            ) / zoom

    };

}



/* =========================
   DRAW BUTTON
========================= */

drawButton.addEventListener(
    "click",
    function() {

        setDrawingMode(
            "draw"
        );

    }
);



eraserButton.addEventListener(
    "click",
    function() {

        setDrawingMode(
            "erase"
        );

    }
);



/* =========================
   SELECTION
========================= */

function selectObject(
    object
) {

    if (selectedObject) {

        selectedObject.classList.remove(
            "selected"
        );

    }


    selectedObject =
        object;


    if (selectedObject) {

        selectedObject.classList.add(
            "selected"
        );

    }

}



/* =========================
   CREATE NOTE
========================= */

function createNote(
    x,
    y,
    title = null,
    content = "Type something..."
) {

    const note =
        document.createElement(
            "div"
        );


    note.className =
        "note board-object";


    note.style.left =
        x + "px";


    note.style.top =
        y + "px";


    note.innerHTML = `

        <div class="note-title">

            ${escapeHTML(
                title ||
                "Note " +
                objectNumber
            )}

        </div>

        <div class="note-content">

            ${escapeHTML(
                content
            )}

        </div>

        <div
            class="resize-handle"
        ></div>

    `;


    workspace.appendChild(
        note
    );


    objectNumber++;


    setupObject(note);

}



/* =========================
   CREATE IMAGE
========================= */

function createImage(
    imageData,
    x,
    y,
    title = null,
    width = 260
) {

    const imageObject =
        document.createElement(
            "div"
        );


    imageObject.className =
        "image-object board-object";


    imageObject.style.left =
        x + "px";


    imageObject.style.top =
        y + "px";


    imageObject.style.width =
        width + "px";


    imageObject.innerHTML = `

        <div class="image-title">

            ${escapeHTML(
                title ||
                "Image " +
                objectNumber
            )}

        </div>

        <div class="image-content">

            <img src="${imageData}">

        </div>

        <div
            class="resize-handle"
        ></div>

    `;


    workspace.appendChild(
        imageObject
    );


    objectNumber++;


    setupObject(
        imageObject
    );

}



/* =========================
   CREATE STICKER
========================= */

function createSticker(
    imageData,
    x,
    y,
    width = 180
) {

    const sticker =
        document.createElement(
            "div"
        );


    sticker.className =
        "sticker board-object";


    sticker.style.left =
        x + "px";


    sticker.style.top =
        y + "px";


    sticker.innerHTML = `

        <img
            src="${imageData}"
            style="width:${width}px"
        >

        <div
            class="resize-handle"
        ></div>

    `;


    workspace.appendChild(
        sticker
    );


    setupObject(
        sticker
    );

}



/* =========================
   OBJECT SETUP
========================= */

function setupObject(
    object
) {

    object.addEventListener(
        "mousedown",
        function() {

            selectObject(
                object
            );

        }
    );


    object.addEventListener(
        "contextmenu",
        function(event) {

            event.preventDefault();


            selectObject(
                object
            );


            showContextMenu(
                event.clientX,
                event.clientY
            );

        }
    );


    setupEditing(
        object
    );


    setupDragging(
        object
    );


    setupResizing(
        object
    );

}



/* =========================
   EDITING
========================= */

function setupEditing(
    object
) {

    const title =
        object.querySelector(
            ".note-title, .image-title"
        );


    const content =
        object.querySelector(
            ".note-content"
        );


    if (title) {

        title.addEventListener(
            "dblclick",
            function(event) {

                event.stopPropagation();


                title.contentEditable =
                    "true";


                title.classList.add(
                    "editing"
                );


                title.focus();


                placeCursorAtEnd(
                    title
                );

            }
        );


        title.addEventListener(
            "blur",
            function() {

                title.contentEditable =
                    "false";


                title.classList.remove(
                    "editing"
                );

            }
        );

    }


    if (content) {

        content.addEventListener(
            "dblclick",
            function(event) {

                event.stopPropagation();


                content.contentEditable =
                    "true";


                content.classList.add(
                    "editing"
                );


                content.focus();

            }
        );


        content.addEventListener(
            "blur",
            function() {

                content.contentEditable =
                    "false";


                content.classList.remove(
                    "editing"
                );

            }
        );

    }

}



/* =========================
   CURSOR POSITION
========================= */

function placeCursorAtEnd(
    element
) {

    const range =
        document.createRange();


    const selection =
        window.getSelection();


    range.selectNodeContents(
        element
    );


    range.collapse(
        false
    );


    selection.removeAllRanges();

    selection.addRange(
        range
    );

}



/* =========================
   DRAGGING
========================= */

function setupDragging(
    object
) {

    let handle =
        object.querySelector(
            ".note-title, .image-title"
        );


    if (!handle) {

        handle =
            object;

    }


    handle.addEventListener(
        "mousedown",
        function(event) {

            if (
                event.button !== 0
            ) {
                return;
            }


            if (
                handle.classList.contains(
                    "editing"
                )
            ) {

                return;

            }


            selectObject(
                object
            );


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
                        originalX +
                        dx
                    ) + "px";


                object.style.top =
                    (
                        originalY +
                        dy
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
   RESIZE
========================= */

function setupResizing(
    object
) {

    const handle =
        object.querySelector(
            ".resize-handle"
        );


    if (!handle) {
        return;
    }


    handle.addEventListener(
        "mousedown",
        function(event) {

            event.preventDefault();

            event.stopPropagation();


            selectObject(
                object
            );


            const startX =
                event.clientX;


            const startWidth =
                object.offsetWidth;


            function resize(event) {

                const change =
                    (
                        event.clientX -
                        startX
                    ) / zoom;


                let newWidth =
                    startWidth +
                    change;


                if (newWidth < 80) {

                    newWidth = 80;

                }


                if (newWidth > 1000) {

                    newWidth = 1000;

                }


                if (
                    object.classList.contains(
                        "sticker"
                    )
                ) {

                    object.querySelector(
                        "img"
                    ).style.width =
                        newWidth + "px";

                }

                else {

                    object.style.width =
                        newWidth + "px";

                }

            }


            function stop() {

                document.removeEventListener(
                    "mousemove",
                    resize
                );


                document.removeEventListener(
                    "mouseup",
                    stop
                );

            }


            document.addEventListener(
                "mousemove",
                resize
            );


            document.addEventListener(
                "mouseup",
                stop
            );

        }
    );

}



/* =========================
   TEXT
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
   IMAGE
========================= */

imageButton.addEventListener(
    "click",
    function() {

        currentImageType =
            "image";


        imageInput.click();

    }
);



/* =========================
   STICKER
========================= */

stickerButton.addEventListener(
    "click",
    function() {

        currentImageType =
            "sticker";


        imageInput.click();

    }
);



imageInput.addEventListener(
    "change",
    function() {

        const file =
            imageInput.files[0];


        if (!file) {
            return;
        }


        const reader =
            new FileReader();


        reader.onload =
            function(event) {

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
                        event.target.result,
                        x,
                        y
                    );

                }

                else {

                    createSticker(
                        event.target.result,
                        x,
                        y
                    );

                }

            };


        reader.readAsDataURL(
            file
        );


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


        copy.classList.remove(
            "selected"
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


        setupObject(
            copy
        );


        selectObject(
            copy
        );

    }
);



/* =========================
   BOARD DATA
========================= */

function getBoardData() {

    const objects = [];


    workspace
        .querySelectorAll(
            ".board-object"
        )
        .forEach(
            function(object) {

                const data = {

                    type:
                        getObjectType(
                            object
                        ),

                    x:
                        object.offsetLeft,

                    y:
                        object.offsetTop,

                    width:
                        object.offsetWidth

                };


                const title =
                    object.querySelector(
                        ".note-title, .image-title"
                    );


                const content =
                    object.querySelector(
                        ".note-content"
                    );


                const image =
                    object.querySelector(
                        "img"
                    );


                if (title) {

                    data.title =
                        title.textContent;

                }


                if (content) {

                    data.content =
                        content.textContent;

                }


                if (image) {

                    data.image =
                        image.src;

                }


                objects.push(
                    data
                );

            }
        );


    return {

        version: 2,

        name:
            boardName,

        objects:
            objects,

        drawing:
            drawingCanvas.toDataURL()

    };

}



/* =========================
   OBJECT TYPE
========================= */

function getObjectType(
    object
) {

    if (
        object.classList.contains(
            "note"
        )
    ) {

        return "note";

    }


    if (
        object.classList.contains(
            "image-object"
        )
    ) {

        return "image";

    }


    if (
        object.classList.contains(
            "sticker"
        )
    ) {

        return "sticker";

    }

}



/* =========================
   SAVE TO BROWSER
========================= */

function saveBoard() {

    const data =
        getBoardData();


    localStorage.setItem(
        "pickdel-board-" +
        boardName,
        JSON.stringify(data)
    );


    alert(
        "Saved: " +
        boardName
    );

}



/* =========================
   SAVE AS
========================= */

function saveAsBoard() {

    const name =
        prompt(
            "Save board as:",
            boardName
        );


    if (!name) {
        return;
    }


    boardName =
        name;


    saveBoard();


    downloadBoard();

}



/* =========================
   DOWNLOAD BACKUP
========================= */

function downloadBoard() {

    const data =
        getBoardData();


    const json =
        JSON.stringify(
            data,
            null,
            2
        );


    const blob =
        new Blob(
            [json],
            {
                type:
                    "application/json"
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    link.href =
        url;


    link.download =
        boardName +
        ".json";


    link.click();


    URL.revokeObjectURL(
        url
    );

}



/* =========================
   LOAD
========================= */

loadButton.addEventListener(
    "click",
    function() {

        boardInput.click();

    }
);



boardInput.addEventListener(
    "change",
    function() {

        const file =
            boardInput.files[0];


        if (!file) {
            return;
        }


        const reader =
            new FileReader();


        reader.onload =
            function(event) {

                try {

                    const data =
                        JSON.parse(
                            event.target.result
                        );


                    loadBoard(
                        data
                    );

                }

                catch {

                    alert(
                        "Could not load this board."
                    );

                }

            };


        reader.readAsText(
            file
        );


        boardInput.value = "";

    }
);



/* =========================
   LOAD BOARD DATA
========================= */

function loadBoard(
    data
) {

    workspace.innerHTML = "";


    selectedObject =
        null;


    boardName =
        data.name ||
        "Untitled Board";


    if (
        !Array.isArray(
            data.objects
        )
    ) {

        alert(
            "Invalid board."
        );

        return;

    }


    data.objects.forEach(
        function(object) {

            if (
                object.type ===
                "note"
            ) {

                createNote(
                    object.x,
                    object.y,
                    object.title,
                    object.content
                );

            }


            else if (
                object.type ===
                "image"
            ) {

                createImage(
                    object.image,
                    object.x,
                    object.y,
                    object.title,
                    object.width
                );

            }


            else if (
                object.type ===
                "sticker"
            ) {

                createSticker(
                    object.image,
                    object.x,
                    object.y,
                    object.width
                );

            }

        }
    );


    /*
       Load drawing
    */

    if (data.drawing) {

        const image =
            new Image();


        image.onload =
            function() {

                drawingContext.clearRect(
                    0,
                    0,
                    drawingCanvas.width,
                    drawingCanvas.height
                );


                drawingContext.drawImage(
                    image,
                    0,
                    0
                );

            };


        image.src =
            data.drawing;

    }

}



/* =========================
   NEW BOARD
========================= */

newButton.addEventListener(
    "click",
    function() {

        const answer =
            confirm(
                "Start a new board? Unsaved changes will be lost."
            );


        if (!answer) {
            return;
        }


        workspace.innerHTML = "";


        drawingContext.clearRect(
            0,
            0,
            drawingCanvas.width,
            drawingCanvas.height
        );


        selectedObject =
            null;


        objectNumber =
            1;


        boardName =
            "Untitled Board";

    }
);



/* =========================
   BUTTONS
========================= */

saveButton.addEventListener(
    "click",
    saveBoard
);


saveAsButton.addEventListener(
    "click",
    saveAsBoard
);



/* =========================
   KEYBOARD SHORTCUTS
========================= */

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.ctrlKey &&
            event.key.toLowerCase() === "s"
        ) {

            event.preventDefault();

            saveBoard();

        }


        if (
            event.ctrlKey &&
            event.key.toLowerCase() === "o"
        ) {

            event.preventDefault();

            boardInput.click();

        }


        if (
            event.key === "Delete" &&
            selectedObject
        ) {

            selectedObject.remove();

            selectedObject =
                null;

        }

    }
);



/* =========================
   PAN
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
                event.shiftKey &&
                !drawingMode &&
                !eraserMode
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

        if (!panning) {
            return;
        }


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

        if (
            !drawingMode &&
            !eraserMode
        ) {

            board.style.cursor =
                "default";

        }

    }
);



/* =========================
   ZOOM
========================= */

board.addEventListener(
    "wheel",
    function(event) {

        if (
            drawingMode ||
            eraserMode
        ) {

            return;

        }


        event.preventDefault();


        if (event.deltaY < 0) {

            zoom += 0.1;

        }

        else {

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
   CAMERA
========================= */

function updateCamera() {

    const transform =
        `translate(${cameraX}px, ${cameraY}px) scale(${zoom})`;


    workspace.style.transform =
        transform;


    drawingCanvas.style.transform =
        transform;


    zoomDisplay.textContent =
        Math.round(
            zoom * 100
        ) + "%";

}



/* =========================
   HTML SAFETY
========================= */

function escapeHTML(
    text
) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        text || "";


    return div.innerHTML;

}



/* =========================
   START
========================= */

setDrawingMode(
    "none"
);


updateCamera();
