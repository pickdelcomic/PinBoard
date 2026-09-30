/* =========================
   ELEMENTS
========================= */

const board =
    document.getElementById("board");

const workspace =
    document.getElementById("workspace");

const drawingCanvas =
    document.getElementById("drawingCanvas");

const drawingContext =
    drawingCanvas.getContext("2d");

const backgroundLayer =
    document.getElementById("backgroundLayer");


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

const styleButton =
    document.getElementById("styleButton");

const helpButton =
    document.getElementById("helpButton");


/* =========================
   HELP
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

const uiColor =
    document.getElementById("uiColor");

const styleBackgroundColor =
    document.getElementById(
        "styleBackgroundColor"
    );

const backgroundImageButton =
    document.getElementById(
        "backgroundImageButton"
    );

const removeBackgroundButton =
    document.getElementById(
        "removeBackgroundButton"
    );

const backgroundScale =
    document.getElementById(
        "backgroundScale"
    );

const backgroundRepeat =
    document.getElementById(
        "backgroundRepeat"
    );

const backgroundPosition =
    document.getElementById(
        "backgroundPosition"
    );

const noSelectionMessage =
    document.getElementById(
        "noSelectionMessage"
    );

const objectStyleControls =
    document.getElementById(
        "objectStyleControls"
    );

const objectFont =
    document.getElementById(
        "objectFont"
    );

const objectFontSize =
    document.getElementById(
        "objectFontSize"
    );

const objectTextColor =
    document.getElementById(
        "objectTextColor"
    );

const objectHeaderColor =
    document.getElementById(
        "objectHeaderColor"
    );

const objectBackgroundColor =
    document.getElementById(
        "objectBackgroundColor"
    );

const objectBorderColor =
    document.getElementById(
        "objectBorderColor"
    );


/* =========================
   COLORS
========================= */

const penColor =
    document.getElementById("penColor");


/* =========================
   INPUTS
========================= */

const imageInput =
    document.getElementById("imageInput");

const boardInput =
    document.getElementById("boardInput");

const backgroundInput =
    document.getElementById(
        "backgroundInput"
    );


/* =========================
   CONTEXT MENU
========================= */

const contextMenu =
    document.getElementById("contextMenu");

const deleteObject =
    document.getElementById(
        "deleteObject"
    );

const duplicateObject =
    document.getElementById(
        "duplicateObject"
    );

const pixelObject =
    document.getElementById(
        "pixelObject"
    );

const bringFront =
    document.getElementById(
        "bringFront"
    );

const bringForward =
    document.getElementById(
        "bringForward"
    );

const sendBackward =
    document.getElementById(
        "sendBackward"
    );

const sendBack =
    document.getElementById(
        "sendBack"
    );


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


/* =========================
   CAMERA
========================= */

let cameraX =
    0;

let cameraY =
    0;

let zoom =
    1;

let cameraSpeed =
    12;


/* =========================
   BACKGROUND
========================= */

let backgroundData = {

    color:
        "#ffffff",

    image:
        "",

    scale:
        "cover",

    repeat:
        "no-repeat",

    position:
        "center"

};


/* =========================
   CANVAS
========================= */

drawingCanvas.width =
    10000;

drawingCanvas.height =
    10000;


/* =========================
   INITIALIZE
========================= */

function initializeBoard() {

    backgroundData.color =
        styleBackgroundColor.value;

    updateBackground();

    centerBoard();

    setTool("select");

    updateCamera();

}


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


    updateStyleControls();

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


    updateStyleControls();

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
    ].forEach(
        button => {

            button.classList.remove(
                "active"
            );

        }
    );


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
   SELECT BUTTON
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

        const center =
            getBoardCenter();


        createNote(
            center.x,
            center.y
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

                const center =
                    getBoardCenter();


                if (
                    currentImageType ===
                    "image"
                ) {

                    createImage(
                        event.target.result,
                        center.x,
                        center.y
                    );

                }


                if (
                    currentImageType ===
                    "sticker"
                ) {

                    createSticker(
                        event.target.result,
                        center.x,
                        center.y
                    );

                }

            };


        reader.readAsDataURL(file);

        imageInput.value =
            "";

    }
);


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
   PIXEL MENU
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
   PIXEL MODE
========================= */

pixelObject.addEventListener(
    "click",
    event => {

        event.stopPropagation();


        if (!selectedObject) {

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

            updateStyleControls();

        }


        closeContextMenu();

    }
);


