"use strict";

/* =========================================================
   ELEMENTS
========================================================= */

const board = document.getElementById("board");
const workspace = document.getElementById("workspace");
const drawingCanvas = document.getElementById("drawingCanvas");
const drawingContext = drawingCanvas.getContext("2d");


/* =========================================================
   TOOLBAR
========================================================= */

const toolbar = document.getElementById("toolbar");

const selectButton = document.getElementById("selectButton");
const textButton = document.getElementById("textButton");
const imageButton = document.getElementById("imageButton");
const stickerButton = document.getElementById("stickerButton");

const drawButton = document.getElementById("drawButton");
const eraserButton = document.getElementById("eraserButton");

const styleButton = document.getElementById("styleButton");

const newButton = document.getElementById("newButton");
const saveButton = document.getElementById("saveButton");
const saveAsButton = document.getElementById("saveAsButton");
const loadButton = document.getElementById("loadButton");

const helpButton = document.getElementById("helpButton");

const penColor = document.getElementById("penColor");


/* =========================================================
   STYLE PANEL
========================================================= */

const stylePanel = document.getElementById("stylePanel");
const closeStyle = document.getElementById("closeStyle");

const uiBg = document.getElementById("uiBg");
const uiAccent = document.getElementById("uiAccent");
const uiDarkAccent = document.getElementById("uiDarkAccent");
const uiButtonHover = document.getElementById("uiButtonHover");
const uiText = document.getElementById("uiText");
const uiFont = document.getElementById("uiFont");

const boardWidthInput = document.getElementById("boardWidth");
const boardHeightInput = document.getElementById("boardHeight");
const applyBoardSize = document.getElementById("applyBoardSize");

const boardColor = document.getElementById("boardColor");
const backgroundRepeat = document.getElementById("backgroundRepeat");
const backgroundScale = document.getElementById("backgroundScale");

const backgroundImageButton =
    document.getElementById("backgroundImageButton");

const clearBackgroundImage =
    document.getElementById("clearBackgroundImage");


/* =========================================================
   OBJECT STYLE
========================================================= */

const objectStyleMessage =
    document.getElementById("objectStyleMessage");

const editTitleButton =
    document.getElementById("editTitleButton");

const editBodyButton =
    document.getElementById("editBodyButton");

const objectHeaderColor =
    document.getElementById("objectHeaderColor");

const objectBodyColor =
    document.getElementById("objectBodyColor");

const objectBorderColor =
    document.getElementById("objectBorderColor");

const objectHeaderText =
    document.getElementById("objectHeaderText");

const objectBodyText =
    document.getElementById("objectBodyText");

const objectFont =
    document.getElementById("objectFont");

const objectHeaderSize =
    document.getElementById("objectHeaderSize");

const objectBodySize =
    document.getElementById("objectBodySize");

const objectBorderWidth =
    document.getElementById("objectBorderWidth");

const objectShadow =
    document.getElementById("objectShadow");

const objectShadowSize =
    document.getElementById("objectShadowSize");


/* =========================================================
   DRAWING STYLE
========================================================= */

const stylePenColor =
    document.getElementById("stylePenColor");

const penSizeInput =
    document.getElementById("penSize");

const eraserSizeInput =
    document.getElementById("eraserSize");


/* =========================================================
   OTHER
========================================================= */

const centerBoardButton =
    document.getElementById("centerBoardButton");

const imageInput =
    document.getElementById("imageInput");

const backgroundImageInput =
    document.getElementById("backgroundImageInput");

const boardInput =
    document.getElementById("boardInput");

const zoomDisplay =
    document.getElementById("zoomDisplay");


/* =========================================================
   CONTEXT MENU
========================================================= */

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

let selectedObject = null;

let objectNumber = 1;

let boardName = "Untitled Board";

let currentFileHandle = null;

let currentImageType = "image";

let drawingMode = "select";

let drawing = false;

let drawingPointerId = null;

let panning = false;

let backgroundImageData = null;

let cameraX = 0;

let cameraY = 0;

let zoom = 1;

let boardWidth = 3000;

let boardHeight = 2000;

let penSize = 4;

let eraserSize = 30;

let panStartX = 0;
let panStartY = 0;

let cameraStartX = 0;
let cameraStartY = 0;

const keys = new Set();


/* =========================================================
   SAFE STARTUP
========================================================= */

function startup() {

    setupCanvas();

    setupToolbar();

    setupStylePanel();

    setupDrawing();

    setupBoard();

    setupKeyboard();

    setupHelp();

    setupContextMenu();

    setTool("select");

    applyUITheme();

    applyBackground();

    centerBoard();

    updateStylePanel();

    keyboardLoop();

}


function setupCanvas() {

    setCanvasSize(
        boardWidth,
        boardHeight,
        false
    );

}


