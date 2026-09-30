"use strict";


/* =========================================================
   ELEMENTS
========================================================= */

const board =
    document.getElementById("board");

const workspace =
    document.getElementById("workspace");

const drawingCanvas =
    document.getElementById("drawingCanvas");

const drawingContext =
    drawingCanvas.getContext("2d");


/* =========================================================
   TOOLBAR
========================================================= */

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

const styleButton =
    document.getElementById("styleButton");

const newButton =
    document.getElementById("newButton");

const saveButton =
    document.getElementById("saveButton");

const saveAsButton =
    document.getElementById("saveAsButton");

const loadButton =
    document.getElementById("loadButton");

const helpButton =
    document.getElementById("helpButton");

const penColor =
    document.getElementById("penColor");

const backgroundColor =
    document.getElementById("backgroundColor");


/* =========================================================
   FILE INPUTS
========================================================= */

const imageInput =
    document.getElementById("imageInput");

const backgroundImageInput =
    document.getElementById("backgroundImageInput");

const boardInput =
    document.getElementById("boardInput");


/* =========================================================
   CONTEXT MENU
========================================================= */

const contextMenu =
    document.getElementById("contextMenu");

const deleteObjectButton =
    document.getElementById("deleteObject");

const duplicateObjectButton =
    document.getElementById("duplicateObject");

const pixelObjectButton =
    document.getElementById("pixelObject");

const bringFrontButton =
    document.getElementById("bringFront");

const bringForwardButton =
    document.getElementById("bringForward");

const sendBackwardButton =
    document.getElementById("sendBackward");

const sendBackButton =
    document.getElementById("sendBack");


/* =========================================================
   STYLE PANEL
========================================================= */

const stylePanel =
    document.getElementById("stylePanel");

const closeStyle =
    document.getElementById("closeStyle");


/* =========================================================
   UI CONTROLS
========================================================= */

const uiColor =
    document.getElementById("uiColor");

const uiTextColor =
    document.getElementById("uiTextColor");

const uiHoverColor =
    document.getElementById("uiHoverColor");

const uiActiveColor =
    document.getElementById("uiActiveColor");

const uiAccent =
    document.getElementById("uiAccent");

const uiAccentDark =
    document.getElementById("uiAccentDark");

const uiFont =
    document.getElementById("uiFont");


/* =========================================================
   BOARD CONTROLS
========================================================= */

const boardWidthInput =
    document.getElementById("boardWidth");

const boardHeightInput =
    document.getElementById("boardHeight");


/* =========================================================
   BACKGROUND CONTROLS
========================================================= */

const styleBackgroundColor =
    document.getElementById("styleBackgroundColor");

const backgroundRepeat =
    document.getElementById("backgroundRepeat");

const backgroundScale =
    document.getElementById("backgroundScale");

const backgroundImageButton =
    document.getElementById("backgroundImageButton");

const removeBackgroundImage =
    document.getElementById("removeBackgroundImage");

const backgroundStatus =
    document.getElementById("backgroundStatus");


/* =========================================================
   OBJECT STYLE CONTROLS
========================================================= */

const noObjectMessage =
    document.getElementById("noObjectMessage");

const objectStyleControls =
    document.getElementById("objectStyleControls");

const objectHeaderColor =
    document.getElementById("objectHeaderColor");

const objectBodyColor =
    document.getElementById("objectBodyColor");

const objectBorderColor =
    document.getElementById("objectBorderColor");

const objectHeaderTextColor =
    document.getElementById("objectHeaderTextColor");

const objectBodyTextColor =
    document.getElementById("objectBodyTextColor");

const objectHeaderFont =
    document.getElementById("objectHeaderFont");

const objectBodyFont =
    document.getElementById("objectBodyFont");

const objectHeaderSize =
    document.getElementById("objectHeaderSize");

const objectBodySize =
    document.getElementById("objectBodySize");

const objectBorderWidth =
    document.getElementById("objectBorderWidth");

const objectShadow =
    document.getElementById("objectShadow");

const resetObjectStyle =
    document.getElementById("resetObjectStyle");


/* =========================================================
   HELP
========================================================= */

const helpWindow =
    document.getElementById("helpWindow");

const closeHelp =
    document.getElementById("closeHelp");


/* =========================================================
   STATE
========================================================= */

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


/* =========================================================
   BOARD STATE
========================================================= */

let boardWidth =
    5000;

let boardHeight =
    5000;


/* =========================================================
   BACKGROUND STATE
========================================================= */

let backgroundImageData =
    null;


/* =========================================================
   CAMERA
========================================================= */

let cameraX =
    0;

let cameraY =
    0;

let zoom =
    1;


/* =========================================================
   PAN
========================================================= */

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


/* =========================================================
   MOVEMENT
========================================================= */

const movementKeys =
    new Set();

let movementAnimation =
    null;


/* =========================================================
   DEFAULT OBJECT STYLE
========================================================= */

const DEFAULT_OBJECT_STYLE = {

    headerColor:
        "#316ac5",

    bodyColor:
        "#fffff0",

    borderColor:
        "#6b7c8c",

    headerTextColor:
        "#ffffff",

    bodyTextColor:
        "#222222",

    headerFont:
        "Tahoma, Arial, sans-serif",

    bodyFont:
        "Tahoma, Arial, sans-serif",

    headerSize:
        13,

    bodySize:
        14,

    borderWidth:
        2,

    shadow:
        "normal"

};


/* =========================================================
   INITIAL CANVAS
========================================================= */

setCanvasSize(
    boardWidth,
    boardHeight
);


/* =========================================================
   BOARD SIZE
========================================================= */

