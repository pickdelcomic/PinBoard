"use strict";


/* =========================================================
   PICKDEL BOARD
   Main application
========================================================= */


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


/* =========================
   TOOLBAR
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


/* =========================
   COLORS
========================= */

const penColor =
    document.getElementById("penColor");

const backgroundColor =
    document.getElementById("backgroundColor");


/* =========================
   INPUTS
========================= */

const imageInput =
    document.getElementById("imageInput");

const backgroundImageInput =
    document.getElementById("backgroundImageInput");

const boardInput =
    document.getElementById("boardInput");


/* =========================
   CONTEXT MENU
========================= */

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


/* =========================
   HELP WINDOW
========================= */

const helpWindow =
    document.getElementById("helpWindow");

const closeHelp =
    document.getElementById("closeHelp");


/* =========================
   STYLE WINDOW
========================= */

const styleWindow =
    document.getElementById("styleWindow");

const closeStyle =
    document.getElementById("closeStyle");


/* =========================
   UI STYLE CONTROLS
========================= */

const uiColor =
    document.getElementById("uiColor");

const uiTextColor =
    document.getElementById("uiTextColor");

const uiAccent =
    document.getElementById("uiAccent");

const uiAccentDark =
    document.getElementById("uiAccentDark");

const uiFont =
    document.getElementById("uiFont");


/* =========================
   BACKGROUND CONTROLS
========================= */

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


/* =========================
   OBJECT STYLE CONTROLS
========================= */

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


/* =========================
   CAMERA
========================= */

let cameraX =
    0;

let cameraY =
    0;

let zoom =
    1;

let cameraHasBeenCentered =
    false;


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


/* =========================
   WASD
========================= */

const movementKeys =
    new Set();

let movementAnimation =
    null;


/* =========================
   BACKGROUND DATA
========================= */

let backgroundImageData =
    null;

let backgroundScaleValue =
    256;

let backgroundRepeatValue =
    "repeat";


/* =========================================================
   CANVAS
========================================================= */

drawingCanvas.width =
    10000;

drawingCanvas.height =
    10000;


/* =========================================================
   DEFAULT STYLE
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


const DEFAULT_UI_STYLE = {

    color:
        "#d4d0c8",

    textColor:
        "#000000",

    accent:
        "#316ac5",

    accentDark:
        "#234a8c",

    font:
        "Tahoma, Arial, sans-serif"

};


/* =========================================================
   UI THEME
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
        "--accent",
        uiAccent.value
    );


    root.style.setProperty(
        "--accent-dark",
        uiAccentDark.value
    );


    root.style.setProperty(
        "--button-hover",
        lightenColor(
            uiAccent.value,
            0.88
        )
    );


    root.style.setProperty(
        "--button-active",
        lightenColor(
            uiAccent.value,
            0.72
        )
    );


    document.body.style.fontFamily =
        uiFont.value;

}


/* =========================================================
   LIGHTEN COLOR
========================================================= */

function lightenColor(
    hex,
    amount
) {

    if (
        !hex ||
        hex.length !== 7
    ) {

        return "#eeeeee";

    }


    const r =
        parseInt(
            hex.slice(1, 3),
            16
        );

    const g =
        parseInt(
            hex.slice(3, 5),
            16
        );

    const b =
        parseInt(
            hex.slice(5, 7),
            16
        );


    const newR =
        Math.round(
            r +
            (255 - r) * amount
        );

    const newG =
        Math.round(
            g +
            (255 - g) * amount
        );

    const newB =
        Math.round(
            b +
            (255 - b) * amount
        );


    return (
        "#" +
        newR.toString(16).padStart(2, "0") +
        newG.toString(16).padStart(2, "0") +
        newB.toString(16).padStart(2, "0")
    );

}


/* =========================================================
   TOOL MODE
========================================================= */

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
   SELECT OBJECT
========================================================= */

function selectObject(object) {

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


    updateStyleWindowForSelection();

}


/* =========================================================
   SELECT TOOL
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
   PEN COLOR
========================================================= */

penColor.addEventListener(
    "input",
    () => {

        drawingContext.strokeStyle =
            penColor.value;

    }
);


/* =========================================================
   BACKGROUND COLOR
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
                    getNewObjectPosition(
                        currentImageType === "image"
                            ? 260
                            : 180,
                        currentImageType === "image"
                            ? 200
                            : 180
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


                if (
                    currentImageType ===
                    "sticker"
                ) {

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


        if (!file) {

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
   REMOVE BACKGROUND IMAGE
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
   BACKGROUND REPEAT
========================================================= */

