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

const undoButton = document.getElementById("undoButton");
const redoButton = document.getElementById("redoButton");

const newButton = document.getElementById("newButton");
const saveButton = document.getElementById("saveButton");
const saveAsButton = document.getElementById("saveAsButton");
const loadButton = document.getElementById("loadButton");

const helpButton = document.getElementById("helpButton");

const penColor = document.getElementById("penColor");

const saveStatus = document.getElementById("saveStatus");


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
   CONSTANTS
========================================================= */

const APP_VERSION = 12;

const AUTOSAVE_KEY =
    "pickdel-board-autosave";

const AUTOSAVE_DELAY =
    1200;

const HISTORY_LIMIT =
    25;


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

let objectDragActive = false;

let objectResizeActive = false;

let autosaveTimer = null;

let saveStatusTimer = null;

let history = [];

let historyIndex = -1;

let historyBusy = false;

let lastSavedSnapshot = null;

let lastAutosaveSnapshot = null;

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

    updateHistoryButtons();

    initializeHistory();

    checkForAutosave();

    keyboardLoop();

}


/* =========================================================
   CANVAS
========================================================= */

function setupCanvas() {

    setCanvasSize(
        boardWidth,
        boardHeight,
        false
    );

}


function setCanvasSize(
    width,
    height,
    preserve
) {

    let oldImage = null;


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
   TOOLBAR
========================================================= */

function setupToolbar() {

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


            if (button === undoButton) {

                undo();

                return;

            }


            if (button === redoButton) {

                redo();

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


    penColor.addEventListener(
        "input",
        () => {

            stylePenColor.value =
                penColor.value;

            scheduleAutosave();

        }
    );


    stylePenColor.addEventListener(
        "change",
        () => {

            penColor.value =
                stylePenColor.value;

            scheduleAutosave();

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
                () => {

                    applyUITheme();

                    scheduleAutosave();

                }
            );

            control.addEventListener(
                "change",
                () => {

                    applyUITheme();

                    scheduleAutosave();

                }
            );

        }
    );


    applyBoardSize.addEventListener(
        "click",
        event => {

            event.preventDefault();

            const before =
                createSnapshot();


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

            commitHistoryIfChanged(
                before
            );

        }
    );


    boardColor.addEventListener(
        "input",
        () => {

            applyBackground();

            scheduleAutosave();

        }
    );


    backgroundRepeat.addEventListener(
        "change",
        () => {

            applyBackground();

            scheduleAutosave();

        }
    );


    backgroundScale.addEventListener(
        "input",
        () => {

            applyBackground();

            scheduleAutosave();

        }
    );


    backgroundImageButton.addEventListener(
        "click",
        event => {

            event.preventDefault();

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

                    const before =
                        createSnapshot();

                    backgroundImageData =
                        event.target.result;

                    applyBackground();

                    commitHistoryIfChanged(
                        before
                    );

                };


            reader.readAsDataURL(
                file
            );


            backgroundImageInput.value =
                "";

        }
    );


    clearBackgroundImage.addEventListener(
        "click",
        event => {

            event.preventDefault();


            const before =
                createSnapshot();


            backgroundImageData =
                null;


            applyBackground();


            commitHistoryIfChanged(
                before
            );

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

            scheduleAutosave();

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

            scheduleAutosave();

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

            if (panning) {

                panning =
                    false;

            }


            if (
                drawingMode === "select" &&
                !objectDragActive &&
                !objectResizeActive
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


    const oldZoom =
        zoom;


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
            Math.round(zoom * 10) / 10,
            0.3,
            3
        );


    if (zoom === oldZoom) {
        return;
    }


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


    backgroundScale.value =
        scale;


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

                /* Ignore unsupported capture. */

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


    pushHistory();

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
    autoSelect = true,
    skipHistory = false
) {

    const note =
        document.createElement("div");


    note.className =
        "note board-object";


    note.style.left =
        safeNumber(x, 0) + "px";

    note.style.top =
        safeNumber(y, 0) + "px";


    const titleElement =
        document.createElement("div");

    titleElement.className =
        "note-title";

    titleElement.textContent =
        title ||
        "Note " +
        objectNumber;


    const contentElement =
        document.createElement("div");

    contentElement.className =
        "note-content";

    contentElement.textContent =
        normalizeText(
            content ?? "Type something..."
        );


    const resizeHandle =
        document.createElement("div");

    resizeHandle.className =
        "resize-handle";


    note.append(
        titleElement,
        contentElement,
        resizeHandle
    );


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


    if (!skipHistory) {

        pushHistory();

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


        if (!file.type.startsWith("image/")) {

            alert(
                "Please choose an image file."
            );

            imageInput.value =
                "";

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
    autoSelect = true,
    skipHistory = false
) {

    if (!imageData) {
        return null;
    }


    const object =
        document.createElement("div");


    object.className =
        "image-object board-object";


    object.style.left =
        safeNumber(x, 0) + "px";

    object.style.top =
        safeNumber(y, 0) + "px";

    object.style.width =
        clamp(
            safeNumber(width, 260),
            80,
            1000
        ) + "px";


    if (pixel) {

        object.classList.add(
            "pixel-mode"
        );

    }


    const titleElement =
        document.createElement("div");

    titleElement.className =
        "image-title";

    titleElement.textContent =
        title ||
        "Image " +
        objectNumber;


    const imageContent =
        document.createElement("div");

    imageContent.className =
        "image-content";


    const image =
        document.createElement("img");

    image.src =
        imageData;

    image.alt =
        "";


    const resizeHandle =
        document.createElement("div");

    resizeHandle.className =
        "resize-handle";


    imageContent.append(
        image
    );


    object.append(
        titleElement,
        imageContent,
        resizeHandle
    );


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


    if (!skipHistory) {

        pushHistory();

    }


    return object;

}


function createSticker(
    imageData,
    x,
    y,
    width = 180,
    pixel = false,
    autoSelect = true,
    skipHistory = false
) {

    if (!imageData) {
        return null;
    }


    const object =
        document.createElement("div");


    object.className =
        "sticker board-object";


    object.style.left =
        safeNumber(x, 0) + "px";

    object.style.top =
        safeNumber(y, 0) + "px";


    if (pixel) {

        object.classList.add(
            "pixel-mode"
        );

    }


    const image =
        document.createElement("img");

    image.src =
        imageData;

    image.alt =
        "";

    image.style.width =
        clamp(
            safeNumber(width, 180),
            80,
            1000
        ) + "px";


    const resizeHandle =
        document.createElement("div");

    resizeHandle.className =
        "resize-handle";


    object.append(
        image,
        resizeHandle
    );


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


    if (!skipHistory) {

        pushHistory();

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
                drawingMode === "select" &&
                !event.target.closest(
                    ".note-content.editing, .note-title.editing, .image-title.editing"
                )
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


            positionContextMenu(
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


function getSelectedObject() {

    if (
        selectedObject &&
        selectedObject.isConnected
    ) {

        return selectedObject;

    }


    selectedObject =
        null;

    return null;

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

                startEditing(
                    title,
                    true
                );

            }
        );


        title.addEventListener(
            "blur",
            () => {

                finishEditing(
                    title
                );

            }
        );


        title.addEventListener(
            "keydown",
            event => {

                if (event.key === "Enter") {

                    event.preventDefault();

                    title.blur();

                }

            }
        );

    }


    if (body) {

        body.addEventListener(
            "dblclick",
            event => {

                event.stopPropagation();

                startEditing(
                    body,
                    false
                );

            }
        );


        body.addEventListener(
            "blur",
            () => {

                finishEditing(
                    body
                );

            }
        );

    }

}


function startEditing(
    element,
    singleLine
) {

    if (!element) {
        return;
    }


    selectObject(
        element.closest(
            ".board-object"
        )
    );


    element.contentEditable =
        "plaintext-only";


    element.classList.add(
        "editing"
    );


    if (singleLine) {

        element.dataset.singleLine =
            "true";

    } else {

        element.dataset.singleLine =
            "false";

    }


    element.focus();


    placeCursorAtEnd(
        element
    );

}


function finishEditing(element) {

    if (!element) {
        return;
    }


    const wasEditing =
        element.classList.contains(
            "editing"
        );


    if (!wasEditing) {
        return;
    }


    if (
        element.dataset.singleLine ===
        "true"
    ) {

        element.textContent =
            normalizeSingleLine(
                element.textContent
            );

    } else {

        element.textContent =
            normalizeText(
                element.innerText
            );

    }


    element.contentEditable =
        "false";


    element.classList.remove(
        "editing"
    );


    delete element.dataset.singleLine;


    pushHistory();

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


            if (
                event.target.isContentEditable
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


            const before =
                createSnapshot();


            objectDragActive =
                true;


            object.classList.add(
                "dragging"
            );


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


                objectDragActive =
                    false;


                object.classList.remove(
                    "dragging"
                );


                commitHistoryIfChanged(
                    before
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


            const before =
                createSnapshot();


            const startX =
                event.clientX;


            const startWidth =
                object.classList.contains(
                    "sticker"
                )
                    ? object.querySelector("img")?.offsetWidth || 180
                    : object.offsetWidth;


            objectResizeActive =
                true;


            object.classList.add(
                "resizing"
            );


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


                objectResizeActive =
                    false;


                object.classList.remove(
                    "resizing"
                );


                commitHistoryIfChanged(
                    before
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
                () => {

                    applySelectedObjectStyle();

                    scheduleAutosave();

                }
            );

            control.addEventListener(
                "change",
                () => {

                    applySelectedObjectStyle();

                    pushHistory();

                }
            );

        }
    );


    editTitleButton.addEventListener(
        "click",
        event => {

            event.preventDefault();


            const object =
                getSelectedObject();


            if (!object) {
                return;
            }


            const title =
                object.querySelector(
                    ".note-title, .image-title"
                );


            if (!title) {
                return;
            }


            startEditing(
                title,
                true
            );

        }
    );


    editBodyButton.addEventListener(
        "click",
        event => {

            event.preventDefault();


            const object =
                getSelectedObject();


            if (!object) {
                return;
            }


            const body =
                object.querySelector(
                    ".note-content"
                );


            if (!body) {
                return;
            }


            startEditing(
                body,
                false
            );

        }
    );

}


function applySelectedObjectStyle() {

    const object =
        getSelectedObject();


    if (!object) {
        return;
    }


    if (
        object.classList.contains(
            "sticker"
        )
    ) {

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


    object.style.borderColor =
        objectBorderColor.value;


    object.style.borderWidth =
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


        object.style.boxShadow =
            `${size}px ${size}px 0 #9aa7b2`;

    } else {

        object.style.boxShadow =
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

    const object =
        getSelectedObject();


    if (!object) {

        objectStyleMessage.textContent =
            "Select a note or image first.";

        disableObjectControls(
            true
        );

        return;

    }


    if (
        object.classList.contains(
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
        object.querySelector(
            ".note-title, .image-title"
        );


    const body =
        object.querySelector(
            ".note-content, .image-content"
        );


    const objectStyle =
        getComputedStyle(
            object
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
            getMatchingFontValue(
                titleStyle.fontFamily
            );

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


    const shadowMatch =
        objectStyle.boxShadow.match(
            /^(-?\d+(?:\.\d+)?)px/
        );


    if (shadowMatch) {

        objectShadowSize.value =
            Math.round(
                parseFloat(
                    shadowMatch[1]
                )
            );

    }

}


function getMatchingFontValue(fontFamily) {

    const options =
        Array.from(
            objectFont.options
        );


    const exact =
        options.find(
            option =>
                option.value ===
                fontFamily
        );


    if (exact) {
        return exact.value;
    }


    const lower =
        String(
            fontFamily
        ).toLowerCase();


    const match =
        options.find(
            option =>
                lower.includes(
                    option.value
                        .split(",")[0]
                        .replaceAll("'", "")
                        .replaceAll('"', "")
                        .toLowerCase()
                )
        );


    return match
        ? match.value
        : options[0].value;

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

            deleteSelectedObject();

            closeContextMenu();

        }
    );


    duplicateObject.addEventListener(
        "click",
        () => {

            duplicateSelectedObject();

            closeContextMenu();

        }
    );


    pixelObject.addEventListener(
        "click",
        () => {

            const object =
                getSelectedObject();


            if (object) {

                const before =
                    createSnapshot();


                object.classList.toggle(
                    "pixel-mode"
                );


                commitHistoryIfChanged(
                    before
                );

            }


            closeContextMenu();

        }
    );


    bringFront.addEventListener(
        "click",
        () => {

            const object =
                getSelectedObject();


            if (object) {

                const before =
                    createSnapshot();


                let highest =
                    0;


                workspace
                    .querySelectorAll(
                        ".board-object"
                    )
                    .forEach(
                        item => {

                            highest =
                                Math.max(
                                    highest,
                                    parseInt(
                                        item.style.zIndex ||
                                        "0",
                                        10
                                    )
                                );

                        }
                    );


                object.style.zIndex =
                    highest + 1;


                commitHistoryIfChanged(
                    before
                );

            }


            closeContextMenu();

        }
    );


    bringForward.addEventListener(
        "click",
        () => {

            const object =
                getSelectedObject();


            if (object) {

                const before =
                    createSnapshot();


                object.style.zIndex =
                    parseInt(
                        object.style.zIndex ||
                        "0",
                        10
                    ) + 1;


                commitHistoryIfChanged(
                    before
                );

            }


            closeContextMenu();

        }
    );


    sendBackward.addEventListener(
        "click",
        () => {

            const object =
                getSelectedObject();


            if (object) {

                const before =
                    createSnapshot();


                object.style.zIndex =
                    parseInt(
                        object.style.zIndex ||
                        "0",
                        10
                    ) - 1;


                commitHistoryIfChanged(
                    before
                );

            }


            closeContextMenu();

        }
    );


    sendBack.addEventListener(
        "click",
        () => {

            const object =
                getSelectedObject();


            if (object) {

                const before =
                    createSnapshot();


                object.style.zIndex =
                    -100;


                commitHistoryIfChanged(
                    before
                );

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


function positionContextMenu(
    x,
    y
) {

    contextMenu.style.display =
        "block";


    const width =
        contextMenu.offsetWidth;

    const height =
        contextMenu.offsetHeight;


    const maxX =
        window.innerWidth -
        width -
        5;

    const maxY =
        window.innerHeight -
        height -
        5;


    contextMenu.style.left =
        clamp(
            x,
            5,
            Math.max(5, maxX)
        ) + "px";


    contextMenu.style.top =
        clamp(
            y,
            5,
            Math.max(5, maxY)
        ) + "px";

}


function updatePixelMenu() {

    const object =
        getSelectedObject();


    if (!object) {

        pixelObject.style.display =
            "none";

        return;

    }


    const valid =
        object.classList.contains(
            "image-object"
        ) ||
        object.classList.contains(
            "sticker"
        );


    pixelObject.style.display =
        valid
            ? "block"
            : "none";


    if (valid) {

        pixelObject.textContent =
            object.classList.contains(
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


    history =
        [];

    historyIndex =
        -1;


    initializeHistory();

    clearAutosave();

    markUnsaved();

}


/* =========================================================
   SAVE / LOAD
========================================================= */

async function saveBoard() {

    setSaveStatus(
        "SAVING..."
    );


    if (currentFileHandle) {

        try {

            await writeToFile(
                currentFileHandle
            );


            markSaved();

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

        setSaveStatus(
            "SAVE CANCELLED"
        );

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
                        sanitizeFilename(
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


            await writeToFile(
                handle
            );


            markSaved();

            return;

        } catch (error) {

            if (
                error.name ===
                "AbortError"
            ) {

                setSaveStatus(
                    "SAVE CANCELLED"
                );

                return;

            }

        }

    }


    downloadBoard();

    markSaved();

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


    try {

        await writable.write(
            json
        );

    } finally {

        await writable.close();

    }

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
        sanitizeFilename(
            boardName
        ) +
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


                    if (
                        !data ||
                        typeof data !== "object"
                    ) {

                        throw new Error(
                            "Invalid board."
                        );

                    }


                    loadBoard(
                        data
                    );


                    setSaveStatus(
                        "LOADED"
                    );

                } catch {

                    alert(
                        "Could not load this board."
                    );


                    setSaveStatus(
                        "LOAD FAILED"
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


                    /*
                     * textContent is used intentionally for
                     * storage because it gives us plain text.
                     *
                     * Newlines are normalized before saving.
                     */

                    title:
                        title
                            ? normalizeSingleLine(
                                title.textContent
                            )
                            : undefined,

                    content:
                        content
                            ? normalizeText(
                                content.innerText ||
                                content.textContent
                            )
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
            APP_VERSION,

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

    historyBusy =
        true;


    workspace.innerHTML =
        "";


    selectedObject =
        null;


    boardName =
        typeof data.name === "string"
            ? data.name
            : "Untitled Board";


    boardWidth =
        clamp(
            parseInt(
                data.boardWidth,
                10
            ) || 3000,
            500,
            12000
        );


    boardHeight =
        clamp(
            parseInt(
                data.boardHeight,
                10
            ) || 2000,
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
        validRepeat(
            data.backgroundRepeat
        );


    backgroundScale.value =
        clamp(
            parseInt(
                data.backgroundScale,
                10
            ) || 256,
            16,
            3000
        );


    applyBackground();


    penColor.value =
        data.penColor ||
        "#000000";


    stylePenColor.value =
        penColor.value;


    penSize =
        clamp(
            parseInt(
                data.penSize,
                10
            ) || 4,
            1,
            100
        );


    eraserSize =
        clamp(
            parseInt(
                data.eraserSize,
                10
            ) || 30,
            1,
            200
        );


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

                if (
                    !item ||
                    typeof item !== "object"
                ) {

                    return;

                }


                let created =
                    null;


                if (
                    item.type === "note"
                ) {

                    created =
                        createNote(
                            safeNumber(item.x, 0),
                            safeNumber(item.y, 0),
                            item.title,
                            item.content,
                            item.styles,
                            false,
                            true
                        );

                }


                if (
                    item.type === "image" &&
                    item.image
                ) {

                    created =
                        createImage(
                            item.image,
                            safeNumber(item.x, 0),
                            safeNumber(item.y, 0),
                            item.title,
                            safeNumber(
                                item.width,
                                260
                            ),
                            Boolean(
                                item.pixel
                            ),
                            item.styles,
                            false,
                            true
                        );

                }


                if (
                    item.type === "sticker" &&
                    item.image
                ) {

                    created =
                        createSticker(
                            item.image,
                            safeNumber(item.x, 0),
                            safeNumber(item.y, 0),
                            safeNumber(
                                item.width,
                                180
                            ),
                            Boolean(
                                item.pixel
                            ),
                            false,
                            true
                        );

                }


                if (created) {

                    created.style.zIndex =
                        safeNumber(
                            item.zIndex,
                            0
                        );

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


        image.onerror =
            () => {

                drawingContext.clearRect(
                    0,
                    0,
                    drawingCanvas.width,
                    drawingCanvas.height
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


    historyBusy =
        false;


    history =
        [];

    historyIndex =
        -1;


    initializeHistory();


    scheduleAutosave();

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
        `translate3d(${cameraX}px, ${cameraY}px, 0) scale(${zoom})`;


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

                if (
                    event.key === "Escape"
                ) {

                    document.activeElement.blur();

                }

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

                event.preventDefault();

                centerBoard();

                return;

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

                closeContextMenu();

                return;

            }


            if (
                event.ctrlKey &&
                key === "z"
            ) {

                event.preventDefault();

                undo();

                return;

            }


            if (
                event.ctrlKey &&
                (
                    key === "y" ||
                    (
                        event.shiftKey &&
                        key === "z"
                    )
                )
            ) {

                event.preventDefault();

                redo();

                return;

            }


            if (
                event.ctrlKey &&
                key === "d"
            ) {

                event.preventDefault();

                duplicateSelectedObject();

                return;

            }


            if (
                event.ctrlKey &&
                key === "s"
            ) {

                event.preventDefault();

                saveBoard();

                return;

            }


            if (
                event.ctrlKey &&
                key === "o"
            ) {

                event.preventDefault();

                boardInput.click();

                return;

            }


            if (
                (
                    event.key === "Delete" ||
                    event.key === "Backspace"
                ) &&
                selectedObject &&
                drawingMode === "select"
            ) {

                event.preventDefault();

                deleteSelectedObject();

                return;

            }


            if (
                selectedObject &&
                drawingMode === "select" &&
                [
                    "ArrowUp",
                    "ArrowDown",
                    "ArrowLeft",
                    "ArrowRight"
                ].includes(
                    event.key
                )
            ) {

                event.preventDefault();

                nudgeSelectedObject(
                    event.key,
                    event.shiftKey
                        ? 10
                        : 1
                );

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
        "blur",
        () => {

            keys.clear();

            panning =
                false;

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
   OBJECT KEYBOARD ACTIONS
========================================================= */

function nudgeSelectedObject(
    direction,
    distance
) {

    const object =
        getSelectedObject();


    if (!object) {
        return;
    }


    const before =
        createSnapshot();


    switch (direction) {

        case "ArrowUp":

            object.style.top =
                object.offsetTop -
                distance +
                "px";

            break;


        case "ArrowDown":

            object.style.top =
                object.offsetTop +
                distance +
                "px";

            break;


        case "ArrowLeft":

            object.style.left =
                object.offsetLeft -
                distance +
                "px";

            break;


        case "ArrowRight":

            object.style.left =
                object.offsetLeft +
                distance +
                "px";

            break;

    }


    commitHistoryIfChanged(
        before
    );

}


function deleteSelectedObject() {

    const object =
        getSelectedObject();


    if (!object) {
        return;
    }


    const before =
        createSnapshot();


    object.remove();


    selectedObject =
        null;


    updateStylePanel();

    commitHistoryIfChanged(
        before
    );

}


function duplicateSelectedObject() {

    const object =
        getSelectedObject();


    if (!object) {
        return null;
    }


    const before =
        createSnapshot();


    const copy =
        object.cloneNode(
            true
        );


    copy.classList.remove(
        "selected"
    );


    copy.style.left =
        object.offsetLeft +
        30 +
        "px";


    copy.style.top =
        object.offsetTop +
        30 +
        "px";


    workspace.appendChild(
        copy
    );


    setupObject(
        copy
    );


    objectNumber++;


    selectObject(
        copy
    );


    commitHistoryIfChanged(
        before
    );


    return copy;

}


/* =========================================================
   HISTORY
========================================================= */

function initializeHistory() {

    history =
        [
            createSnapshot()
        ];

    historyIndex =
        0;


    updateHistoryButtons();

}


function createSnapshot() {

    try {

        return JSON.stringify(
            getBoardData()
        );

    } catch {

        return "";

    }

}


function pushHistory() {

    if (historyBusy) {
        return;
    }


    const snapshot =
        createSnapshot();


    if (!snapshot) {
        return;
    }


    if (
        historyIndex >= 0 &&
        history[historyIndex] === snapshot
    ) {

        scheduleAutosave();

        updateHistoryButtons();

        return;

    }


    history =
        history.slice(
            0,
            historyIndex + 1
        );


    history.push(
        snapshot
    );


    if (
        history.length >
        HISTORY_LIMIT
    ) {

        history.shift();

    }


    historyIndex =
        history.length - 1;


    updateHistoryButtons();

    scheduleAutosave();

}


function commitHistoryIfChanged(
    before
) {

    if (!before) {

        pushHistory();

        return;

    }


    const after =
        createSnapshot();


    if (
        before !== after
    ) {

        historyBusy =
            false;

        pushHistory();

    } else {

        scheduleAutosave();

    }

}


function undo() {

    if (
        historyIndex <= 0
    ) {

        return;

    }


    historyIndex--;

    restoreSnapshot(
        history[historyIndex]
    );


    updateHistoryButtons();

}


function redo() {

    if (
        historyIndex >=
        history.length - 1
    ) {

        return;

    }


    historyIndex++;

    restoreSnapshot(
        history[historyIndex]
    );


    updateHistoryButtons();

}


function restoreSnapshot(
    snapshot
) {

    if (!snapshot) {
        return;
    }


    try {

        const data =
            JSON.parse(
                snapshot
            );


        historyBusy =
            true;


        loadBoardWithoutHistory(
            data
        );


        historyBusy =
            false;


        scheduleAutosave();

    } catch {

        historyBusy =
            false;

        setSaveStatus(
            "UNDO FAILED"
        );

    }

}


function loadBoardWithoutHistory(
    data
) {

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
                data.boardWidth,
                10
            ) || 3000,
            500,
            12000
        );


    boardHeight =
        clamp(
            parseInt(
                data.boardHeight,
                10
            ) || 2000,
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
        "#ffffff";


    backgroundImageData =
        data.backgroundImage ||
        null;


    backgroundRepeat.value =
        validRepeat(
            data.backgroundRepeat
        );


    backgroundScale.value =
        clamp(
            parseInt(
                data.backgroundScale,
                10
            ) || 256,
            16,
            3000
        );


    applyBackground();


    penColor.value =
        data.penColor ||
        "#000000";


    stylePenColor.value =
        penColor.value;


    penSize =
        clamp(
            parseInt(
                data.penSize,
                10
            ) || 4,
            1,
            100
        );


    eraserSize =
        clamp(
            parseInt(
                data.eraserSize,
                10
            ) || 30,
            1,
            200
        );


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

                if (!item) {
                    return;
                }


                let created =
                    null;


                if (
                    item.type === "note"
                ) {

                    created =
                        createNote(
                            safeNumber(item.x, 0),
                            safeNumber(item.y, 0),
                            item.title,
                            item.content,
                            item.styles,
                            false,
                            true
                        );

                }


                if (
                    item.type === "image" &&
                    item.image
                ) {

                    created =
                        createImage(
                            item.image,
                            safeNumber(item.x, 0),
                            safeNumber(item.y, 0),
                            item.title,
                            safeNumber(
                                item.width,
                                260
                            ),
                            Boolean(
                                item.pixel
                            ),
                            item.styles,
                            false,
                            true
                        );

                }


                if (
                    item.type === "sticker" &&
                    item.image
                ) {

                    created =
                        createSticker(
                            item.image,
                            safeNumber(item.x, 0),
                            safeNumber(item.y, 0),
                            safeNumber(
                                item.width,
                                180
                            ),
                            Boolean(
                                item.pixel
                            ),
                            false,
                            true
                        );

                }


                if (created) {

                    created.style.zIndex =
                        safeNumber(
                            item.zIndex,
                            0
                        );

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


    updateStylePanel();

}


/* =========================================================
   AUTOSAVE
========================================================= */

function scheduleAutosave() {

    clearTimeout(
        autosaveTimer
    );


    autosaveTimer =
        setTimeout(
            performAutosave,
            AUTOSAVE_DELAY
        );


    markUnsaved();

}


function performAutosave() {

    try {

        const snapshot =
            createSnapshot();


        localStorage.setItem(
            AUTOSAVE_KEY,
            snapshot
        );


        lastAutosaveSnapshot =
            snapshot;


        setSaveStatus(
            "AUTOSAVED"
        );

    } catch {

        /*
         * Large boards with large embedded images can exceed
         * localStorage limits. Manual file saving still works.
         */

        setSaveStatus(
            "LOCAL SAVE FULL"
        );

    }

}


function checkForAutosave() {

    let snapshot = null;


    try {

        snapshot =
            localStorage.getItem(
                AUTOSAVE_KEY
            );

    } catch {

        return;

    }


    if (!snapshot) {
        return;
    }


    try {

        const data =
            JSON.parse(
                snapshot
            );


        if (
            !data ||
            typeof data !== "object"
        ) {

            return;

        }


        const useAutosave =
            confirm(
                "Pickdel found an autosaved board. Load it?"
            );


        if (useAutosave) {

            loadBoard(
                data
            );

        }

    } catch {

        clearAutosave();

    }

}


function clearAutosave() {

    try {

        localStorage.removeItem(
            AUTOSAVE_KEY
        );

    } catch {

        /* Ignore storage errors. */

    }

}


/* =========================================================
   SAVE STATUS
========================================================= */

function setSaveStatus(
    message
) {

    if (!saveStatus) {
        return;
    }


    saveStatus.textContent =
        message;


    clearTimeout(
        saveStatusTimer
    );


    saveStatusTimer =
        setTimeout(
            () => {

                if (
                    saveStatus.textContent ===
                    message
                ) {

                    saveStatus.textContent =
                        "READY";

                }

            },
            2500
        );

}


function markUnsaved() {

    setSaveStatus(
        "UNSAVED"
    );

}


function markSaved() {

    lastSavedSnapshot =
        createSnapshot();


    clearTimeout(
        autosaveTimer
    );


    setSaveStatus(
        "SAVED"
    );

}


/* =========================================================
   HISTORY BUTTONS
========================================================= */

function updateHistoryButtons() {

    if (undoButton) {

        undoButton.disabled =
            historyIndex <= 0;

    }


    if (redoButton) {

        redoButton.disabled =
            historyIndex >=
            history.length - 1;

    }

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


function normalizeText(text) {

    if (
        text === null ||
        text === undefined
    ) {

        return "";

    }


    return String(
        text
    )
        .replace(
            /\r\n/g,
            "\n"
        )
        .replace(
            /\r/g,
            "\n"
        )
        .replace(
            /\u00a0/g,
            " "
        );

}


function normalizeSingleLine(text) {

    return normalizeText(
        text
    )
        .replace(
            /\s+/g,
            " "
        )
        .trim();

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


function safeNumber(
    value,
    fallback
) {

    const number =
        Number(
            value
        );


    return Number.isFinite(
        number
    )
        ? number
        : fallback;

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


function validRepeat(
    value
) {

    return [
        "repeat",
        "no-repeat",
        "repeat-x",
        "repeat-y"
    ].includes(
        value
    )
        ? value
        : "repeat";

}


function sanitizeFilename(
    name
) {

    return String(
        name ||
        "Untitled Board"
    )
        .replace(
            /[<>:"/\\|?*]/g,
            "_"
        )
        .trim() ||
        "Untitled Board";

}


/* =========================================================
   START
========================================================= */

startup();