/* =========================
   DUPLICATE
========================= */

duplicateObject.addEventListener(
    "click",
    event => {

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


        copy.classList.remove(
            "selected"
        );


        workspace.appendChild(copy);


        setupObject(copy);

        selectObject(copy);

        closeContextMenu();

    }
);


/* =========================
   LAYERS
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
            .forEach(
                object => {

                    highest =
                        Math.max(
                            highest,
                            parseInt(
                                object.style.zIndex ||
                                "0"
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
   CONTEXT MENU
========================= */

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


/* =========================
   EMPTY BOARD CLICK
========================= */

board.addEventListener(
    "mousedown",
    event => {

        if (
            event.target === board ||
            event.target === backgroundLayer
        ) {

            if (
                event.button === 0 &&
                !event.shiftKey
            ) {

                deselectObject();

            }

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
   STYLE WINDOW
========================= */

styleButton.addEventListener(
    "click",
    event => {

        event.stopPropagation();

        updateStyleControls();

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


/* =========================
   UI COLOR
========================= */

uiColor.addEventListener(
    "input",
    () => {

        document.documentElement.style
            .setProperty(
                "--ui-color",
                uiColor.value
            );


        const dark =
            darkenColor(
                uiColor.value,
                25
            );


        document.documentElement.style
            .setProperty(
                "--ui-dark",
                dark
            );

    }
);


/* =========================
   BACKGROUND COLOR
========================= */

styleBackgroundColor.addEventListener(
    "input",
    () => {

        backgroundData.color =
            styleBackgroundColor.value;

        updateBackground();

    }
);


/* =========================
   BACKGROUND IMAGE
========================= */

backgroundImageButton.addEventListener(
    "click",
    () => {

        backgroundInput.click();

    }
);


backgroundInput.addEventListener(
    "change",
    () => {

        const file =
            backgroundInput.files[0];


        if (!file) {

            return;

        }


        const reader =
            new FileReader();


        reader.onload =
            event => {

                backgroundData.image =
                    event.target.result;

                updateBackground();

            };


        reader.readAsDataURL(file);

        backgroundInput.value =
            "";

    }
);


/* =========================
   REMOVE BACKGROUND
========================= */

removeBackgroundButton.addEventListener(
    "click",
    () => {

        backgroundData.image =
            "";

        updateBackground();

    }
);


/* =========================
   BACKGROUND SCALE
========================= */

backgroundScale.addEventListener(
    "change",
    () => {

        backgroundData.scale =
            backgroundScale.value;

        updateBackground();

    }
);


/* =========================
   BACKGROUND REPEAT
========================= */

backgroundRepeat.addEventListener(
    "change",
    () => {

        backgroundData.repeat =
            backgroundRepeat.value;

        updateBackground();

    }
);


/* =========================
   BACKGROUND POSITION
========================= */

backgroundPosition.addEventListener(
    "change",
    () => {

        backgroundData.position =
            backgroundPosition.value;

        updateBackground();

    }
);


/* =========================
   UPDATE BACKGROUND
========================= */

function updateBackground() {

    backgroundLayer.style.backgroundColor =
        backgroundData.color;


    if (backgroundData.image) {

        backgroundLayer.style.backgroundImage =
            `url("${backgroundData.image}")`;

    } else {

        backgroundLayer.style.backgroundImage =
            "none";

    }


    backgroundLayer.style.backgroundSize =
        backgroundData.scale;


    backgroundLayer.style.backgroundRepeat =
        backgroundData.repeat;


    backgroundLayer.style.backgroundPosition =
        backgroundData.position;

}


/* =========================
   SELECTED OBJECT STYLE
========================= */

function updateStyleControls() {

    if (
        !selectedObject ||
        (
            !selectedObject.classList.contains(
                "note"
            ) &&
            !selectedObject.classList.contains(
                "image-object"
            )
        )
    ) {

        noSelectionMessage.style.display =
            "block";

        objectStyleControls.style.display =
            "none";

        return;

    }


    noSelectionMessage.style.display =
        "none";

    objectStyleControls.style.display =
        "block";


    const styles =
        getComputedStyle(
            selectedObject
        );


    objectFont.value =
        selectedObject.style
            .getPropertyValue(
                "--object-font"
            ) ||
        "Tahoma";


    objectFontSize.value =
        parseInt(
            selectedObject.style
                .getPropertyValue(
                    "--object-font-size"
                ) ||
                "14"
        );


    objectTextColor.value =
        rgbToHex(
            styles.color
        );


    objectHeaderColor.value =
        rgbToHex(
            selectedObject.style
                .getPropertyValue(
                    "--object-header"
                ) ||
                "#316ac5"
        );


    objectBackgroundColor.value =
        rgbToHex(
            selectedObject.style
                .getPropertyValue(
                    "--object-bg"
                ) ||
                "#fffff0"
        );


    objectBorderColor.value =
        rgbToHex(
            selectedObject.style
                .getPropertyValue(
                    "--object-border"
                ) ||
                "#6b7c8c"
        );

}


/* =========================
   OBJECT FONT
========================= */

objectFont.addEventListener(
    "change",
    () => {

        if (!selectedObject) {

            return;

        }


        selectedObject.style
            .setProperty(
                "--object-font",
                objectFont.value
            );

        applyFontToObject();

    }
);


/* =========================
   OBJECT FONT SIZE
========================= */

objectFontSize.addEventListener(
    "input",
    () => {

        if (!selectedObject) {

            return;

        }


        const size =
            Math.max(
                8,
                Math.min(
                    72,
                    parseInt(
                        objectFontSize.value ||
                        "14"
                    )
                )
            );


        selectedObject.style
            .setProperty(
                "--object-font-size",
                size + "px"
            );


        applyFontToObject();

    }
);


/* =========================
   OBJECT TEXT COLOR
========================= */

objectTextColor.addEventListener(
    "input",
    () => {

        if (!selectedObject) {

            return;

        }


        selectedObject.style
            .setProperty(
                "--object-text",
                objectTextColor.value
            );

    }
);


/* =========================
   OBJECT HEADER COLOR
========================= */

objectHeaderColor.addEventListener(
    "input",
    () => {

        if (!selectedObject) {

            return;

        }


        selectedObject.style
            .setProperty(
                "--object-header",
                objectHeaderColor.value
            );

    }
);


/* =========================
   OBJECT BACKGROUND COLOR
========================= */

objectBackgroundColor.addEventListener(
    "input",
    () => {

        if (!selectedObject) {

            return;

        }


        selectedObject.style
            .setProperty(
                "--object-bg",
                objectBackgroundColor.value
            );

    }
);


/* =========================
   OBJECT BORDER COLOR
========================= */

objectBorderColor.addEventListener(
    "input",
    () => {

        if (!selectedObject) {

            return;

        }


        selectedObject.style
            .setProperty(
                "--object-border",
                objectBorderColor.value
            );

    }
);


/* =========================
   APPLY FONT
========================= */

function applyFontToObject() {

    if (!selectedObject) {

        return;

    }


    const font =
        objectFont.value;


    const size =
        objectFontSize.value +
        "px";


    const title =
        selectedObject.querySelector(
            ".note-title, .image-title"
        );


    const content =
        selectedObject.querySelector(
            ".note-content"
        );


    if (title) {

        title.style.fontFamily =
            font;

        title.style.fontSize =
            size;

    }


    if (content) {

        content.style.fontFamily =
            font;

        content.style.fontSize =
            size;

    }

}


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


        deselectObject();


        objectNumber =
            1;


        boardName =
            "Untitled Board";


        currentFileHandle =
            null;


        backgroundData = {

            color:
                "#ffffff",

            image:
                "",

            scale:
                "cover",

            repeat:
                "no-repeat",

            position:
                "center"

        };


        styleBackgroundColor.value =
            "#ffffff";


        updateBackground();

        centerBoard();

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
   LOAD BUTTON
========================= */

loadButton.addEventListener(
    "click",
    () => {

        boardInput.click();

    }
);


/* =========================
   LOAD FILE
========================= */

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
                        ),

                    styles: {

                        font:
                            object.style
                                .getPropertyValue(
                                    "--object-font"
                                ),

                        fontSize:
                            object.style
                                .getPropertyValue(
                                    "--object-font-size"
                                ),

                        text:
                            object.style
                                .getPropertyValue(
                                    "--object-text"
                                ),

                        header:
                            object.style
                                .getPropertyValue(
                                    "--object-header"
                                ),

                        background:
                            object.style
                                .getPropertyValue(
                                    "--object-bg"
                                ),

                        border:
                            object.style
                                .getPropertyValue(
                                    "--object-border"
                                )

                    }

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
            8,

        name:
            boardName,

        background:
            backgroundData,

        penColor:
            penColor.value,

        uiColor:
            uiColor.value,

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


    deselectObject();


    objectNumber =
        1;


    boardName =
        data.name ||
        "Untitled Board";


    /* =====================
       UI COLOR
    ===================== */

    if (data.uiColor) {

        uiColor.value =
            data.uiColor;

        uiColor.dispatchEvent(
            new Event("input")
        );

    }


    /* =====================
       BACKGROUND
    ===================== */

    if (
        data.background &&
        typeof data.background ===
        "object"
    ) {

        backgroundData = {

            color:
                data.background.color ||
                "#ffffff",

            image:
                data.background.image ||
                "",

            scale:
                data.background.scale ||
                "cover",

            repeat:
                data.background.repeat ||
                "no-repeat",

            position:
                data.background.position ||
                "center"

        };

    }


    /*
       Older boards may have stored
       background as a simple color.
    */

    else if (
        typeof data.background ===
        "string"
    ) {

        backgroundData = {

            color:
                data.background,

            image:
                "",

            scale:
                "cover",

            repeat:
                "no-repeat",

            position:
                "center"

        };

    }


    styleBackgroundColor.value =
        backgroundData.color;


    backgroundScale.value =
        backgroundData.scale;


    backgroundRepeat.value =
        backgroundData.repeat;


    backgroundPosition.value =
        backgroundData.position;


    updateBackground();


    /* =====================
       PEN COLOR
    ===================== */

    if (data.penColor) {

        penColor.value =
            data.penColor;

    }


    /* =====================
       OBJECTS
    ===================== */

    if (
        Array.isArray(
            data.objects
        )
    ) {

        data.objects.forEach(
            object => {

                let created =
                    null;


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

                    created =
                        selectedObject;

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

                    created =
                        selectedObject;

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

                    created =
                        selectedObject;

                }


                if (created) {

                    created.style.zIndex =
                        object.zIndex ||
                        0;


                    if (
                        object.styles
                    ) {

                        applySavedStyles(
                            created,
                            object.styles
                        );

                    }


                    created.classList.remove(
                        "selected"
                    );

                    selectedObject =
                        null;

                }

            }
        );

    }


    /* =====================
       DRAWING
    ===================== */

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


    updateStyleControls();

    centerBoard();

}


/* =========================
   SAVED STYLES
========================= */

function applySavedStyles(
    object,
    styles
) {

    if (
        styles.font
    ) {

        object.style.setProperty(
            "--object-font",
            styles.font
        );

    }


    if (
        styles.fontSize
    ) {

        object.style.setProperty(
            "--object-font-size",
            styles.fontSize
        );

    }


    if (
        styles.text
    ) {

        object.style.setProperty(
            "--object-text",
            styles.text
        );

    }


    if (
        styles.header
    ) {

        object.style.setProperty(
            "--object-header",
            styles.header
        );

    }


    if (
        styles.background
    ) {

        object.style.setProperty(
            "--object-bg",
            styles.background
        );

    }


    if (
        styles.border
    ) {

        object.style.setProperty(
            "--object-border",
            styles.border
        );

    }


    const title =
        object.querySelector(
            ".note-title, .image-title"
        );


    const content =
        object.querySelector(
            ".note-content"
        );


    if (
        styles.font
    ) {

        if (title) {

            title.style.fontFamily =
                styles.font;

        }

        if (content) {

            content.style.fontFamily =
                styles.font;

        }

    }


    if (
        styles.fontSize
    ) {

        if (title) {

            title.style.fontSize =
                styles.fontSize;

        }

        if (content) {

            content.style.fontSize =
                styles.fontSize;

        }

    }

}


/* =========================
   KEYBOARD
========================= */

document.addEventListener(
    "keydown",
    event => {

        const key =
            event.key.toLowerCase();


        /* =====================
           SAVE
        ===================== */

        if (
            event.ctrlKey &&
            key === "s"
        ) {

            event.preventDefault();

            saveBoard();

            return;

        }


        /* =====================
           LOAD
        ===================== */

        if (
            event.ctrlKey &&
            key === "o"
        ) {

            event.preventDefault();

            loadButton.click();

            return;

        }


        /* =====================
           ESCAPE
        ===================== */

        if (
            event.key ===
            "Escape"
        ) {

            setTool("select");

            helpWindow.style.display =
                "none";

            styleWindow.style.display =
                "none";

            closeContextMenu();

            return;

        }


        /* =====================
           DELETE
        ===================== */

        if (
            event.key ===
            "Delete" &&
            selectedObject &&
            drawingMode ===
            "select" &&
            !isTyping()
        ) {

            selectedObject.remove();

            selectedObject =
                null;

            updateStyleControls();

            return;

        }


        /* =====================
           WASD / ARROWS
        ===================== */

        if (
            drawingMode !==
            "select"
        ) {

            return;

        }


        if (
            isTyping()
        ) {

            return;

        }


        let moveX =
            0;

        let moveY =
            0;


        if (
            key === "w" ||
            event.key === "ArrowUp"
        ) {

            moveY =
                cameraSpeed;

        }


        if (
            key === "s" ||
            event.key === "ArrowDown"
        ) {

            moveY =
                -cameraSpeed;

        }


        if (
            key === "a" ||
            event.key === "ArrowLeft"
        ) {

            moveX =
                cameraSpeed;

        }


        if (
            key === "d" ||
            event.key === "ArrowRight"
        ) {

            moveX =
                -cameraSpeed;

        }


        if (
            moveX !== 0 ||
            moveY !== 0
        ) {

            event.preventDefault();


            const speed =
                event.shiftKey
                    ? 3
                    : 1;


            cameraX +=
                moveX *
                speed;


            cameraY +=
                moveY *
                speed;


            updateCamera();

        }

    }
);


/* =========================
   TYPING CHECK
========================= */

function isTyping() {

    const active =
        document.activeElement;


    if (!active) {

        return false;

    }


    return (
        active.isContentEditable ||
        active.tagName === "INPUT" ||
        active.tagName === "TEXTAREA" ||
        active.tagName === "SELECT"
    );

}


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
            Math.max(
                0.3,
                Math.min(
                    3,
                    zoom
                )
            );


        /*
           Keep the point under the mouse
           in roughly the same place while zooming.
        */

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
            ) / oldZoom;


        const worldY =
            (
                mouseY -
                cameraY
            ) / oldZoom;


        cameraX =
            mouseX -
            worldX *
            zoom;


        cameraY =
            mouseY -
            worldY *
            zoom;


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


    document.getElementById(
        "zoomDisplay"
    ).textContent =
        Math.round(
            zoom * 100
        ) + "%";

}