function setBoardSize(
    width,
    height
) {

    width =
        clamp(
            Number(width),
            300,
            20000
        );

    height =
        clamp(
            Number(height),
            300,
            20000
        );


    boardWidth =
        width;

    boardHeight =
        height;


    boardWidthInput.value =
        width;

    boardHeightInput.value =
        height;


    workspace.style.width =
        `${width}px`;

    workspace.style.height =
        `${height}px`;


    resizeDrawingCanvas(
        width,
        height
    );


    keepCameraInsideBoard();

}


/* =========================================================
   DRAWING CANVAS RESIZE
========================================================= */

function resizeDrawingCanvas(
    width,
    height
) {

    /*
       Preserve existing drawing.
    */

    let oldDrawing =
        null;


    if (
        drawingCanvas.width > 0 &&
        drawingCanvas.height > 0
    ) {

        try {

            oldDrawing =
                drawingCanvas.toDataURL();

        }

        catch {

            oldDrawing =
                null;

        }

    }


    drawingCanvas.width =
        width;

    drawingCanvas.height =
        height;


    drawingCanvas.style.width =
        `${width}px`;

    drawingCanvas.style.height =
        `${height}px`;


    if (
        oldDrawing
    ) {

        const image =
            new Image();


        image.onload =
            () => {

                drawingContext.drawImage(
                    image,
                    0,
                    0
                );

            };


        image.src =
            oldDrawing;

    }

}


/* =========================================================
   BOARD SIZE INPUTS
========================================================= */

boardWidthInput.addEventListener(
    "change",
    () => {

        setBoardSize(
            boardWidthInput.value,
            boardHeightInput.value
        );

    }
);


boardHeightInput.addEventListener(
    "change",
    () => {

        setBoardSize(
            boardWidthInput.value,
            boardHeightInput.value
        );

    }
);


/* =========================================================
   CAMERA LIMITS
========================================================= */

function keepCameraInsideBoard() {

    const visibleWidth =
        board.clientWidth /
        zoom;

    const visibleHeight =
        board.clientHeight /
        zoom;


    /*
       If the viewport is bigger than
       the board, center it.
    */

    if (
        visibleWidth >=
        boardWidth
    ) {

        cameraX =
            (
                board.clientWidth -
                boardWidth *
                zoom
            ) / 2;

    }

    else {

        const minCameraX =
            board.clientWidth -
            boardWidth *
            zoom;


        cameraX =
            Math.min(
                0,
                Math.max(
                    minCameraX,
                    cameraX
                )
            );

    }


    if (
        visibleHeight >=
        boardHeight
    ) {

        cameraY =
            (
                board.clientHeight -
                boardHeight *
                zoom
            ) / 2;

    }

    else {

        const minCameraY =
            board.clientHeight -
            boardHeight *
            zoom;


        cameraY =
            Math.min(
                0,
                Math.max(
                    minCameraY,
                    cameraY
                )
            );

    }

}


/* =========================================================
   CENTER BOARD
========================================================= */

function centerCamera() {

    cameraX =
        (
            board.clientWidth -
            boardWidth *
            zoom
        ) / 2;


    cameraY =
        (
            board.clientHeight -
            boardHeight *
            zoom
        ) / 2;


    keepCameraInsideBoard();

    updateCamera();

}


/* =========================================================
   UPDATE CAMERA
========================================================= */

function updateCamera() {

    keepCameraInsideBoard();


    const transform =
        `translate(${cameraX}px, ${cameraY}px) scale(${zoom})`;


    workspace.style.transform =
        transform;


    drawingCanvas.style.transform =
        transform;


    document.getElementById(
        "zoomDisplay"
    ).textContent =
        `${Math.round(zoom * 100)}%`;

}


/* =========================================================
   UI STYLE
========================================================= */

function applyUIStyle() {

    const root =
        document.documentElement;


    root.style.setProperty(
        "--ui-color",
        uiColor.value
    );


    root.style.setProperty(
        "--ui-text",
        uiTextColor.value
    );


    root.style.setProperty(
        "--ui-hover",
        uiHoverColor.value
    );


    root.style.setProperty(
        "--ui-active",
        uiActiveColor.value
    );


    root.style.setProperty(
        "--accent",
        uiAccent.value
    );


    root.style.setProperty(
        "--accent-dark",
        uiAccentDark.value
    );


    document.body.style.fontFamily =
        uiFont.value;

}


/* =========================================================
   UI CONTROL EVENTS
========================================================= */

[
    uiColor,
    uiTextColor,
    uiHoverColor,
    uiActiveColor,
    uiAccent,
    uiAccentDark,
    uiFont
].forEach(
    control => {

        control.addEventListener(
            "input",
            applyUIStyle
        );


        control.addEventListener(
            "change",
            applyUIStyle
        );

    }
);


/* =========================================================
   BACKGROUND COLOR
========================================================= */

function applyBackground() {

    const color =
        styleBackgroundColor.value;


    document.documentElement.style.setProperty(
        "--board-color",
        color
    );


    board.style.backgroundColor =
        color;


    workspace.style.backgroundColor =
        color;


    if (
        backgroundImageData
    ) {

        workspace.style.backgroundImage =
            `url("${backgroundImageData}")`;

    }

    else {

        workspace.style.backgroundImage =
            "none";

    }


    workspace.style.backgroundRepeat =
        backgroundRepeat.value;


    workspace.style.backgroundSize =
        `${backgroundScale.value}px auto`;

}


/* =========================================================
   BACKGROUND COLOR EVENTS
========================================================= */

backgroundColor.addEventListener(
    "input",
    () => {

        styleBackgroundColor.value =
            backgroundColor.value;

        applyBackground();

    }
);


styleBackgroundColor.addEventListener(
    "input",
    () => {

        backgroundColor.value =
            styleBackgroundColor.value;

        applyBackground();

    }
);


/* =========================================================
   BACKGROUND REPEAT
========================================================= */

backgroundRepeat.addEventListener(
    "change",
    applyBackground
);


/* =========================================================
   BACKGROUND SCALE
========================================================= */