backgroundRepeat.addEventListener(
    "change",
    () => {

        backgroundRepeatValue =
            backgroundRepeat.value;

        applyBackground();

    }
);


/* =========================================================
   BACKGROUND SCALE
========================================================= */

backgroundScale.addEventListener(
    "input",
    () => {

        let value =
            Number(
                backgroundScale.value
            );


        if (
            !Number.isFinite(value)
        ) {

            value =
                256;

        }


        value =
            Math.max(
                16,
                Math.min(
                    3000,
                    value
                )
            );


        backgroundScale.value =
            value;


        backgroundScaleValue =
            value;


        applyBackground();

    }
);


/* =========================================================
   APPLY BACKGROUND
========================================================= */

function applyBackground() {

    workspace.style.backgroundColor =
        styleBackgroundColor.value;


    board.style.backgroundColor =
        styleBackgroundColor.value;


    if (
        backgroundImageData
    ) {

        workspace.style.backgroundImage =
            `url("${backgroundImageData}")`;

        workspace.style.backgroundRepeat =
            backgroundRepeat.value;

        workspace.style.backgroundSize =
            `${backgroundScale.value}px auto`;

    } else {

        workspace.style.backgroundImage =
            "none";

    }

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
        document.createElement("div");


    object.className =
        "image-object board-object";


    object.style.left =
        x + "px";


    object.style.top =
        y + "px";


    object.style.width =
        width + "px";


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
        document.createElement("div");


    object.className =
        "sticker board-object";


    object.style.left =
        x + "px";


    object.style.top =
        y + "px";


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
                event.clientX +
                "px";


            contextMenu.style.top =
                event.clientY +
                "px";

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

                const change =
                    (
                        resizeEvent.clientX -
                        startX
                    ) / zoom;


                let newWidth =
                    startWidth +
                    change;


                newWidth =
                    Math.max(
                        80,
                        Math.min(
                            1200,
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
                        newWidth +
                        "px";

                } else {

                    object.style.width =
                        newWidth +
                        "px";

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
   OBJECT STYLE
========================================================= */

function applyObjectStyle(
    object,
    style
) {

    if (
        !object
    ) {

        return;

    }


    const safeStyle =
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
        safeStyle.borderColor;


    object.style.borderWidth =
        `${safeStyle.borderWidth}px`;


    if (
        safeStyle.shadow ===
        "none"
    ) {

        object.style.boxShadow =
            "none";

    }

    else if (
        safeStyle.shadow ===
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
            safeStyle.headerColor;

        title.style.color =
            safeStyle.headerTextColor;

        title.style.fontFamily =
            safeStyle.headerFont;

        title.style.fontSize =
            `${safeStyle.headerSize}px`;

        title.style.borderBottomColor =
            safeStyle.borderColor;

    }


    if (
        content
    ) {

        content.style.backgroundColor =
            safeStyle.bodyColor;

        content.style.color =
            safeStyle.bodyTextColor;

        content.style.fontFamily =
            safeStyle.bodyFont;

        content.style.fontSize =
            `${safeStyle.bodySize}px`;

    }


    object.dataset.headerColor =
        safeStyle.headerColor;

    object.dataset.bodyColor =
        safeStyle.bodyColor;

    object.dataset.borderColor =
        safeStyle.borderColor;

    object.dataset.headerTextColor =
        safeStyle.headerTextColor;

    object.dataset.bodyTextColor =
        safeStyle.bodyTextColor;

    object.dataset.headerFont =
        safeStyle.headerFont;

    object.dataset.bodyFont =
        safeStyle.bodyFont;

    object.dataset.headerSize =
        safeStyle.headerSize;

    object.dataset.bodySize =
        safeStyle.bodySize;

    object.dataset.borderWidth =
        safeStyle.borderWidth;

    object.dataset.shadow =
        safeStyle.shadow;

}


/* =========================================================
   READ OBJECT STYLE
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
   STYLE WINDOW SELECTION
========================================================= */

function updateStyleWindowForSelection() {

    if (
        !selectedObject
    ) {

        noObjectMessage.style.display =
            "block";

        objectStyleControls.style.display =
            "none";

        return;

    }


    const isNote =
        selectedObject.classList.contains(
            "note"
        );


    const isImage =
        selectedObject.classList.contains(
            "image-object"
        );


    if (
        !isNote &&
        !isImage
    ) {

        noObjectMessage.style.display =
            "block";

        noObjectMessage.textContent =
            "This object has no editable text box.";

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
   APPLY SELECTED OBJECT STYLE
========================================================= */

function applySelectedObjectStyle() {

    if (
        !selectedObject
    ) {

        return;

    }


    const isNote =
        selectedObject.classList.contains(
            "note"
        );


    const isImage =
        selectedObject.classList.contains(
            "image-object"
        );


    if (
        !isNote &&
        !isImage
    ) {

        return;

    }


    const style = {

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

    };


    objectHeaderSize.value =
        style.headerSize;

    objectBodySize.value =
        style.bodySize;

    objectBorderWidth.value =
        style.borderWidth;


    applyObjectStyle(
        selectedObject,
        style
    );

}


/* =========================================================
   STYLE CONTROL EVENTS
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
   RESET OBJECT STYLE
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


        updateStyleWindowForSelection();

    }
);


/* =========================================================
   STYLE WINDOW
========================================================= */

styleButton.addEventListener(
    "click",
    () => {

        updateStyleWindowForSelection();

        styleWindow.style.display =
            "flex";

    }
);


closeStyle.addEventListener(
    "click",
    () => {

        styleWindow.style.display =
            "none";

    }
);


styleWindow.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            styleWindow
        ) {

            styleWindow.style.display =
                "none";

        }

    }
);


/* =========================================================
   UI STYLE EVENTS
========================================================= */

[
    uiColor,
    uiTextColor,
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
   PIXEL MODE
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


    if (
        selectedObject.classList.contains(
            "pixel-mode"
        )
    ) {

        pixelObjectButton.textContent =
            "Pixel Mode: ON";

    }

    else {

        pixelObjectButton.textContent =
            "Pixel Mode: OFF";

    }

}


/* =========================================================
   TOGGLE PIXEL MODE
========================================================= */

pixelObjectButton.addEventListener(
    "click",
    event => {

        event.stopPropagation();


        if (
            !selectedObject
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


/* =========================================================
   DELETE
========================================================= */

deleteObjectButton.addEventListener(
    "click",
    event => {

        event.stopPropagation();


        if (
            selectedObject
        ) {

            selectedObject.remove();

            selectedObject =
                null;

            updateStyleWindowForSelection();

        }


        closeContextMenu();

    }
);


/* =========================================================
   DUPLICATE
========================================================= */

duplicateObjectButton.addEventListener(
    "click",
    event => {

        event.stopPropagation();


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
   BRING FRONT
========================================================= */

bringFrontButton.addEventListener(
    "click",
    event => {

        event.stopPropagation();


        if (
            !selectedObject
        ) {

            closeContextMenu();

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


/* =========================================================
   BRING FORWARD
========================================================= */

bringForwardButton.addEventListener(
    "click",
    event => {

        event.stopPropagation();


        if (
            !selectedObject
        ) {

            closeContextMenu();

            return;

        }


        const current =
            Number(
                selectedObject.style.zIndex ||
                0
            );


        selectedObject.style.zIndex =
            current + 1;


        closeContextMenu();

    }
);


/* =========================================================
   SEND BACKWARD
========================================================= */

sendBackwardButton.addEventListener(
    "click",
    event => {

        event.stopPropagation();


        if (
            !selectedObject
        ) {

            closeContextMenu();

            return;

        }


        const current =
            Number(
                selectedObject.style.zIndex ||
                0
            );


        selectedObject.style.zIndex =
            current - 1;


        closeContextMenu();

    }
);


/* =========================================================
   SEND BACK
========================================================= */

sendBackButton.addEventListener(
    "click",
    event => {

        event.stopPropagation();


        if (
            !selectedObject
        ) {

            closeContextMenu();

            return;

        }


        selectedObject.style.zIndex =
            -100;


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
   HELP
========================================================= */

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


        resetBoardAppearance();

        centerCamera();


        updateStyleWindowForSelection();

    }
);


/* =========================================================
   RESET BOARD APPEARANCE
========================================================= */

function resetBoardAppearance() {

    backgroundImageData =
        null;

    backgroundScaleValue =
        256;

    backgroundRepeatValue =
        "repeat";


    backgroundColor.value =
        "#ffffff";

    styleBackgroundColor.value =
        "#ffffff";

    backgroundScale.value =
        256;

    backgroundRepeat.value =
        "repeat";

    backgroundStatus.textContent =
        "No background image";


    workspace.style.backgroundColor =
        "#ffffff";

    workspace.style.backgroundImage =
        "none";

    workspace.style.backgroundRepeat =
        "repeat";

    workspace.style.backgroundSize =
        "256px auto";


    board.style.backgroundColor =
        "#ffffff";


    penColor.value =
        "#000000";


    uiColor.value =
        DEFAULT_UI_STYLE.color;

    uiTextColor.value =
        DEFAULT_UI_STYLE.textColor;

    uiAccent.value =
        DEFAULT_UI_STYLE.accent;

    uiAccentDark.value =
        DEFAULT_UI_STYLE.accentDark;

    uiFont.value =
        DEFAULT_UI_STYLE.font;


    applyUIStyle();

}


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


/* =========================================================
   SAVE
========================================================= */

async function saveBoard() {

    try {

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


saveAsButton.addEventListener(
    "click",
    saveAsBoard
);


/* =========================================================
   WRITE FILE
========================================================= */

async function writeToFile(
    handle
) {

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


/* =========================================================
   DOWNLOAD FALLBACK
========================================================= */

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
        sanitizeFileName(
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


/* =========================================================
   LOAD BUTTON
========================================================= */

loadButton.addEventListener(
    "click",
    () => {

        boardInput.click();

    }
);


/* =========================================================
   LOAD FILE
========================================================= */

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

                    const data =
                        JSON.parse(
                            event.target.result
                        );


                    loadBoard(
                        data
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
   GET BOARD DATA
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

                const type =
                    getObjectType(
                        object
                    );


                const data = {

                    type:

                        type,

                    x:
                        object.offsetLeft,

                    y:
                        object.offsetTop,

                    width:
                        object.classList.contains(
                            "sticker"
                        )
                            ? (
                                object.querySelector(
                                    "img"
                                )?.offsetWidth ||
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

                    style:
                        getObjectStyle(
                            object
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


                if (
                    title
                ) {

                    data.title =
                        title.textContent;

                }


                if (
                    content
                ) {

                    data.content =
                        content.textContent;

                }


                if (
                    image
                ) {

                    data.image =
                        image.src;

                }


                objects.push(
                    data
                );

            }
        );


    return {

        version:
            8,

        name:
            boardName,

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
   GET OBJECT TYPE
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
       BACKGROUND
    ========================= */

    if (
        data.background &&
        typeof data.background ===
        "object"
    ) {

        const bg =
            data.background;


        styleBackgroundColor.value =
            bg.color ||
            "#ffffff";


        backgroundColor.value =
            bg.color ||
            "#ffffff";


        backgroundImageData =
            bg.image ||
            null;


        backgroundRepeat.value =
            bg.repeat ||
            "repeat";


        backgroundScale.value =
            bg.scale ||
            256;


        backgroundScaleValue =
            Number(
                bg.scale ||
                256
            );


        backgroundRepeatValue =
            bg.repeat ||
            "repeat";


        backgroundStatus.textContent =
            backgroundImageData
                ? "Background image loaded"
                : "No background image";

    }

    else {

        /*
           Old board format.
        */

        styleBackgroundColor.value =
            data.background ||
            "#ffffff";


        backgroundColor.value =
            data.background ||
            "#ffffff";


        backgroundImageData =
            null;


        backgroundRepeat.value =
            "repeat";


        backgroundScale.value =
            256;


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
            DEFAULT_UI_STYLE.color;

        uiTextColor.value =
            data.ui.textColor ||
            DEFAULT_UI_STYLE.textColor;

        uiAccent.value =
            data.ui.accent ||
            DEFAULT_UI_STYLE.accent;

        uiAccentDark.value =
            data.ui.accentDark ||
            DEFAULT_UI_STYLE.accentDark;

        uiFont.value =
            data.ui.font ||
            DEFAULT_UI_STYLE.font;

    }

    else {

        uiColor.value =
            DEFAULT_UI_STYLE.color;

        uiTextColor.value =
            DEFAULT_UI_STYLE.textColor;

        uiAccent.value =
            DEFAULT_UI_STYLE.accent;

        uiAccentDark.value =
            DEFAULT_UI_STYLE.accentDark;

        uiFont.value =
            DEFAULT_UI_STYLE.font;

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
                    "image"
                ) {

                    if (
                        objectData.image
                    ) {

                        object =
                            createImage(
                                objectData.image,
                                objectData.x || 0,
                                objectData.y || 0,
                                objectData.title,
                                objectData.width ||
                                260,
                                objectData.pixel ||
                                false,
                                objectData.style ||
                                DEFAULT_OBJECT_STYLE,
                                false
                            );

                        }

                }


                if (
                    objectData.type ===
                    "sticker"
                ) {

                    if (
                        objectData.image
                    ) {

                        object =
                            createSticker(
                                objectData.image,
                                objectData.x || 0,
                                objectData.y || 0,
                                objectData.width ||
                                180,
                                objectData.pixel ||
                                false,
                                false
                            );

                    }

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


    updateStyleWindowForSelection();


    centerCamera();

}


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
            Math.max(
                20,
                centerX -
                width / 2
            ),

        y:
            Math.max(
                20,
                centerY -
                height / 2
            )

    };

}


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
           Empty board click.
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
           Middle mouse or
           Shift + left mouse.
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


        if (
            event.deltaY < 0
        ) {

            zoom +=
                0.1;

        }

        else {

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


        /*
           Zoom toward mouse position.
        */

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
   CENTER CAMERA
========================================================= */

function centerCamera() {

    const boardCenterX =
        board.clientWidth / 2;

    const boardCenterY =
        board.clientHeight / 2;


    const workspaceCenter =
        5000;


    cameraX =
        boardCenterX -
        workspaceCenter *
        zoom;


    cameraY =
        boardCenterY -
        workspaceCenter *
        zoom;


    cameraHasBeenCentered =
        true;


    updateCamera();

}


/* =========================================================
   UPDATE CAMERA
========================================================= */

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
        ) +
        "%";

}


/* =========================================================
   WASD MOVEMENT
========================================================= */

document.addEventListener(
    "keydown",
    event => {

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
            ].includes(
                key
            )
        ) {

            if (
                isTypingInField()
            ) {

                return;

            }


            if (
                helpWindow.style.display ===
                "flex" ||
                styleWindow.style.display ===
                "flex"
            ) {

                return;

            }


            movementKeys.add(
                key
            );


            event.preventDefault();


            startMovementLoop();

        }

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
   MOVEMENT LOOP
========================================================= */

function startMovementLoop() {

    if (
        movementAnimation
    ) {

        return;

    }


    function moveFrame() {

        let moved =
            false;


        const speed =
            12 /
            zoom;


        if (
            movementKeys.has("w") ||
            movementKeys.has("arrowup")
        ) {

            cameraY +=
                speed;

            moved =
                true;

        }


        if (
            movementKeys.has("s") ||
            movementKeys.has("arrowdown")
        ) {

            cameraY -=
                speed;

            moved =
                true;

        }


        if (
            movementKeys.has("a") ||
            movementKeys.has("arrowleft")
        ) {

            cameraX +=
                speed;

            moved =
                true;

        }


        if (
            movementKeys.has("d") ||
            movementKeys.has("arrowright")
        ) {

            cameraX -=
                speed;

            moved =
                true;

        }


        if (
            moved
        ) {

            updateCamera();

        }


        if (
            movementKeys.size > 0
        ) {

            movementAnimation =
                requestAnimationFrame(
                    moveFrame
                );

        }

        else {

            movementAnimation =
                null;

        }

    }


    movementAnimation =
        requestAnimationFrame(
            moveFrame
        );

}


/* =========================================================
   KEYBOARD SHORTCUTS
========================================================= */

document.addEventListener(
    "keydown",
    event => {

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


            styleWindow.style.display =
                "none";


            closeContextMenu();


            return;

        }


        if (
            event.key ===
            "Home"
        ) {

            if (
                !isTypingInField()
            ) {

                centerCamera();

            }

            return;

        }


        if (
            event.key ===
            "Delete" &&
            selectedObject &&
            drawingMode ===
            "select" &&
            !isTypingInField()
        ) {

            selectedObject.remove();

            selectedObject =
                null;

            updateStyleWindowForSelection();

        }

    }
);


/* =========================================================
   TYPING CHECK
========================================================= */

function isTypingInField() {

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
   CURSOR
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
   ESCAPE HTML
========================================================= */

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


/* =========================================================
   CLAMP
========================================================= */

function clamp(
    value,
    minimum,
    maximum
) {

    if (
        !Number.isFinite(
            value
        )
    ) {

        return minimum;

    }


    return Math.max(
        minimum,
        Math.min(
            maximum,
            value
        )
    );

}


/* =========================================================
   SANITIZE FILE NAME
========================================================= */

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
   WINDOW RESIZE
========================================================= */

window.addEventListener(
    "resize",
    () => {

        if (
            !cameraHasBeenCentered
        ) {

            centerCamera();

        }

    }
);


/* =========================================================
   START APPLICATION
========================================================= */

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
