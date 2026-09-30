const board =
    document.getElementById("board");

const workspace =
    document.getElementById("workspace");

const drawingCanvas =
    document.getElementById("drawingCanvas");

const drawingContext =
    drawingCanvas.getContext("2d");


/* =========================
   BUTTONS
========================= */

const selectButton =
    document.getElementById("selectButton");

const textButton =
    document.getElementById("textButton");

const imageButton =
    document.getElementById("imageButton");

const stickerButton =
    document.getElementById("stickerButton");

const drawButton =
    document.getElementById("drawButton");

const eraserButton =
    document.getElementById("eraserButton");

const newButton =
    document.getElementById("newButton");

const saveButton =
    document.getElementById("saveButton");

const saveAsButton =
    document.getElementById("saveAsButton");

const loadButton =
    document.getElementById("loadButton");

const shareButton =
    document.getElementById("shareButton");

const resetViewButton =
    document.getElementById("resetViewButton");

const backgroundImageButton =
    document.getElementById("backgroundImageButton");

const tileBackgroundButton =
    document.getElementById("tileBackgroundButton");


/* =========================
   HELP
========================= */

const helpButton =
    document.getElementById("helpButton");

const helpWindow =
    document.getElementById("helpWindow");

const closeHelp =
    document.getElementById("closeHelp");


/* =========================
   COLORS / CUSTOMIZATION
========================= */

const penColor =
    document.getElementById("penColor");

const backgroundColor =
    document.getElementById("backgroundColor");

const textColor =
    document.getElementById("textColor");

const fontSelect =
    document.getElementById("fontSelect");


/* =========================
   INPUTS
========================= */

const imageInput =
    document.getElementById("imageInput");

const backgroundImageInput =
    document.getElementById(
        "backgroundImageInput"
    );

const boardInput =
    document.getElementById("boardInput");


/* =========================
   CONTEXT MENU
========================= */

const contextMenu =
    document.getElementById("contextMenu");

const deleteObject =
    document.getElementById("deleteObject");

const duplicateObject =
    document.getElementById("duplicateObject");

const pixelObject =
    document.getElementById("pixelObject");

const bringFront =
    document.getElementById("bringFront");

const bringForward =
    document.getElementById("bringForward");

const sendBackward =
    document.getElementById("sendBackward");

const sendBack =
    document.getElementById("sendBack");


/* =========================
   STATE
========================= */

let selectedObject =
    null;

let objectNumber =
    1;

let boardName =
    "Untitled Board";

let currentFileHandle =
    null;

let currentImageType =
    "image";

let drawingMode =
    "select";

let drawing =
    false;

let cameraX =
    0;

let cameraY =
    0;

let zoom =
    1;

let backgroundImage =
    "";

let backgroundTiled =
    true;


/* =========================
   CANVAS
========================= */

drawingCanvas.width =
    10000;

drawingCanvas.height =
    10000;


/* =========================
   CUSTOMIZATION
========================= */

function updateCustomization() {

    workspace.style.setProperty(
        "--board-font",
        fontSelect.value
    );

    workspace.style.setProperty(
        "--board-text-color",
        textColor.value
    );

    workspace.style.backgroundColor =
        backgroundColor.value;

    board.style.backgroundColor =
        backgroundColor.value;

}


backgroundColor.addEventListener(
    "input",
    updateCustomization
);


textColor.addEventListener(
    "input",
    updateCustomization
);


fontSelect.addEventListener(
    "change",
    updateCustomization
);


/* =========================
   BACKGROUND IMAGE
========================= */

backgroundImageButton.addEventListener(
    "click",
    () => {

        backgroundImageInput.click();

    }
);


backgroundImageInput.addEventListener(
    "change",
    () => {

        const file =
            backgroundImageInput.files[0];


        if (!file) {

            return;

        }


        const reader =
            new FileReader();


        reader.onload =
            event => {

                backgroundImage =
                    event.target.result;

                updateBackground();

            };


        reader.readAsDataURL(file);


        backgroundImageInput.value =
            "";

    }
);