backgroundScale.addEventListener(
    "input",
    () => {

        backgroundScale.value =
            clamp(
                Number(
                    backgroundScale.value
                ),
                16,
                3000
            );


        applyBackground();

    }
);


/* =========================================================
   BACKGROUND IMAGE
========================================================= */

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


        if (
            !file
        ) {

            return;

        }


        const reader =
            new FileReader();


        reader.onload =
            event => {

                backgroundImageData =
                    event.target.result;

                backgroundStatus.textContent =
                    file.name;

                applyBackground();

            };


        reader.readAsDataURL(
            file
        );


        backgroundImageInput.value =
            "";

    }
);


/* =========================================================
   REMOVE BACKGROUND
========================================================= */

removeBackgroundImage.addEventListener(
    "click",
    () => {

        backgroundImageData =
            null;

        backgroundStatus.textContent =
            "No background image";

        applyBackground();

    }
);


/* =========================================================
   TOOL SYSTEM
========================================================= */

function setTool(
    tool
) {

    drawingMode =
        tool;


    selectButton.classList.remove(
        "active"
    );

    drawButton.classList.remove(
        "active"
    );

    eraserButton.classList.remove(
        "active"
    );


    if (
        tool ===
        "select"
    ) {

        selectButton.classList.add(
            "active"
        );

        drawingCanvas.style.pointerEvents =
            "none";

        board.style.cursor =
            "default";

    }


    if (
        tool ===
        "draw"
    ) {

        drawButton.classList.add(
            "active"
        );

        drawingCanvas.style.pointerEvents =
            "auto";

        board.style.cursor =
            "crosshair";

    }


    if (
        tool ===
        "erase"
    ) {

        eraserButton.classList.add(
            "active"
        );

        drawingCanvas.style.pointerEvents =
            "auto";

        board.style.cursor =
            "crosshair";

    }

}


/* =========================================================
   SELECT
========================================================= */

selectButton.addEventListener(
    "click",
    () => {

        setTool(
            "select"
        );

    }
);


/* =========================================================
   TEXT
========================================================= */

textButton.addEventListener(
    "click",
    () => {

        const position =
            getNewObjectPosition(
                230,
                150
            );


        createNote(
            position.x,
            position.y
        );


        setTool(
            "select"
        );

    }
);


/* =========================================================
   IMAGE
========================================================= */

imageButton.addEventListener(
    "click",
    () => {

        currentImageType =
            "image";

        imageInput.click();

    }
);


/* =========================================================
   STICKER
========================================================= */

stickerButton.addEventListener(
    "click",
    () => {

        currentImageType =
            "sticker";

        imageInput.click();

    }
);


/* =========================================================
   DRAW
========================================================= */

drawButton.addEventListener(
    "click",
    () => {

        setTool(
            "draw"
        );

    }
);


/* =========================================================
   ERASER
========================================================= */

eraserButton.addEventListener(
    "click",
    () => {

        setTool(
            "erase"
        );

    }
);


/* =========================================================
   DRAWING
========================================================= */

drawingCanvas.addEventListener(
    "mousedown",
    event => {

        if (
            drawingMode !== "draw" &&
            drawingMode !== "erase"
        ) {

            return;

        }


        if (
            event.button !== 0
        ) {

            return;

        }


        drawing =
            true;


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
            drawingMode === "erase"
                ? 30
                : 4;


        drawingContext.lineCap =
            "round";

        drawingContext.lineJoin =
            "round";


        if (
            drawingMode ===
            "erase"
        ) {

            drawingContext.globalCompositeOperation =
                "destination-out";

        }

        else {

            drawingContext.globalCompositeOperation =
                "source-over";

            drawingContext.strokeStyle =
                penColor.value;

        }


        event.preventDefault();

    }
);