/* =========================
   CENTER BOARD
========================= */

function centerBoard() {

    const rect =
        board.getBoundingClientRect();


    const boardWidth =
        10000 * zoom;


    const boardHeight =
        10000 * zoom;


    cameraX =
        (
            rect.width -
            boardWidth
        ) / 2;


    cameraY =
        (
            rect.height -
            boardHeight
        ) / 2;


    updateCamera();

}


/* =========================
   BOARD CENTER
========================= */

function getBoardCenter() {

    const rect =
        board.getBoundingClientRect();


    return {

        x:
            (
                rect.width / 2 -
                cameraX
            ) / zoom,

        y:
            (
                rect.height / 2 -
                cameraY
            ) / zoom

    };

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
   RGB -> HEX
========================= */

function rgbToHex(color) {

    if (
        !color ||
        color.startsWith("#")
    ) {

        return color ||
            "#000000";

    }


    const result =
        color.match(
            /\d+/g
        );


    if (
        !result ||
        result.length < 3
    ) {

        return "#000000";

    }


    return "#" +
        result
            .slice(0, 3)
            .map(
                number =>
                    parseInt(
                        number
                    )
                        .toString(16)
                        .padStart(
                            2,
                            "0"
                        )
            )
            .join("");

}


/* =========================
   DARKEN COLOR
========================= */

function darkenColor(
    hex,
    amount
) {

    const value =
        hex.replace(
            "#",
            ""
        );


    const number =
        parseInt(
            value,
            16
        );


    let r =
        (number >> 16) -
        amount;


    let g =
        ((number >> 8) & 255) -
        amount;


    let b =
        (number & 255) -
        amount;


    r =
        Math.max(
            0,
            r
        );


    g =
        Math.max(
            0,
            g
        );


    b =
        Math.max(
            0,
            b
        );


    return "#" +
        (
            (r << 16) |
            (g << 8) |
            b
        )
            .toString(16)
            .padStart(
                6,
                "0"
            );

}


/* =========================
   START
========================= */

initializeBoard();