function setupToolbar() {

    /*
        ONE toolbar listener.

        This is intentional.

        Instead of having dozens of separate
        listeners that can get interrupted,
        every toolbar button is handled here.
    */

    toolbar.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest("button");

            if (!button) {
                return;
            }

            event.preventDefault();

            event.stopPropagation();


            if (button === selectButton) {
                setTool("select");
                return;
            }


            if (button === textButton) {

                const position =
                    getDefaultObjectPosition();

                createNote(
                    position.x,
                    position.y
                );

                setTool("select");

                return;
            }


            if (button === imageButton) {

                currentImageType =
                    "image";

                imageInput.click();

                return;
            }


            if (button === stickerButton) {

                currentImageType =
                    "sticker";

                imageInput.click();

                return;
            }


            if (button === drawButton) {

                setTool("draw");

                return;
            }


            if (button === eraserButton) {

                setTool("erase");

                return;
            }


            if (button === styleButton) {

                toggleStylePanel();

                return;
            }


            if (button === newButton) {

                newBoard();

                return;
            }


            if (button === saveButton) {

                saveBoard();

                return;
            }


            if (button === saveAsButton) {

                saveAsBoard();

                return;
            }


            if (button === loadButton) {

                boardInput.click();

                return;
            }


            if (button === helpButton) {

                helpWindow.style.display =
                    "flex";

                return;
            }

        }
    );


    /*
        Pen color is outside the button system.
    */

    penColor.addEventListener(
        "input",
        () => {

            stylePenColor.value =
                penColor.value;

        }
    );

}


function toggleStylePanel() {

    const open =
        stylePanel.classList.toggle("open");

    styleButton.classList.toggle(
        "active",
        open
    );

    updateStylePanel();

}


/* =========================================================
   STYLE PANEL
========================================================= */

function setupStylePanel() {

    closeStyle.addEventListener(
        "click",
        event => {

            event.preventDefault();

            event.stopPropagation();

            stylePanel.classList.remove(
                "open"
            );

            styleButton.classList.remove(
                "active"
            );

        }
    );


    stylePanel.addEventListener(
        "mousedown",
        event => {

            event.stopPropagation();

        }
    );


    stylePanel.addEventListener(
        "click",
        event => {

            event.stopPropagation();

        }
    );


    [
        uiBg,
        uiAccent,
        uiDarkAccent,
        uiButtonHover,
        uiText,
        uiFont
    ].forEach(
        control => {

            control.addEventListener(
                "input",
                applyUITheme
            );

            control.addEventListener(
                "change",
                applyUITheme
            );

        }
    );


    applyBoardSize.addEventListener(
        "click",
        event => {

            event.preventDefault();

            const width =
                clamp(
                    parseInt(
                        boardWidthInput.value,
                        10
                    ) || 3000,
                    500,
                    12000
                );

            const height =
                clamp(
                    parseInt(
                        boardHeightInput.value,
                        10
                    ) || 2000,
                    500,
                    12000
                );


            boardWidth =
                width;

            boardHeight =
                height;


            boardWidthInput.value =
                width;

            boardHeightInput.value =
                height;


            setCanvasSize(
                width,
                height,
                true
            );


            clampCamera();

            updateCamera();

        }
    );


    boardColor.addEventListener(
        "input",
        applyBackground
    );


    backgroundRepeat.addEventListener(
        "change",
        applyBackground
    );


    backgroundScale.addEventListener(
        "input",
        applyBackground
    );


    backgroundImageButton.addEventListener(
        "click",
        event => {

            event.preventDefault();

            backgroundImageInput.click();

        }
    );


    clearBackgroundImage.addEventListener(
        "click",
        event => {

            event.preventDefault();

            backgroundImageData =
                null;

            applyBackground();

        }
    );


    centerBoardButton.addEventListener(
        "click",
        event => {

            event.preventDefault();

            centerBoard();

        }
    );


    setupObjectStyleControls();


    stylePenColor.addEventListener(
        "input",
        () => {

            penColor.value =
                stylePenColor.value;

        }
    );


    penSizeInput.addEventListener(
        "input",
        () => {

            penSize =
                clamp(
                    parseInt(
                        penSizeInput.value,
                        10
                    ) || 4,
                    1,
                    100
                );

            penSizeInput.value =
                penSize;

        }
    );


    eraserSizeInput.addEventListener(
        "input",
        () => {

            eraserSize =
                clamp(
                    parseInt(
                        eraserSizeInput.value,
                        10
                    ) || 30,
                    1,
                    200
                );

            eraserSizeInput.value =
                eraserSize;

        }
    );

}


function applyUITheme() {

    const root =
        document.documentElement;

    root.style.setProperty(
        "--ui-bg",
        uiBg.value
    );

    root.style.setProperty(
        "--accent",
        uiAccent.value
    );

    root.style.setProperty(
        "--accent-dark",
        uiDarkAccent.value
    );

    root.style.setProperty(
        "--button-hover",
        uiButtonHover.value
    );

    root.style.setProperty(
        "--ui-text",
        uiText.value
    );

    root.style.setProperty(
        "--ui-font",
        uiFont.value
    );

}


/* =========================================================
   TOOL MODE
========================================================= */