drawingCanvas.addEventListener(
    "mousemove",
    event => {

        if (
            !drawing
        ) {

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
    () => {

        if (
            drawing
        ) {

            drawingContext.closePath();

        }


        drawing =
            false;

    }
);


/* =========================================================
   CANVAS POSITION
========================================================= */

function getCanvasPosition(
    event
) {

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


/* =========================================================
   IMAGE FILE
========================================================= */

imageInput.addEventListener(
    "change",
    () => {

        const file =
            imageInput.files[0];


        if (
            !file
        ) {

            return;

        }


        const reader =
            new FileReader();


        reader.onload =
            event => {

                const position =
                    getNewObjectPosition(
                        currentImageType ===
                            "image"
                            ? 260
                            : 180,
                        200
                    );


                if (
                    currentImageType ===
                    "image"
                ) {

                    createImage(
                        event.target.result,
                        position.x,
                        position.y
                    );

                }

                else {

                    createSticker(
                        event.target.result,
                        position.x,
                        position.y
                    );

                }

            };


        reader.readAsDataURL(
            file
        );


        imageInput.value =
            "";

    }
);


/* =========================================================
   NEW OBJECT POSITION
========================================================= */

function getNewObjectPosition(
    width,
    height
) {

    const centerX =
        (
            board.clientWidth / 2 -
            cameraX
        ) / zoom;


    const centerY =
        (
            board.clientHeight / 2 -
            cameraY
        ) / zoom;


    return {

        x:
            clamp(
                centerX -
                width / 2,
                20,
                Math.max(
                    20,
                    boardWidth -
                    width -
                    20
                )
            ),

        y:
            clamp(
                centerY -
                height / 2,
                20,
                Math.max(
                    20,
                    boardHeight -
                    height -
                    20
                )
            )

    };

}


/* =========================================================
   CREATE NOTE
========================================================= */

function createNote(
    x,
    y,
    title = null,
    content = "Type something...",
    style = null,
    autoSelect = true
) {

    const note =
        document.createElement(
            "div"
        );


    note.className =
        "note board-object";


    note.style.left =
        `${x}px`;

    note.style.top =
        `${y}px`;


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

        <div class="resize-handle"></div>

    `;


    workspace.appendChild(
        note
    );


    objectNumber++;


    setupObject(
        note
    );


    applyObjectStyle(
        note,
        style ||
        DEFAULT_OBJECT_STYLE
    );


    if (
        autoSelect
    ) {

        selectObject(
            note
        );

    }


    return note;

}


/* =========================================================
   CREATE IMAGE
========================================================= */

function createImage(
    imageData,
    x,
    y,
    title = null,
    width = 260,
    pixel = false,
    style = null,
    autoSelect = true
) {

    const object =
        document.createElement(
            "div"
        );


    object.className =
        "image-object board-object";


    object.style.left =
        `${x}px`;

    object.style.top =
        `${y}px`;

    object.style.width =
        `${width}px`;


    if (
        pixel
    ) {

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


    workspace.appendChild(
        object
    );


    objectNumber++;


    setupObject(
        object
    );


    applyObjectStyle(
        object,
        style ||
        DEFAULT_OBJECT_STYLE
    );


    if (
        autoSelect
    ) {

        selectObject(
            object
        );

    }


    return object;

}


/* =========================================================
   CREATE STICKER
========================================================= */

function createSticker(
    imageData,
    x,
    y,
    width = 180,
    pixel = false,
    autoSelect = true
) {

    const object =
        document.createElement(
            "div"
        );


    object.className =
        "sticker board-object";


    object.style.left =
        `${x}px`;

    object.style.top =
        `${y}px`;


    if (
        pixel
    ) {

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


    workspace.appendChild(
        object
    );


    setupObject(
        object
    );


    if (
        autoSelect
    ) {

        selectObject(
            object
        );

    }


    return object;

}


/* =========================================================
   SETUP OBJECT
========================================================= */

function setupObject(
    object
) {

    object.addEventListener(
        "mousedown",
        event => {

            if (
                drawingMode ===
                "select"
            ) {

                selectObject(
                    object
                );

            }

        }
    );


    object.addEventListener(
        "contextmenu",
        event => {

            event.preventDefault();

            event.stopPropagation();


            selectObject(
                object
            );


            updatePixelMenu();


            contextMenu.style.display =
                "block";


            contextMenu.style.left =
                `${event.clientX}px`;

            contextMenu.style.top =
                `${event.clientY}px`;

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


/* =========================================================
   EDITING
========================================================= */

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


    if (
        title
    ) {

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


        title.addEventListener(
            "keydown",
            event => {

                if (
                    event.key ===
                    "Enter"
                ) {

                    event.preventDefault();

                    title.blur();

                }

            }
        );

    }


    if (
        content
    ) {

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


/* =========================================================
   DRAGGING
========================================================= */

function setupDragging(
    object
) {

    let handle =
        object.querySelector(
            ".note-title, .image-title"
        );


    if (
        !handle
    ) {

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
                event.button !==
                0
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


            function move(
                moveEvent
            ) {

                object.style.left =
                    `${originalX +
                    (
                        moveEvent.clientX -
                        startX
                    ) / zoom}px`;


                object.style.top =
                    `${originalY +
                    (
                        moveEvent.clientY -
                        startY
                    ) / zoom}px`;

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


/* =========================================================
   RESIZING
========================================================= */

function setupResizing(
    object
) {

    const handle =
        object.querySelector(
            ".resize-handle"
        );


    if (
        !handle
    ) {

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


            selectObject(
                object
            );


            const startX =
                event.clientX;


            const startWidth =
                object.classList.contains(
                    "sticker"
                )
                    ? object.querySelector("img").offsetWidth
                    : object.offsetWidth;


            function resize(
                resizeEvent
            ) {

                let width =
                    startWidth +
                    (
                        resizeEvent.clientX -
                        startX
                    ) / zoom;


                width =
                    clamp(
                        width,
                        80,
                        1500
                    );


                if (
                    object.classList.contains(
                        "sticker"
                    )
                ) {

                    object.querySelector(
                        "img"
                    ).style.width =
                        `${width}px`;

                }

                else {

                    object.style.width =
                        `${width}px`;

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


/* =========================================================
   SELECT OBJECT
========================================================= */

function selectObject(
    object
) {

    if (
        selectedObject
    ) {

        selectedObject.classList.remove(
            "selected"
        );

    }


    selectedObject =
        object;


    if (
        selectedObject
    ) {

        selectedObject.classList.add(
            "selected"
        );

    }


    updateObjectStylePanel();

}


/* =========================================================
   OBJECT STYLE
========================================================= */

function applyObjectStyle(
    object,
    style
) {

    const finalStyle =
        {
            ...DEFAULT_OBJECT_STYLE,
            ...(style || {})
        };


    const title =
        object.querySelector(
            ".note-title, .image-title"
        );


    const content =
        object.querySelector(
            ".note-content, .image-content"
        );


    object.style.borderColor =
        finalStyle.borderColor;


    object.style.borderWidth =
        `${finalStyle.borderWidth}px`;


    if (
        finalStyle.shadow ===
        "none"
    ) {

        object.style.boxShadow =
            "none";

    }

    else if (
        finalStyle.shadow ===
        "small"
    ) {

        object.style.boxShadow =
            "2px 2px 0 #999999";

    }

    else {

        object.style.boxShadow =
            "4px 4px 0 #9aa7b2";

    }


    if (
        title
    ) {

        title.style.backgroundColor =
            finalStyle.headerColor;

        title.style.color =
            finalStyle.headerTextColor;

        title.style.fontFamily =
            finalStyle.headerFont;

        title.style.fontSize =
            `${finalStyle.headerSize}px`;

        title.style.borderBottomColor =
            finalStyle.borderColor;

    }


    if (
        content
    ) {

        content.style.backgroundColor =
            finalStyle.bodyColor;

        content.style.color =
            finalStyle.bodyTextColor;

        content.style.fontFamily =
            finalStyle.bodyFont;

        content.style.fontSize =
            `${finalStyle.bodySize}px`;

    }


    Object.keys(
        finalStyle
    ).forEach(
        key => {

            object.dataset[key] =
                finalStyle[key];

        }
    );

}


/* =========================================================
   GET OBJECT STYLE
========================================================= */

function getObjectStyle(
    object
) {

    return {

        headerColor:
            object.dataset.headerColor ||
            DEFAULT_OBJECT_STYLE.headerColor,

        bodyColor:
            object.dataset.bodyColor ||
            DEFAULT_OBJECT_STYLE.bodyColor,

        borderColor:
            object.dataset.borderColor ||
            DEFAULT_OBJECT_STYLE.borderColor,

        headerTextColor:
            object.dataset.headerTextColor ||
            DEFAULT_OBJECT_STYLE.headerTextColor,

        bodyTextColor:
            object.dataset.bodyTextColor ||
            DEFAULT_OBJECT_STYLE.bodyTextColor,

        headerFont:
            object.dataset.headerFont ||
            DEFAULT_OBJECT_STYLE.headerFont,

        bodyFont:
            object.dataset.bodyFont ||
            DEFAULT_OBJECT_STYLE.bodyFont,

        headerSize:
            Number(
                object.dataset.headerSize ||
                DEFAULT_OBJECT_STYLE.headerSize
            ),

        bodySize:
            Number(
                object.dataset.bodySize ||
                DEFAULT_OBJECT_STYLE.bodySize
            ),

        borderWidth:
            Number(
                object.dataset.borderWidth ||
                DEFAULT_OBJECT_STYLE.borderWidth
            ),

        shadow:
            object.dataset.shadow ||
            DEFAULT_OBJECT_STYLE.shadow

    };

}


/* =========================================================
   UPDATE STYLE PANEL
========================================================= */

function updateObjectStylePanel() {

    const editable =
        selectedObject &&
        (
            selectedObject.classList.contains(
                "note"
            ) ||
            selectedObject.classList.contains(
                "image-object"
            )
        );


    if (
        !editable
    ) {

        noObjectMessage.style.display =
            "block";

        objectStyleControls.style.display =
            "none";

        return;

    }


    noObjectMessage.style.display =
        "none";

    objectStyleControls.style.display =
        "block";


    const style =
        getObjectStyle(
            selectedObject
        );


    objectHeaderColor.value =
        style.headerColor;

    objectBodyColor.value =
        style.bodyColor;

    objectBorderColor.value =
        style.borderColor;

    objectHeaderTextColor.value =
        style.headerTextColor;

    objectBodyTextColor.value =
        style.bodyTextColor;

    objectHeaderFont.value =
        style.headerFont;

    objectBodyFont.value =
        style.bodyFont;

    objectHeaderSize.value =
        style.headerSize;

    objectBodySize.value =
        style.bodySize;

    objectBorderWidth.value =
        style.borderWidth;

    objectShadow.value =
        style.shadow;

}


/* =========================================================
   APPLY STYLE PANEL TO OBJECT
========================================================= */

function applySelectedObjectStyle() {

    if (
        !selectedObject
    ) {

        return;

    }


    const editable =
        selectedObject.classList.contains(
            "note"
        ) ||
        selectedObject.classList.contains(
            "image-object"
        );


    if (
        !editable
    ) {

        return;

    }


    applyObjectStyle(
        selectedObject,
        {

            headerColor:
                objectHeaderColor.value,

            bodyColor:
                objectBodyColor.value,

            borderColor:
                objectBorderColor.value,

            headerTextColor:
                objectHeaderTextColor.value,

            bodyTextColor:
                objectBodyTextColor.value,

            headerFont:
                objectHeaderFont.value,

            bodyFont:
                objectBodyFont.value,

            headerSize:
                clamp(
                    Number(
                        objectHeaderSize.value
                    ),
                    8,
                    60
                ),

            bodySize:
                clamp(
                    Number(
                        objectBodySize.value
                    ),
                    8,
                    60
                ),

            borderWidth:
                clamp(
                    Number(
                        objectBorderWidth.value
                    ),
                    0,
                    12
                ),

            shadow:
                objectShadow.value

        }
    );

}


/* =========================================================
   OBJECT STYLE EVENTS
========================================================= */

[
    objectHeaderColor,
    objectBodyColor,
    objectBorderColor,
    objectHeaderTextColor,
    objectBodyTextColor,
    objectHeaderFont,
    objectBodyFont,
    objectHeaderSize,
    objectBodySize,
    objectBorderWidth,
    objectShadow
].forEach(
    control => {

        control.addEventListener(
            "input",
            applySelectedObjectStyle
        );

        control.addEventListener(
            "change",
            applySelectedObjectStyle
        );

    }
);


/* =========================================================
   RESET OBJECT
========================================================= */

resetObjectStyle.addEventListener(
    "click",
    () => {

        if (
            !selectedObject
        ) {

            return;

        }


        applyObjectStyle(
            selectedObject,
            DEFAULT_OBJECT_STYLE
        );


        updateObjectStylePanel();

    }
);


/* =========================================================
   STYLE SIDEBAR
========================================================= */

styleButton.addEventListener(
    "click",
    () => {

        stylePanel.classList.toggle(
            "open"
        );

    }
);


closeStyle.addEventListener(
    "click",
    () => {

        stylePanel.classList.remove(
            "open"
        );

    }
);


/* =========================================================
   CONTEXT MENU
========================================================= */

function updatePixelMenu() {

    if (
        !selectedObject
    ) {

        pixelObjectButton.style.display =
            "none";

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

        pixelObjectButton.style.display =
            "none";

        return;

    }


    pixelObjectButton.style.display =
        "block";


    pixelObjectButton.textContent =
        selectedObject.classList.contains(
            "pixel-mode"
        )
            ? "Pixel Mode: ON"
            : "Pixel Mode: OFF";

}


pixelObjectButton.addEventListener(
    "click",
    () => {

        if (
            selectedObject
        ) {

            selectedObject.classList.toggle(
                "pixel-mode"
            );

        }


        closeContextMenu();

    }
);


/* =========================================================
   DELETE
========================================================= */

deleteObjectButton.addEventListener(
    "click",
    () => {

        if (
            selectedObject
        ) {

            selectedObject.remove();

            selectedObject =
                null;

        }


        updateObjectStylePanel();

        closeContextMenu();

    }
);


/* =========================================================
   DUPLICATE
========================================================= */

duplicateObjectButton.addEventListener(
    "click",
    () => {

        if (
            !selectedObject
        ) {

            closeContextMenu();

            return;

        }


        const copy =
            selectedObject.cloneNode(
                true
            );


        copy.style.left =
            `${selectedObject.offsetLeft + 30}px`;

        copy.style.top =
            `${selectedObject.offsetTop + 30}px`;


        copy.classList.remove(
            "selected"
        );


        workspace.appendChild(
            copy
        );


        setupObject(
            copy
        );


        selectObject(
            copy
        );


        closeContextMenu();

    }
);


/* =========================================================
   Z ORDER
========================================================= */

bringFrontButton.addEventListener(
    "click",
    () => {

        if (
            !selectedObject
        ) {

            return;

        }


        let highest =
            0;


        workspace
            .querySelectorAll(
                ".board-object"
            )
            .forEach(
                object => {

                    highest =
                        Math.max(
                            highest,
                            Number(
                                object.style.zIndex ||
                                0
                            )
                        );

                }
            );


        selectedObject.style.zIndex =
            highest + 1;


        closeContextMenu();

    }
);


bringForwardButton.addEventListener(
    "click",
    () => {

        if (
            selectedObject
        ) {

            selectedObject.style.zIndex =
                Number(
                    selectedObject.style.zIndex ||
                    0
                ) + 1;

        }


        closeContextMenu();

    }
);


sendBackwardButton.addEventListener(
    "click",
    () => {

        if (
            selectedObject
        ) {

            selectedObject.style.zIndex =
                Number(
                    selectedObject.style.zIndex ||
                    0
                ) - 1;

        }


        closeContextMenu();

    }
);


sendBackButton.addEventListener(
    "click",
    () => {

        if (
            selectedObject
        ) {

            selectedObject.style.zIndex =
                -100;

        }


        closeContextMenu();

    }
);


/* =========================================================
   CLOSE CONTEXT MENU
========================================================= */

function closeContextMenu() {

    contextMenu.style.display =
        "none";

}


document.addEventListener(
    "click",
    event => {

        if (
            !contextMenu.contains(
                event.target
            )
        ) {

            closeContextMenu();

        }

    }
);


/* =========================================================
   BOARD CLICK
========================================================= */

board.addEventListener(
    "mousedown",
    event => {

        if (
            drawingMode !==
            "select"
        ) {

            return;

        }


        /*
           Clicking empty board.
        */

        if (
            event.button === 0 &&
            !event.shiftKey &&
            (
                event.target ===
                board ||
                event.target ===
                workspace
            )
        ) {

            selectObject(
                null
            );

        }


        /*
           Shift + drag
           or middle mouse.
        */

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


/* =========================================================
   PAN
========================================================= */

document.addEventListener(
    "mousemove",
    event => {

        if (
            !panning
        ) {

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


/* =========================================================
   ZOOM
========================================================= */

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


        const oldZoom =
            zoom;


        zoom +=
            event.deltaY < 0
                ? 0.1
                : -0.1;


        zoom =
            clamp(
                zoom,
                0.3,
                3
            );


        const rect =
            board.getBoundingClientRect();


        const mouseX =
            event.clientX -
            rect.left;

        const mouseY =
            event.clientY -
            rect.top;


        const boardX =
            (
                mouseX -
                cameraX
            ) /
            oldZoom;


        const boardY =
            (
                mouseY -
                cameraY
            ) /
            oldZoom;


        cameraX =
            mouseX -
            boardX *
            zoom;


        cameraY =
            mouseY -
            boardY *
            zoom;


        updateCamera();

    },
    {
        passive:
            false
    }
);


/* =========================================================
   WASD
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            isTyping()
        ) {

            return;

        }


        const key =
            event.key.toLowerCase();


        const valid =
            [
                "w",
                "a",
                "s",
                "d",
                "arrowup",
                "arrowdown",
                "arrowleft",
                "arrowright"
            ].includes(
                key
            );


        if (
            !valid
        ) {

            return;

        }


        movementKeys.add(
            key
        );


        event.preventDefault();


        startMovement();

    }
);


document.addEventListener(
    "keyup",
    event => {

        movementKeys.delete(
            event.key.toLowerCase()
        );

    }
);


/* =========================================================
   MOVEMENT
========================================================= */

function startMovement() {

    if (
        movementAnimation
    ) {

        return;

    }


    function frame() {

        const speed =
            14;


        if (
            movementKeys.has("w") ||
            movementKeys.has("arrowup")
        ) {

            cameraY +=
                speed;

        }


        if (
            movementKeys.has("s") ||
            movementKeys.has("arrowdown")
        ) {

            cameraY -=
                speed;

        }


        if (
            movementKeys.has("a") ||
            movementKeys.has("arrowleft")
        ) {

            cameraX +=
                speed;

        }


        if (
            movementKeys.has("d") ||
            movementKeys.has("arrowright")
        ) {

            cameraX -=
                speed;

        }


        updateCamera();


        if (
            movementKeys.size > 0
        ) {

            movementAnimation =
                requestAnimationFrame(
                    frame
                );

        }

        else {

            movementAnimation =
                null;

        }

    }


    movementAnimation =
        requestAnimationFrame(
            frame
        );

}


/* =========================================================
   HELP
========================================================= */

helpButton.addEventListener(
    "click",
    () => {

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


/* =========================================================
   NEW BOARD
========================================================= */

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


        selectedObject =
            null;


        objectNumber =
            1;


        boardName =
            "Untitled Board";


        currentFileHandle =
            null;


        boardWidth =
            5000;

        boardHeight =
            5000;


        boardWidthInput.value =
            5000;

        boardHeightInput.value =
            5000;


        drawingContext.clearRect(
            0,
            0,
            drawingCanvas.width,
            drawingCanvas.height
        );


        setBoardSize(
            5000,
            5000
        );


        backgroundImageData =
            null;


        backgroundStatus.textContent =
            "No background image";


        backgroundScale.value =
            256;

        backgroundRepeat.value =
            "repeat";


        styleBackgroundColor.value =
            "#ffffff";

        backgroundColor.value =
            "#ffffff";


        applyBackground();


        selectObject(
            null
        );


        centerCamera();

    }
);


/* =========================================================
   BOARD DATA
========================================================= */

function getBoardData() {

    const objects =
        [];


    workspace
        .querySelectorAll(
            ".board-object"
        )
        .forEach(
            object => {

                const image =
                    object.querySelector(
                        "img"
                    );


                const title =
                    object.querySelector(
                        ".note-title, .image-title"
                    );


                const content =
                    object.querySelector(
                        ".note-content"
                    );


                objects.push({

                    type:
                        getObjectType(
                            object
                        ),

                    x:
                        object.offsetLeft,

                    y:
                        object.offsetTop,

                    width:
                        object.classList.contains(
                            "sticker"
                        )
                            ? (
                                image?.offsetWidth ||
                                180
                            )
                            : object.offsetWidth,

                    zIndex:
                        Number(
                            object.style.zIndex ||
                            0
                        ),

                    pixel:
                        object.classList.contains(
                            "pixel-mode"
                        ),

                    title:
                        title
                            ? title.textContent
                            : null,

                    content:
                        content
                            ? content.textContent
                            : null,

                    image:
                        image
                            ? image.src
                            : null,

                    style:
                        getObjectStyle(
                            object
                        )

                });

            }
        );


    return {

        version:
            9,

        name:
            boardName,

        board:

            {

                width:
                    boardWidth,

                height:
                    boardHeight

            },

        background:

            {

                color:
                    styleBackgroundColor.value,

                image:
                    backgroundImageData,

                repeat:
                    backgroundRepeat.value,

                scale:
                    Number(
                        backgroundScale.value
                    )

            },

        penColor:
            penColor.value,

        ui:

            {

                color:
                    uiColor.value,

                textColor:
                    uiTextColor.value,

                hover:
                    uiHoverColor.value,

                active:
                    uiActiveColor.value,

                accent:
                    uiAccent.value,

                accentDark:
                    uiAccentDark.value,

                font:
                    uiFont.value

            },

        objects:
            objects,

        drawing:
            drawingCanvas.toDataURL()

    };

}


/* =========================================================
   OBJECT TYPE
========================================================= */

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


    return null;

}


/* =========================================================
   SAVE
========================================================= */

async function saveBoard() {

    try {

        if (
            currentFileHandle
        ) {

            await writeFile(
                currentFileHandle
            );

        }

        else {

            await saveAsBoard();

        }

    }

    catch (
        error
    ) {

        console.error(
            error
        );


        alert(
            "Could not save the board."
        );

    }

}


saveButton.addEventListener(
    "click",
    saveBoard
);


/* =========================================================
   SAVE AS
========================================================= */

async function saveAsBoard() {

    const name =
        prompt(
            "Board name:",
            boardName
        );


    if (
        !name
    ) {

        return;

    }


    boardName =
        name.trim() ||
        "Untitled Board";


    if (
        window.showSaveFilePicker
    ) {

        try {

            const handle =
                await window.showSaveFilePicker({

                    suggestedName:
                        sanitizeFileName(
                            boardName
                        ) +
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


            await writeFile(
                handle
            );


            return;

        }

        catch (
            error
        ) {

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


saveAsButton.addEventListener(
    "click",
    saveAsBoard
);


/* =========================================================
   WRITE FILE
========================================================= */

async function writeFile(
    handle
) {

    const json =
        JSON.stringify(
            getBoardData(),
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


/* =========================================================
   DOWNLOAD
========================================================= */

function downloadBoard() {

    const blob =
        new Blob(
            [
                JSON.stringify(
                    getBoardData(),
                    null,
                    2
                )
            ],
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
        `${sanitizeFileName(
            boardName
        )}.json`;


    document.body.appendChild(
        link
    );


    link.click();


    link.remove();


    setTimeout(
        () => {

            URL.revokeObjectURL(
                url
            );

        },
        1000
    );

}


/* =========================================================
   LOAD
========================================================= */

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


        if (
            !file
        ) {

            return;

        }


        const reader =
            new FileReader();


        reader.onload =
            event => {

                try {

                    loadBoard(
                        JSON.parse(
                            event.target.result
                        )
                    );

                }

                catch (
                    error
                ) {

                    console.error(
                        error
                    );


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


/* =========================================================
   LOAD BOARD
========================================================= */

function loadBoard(
    data
) {

    workspace.innerHTML =
        "";


    selectedObject =
        null;


    objectNumber =
        1;


    boardName =
        data.name ||
        "Untitled Board";


    /* =========================
       BOARD SIZE
    ========================= */

    if (
        data.board
    ) {

        setBoardSize(
            data.board.width ||
                5000,

            data.board.height ||
                5000
        );

    }

    else {

        setBoardSize(
            5000,
            5000
        );

    }


    /* =========================
       BACKGROUND
    ========================= */

    if (
        data.background
    ) {

        styleBackgroundColor.value =
            data.background.color ||
            "#ffffff";


        backgroundColor.value =
            data.background.color ||
            "#ffffff";


        backgroundImageData =
            data.background.image ||
            null;


        backgroundRepeat.value =
            data.background.repeat ||
            "repeat";


        backgroundScale.value =
            data.background.scale ||
            256;


        backgroundStatus.textContent =
            backgroundImageData
                ? "Background image loaded"
                : "No background image";

    }

    else {

        styleBackgroundColor.value =
            data.background ||
            "#ffffff";


        backgroundColor.value =
            styleBackgroundColor.value;


        backgroundImageData =
            null;


        backgroundStatus.textContent =
            "No background image";

    }


    applyBackground();


    /* =========================
       PEN
    ========================= */

    if (
        data.penColor
    ) {

        penColor.value =
            data.penColor;

    }


    /* =========================
       UI
    ========================= */

    if (
        data.ui
    ) {

        uiColor.value =
            data.ui.color ||
            "#d4d0c8";

        uiTextColor.value =
            data.ui.textColor ||
            "#000000";

        uiHoverColor.value =
            data.ui.hover ||
            "#eeeeee";

        uiActiveColor.value =
            data.ui.active ||
            "#c3ccd7";

        uiAccent.value =
            data.ui.accent ||
            "#316ac5";

        uiAccentDark.value =
            data.ui.accentDark ||
            "#234a8c";

        uiFont.value =
            data.ui.font ||
            "Tahoma, Arial, sans-serif";

    }


    applyUIStyle();


    /* =========================
       OBJECTS
    ========================= */

    if (
        Array.isArray(
            data.objects
        )
    ) {

        data.objects.forEach(
            objectData => {

                let object =
                    null;


                if (
                    objectData.type ===
                    "note"
                ) {

                    object =
                        createNote(
                            objectData.x || 0,
                            objectData.y || 0,
                            objectData.title,
                            objectData.content ||
                                "Type something...",
                            objectData.style ||
                                DEFAULT_OBJECT_STYLE,
                            false
                        );

                }


                if (
                    objectData.type ===
                    "image" &&
                    objectData.image
                ) {

                    object =
                        createImage(
                            objectData.image,
                            objectData.x || 0,
                            objectData.y || 0,
                            objectData.title,
                            objectData.width || 260,
                            objectData.pixel ||
                                false,
                            objectData.style ||
                                DEFAULT_OBJECT_STYLE,
                            false
                        );

                }


                if (
                    objectData.type ===
                    "sticker" &&
                    objectData.image
                ) {

                    object =
                        createSticker(
                            objectData.image,
                            objectData.x || 0,
                            objectData.y || 0,
                            objectData.width || 180,
                            objectData.pixel ||
                                false,
                            false
                        );

                }


                if (
                    object
                ) {

                    object.style.zIndex =
                        objectData.zIndex ||
                        0;

                }

            }
        );

    }


    /* =========================
       DRAWING
    ========================= */

    drawingContext.clearRect(
        0,
        0,
        drawingCanvas.width,
        drawingCanvas.height
    );


    if (
        data.drawing
    ) {

        const image =
            new Image();


        image.onload =
            () => {

                drawingContext.drawImage(
                    image,
                    0,
                    0,
                    boardWidth,
                    boardHeight
                );

            };


        image.src =
            data.drawing;

    }


    selectObject(
        null
    );


    centerCamera();

}


/* =========================================================
   NEW BOARD OBJECT
========================================================= */

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


/* =========================================================
   KEYBOARD
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            isTyping()
        ) {

            return;

        }


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
            event.key ===
            "Escape"
        ) {

            setTool(
                "select"
            );


            helpWindow.style.display =
                "none";


            stylePanel.classList.remove(
                "open"
            );


            closeContextMenu();

            return;

        }


        if (
            event.key ===
            "Home"
        ) {

            centerCamera();

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

            updateObjectStylePanel();

        }

    }
);


/* =========================================================
   TYPING CHECK
========================================================= */

function isTyping() {

    const active =
        document.activeElement;


    if (
        !active
    ) {

        return false;

    }


    return (
        active.isContentEditable ||
        active.tagName === "INPUT" ||
        active.tagName === "TEXTAREA" ||
        active.tagName === "SELECT"
    );

}


/* =========================================================
   HELPERS
========================================================= */

function clamp(
    value,
    min,
    max
) {

    if (
        !Number.isFinite(
            value
        )
    ) {

        return min;

    }


    return Math.max(
        min,
        Math.min(
            max,
            value
        )
    );

}


function escapeHTML(
    text
) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        text ||
        "";


    return div.innerHTML;

}


function sanitizeFileName(
    name
) {

    return (
        name
            .replace(
                /[<>:"/\\|?*]/g,
                "_"
            )
            .trim() ||
        "Untitled Board"
    );

}


/* =========================================================
   RESIZE WINDOW
========================================================= */

window.addEventListener(
    "resize",
    () => {

        keepCameraInsideBoard();

        updateCamera();

    }
);


/* =========================================================
   START
========================================================= */

uiColor.value =
    "#d4d0c8";

uiTextColor.value =
    "#000000";

uiHoverColor.value =
    "#eeeeee";

uiActiveColor.value =
    "#c3ccd7";

uiAccent.value =
    "#316ac5";

uiAccentDark.value =
    "#234a8c";


boardWidthInput.value =
    boardWidth;

boardHeightInput.value =
    boardHeight;


styleBackgroundColor.value =
    "#ffffff";

backgroundColor.value =
    "#ffffff";


applyUIStyle();

applyBackground();

setTool(
    "select"
);


requestAnimationFrame(
    () => {

        centerCamera();

    }
);