function updateBackground() {

    workspace.style.backgroundColor =
        backgroundColor.value;


    board.style.backgroundColor =
        backgroundColor.value;


    if (backgroundImage) {

        workspace.style.backgroundImage =
            `url("${backgroundImage}")`;

    } else {

        workspace.style.backgroundImage =
            "none";

    }


    if (backgroundTiled) {

        workspace.style.backgroundRepeat =
            "repeat";

        workspace.style.backgroundSize =
            "auto";

    } else {

        workspace.style.backgroundRepeat =
            "no-repeat";

        workspace.style.backgroundSize =
            "cover";

    }


    tileBackgroundButton.textContent =
        backgroundTiled
            ? "BG TILE: ON"
            : "BG TILE: OFF";

}


tileBackgroundButton.addEventListener(
    "click",
    () => {

        backgroundTiled =
            !backgroundTiled;

        updateBackground();

    }
);


/* =========================
   SELECT OBJECT
========================= */

function selectObject(object) {

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
   DESELECT
========================= */

function deselectObject() {

    if (selectedObject) {

        selectedObject.classList.remove(
            "selected"
        );

    }


    selectedObject =
        null;

}


/* =========================
   TOOL MODE
========================= */

function setTool(tool) {

    drawingMode =
        tool;


    [
        selectButton,
        drawButton,
        eraserButton
    ].forEach(button => {

        button.classList.remove(
            "active"
        );

    });


    if (tool === "select") {

        selectButton.classList.add(
            "active"
        );

        drawingCanvas.style.pointerEvents =
            "none";

        board.style.cursor =
            "default";

    }


    if (tool === "draw") {

        drawButton.classList.add(
            "active"
        );

        drawingCanvas.style.pointerEvents =
            "auto";

        board.style.cursor =
            "crosshair";

    }


    if (tool === "erase") {

        eraserButton.classList.add(
            "active"
        );

        drawingCanvas.style.pointerEvents =
            "auto";

        board.style.cursor =
            "crosshair";

    }

}


/* =========================
   SELECT
========================= */

selectButton.addEventListener(
    "click",
    () => {

        setTool("select");

    }
);


/* =========================
   TEXT
========================= */

textButton.addEventListener(
    "click",
    () => {

        const x =
            200 -
            cameraX / zoom;

        const y =
            150 -
            cameraY / zoom;


        createNote(
            x,
            y
        );


        setTool("select");

    }
);


/* =========================
   DRAW
========================= */

drawButton.addEventListener(
    "click",
    () => {

        setTool("draw");

    }
);


/* =========================
   ERASER
========================= */

eraserButton.addEventListener(
    "click",
    () => {

        setTool("erase");

    }
);


/* =========================
   DRAWING
========================= */

drawingCanvas.addEventListener(
    "mousedown",
    event => {

        if (
            drawingMode !== "draw" &&
            drawingMode !== "erase"
        ) {

            return;

        }


        drawing =
            true;


        const position =
            getCanvasPosition(event);


        drawingContext.beginPath();


        drawingContext.moveTo(
            position.x,
            position.y
        );


        drawingContext.lineWidth =
            drawingMode === "erase"
                ? 30
                : 4;


        drawingContext.lineCap =
            "round";


        drawingContext.lineJoin =
            "round";


        if (
            drawingMode === "erase"
        ) {

            drawingContext.globalCompositeOperation =
                "destination-out";

        } else {

            drawingContext.globalCompositeOperation =
                "source-over";

            drawingContext.strokeStyle =
                penColor.value;

        }

    }
);


drawingCanvas.addEventListener(
    "mousemove",
    event => {

        if (!drawing) {

            return;

        }


        const position =
            getCanvasPosition(event);


        drawingContext.lineTo(
            position.x,
            position.y
        );


        drawingContext.stroke();

    }
);


document.addEventListener(
    "mouseup",
    () => {

        drawing =
            false;

    }
);


function getCanvasPosition(event) {

    const rect =
        board.getBoundingClientRect();


    return {

        x:
            (
                event.clientX -
                rect.left -
                cameraX
            ) / zoom,

        y:
            (
                event.clientY -
                rect.top -
                cameraY
            ) / zoom

    };

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
        document.createElement("div");


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
            ${escapeHTML(content)}
        </div>

        <div class="resize-handle"></div>

    `;


    workspace.appendChild(note);


    objectNumber++;


    setupObject(note);


    selectObject(note);

}


/* =========================
   IMAGE BUTTON
========================= */

imageButton.addEventListener(
    "click",
    () => {

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
    () => {

        currentImageType =
            "sticker";

        imageInput.click();

    }
);


/* =========================
   IMAGE INPUT
========================= */

imageInput.addEventListener(
    "change",
    () => {

        const file =
            imageInput.files[0];


        if (!file) {

            return;

        }


        const reader =
            new FileReader();


        reader.onload =
            event => {

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


                if (
                    currentImageType ===
                    "sticker"
                ) {

                    createSticker(
                        event.target.result,
                        x,
                        y
                    );

                }

            };


        reader.readAsDataURL(file);


        imageInput.value =
            "";

    }
);


/* =========================
   CREATE IMAGE
========================= */

function createImage(
    imageData,
    x,
    y,
    title = null,
    width = 260,
    pixel = false
) {

    const object =
        document.createElement("div");


    object.className =
        "image-object board-object";


    object.style.left =
        x + "px";


    object.style.top =
        y + "px";


    object.style.width =
        width + "px";


    if (pixel) {

        object.classList.add(
            "pixel-mode"
        );

    }


    object.innerHTML = `

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

        <div class="resize-handle"></div>

    `;


    workspace.appendChild(object);


    objectNumber++;


    setupObject(object);


    selectObject(object);

}


/* =========================
   CREATE STICKER
========================= */

function createSticker(
    imageData,
    x,
    y,
    width = 180,
    pixel = false
) {

    const object =
        document.createElement("div");


    object.className =
        "sticker board-object";


    object.style.left =
        x + "px";


    object.style.top =
        y + "px";


    if (pixel) {

        object.classList.add(
            "pixel-mode"
        );

    }


    object.innerHTML = `

        <img
            src="${imageData}"
            style="width:${width}px"
        >

        <div class="resize-handle"></div>

    `;


    workspace.appendChild(object);


    setupObject(object);


    selectObject(object);

}


/* =========================
   SETUP OBJECT
========================= */

function setupObject(object) {

    object.addEventListener(
        "mousedown",
        event => {

            if (
                drawingMode ===
                "select"
            ) {

                selectObject(object);

            }

        }
    );


    object.addEventListener(
        "contextmenu",
        event => {

            event.preventDefault();


            selectObject(object);


            updatePixelMenu();


            contextMenu.style.display =
                "block";


            contextMenu.style.left =
                event.clientX + "px";


            contextMenu.style.top =
                event.clientY + "px";

        }
    );


    setupEditing(object);

    setupDragging(object);

    setupResizing(object);

}


/* =========================
   PIXEL MODE MENU
========================= */

function updatePixelMenu() {

    if (!selectedObject) {

        return;

    }


    const isImage =
        selectedObject.classList.contains(
            "image-object"
        );


    const isSticker =
        selectedObject.classList.contains(
            "sticker"
        );


    if (
        !isImage &&
        !isSticker
    ) {

        pixelObject.style.display =
            "none";

        return;

    }


    pixelObject.style.display =
        "block";


    if (
        selectedObject.classList.contains(
            "pixel-mode"
        )
    ) {

        pixelObject.textContent =
            "Pixel Mode: ON";

    } else {

        pixelObject.textContent =
            "Pixel Mode: OFF";

    }

}


/* =========================
   TOGGLE PIXEL MODE
========================= */

pixelObject.addEventListener(
    "click",
    event => {

        event.stopPropagation();


        if (!selectedObject) {

            return;

        }


        const isImage =
            selectedObject.classList.contains(
                "image-object"
            );


        const isSticker =
            selectedObject.classList.contains(
                "sticker"
            );


        if (
            !isImage &&
            !isSticker
        ) {

            closeContextMenu();

            return;

        }


        selectedObject.classList.toggle(
            "pixel-mode"
        );


        updatePixelMenu();


        closeContextMenu();

    }
);


/* =========================
   EDITING
========================= */

function setupEditing(object) {

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
            event => {

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
            () => {

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
            event => {

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
            () => {

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
   DRAGGING
========================= */

function setupDragging(object) {

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
        event => {

            if (
                drawingMode !==
                "select"
            ) {

                return;

            }


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


            selectObject(object);


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
   RESIZING
========================= */

function setupResizing(object) {

    const handle =
        object.querySelector(
            ".resize-handle"
        );


    if (!handle) {

        return;

    }


    handle.addEventListener(
        "mousedown",
        event => {

            event.preventDefault();

            event.stopPropagation();


            if (
                drawingMode !==
                "select"
            ) {

                return;

            }


            selectObject(object);


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


                newWidth =
                    Math.max(
                        80,
                        Math.min(
                            1000,
                            newWidth
                        )
                    );


                if (
                    object.classList.contains(
                        "sticker"
                    )
                ) {

                    object.querySelector(
                        "img"
                    ).style.width =
                        newWidth + "px";

                } else {

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
   DELETE
========================= */

deleteObject.addEventListener(
    "click",
    event => {

        event.stopPropagation();


        if (selectedObject) {

            selectedObject.remove();

            selectedObject =
                null;

        }


        closeContextMenu();

    }
);


/* =========================
   DUPLICATE
========================= */

function duplicateSelectedObject() {

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


    copy.classList.remove(
        "selected"
    );


    workspace.appendChild(
        copy
    );


    setupObject(copy);


    selectObject(copy);

}


duplicateObject.addEventListener(
    "click",
    event => {

        event.stopPropagation();


        duplicateSelectedObject();


        closeContextMenu();

    }
);


/* =========================
   BRING TO FRONT
========================= */

bringFront.addEventListener(
    "click",
    event => {

        event.stopPropagation();


        if (!selectedObject) {

            return;

        }


        let highest =
            0;


        workspace
            .querySelectorAll(
                ".board-object"
            )
            .forEach(object => {

                highest =
                    Math.max(
                        highest,
                        parseInt(
                            object.style.zIndex ||
                            "0"
                        )
                    );

            });


        selectedObject.style.zIndex =
            highest + 1;


        closeContextMenu();

    }
);


/* =========================
   BRING FORWARD
========================= */

bringForward.addEventListener(
    "click",
    event => {

        event.stopPropagation();


        if (!selectedObject) {

            return;

        }


        const current =
            parseInt(
                selectedObject.style.zIndex ||
                "0"
            );


        selectedObject.style.zIndex =
            current + 1;


        closeContextMenu();

    }
);


/* =========================
   SEND BACKWARD
========================= */

sendBackward.addEventListener(
    "click",
    event => {

        event.stopPropagation();


        if (!selectedObject) {

            return;

        }


        const current =
            parseInt(
                selectedObject.style.zIndex ||
                "0"
            );


        selectedObject.style.zIndex =
            current - 1;


        closeContextMenu();

    }
);


/* =========================
   SEND TO BACK
========================= */

sendBack.addEventListener(
    "click",
    event => {

        event.stopPropagation();


        if (!selectedObject) {

            return;

        }


        selectedObject.style.zIndex =
            -100;


        closeContextMenu();

    }
);


/* =========================
   CLOSE MENU
========================= */

function closeContextMenu() {

    contextMenu.style.display =
        "none";

}


document.addEventListener(
    "click",
    event => {

        closeContextMenu();

    }
);


/* =========================
   EMPTY BOARD DESELECT
========================= */

board.addEventListener(
    "mousedown",
    event => {

        if (
            event.target === board ||
            event.target === workspace
        ) {

            deselectObject();

        }

    }
);


/* =========================
   HELP
========================= */

helpButton.addEventListener(
    "click",
    event => {

        event.stopPropagation();


        helpWindow.style.display =
            "flex";

    }
);


closeHelp.addEventListener(
    "click",
    () => {

        helpWindow.style.display =
            "none";

    }
);


helpWindow.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            helpWindow
        ) {

            helpWindow.style.display =
                "none";

        }

    }
);


/* =========================
   NEW BOARD
========================= */

newButton.addEventListener(
    "click",
    () => {

        if (
            !confirm(
                "Start a new board?"
            )
        ) {

            return;

        }


        workspace.innerHTML =
            "";


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


        currentFileHandle =
            null;


        backgroundImage =
            "";


        backgroundTiled =
            true;


        backgroundColor.value =
            "#ffffff";


        penColor.value =
            "#000000";


        textColor.value =
            "#222222";


        fontSelect.value =
            "Tahoma, Arial, sans-serif";


        cameraX =
            0;


        cameraY =
            0;


        zoom =
            1;


        updateCustomization();

        updateBackground();

        updateCamera();

    }
);


/* =========================
   SAVE AS
========================= */

async function saveAsBoard() {

    const name =
        prompt(
            "Board name:",
            boardName
        );


    if (!name) {

        return;

    }


    boardName =
        name;


    if (
        window.showSaveFilePicker
    ) {

        try {

            const handle =
                await window.showSaveFilePicker({

                    suggestedName:
                        boardName +
                        ".json",

                    types: [

                        {

                            description:
                                "Pickdel Board",

                            accept: {

                                "application/json":
                                    [".json"]

                            }

                        }

                    ]

                });


            currentFileHandle =
                handle;


            await writeToFile(
                handle
            );


            return;

        }

        catch (error) {

            if (
                error.name ===
                "AbortError"
            ) {

                return;

            }

        }

    }


    downloadBoard();

}


/* =========================
   SAVE
========================= */

async function saveBoard() {

    if (
        currentFileHandle
    ) {

        await writeToFile(
            currentFileHandle
        );

        return;

    }


    await saveAsBoard();

}


saveButton.addEventListener(
    "click",
    saveBoard
);


saveAsButton.addEventListener(
    "click",
    saveAsBoard
);


/* =========================
   WRITE FILE
========================= */

async function writeToFile(handle) {

    const data =
        getBoardData();


    const json =
        JSON.stringify(
            data,
            null,
            2
        );


    const writable =
        await handle.createWritable();


    await writable.write(
        json
    );


    await writable.close();

}


/* =========================
   DOWNLOAD FALLBACK
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
        document.createElement("a");


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
   SHARE BOARD
========================= */

async function shareBoard() {

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


    const file =
        new File(
            [blob],
            boardName + ".json",
            {
                type:
                    "application/json"
            }
        );


    if (
        navigator.share &&
        navigator.canShare &&
        navigator.canShare({
            files: [file]
        })
    ) {

        try {

            await navigator.share({

                title:
                    boardName,

                text:
                    "Pickdel Board",

                files:
                    [file]

            });

            return;

        }

        catch (error) {

            if (
                error.name ===
                "AbortError"
            ) {

                return;

            }

        }

    }


    downloadBoard();


    alert(
        "Your Pickdel board was downloaded as a JSON file. You can send that file to someone else and they can LOAD it in Pickdel."
    );

}


shareButton.addEventListener(
    "click",
    shareBoard
);


/* =========================
   LOAD
========================= */

loadButton.addEventListener(
    "click",
    () => {

        boardInput.click();

    }
);


boardInput.addEventListener(
    "change",
    () => {

        const file =
            boardInput.files[0];


        if (!file) {

            return;

        }


        const reader =
            new FileReader();


        reader.onload =
            event => {

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


        boardInput.value =
            "";

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
            object => {

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
                        object.offsetWidth,

                    zIndex:
                        parseInt(
                            object.style.zIndex ||
                            "0"
                        ),

                    pixel:
                        object.classList.contains(
                            "pixel-mode"
                        )

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


                if (
                    object.classList.contains(
                        "sticker"
                    )
                ) {

                    data.width =
                        image
                            ? image.offsetWidth
                            : 180;

                }


                objects.push(
                    data
                );

            }
        );


    return {

        version:
            7,

        name:
            boardName,

        background:
            backgroundColor.value,

        penColor:
            penColor.value,

        textColor:
            textColor.value,

        font:
            fontSelect.value,

        backgroundImage:
            backgroundImage,

        backgroundTiled:
            backgroundTiled,

        objects,

        drawing:
            drawingCanvas.toDataURL()

    };

}


/* =========================
   OBJECT TYPE
========================= */

function getObjectType(object) {

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
   LOAD BOARD
========================= */

function loadBoard(data) {

    workspace.innerHTML =
        "";


    selectedObject =
        null;


    boardName =
        data.name ||
        "Untitled Board";


    if (data.background) {

        backgroundColor.value =
            data.background;

    }


    if (data.penColor) {

        penColor.value =
            data.penColor;

    }


    if (data.textColor) {

        textColor.value =
            data.textColor;

    }


    if (data.font) {

        fontSelect.value =
            data.font;

    }


    backgroundImage =
        data.backgroundImage ||
        "";


    backgroundTiled =
        data.backgroundTiled !== false;


    updateCustomization();

    updateBackground();


    objectNumber =
        1;


    if (
        Array.isArray(
            data.objects
        )
    ) {

        data.objects.forEach(
            object => {

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


                if (
                    object.type ===
                    "image"
                ) {

                    createImage(
                        object.image,
                        object.x,
                        object.y,
                        object.title,
                        object.width,
                        object.pixel
                    );

                }


                if (
                    object.type ===
                    "sticker"
                ) {

                    createSticker(
                        object.image,
                        object.x,
                        object.y,
                        object.width,
                        object.pixel
                    );

                }


                if (
                    selectedObject
                ) {

                    selectedObject.style.zIndex =
                        object.zIndex ||
                        0;

                    selectedObject =
                        null;

                }

            }
        );

    }


    if (data.drawing) {

        const image =
            new Image();


        image.onload =
            () => {

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
   KEYBOARD
========================= */

document.addEventListener(
    "keydown",
    event => {

        const activeElement =
            document.activeElement;


        const isTyping =
            activeElement &&
            (
                activeElement.isContentEditable ||
                activeElement.tagName === "INPUT" ||
                activeElement.tagName === "TEXTAREA" ||
                activeElement.tagName === "SELECT"
            );


        if (
            event.ctrlKey &&
            event.key.toLowerCase() ===
            "s"
        ) {

            event.preventDefault();

            saveBoard();

            return;

        }


        if (
            event.ctrlKey &&
            event.key.toLowerCase() ===
            "o"
        ) {

            event.preventDefault();

            loadButton.click();

            return;

        }


        if (
            event.ctrlKey &&
            event.key.toLowerCase() ===
            "d"
        ) {

            if (!isTyping) {

                event.preventDefault();

                duplicateSelectedObject();

            }

            return;

        }


        if (
            event.key ===
            "Escape"
        ) {

            setTool(
                "select"
            );


            helpWindow.style.display =
                "none";


            closeContextMenu();


            return;

        }


        if (
            isTyping
        ) {

            return;

        }


        if (
            event.key ===
            "Delete" &&
            selectedObject &&
            drawingMode ===
            "select"
        ) {

            selectedObject.remove();

            selectedObject =
                null;

            return;

        }


        if (
            drawingMode ===
            "select"
        ) {

            let moveX =
                0;

            let moveY =
                0;


            const moveAmount =
                event.shiftKey
                    ? 50
                    : 20;


            if (
                event.key.toLowerCase() ===
                "w" ||
                event.key ===
                "ArrowUp"
            ) {

                moveY =
                    moveAmount;

            }


            if (
                event.key.toLowerCase() ===
                "s" ||
                event.key ===
                "ArrowDown"
            ) {

                moveY =
                    -moveAmount;

            }


            if (
                event.key.toLowerCase() ===
                "a" ||
                event.key ===
                "ArrowLeft"
            ) {

                moveX =
                    moveAmount;

            }


            if (
                event.key.toLowerCase() ===
                "d" ||
                event.key ===
                "ArrowRight"
            ) {

                moveX =
                    -moveAmount;

            }


            if (
                moveX !== 0 ||
                moveY !== 0
            ) {

                event.preventDefault();


                cameraX +=
                    moveX;

                cameraY +=
                    moveY;


                updateCamera();

            }

        }

    }
);


/* =========================
   PAN
========================= */

let panning =
    false;

let panStartX =
    0;

let panStartY =
    0;

let cameraStartX =
    0;

let cameraStartY =
    0;


board.addEventListener(
    "mousedown",
    event => {

        if (
            drawingMode !==
            "select"
        ) {

            return;

        }


        if (
            event.button === 1 ||
            (
                event.button === 0 &&
                event.shiftKey
            )
        ) {

            panning =
                true;


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
    event => {

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
    () => {

        panning =
            false;


        if (
            drawingMode ===
            "select"
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
    event => {

        if (
            drawingMode !==
            "select"
        ) {

            return;

        }


        event.preventDefault();


        if (
            event.deltaY < 0
        ) {

            zoom +=
                0.1;

        } else {

            zoom -=
                0.1;

        }


        zoom =
            Math.max(
                0.3,
                Math.min(
                    3,
                    zoom
                )
            );


        updateCamera();

    },
    {
        passive: false
    }
);


/* =========================
   RESET VIEW
========================= */

resetViewButton.addEventListener(
    "click",
    () => {

        cameraX =
            0;

        cameraY =
            0;

        zoom =
            1;

        updateCamera();

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


    document.getElementById(
        "zoomDisplay"
    ).textContent =
        Math.round(
            zoom * 100
        ) + "%";

}


/* =========================
   CURSOR
========================= */

function placeCursorAtEnd(element) {

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
   ESCAPE HTML
========================= */

function escapeHTML(text) {

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

updateCustomization();

updateBackground();

setTool(
    "select"
);

updateCamera();