function setTool(tool) {

    drawingMode =
        tool;


    selectButton.classList.remove("active");
    drawButton.classList.remove("active");
    eraserButton.classList.remove("active");


    drawingCanvas.style.pointerEvents =
        "none";


    board.style.cursor =
        "default";


    if (tool === "select") {

        selectButton.classList.add(
            "active"
        );

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


/* =========================================================
   BOARD
========================================================= */

function setupBoard() {

    board.addEventListener(
        "mousedown",
        event => {

            if (
                drawingMode === "select" &&
                (
                    event.target === board ||
                    event.target === workspace
                )
            ) {

                selectObject(null);

            }


            if (
                drawingMode !== "select"
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


    board.addEventListener(
        "wheel",
        event => {

            if (
                drawingMode !== "select"
            ) {

                return;

            }

            event.preventDefault();

            zoomBoard(event);

        },
        {
            passive: false
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
                drawingMode === "select"
            ) {

                board.style.cursor =
                    "default";

            }

        }
    );

}


function zoomBoard(event) {

    const rect =
        board.getBoundingClientRect();

    const mouseX =
        event.clientX -
        rect.left;

    const mouseY =
        event.clientY -
        rect.top;


    const worldX =
        (
            mouseX -
            cameraX
        ) / zoom;

    const worldY =
        (
            mouseY -
            cameraY
        ) / zoom;


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
        clamp(
            zoom,
            0.3,
            3
        );


    cameraX =
        mouseX -
        worldX * zoom;

    cameraY =
        mouseY -
        worldY * zoom;


    updateCamera();

}


/* =========================================================
   BACKGROUND
========================================================= */

function applyBackground() {

    const color =
        boardColor.value ||
        "#ffffff";


    workspace.style.backgroundColor =
        color;

    board.style.backgroundColor =
        color;


    workspace.style.backgroundRepeat =
        backgroundRepeat.value;


    const scale =
        clamp(
            parseInt(
                backgroundScale.value,
                10
            ) || 256,
            16,
            3000
        );


    workspace.style.backgroundSize =
        scale + "px auto";


    workspace.style.backgroundPosition =
        "0 0";


    if (backgroundImageData) {

        workspace.style.backgroundImage =
            `url("${backgroundImageData}")`;

    } else {

        workspace.style.backgroundImage =
            "none";

    }

}


/* =========================================================
   CANVAS
========================================================= */

function setCanvasSize(
    width,
    height,
    preserve
) {

    let oldImage =
        null;


    if (
        preserve &&
        drawingCanvas.width > 0 &&
        drawingCanvas.height > 0
    ) {

        try {

            oldImage =
                drawingCanvas.toDataURL();

        } catch {

            oldImage =
                null;

        }

    }


    drawingCanvas.width =
        width;

    drawingCanvas.height =
        height;


    drawingCanvas.style.width =
        width + "px";

    drawingCanvas.style.height =
        height + "px";


    drawingContext.setTransform(
        1,
        0,
        0,
        1,
        0,
        0
    );


    drawingContext.clearRect(
        0,
        0,
        width,
        height
    );


    if (oldImage) {

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
            oldImage;

    }


    workspace.style.width =
        width + "px";

    workspace.style.height =
        height + "px";

}


/* =========================================================
   DRAWING
========================================================= */

function setupDrawing() {

    drawingCanvas.addEventListener(
        "pointerdown",
        event => {

            if (
                drawingMode !== "draw" &&
                drawingMode !== "erase"
            ) {

                return;

            }


            event.preventDefault();


            drawing =
                true;

            drawingPointerId =
                event.pointerId;


            try {

                drawingCanvas.setPointerCapture(
                    event.pointerId
                );

            } catch {
                /* ignore */
            }


            const position =
                getCanvasPosition(event);


            drawingContext.beginPath();

            drawingContext.moveTo(
                position.x,
                position.y
            );


            drawingContext.lineWidth =
                drawingMode === "erase"
                    ? eraserSize
                    : penSize;


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
        "pointermove",
        event => {

            if (
                !drawing ||
                event.pointerId !== drawingPointerId
            ) {

                return;

            }


            event.preventDefault();


            const position =
                getCanvasPosition(event);


            drawingContext.lineTo(
                position.x,
                position.y
            );

            drawingContext.stroke();

        }
    );


    drawingCanvas.addEventListener(
        "pointerup",
        stopDrawing
    );


    drawingCanvas.addEventListener(
        "pointercancel",
        stopDrawing
    );


    document.addEventListener(
        "pointerup",
        stopDrawing
    );

}


function stopDrawing() {

    if (!drawing) {
        return;
    }


    drawing =
        false;

    drawingPointerId =
        null;


    drawingContext.closePath();


    drawingContext.globalCompositeOperation =
        "source-over";

}


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


/* =========================================================
   OBJECT CREATION
========================================================= */

function getDefaultObjectPosition() {

    return {

        x:
            (
                board.clientWidth / 2 -
                cameraX
            ) / zoom - 115,

        y:
            (
                board.clientHeight / 2 -
                cameraY
            ) / zoom - 60

    };

}


function createNote(
    x,
    y,
    title = null,
    content = "Type something...",
    styles = null,
    autoSelect = true
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


    workspace.appendChild(
        note
    );


    objectNumber++;


    setupObject(
        note
    );


    if (styles) {

        applyObjectStyles(
            note,
            styles
        );

    }


    if (autoSelect) {

        selectObject(
            note
        );

    }


    return note;

}


/* =========================================================
   IMAGE INPUT
========================================================= */

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

                const position =
                    getDefaultObjectPosition();


                if (
                    currentImageType ===
                    "image"
                ) {

                    createImage(
                        event.target.result,
                        position.x,
                        position.y
                    );

                } else {

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


function createImage(
    imageData,
    x,
    y,
    title = null,
    width = 260,
    pixel = false,
    styles = null,
    autoSelect = true
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


    workspace.appendChild(
        object
    );


    objectNumber++;


    setupObject(
        object
    );


    if (styles) {

        applyObjectStyles(
            object,
            styles
        );

    }


    if (autoSelect) {

        selectObject(
            object
        );

    }


    return object;

}


function createSticker(
    imageData,
    x,
    y,
    width = 180,
    pixel = false,
    autoSelect = true
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


    workspace.appendChild(
        object
    );


    setupObject(
        object
    );


    if (autoSelect) {

        selectObject(
            object
        );

    }


    return object;

}


/* =========================================================
   OBJECT SETUP
========================================================= */

function setupObject(object) {

    object.addEventListener(
        "mousedown",
        event => {

            if (
                drawingMode === "select"
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

            selectObject(
                object
            );

            updatePixelMenu();


            contextMenu.style.display =
                "block";


            contextMenu.style.left =
                event.clientX + "px";


            contextMenu.style.top =
                event.clientY + "px";

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
   SELECTION
========================================================= */

function selectObject(object) {

    if (
        selectedObject &&
        selectedObject !== object
    ) {

        selectedObject.classList.remove(
            "selected"
        );

    }


    selectedObject =
        object || null;


    if (selectedObject) {

        selectedObject.classList.add(
            "selected"
        );

    }


    updateStylePanel();

}


/* =========================================================
   EDITING
========================================================= */

function setupEditing(object) {

    const title =
        object.querySelector(
            ".note-title, .image-title"
        );


    const body =
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


    if (body) {

        body.addEventListener(
            "dblclick",
            event => {

                event.stopPropagation();

                body.contentEditable =
                    "true";

                body.classList.add(
                    "editing"
                );

                body.focus();

                placeCursorAtEnd(
                    body
                );

            }
        );


        body.addEventListener(
            "blur",
            () => {

                body.contentEditable =
                    "false";

                body.classList.remove(
                    "editing"
                );

            }
        );

    }

}


/* =========================================================
   DRAGGING
========================================================= */

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
                drawingMode !== "select" ||
                event.button !== 0 ||
                handle.classList.contains("editing")
            ) {

                return;

            }


            if (
                event.target.closest(
                    ".resize-handle"
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


            function move(moveEvent) {

                const dx =
                    (
                        moveEvent.clientX -
                        startX
                    ) / zoom;


                const dy =
                    (
                        moveEvent.clientY -
                        startY
                    ) / zoom;


                object.style.left =
                    originalX + dx + "px";


                object.style.top =
                    originalY + dy + "px";

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
                drawingMode !== "select"
            ) {

                return;

            }


            selectObject(
                object
            );


            const startX =
                event.clientX;

            const startWidth =
                object.offsetWidth;


            function resize(moveEvent) {

                let width =
                    startWidth +
                    (
                        moveEvent.clientX -
                        startX
                    ) / zoom;


                width =
                    clamp(
                        width,
                        80,
                        1000
                    );


                if (
                    object.classList.contains(
                        "sticker"
                    )
                ) {

                    const image =
                        object.querySelector(
                            "img"
                        );

                    if (image) {

                        image.style.width =
                            width + "px";

                    }

                } else {

                    object.style.width =
                        width + "px";

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
   OBJECT STYLE CONTROLS
========================================================= */

function setupObjectStyleControls() {

    const controls = [

        objectHeaderColor,
        objectBodyColor,
        objectBorderColor,
        objectHeaderText,
        objectBodyText,
        objectFont,
        objectHeaderSize,
        objectBodySize,
        objectBorderWidth,
        objectShadow,
        objectShadowSize

    ];


    controls.forEach(
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


    editTitleButton.addEventListener(
        "click",
        event => {

            event.preventDefault();

            if (!selectedObject) {
                return;
            }


            const title =
                selectedObject.querySelector(
                    ".note-title, .image-title"
                );


            if (!title) {
                return;
            }


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


    editBodyButton.addEventListener(
        "click",
        event => {

            event.preventDefault();

            if (!selectedObject) {
                return;
            }


            const body =
                selectedObject.querySelector(
                    ".note-content"
                );


            if (!body) {
                return;
            }


            body.contentEditable =
                "true";

            body.classList.add(
                "editing"
            );

            body.focus();

            placeCursorAtEnd(
                body
            );

        }
    );

}


function applySelectedObjectStyle() {

    if (!selectedObject) {
        return;
    }


    if (
        selectedObject.classList.contains(
            "sticker"
        )
    ) {

        return;

    }


    const title =
        selectedObject.querySelector(
            ".note-title, .image-title"
        );


    const body =
        selectedObject.querySelector(
            ".note-content, .image-content"
        );


    selectedObject.style.borderColor =
        objectBorderColor.value;


    selectedObject.style.borderWidth =
        clamp(
            parseInt(
                objectBorderWidth.value,
                10
            ) || 2,
            0,
            20
        ) + "px";


    if (objectShadow.checked) {

        const size =
            clamp(
                parseInt(
                    objectShadowSize.value,
                    10
                ) || 4,
                0,
                30
            );


        selectedObject.style.boxShadow =
            `${size}px ${size}px 0 #9aa7b2`;

    } else {

        selectedObject.style.boxShadow =
            "none";

    }


    if (title) {

        title.style.backgroundColor =
            objectHeaderColor.value;

        title.style.color =
            objectHeaderText.value;

        title.style.fontFamily =
            objectFont.value;

        title.style.fontSize =
            clamp(
                parseInt(
                    objectHeaderSize.value,
                    10
                ) || 13,
                8,
                48
            ) + "px";

    }


    if (body) {

        body.style.backgroundColor =
            objectBodyColor.value;

        body.style.color =
            objectBodyText.value;

        body.style.fontFamily =
            objectFont.value;

        body.style.fontSize =
            clamp(
                parseInt(
                    objectBodySize.value,
                    10
                ) || 14,
                8,
                48
            ) + "px";

    }

}


function updateStylePanel() {

    if (!selectedObject) {

        objectStyleMessage.textContent =
            "Select a note or image first.";

        disableObjectControls(
            true
        );

        return;

    }


    if (
        selectedObject.classList.contains(
            "sticker"
        )
    ) {

        objectStyleMessage.textContent =
            "Sticker selected.";

        disableObjectControls(
            true
        );

        return;

    }


    objectStyleMessage.textContent =
        "Editing selected object.";

    disableObjectControls(
        false
    );


    const title =
        selectedObject.querySelector(
            ".note-title, .image-title"
        );


    const body =
        selectedObject.querySelector(
            ".note-content, .image-content"
        );


    const objectStyle =
        getComputedStyle(
            selectedObject
        );


    objectBorderColor.value =
        normalizeColor(
            objectStyle.borderColor,
            "#6b7c8c"
        );


    objectBorderWidth.value =
        parseInt(
            objectStyle.borderWidth,
            10
        ) || 2;


    if (title) {

        const titleStyle =
            getComputedStyle(
                title
            );


        objectHeaderColor.value =
            normalizeColor(
                titleStyle.backgroundColor,
                "#316ac5"
            );


        objectHeaderText.value =
            normalizeColor(
                titleStyle.color,
                "#ffffff"
            );


        objectHeaderSize.value =
            parseInt(
                titleStyle.fontSize,
                10
            ) || 13;


        objectFont.value =
            titleStyle.fontFamily;

    }


    if (body) {

        const bodyStyle =
            getComputedStyle(
                body
            );


        objectBodyColor.value =
            normalizeColor(
                bodyStyle.backgroundColor,
                "#fffff0"
            );


        objectBodyText.value =
            normalizeColor(
                bodyStyle.color,
                "#222222"
            );


        objectBodySize.value =
            parseInt(
                bodyStyle.fontSize,
                10
            ) || 14;

    }


    objectShadow.checked =
        objectStyle.boxShadow !== "none";

}


function disableObjectControls(disabled) {

    [
        editTitleButton,
        editBodyButton,
        objectHeaderColor,
        objectBodyColor,
        objectBorderColor,
        objectHeaderText,
        objectBodyText,
        objectFont,
        objectHeaderSize,
        objectBodySize,
        objectBorderWidth,
        objectShadow,
        objectShadowSize
    ].forEach(
        control => {

            control.disabled =
                disabled;

        }
    );

}


function getObjectStyles(object) {

    const title =
        object.querySelector(
            ".note-title, .image-title"
        );


    const body =
        object.querySelector(
            ".note-content, .image-content"
        );


    return {

        borderColor:
            object.style.borderColor ||
            "#6b7c8c",

        borderWidth:
            object.style.borderWidth ||
            "2px",

        boxShadow:
            object.style.boxShadow ||
            "4px 4px 0 #9aa7b2",

        headerColor:
            title?.style.backgroundColor ||
            "#316ac5",

        headerText:
            title?.style.color ||
            "#ffffff",

        bodyColor:
            body?.style.backgroundColor ||
            "#fffff0",

        bodyText:
            body?.style.color ||
            "#222222",

        font:
            title?.style.fontFamily ||
            "Tahoma, Arial, sans-serif",

        headerSize:
            title?.style.fontSize ||
            "13px",

        bodySize:
            body?.style.fontSize ||
            "14px"

    };

}


function applyObjectStyles(
    object,
    styles
) {

    if (!styles) {
        return;
    }


    const title =
        object.querySelector(
            ".note-title, .image-title"
        );


    const body =
        object.querySelector(
            ".note-content, .image-content"
        );


    if (styles.borderColor) {
        object.style.borderColor =
            styles.borderColor;
    }


    if (styles.borderWidth) {
        object.style.borderWidth =
            styles.borderWidth;
    }


    if (styles.boxShadow !== undefined) {
        object.style.boxShadow =
            styles.boxShadow;
    }


    if (title) {

        if (styles.headerColor) {
            title.style.backgroundColor =
                styles.headerColor;
        }

        if (styles.headerText) {
            title.style.color =
                styles.headerText;
        }

        if (styles.font) {
            title.style.fontFamily =
                styles.font;
        }

        if (styles.headerSize) {
            title.style.fontSize =
                styles.headerSize;
        }

    }


    if (body) {

        if (styles.bodyColor) {
            body.style.backgroundColor =
                styles.bodyColor;
        }

        if (styles.bodyText) {
            body.style.color =
                styles.bodyText;
        }

        if (styles.font) {
            body.style.fontFamily =
                styles.font;
        }

        if (styles.bodySize) {
            body.style.fontSize =
                styles.bodySize;
        }

    }

}


/* =========================================================
   CONTEXT MENU
========================================================= */

function setupContextMenu() {

    deleteObject.addEventListener(
        "click",
        () => {

            if (selectedObject) {

                selectedObject.remove();

                selectedObject =
                    null;

                updateStylePanel();

            }

            closeContextMenu();

        }
    );


    duplicateObject.addEventListener(
        "click",
        () => {

            if (!selectedObject) {
                return;
            }


            const copy =
                selectedObject.cloneNode(
                    true
                );


            copy.style.left =
                selectedObject.offsetLeft +
                30 +
                "px";


            copy.style.top =
                selectedObject.offsetTop +
                30 +
                "px";


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


    pixelObject.addEventListener(
        "click",
        () => {

            if (selectedObject) {

                selectedObject.classList.toggle(
                    "pixel-mode"
                );

            }

            closeContextMenu();

        }
    );


    bringFront.addEventListener(
        "click",
        () => {

            if (!selectedObject) {
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
                                parseInt(
                                    object.style.zIndex ||
                                    "0",
                                    10
                                )
                            );

                    }
                );


            selectedObject.style.zIndex =
                highest + 1;


            closeContextMenu();

        }
    );


    bringForward.addEventListener(
        "click",
        () => {

            if (selectedObject) {

                selectedObject.style.zIndex =
                    parseInt(
                        selectedObject.style.zIndex ||
                        "0",
                        10
                    ) + 1;

            }

            closeContextMenu();

        }
    );


    sendBackward.addEventListener(
        "click",
        () => {

            if (selectedObject) {

                selectedObject.style.zIndex =
                    parseInt(
                        selectedObject.style.zIndex ||
                        "0",
                        10
                    ) - 1;

            }

            closeContextMenu();

        }
    );


    sendBack.addEventListener(
        "click",
        () => {

            if (selectedObject) {

                selectedObject.style.zIndex =
                    -100;

            }

            closeContextMenu();

        }
    );


    document.addEventListener(
        "click",
        event => {

            if (
                !event.target.closest(
                    "#contextMenu"
                )
            ) {

                closeContextMenu();

            }

        }
    );

}


function updatePixelMenu() {

    if (!selectedObject) {

        pixelObject.style.display =
            "none";

        return;

    }


    const valid =
        selectedObject.classList.contains(
            "image-object"
        ) ||
        selectedObject.classList.contains(
            "sticker"
        );


    pixelObject.style.display =
        valid
            ? "block"
            : "none";


    if (valid) {

        pixelObject.textContent =
            selectedObject.classList.contains(
                "pixel-mode"
            )
                ? "Pixel Mode: ON"
                : "Pixel Mode: OFF";

    }

}


function closeContextMenu() {

    contextMenu.style.display =
        "none";

}


/* =========================================================
   HELP
========================================================= */

function setupHelp() {

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

}


/* =========================================================
   NEW BOARD
========================================================= */

function newBoard() {

    const confirmed =
        confirm(
            "Start a new board?"
        );


    if (!confirmed) {
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


    boardWidth =
        3000;

    boardHeight =
        2000;


    boardWidthInput.value =
        boardWidth;

    boardHeightInput.value =
        boardHeight;


    boardColor.value =
        "#ffffff";


    backgroundImageData =
        null;


    backgroundRepeat.value =
        "repeat";


    backgroundScale.value =
        256;


    setCanvasSize(
        boardWidth,
        boardHeight,
        false
    );


    applyBackground();

    centerBoard();

    updateStylePanel();

}


/* =========================================================
   SAVE / LOAD
========================================================= */

async function saveBoard() {

    if (currentFileHandle) {

        try {

            await writeToFile(
                currentFileHandle
            );

            return;

        } catch {

            currentFileHandle =
                null;

        }

    }


    await saveAsBoard();

}


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

        } catch (error) {

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

                } catch {

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
   SAVE DATA
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


                let width =
                    object.offsetWidth;


                if (
                    object.classList.contains(
                        "sticker"
                    ) &&
                    image
                ) {

                    width =
                        image.offsetWidth;

                }


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
                        width,

                    zIndex:
                        parseInt(
                            object.style.zIndex ||
                            "0",
                            10
                        ),

                    pixel:
                        object.classList.contains(
                            "pixel-mode"
                        ),

                    title:
                        title
                            ? title.textContent
                            : undefined,

                    content:
                        content
                            ? content.textContent
                            : undefined,

                    image:
                        image
                            ? image.src
                            : undefined,

                    styles:
                        getObjectStyles(
                            object
                        )

                });

            }
        );


    return {

        version:
            11,

        name:
            boardName,

        boardWidth:
            boardWidth,

        boardHeight:
            boardHeight,

        backgroundColor:
            boardColor.value,

        backgroundImage:
            backgroundImageData,

        backgroundRepeat:
            backgroundRepeat.value,

        backgroundScale:
            parseInt(
                backgroundScale.value,
                10
            ) || 256,

        penColor:
            penColor.value,

        penSize:
            penSize,

        eraserSize:
            eraserSize,

        uiTheme: {

            bg:
                uiBg.value,

            accent:
                uiAccent.value,

            darkAccent:
                uiDarkAccent.value,

            buttonHover:
                uiButtonHover.value,

            text:
                uiText.value,

            font:
                uiFont.value

        },

        objects:
            objects,

        drawing:
            drawingCanvas.toDataURL()

    };

}


function getObjectType(object) {

    if (
        object.classList.contains("note")
    ) {

        return "note";

    }


    if (
        object.classList.contains("image-object")
    ) {

        return "image";

    }


    if (
        object.classList.contains("sticker")
    ) {

        return "sticker";

    }


    return "unknown";

}


/* =========================================================
   LOAD BOARD
========================================================= */

function loadBoard(data) {

    workspace.innerHTML =
        "";


    selectedObject =
        null;


    boardName =
        data.name ||
        "Untitled Board";


    boardWidth =
        clamp(
            parseInt(
                data.boardWidth ||
                10000,
                10
            ),
            500,
            12000
        );


    boardHeight =
        clamp(
            parseInt(
                data.boardHeight ||
                10000,
                10
            ),
            500,
            12000
        );


    boardWidthInput.value =
        boardWidth;

    boardHeightInput.value =
        boardHeight;


    setCanvasSize(
        boardWidth,
        boardHeight,
        false
    );


    boardColor.value =
        data.backgroundColor ||
        data.background ||
        "#ffffff";


    backgroundImageData =
        data.backgroundImage ||
        null;


    backgroundRepeat.value =
        data.backgroundRepeat ||
        "repeat";


    backgroundScale.value =
        data.backgroundScale ||
        256;


    applyBackground();


    penColor.value =
        data.penColor ||
        "#000000";


    stylePenColor.value =
        penColor.value;


    penSize =
        data.penSize ||
        4;


    eraserSize =
        data.eraserSize ||
        30;


    penSizeInput.value =
        penSize;

    eraserSizeInput.value =
        eraserSize;


    if (data.uiTheme) {

        uiBg.value =
            data.uiTheme.bg ||
            "#d4d0c8";

        uiAccent.value =
            data.uiTheme.accent ||
            "#316ac5";

        uiDarkAccent.value =
            data.uiTheme.darkAccent ||
            "#234a8c";

        uiButtonHover.value =
            data.uiTheme.buttonHover ||
            "#eeeeee";

        uiText.value =
            data.uiTheme.text ||
            "#000000";

        uiFont.value =
            data.uiTheme.font ||
            "Tahoma, Arial, sans-serif";


        applyUITheme();

    }


    if (
        Array.isArray(
            data.objects
        )
    ) {

        data.objects.forEach(
            item => {

                let created =
                    null;


                if (
                    item.type === "note"
                ) {

                    created =
                        createNote(
                            item.x || 0,
                            item.y || 0,
                            item.title,
                            item.content,
                            item.styles,
                            false
                        );

                }


                if (
                    item.type === "image"
                ) {

                    created =
                        createImage(
                            item.image,
                            item.x || 0,
                            item.y || 0,
                            item.title,
                            item.width || 260,
                            item.pixel,
                            item.styles,
                            false
                        );

                }


                if (
                    item.type === "sticker"
                ) {

                    created =
                        createSticker(
                            item.image,
                            item.x || 0,
                            item.y || 0,
                            item.width || 180,
                            item.pixel,
                            false
                        );

                }


                if (created) {

                    created.style.zIndex =
                        item.zIndex || 0;

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
                    0,
                    boardWidth,
                    boardHeight
                );

            };


        image.src =
            data.drawing;

    }


    objectNumber =
        workspace.querySelectorAll(
            ".board-object"
        ).length + 1;


    centerBoard();

    updateStylePanel();

}


/* =========================================================
   CAMERA
========================================================= */

function centerBoard() {

    cameraX =
        (
            board.clientWidth -
            boardWidth * zoom
        ) / 2;


    cameraY =
        (
            board.clientHeight -
            boardHeight * zoom
        ) / 2;


    updateCamera();

}


function clampCamera() {

    const viewportWidth =
        board.clientWidth;

    const viewportHeight =
        board.clientHeight;


    const scaledWidth =
        boardWidth * zoom;

    const scaledHeight =
        boardHeight * zoom;


    const margin =
        200;


    const minX =
        viewportWidth -
        scaledWidth -
        margin;


    const maxX =
        margin;


    const minY =
        viewportHeight -
        scaledHeight -
        margin;


    const maxY =
        margin;


    cameraX =
        clamp(
            cameraX,
            Math.min(minX, maxX),
            Math.max(minX, maxX)
        );


    cameraY =
        clamp(
            cameraY,
            Math.min(minY, maxY),
            Math.max(minY, maxY)
        );

}


function updateCamera() {

    clampCamera();


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


/* =========================================================
   KEYBOARD
========================================================= */

function setupKeyboard() {

    document.addEventListener(
        "keydown",
        event => {

            if (isTypingTarget()) {
                return;
            }


            const key =
                event.key.toLowerCase();


            if (
                [
                    "w",
                    "a",
                    "s",
                    "d",
                    "arrowup",
                    "arrowdown",
                    "arrowleft",
                    "arrowright"
                ].includes(key)
            ) {

                keys.add(key);

                event.preventDefault();

            }


            if (
                event.key === "Home"
            ) {

                centerBoard();

            }


            if (
                event.key === "Escape"
            ) {

                setTool("select");

                stylePanel.classList.remove(
                    "open"
                );

                styleButton.classList.remove(
                    "active"
                );

                helpWindow.style.display =
                    "none";

            }


            if (
                event.key === "Delete" &&
                selectedObject &&
                drawingMode === "select"
            ) {

                selectedObject.remove();

                selectedObject =
                    null;

                updateStylePanel();

            }


            if (
                event.ctrlKey &&
                key === "s"
            ) {

                event.preventDefault();

                saveBoard();

            }


            if (
                event.ctrlKey &&
                key === "o"
            ) {

                event.preventDefault();

                boardInput.click();

            }

        }
    );


    document.addEventListener(
        "keyup",
        event => {

            keys.delete(
                event.key.toLowerCase()
            );

        }
    );


    window.addEventListener(
        "resize",
        () => {

            updateCamera();

        }
    );

}


function isTypingTarget() {

    const element =
        document.activeElement;


    if (!element) {
        return false;
    }


    return (
        element.tagName === "INPUT" ||
        element.tagName === "TEXTAREA" ||
        element.tagName === "SELECT" ||
        element.isContentEditable
    );

}


function keyboardLoop() {

    if (
        !isTypingTarget()
    ) {

        const speed =
            10;


        if (
            keys.has("w") ||
            keys.has("arrowup")
        ) {

            cameraY += speed;

        }


        if (
            keys.has("s") ||
            keys.has("arrowdown")
        ) {

            cameraY -= speed;

        }


        if (
            keys.has("a") ||
            keys.has("arrowleft")
        ) {

            cameraX += speed;

        }


        if (
            keys.has("d") ||
            keys.has("arrowright")
        ) {

            cameraX -= speed;

        }


        if (keys.size > 0) {

            updateCamera();

        }

    }


    requestAnimationFrame(
        keyboardLoop
    );

}


/* =========================================================
   UTILITIES
========================================================= */

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


function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        text || "";


    return div.innerHTML;

}


function clamp(
    value,
    min,
    max
) {

    return Math.max(
        min,
        Math.min(
            max,
            value
        )
    );

}


function normalizeColor(
    color,
    fallback
) {

    if (
        !color ||
        color === "transparent"
    ) {

        return fallback;

    }


    if (
        color.startsWith("#")
    ) {

        return color;

    }


    const match =
        color.match(
            /rgba?\((\d+),\s*(\d+),\s*(\d+)/
        );


    if (!match) {

        return fallback;

    }


    return (
        "#" +
        [1, 2, 3]
            .map(
                index =>
                    parseInt(
                        match[index],
                        10
                    )
                    .toString(16)
                    .padStart(
                        2,
                        "0"
                    )
            )
            .join("")
    );

}


/* =========================================================
   START
========================================================= */

startup();
