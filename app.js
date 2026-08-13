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



/* =========================
   BUTTONS
========================= */

const selectButton =
    document.getElementById(
        "selectButton"
    );

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

const pageButton =
    document.getElementById(
        "pageButton"
    );

const newButton =
    document.getElementById(
        "newButton"
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



/* =========================
   COLOR
========================= */

const penColor =
    document.getElementById(
        "penColor"
    );

const backgroundColor =
    document.getElementById(
        "backgroundColor"
    );



/* =========================
   INPUTS
========================= */

const imageInput =
    document.getElementById(
        "imageInput"
    );

const boardInput =
    document.getElementById(
        "boardInput"
    );



/* =========================
   MENUS
========================= */

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



/* =========================
   PAGE DIALOG
========================= */

const pageDialog =
    document.getElementById(
        "pageDialog"
    );

const pageTextOption =
    document.getElementById(
        "pageTextOption"
    );

const pageImageOption =
    document.getElementById(
        "pageImageOption"
    );

const pageCancelOption =
    document.getElementById(
        "pageCancelOption"
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



/* =========================
   CAMERA
========================= */

let cameraX =
    0;

let cameraY =
    0;

let zoom =
    1;



/* =========================
   DRAWING
========================= */

let drawingMode =
    "select";

let drawing =
    false;



drawingCanvas.width =
    10000;

drawingCanvas.height =
    10000;



/* =========================
   PAGE DATA
========================= */

let pageCounter =
    1;



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
   TOOL MODE
========================= */

function setTool(
    tool
) {

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
    function() {

        setTool(
            "select"
        );

    }
);



/* =========================
   DRAW BUTTON
========================= */

drawButton.addEventListener(
    "click",
    function() {

        setTool(
            "draw"
        );

    }
);



/* =========================
   ERASER BUTTON
========================= */

eraserButton.addEventListener(
    "click",
    function() {

        setTool(
            "erase"
        );

    }
);



/* =========================
   PEN COLOR
========================= */

penColor.addEventListener(
    "input",
    function() {

        drawingContext.strokeStyle =
            penColor.value;

    }
);



/* =========================
   BACKGROUND COLOR
========================= */

backgroundColor.addEventListener(
    "input",
    function() {

        workspace.style.backgroundColor =
            backgroundColor.value;

        board.style.backgroundColor =
            backgroundColor.value;

    }
);



/* =========================
   DRAWING
========================= */

drawingCanvas.addEventListener(
    "mousedown",
    function(event) {

        if (
            drawingMode !== "draw" &&
            drawingMode !== "erase"
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
            drawingMode === "erase"
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

        drawing =
            false;

    }
);



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


        <div class="resize-handle"></div>

    `;


    workspace.appendChild(
        note
    );


    objectNumber++;


    setupObject(
        note
    );

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

    const object =
        document.createElement(
            "div"
        );


    object.className =
        "image-object board-object";


    object.style.left =
        x + "px";


    object.style.top =
        y + "px";


    object.style.width =
        width + "px";


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

    const object =
        document.createElement(
            "div"
        );


    object.className =
        "sticker board-object";


    object.style.left =
        x + "px";


    object.style.top =
        y + "px";


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

}



/* =========================
   CREATE PAGE
========================= */

function createPage(
    type,
    x,
    y,
    title = null,
    imageData = null
) {

    const page =
        document.createElement(
            "div"
        );


    page.className =
        "page-object board-object";


    page.dataset.pageId =
        "page-" +
        Date.now() +
        "-" +
        pageCounter;


    page.dataset.pageName =
        title ||
        "New Page";


    page.style.left =
        x + "px";


    page.style.top =
        y + "px";


    if (type === "text") {

        page.innerHTML = `

            <div class="page-text">

                ${escapeHTML(
                    title ||
                    "New Page"
                )}

            </div>

            <div class="resize-handle"></div>

        `;

    }

    else {

        page.innerHTML = `

            <div class="page-image">

                <img
                    src="${imageData}"
                >

            </div>

            <div class="resize-handle"></div>

        `;

    }


    workspace.appendChild(
        page
    );


    pageCounter++;


    setupObject(
        page
    );


    /*
       Double click a page
       to open it.
    */

    page.addEventListener(
        "dblclick",
        function(event) {

            if (
                event.target.classList.contains(
                    "resize-handle"
                )
            ) {

                return;

            }


            openPage(
                page
            );

        }
    );

}



/* =========================
   PAGE BUTTON
========================= */

pageButton.addEventListener(
    "click",
    function() {

        pageDialog.style.display =
            "flex";

    }
);



/* =========================
   PAGE TEXT
========================= */

pageTextOption.addEventListener(
    "click",
    function() {

        pageDialog.style.display =
            "none";


        const title =
            prompt(
                "Name this page:"
            );


        if (!title) {

            return;

        }


        createPage(

            "text",

            200 -
                cameraX / zoom,

            150 -
                cameraY / zoom,

            title

        );

    }
);



/* =========================
   PAGE IMAGE
========================= */

pageImageOption.addEventListener(
    "click",
    function() {

        pageDialog.style.display =
            "none";


        currentImageType =
            "page";


        imageInput.click();

    }
);



/* =========================
   PAGE CANCEL
========================= */

pageCancelOption.addEventListener(
    "click",
    function() {

        pageDialog.style.display =
            "none";

    }
);



/* =========================
   IMAGE BUTTON
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
   IMAGE LOADING
========================= */

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


                else if (
                    currentImageType ===
                    "sticker"
                ) {

                    createSticker(
                        event.target.result,
                        x,
                        y
                    );

                }


                else if (
                    currentImageType ===
                    "page"
                ) {

                    const title =
                        prompt(
                            "Name this page:"
                        );


                    if (!title) {

                        return;

                    }


                    createPage(

                        "image",

                        x,
                        y,

                        title,

                        event.target.result

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



/* =========================
   OBJECT SETUP
========================= */

function setupObject(
    object
) {

    object.addEventListener(
        "mousedown",
        function() {

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
        function(event) {

            event.preventDefault();


            selectObject(
                object
            );


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



/* =========================
   EDITING
========================= */

function setupEditing(
    object
) {

    const title =
        object.querySelector(
            ".note-title, .image-title, .page-text"
        );


    const content =
        object.querySelector(
            ".note-content"
        );


    if (title) {

        title.addEventListener(
            "dblclick",
            function(event) {

                if (
                    object.classList.contains(
                        "page-object"
                    )
                ) {

                    event.stopPropagation();

                    const newName =
                        prompt(
                            "Rename page:",
                            title.textContent
                        );


                    if (newName) {

                        title.textContent =
                            newName;

                        object.dataset.pageName =
                            newName;

                    }


                    return;

                }


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
   DRAGGING
========================= */

function setupDragging(
    object
) {

    let handle =
        object.querySelector(
            ".note-title, .image-title, .page-text"
        );


    if (!handle) {

        handle =
            object;

    }


    handle.addEventListener(
        "mousedown",
        function(event) {

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


                if (
                    newWidth < 80
                ) {

                    newWidth =
                        80;

                }


                if (
                    newWidth > 1000
                ) {

                    newWidth =
                        1000;

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
   PLACE CURSOR
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
   RIGHT CLICK DELETE
========================= */

deleteObject.addEventListener(
    "click",
    function(event) {

        event.stopPropagation();


        if (
            selectedObject
        ) {

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


        if (
            !selectedObject
        ) {

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



document.addEventListener(
    "click",
    function() {

        contextMenu.style.display =
            "none";

    }
);



/* =========================
   NEW BOARD
========================= */

newButton.addEventListener(
    "click",
    function() {

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


        pageCounter =
            1;


        boardName =
            "Untitled Board";


        currentFileHandle =
            null;

    }
);



/* =========================
   GET BOARD DATA
========================= */

function getBoardData() {

    const objects =
        [];


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
                        ".note-title, .image-title, .page-text"
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
                        "page-object"
                    )
                ) {

                    data.pageName =
                        object.dataset.pageName;

                }


                objects.push(
                    data
                );

            }
        );


    return {

        version: 3,

        name:
            boardName,

        background:
            backgroundColor.value,

        penColor:
            penColor.value,

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


    if (
        object.classList.contains(
            "page-object"
        )
    ) {

        if (
            object.querySelector(
                ".page-image"
            )
        ) {

            return "page-image";

        }


        return "page-text";

    }

}



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


    /*
       Modern Chrome / Edge
       file picker.
    */

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


    /*
       Fallback for browsers
       without the picker.
    */

    downloadBoard();

}



/* =========================
   SAVE
========================= */

async function saveBoard() {

    /*
       If a file has already
       been selected, write
       directly to it.
    */

    if (
        currentFileHandle
    ) {

        try {

            await writeToFile(
                currentFileHandle
            );


            return;

        }

        catch (error) {

            console.log(
                error
            );

        }

    }


    /*
       No file yet.
       Use Save As.
    */

    await saveAsBoard();

}



/* =========================
   WRITE FILE
========================= */

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


    /*
       Ask for permission
       if needed.
    */

    if (
        handle.queryPermission
    ) {

        const permission =
            await handle.queryPermission({
                mode: "readwrite"
            });


        if (
            permission !==
            "granted"
        ) {

            const request =
                await handle.requestPermission({
                    mode: "readwrite"
                });


            if (
                request !==
                "granted"
            ) {

                return;

            }

        }

    }


    const writable =
        await handle.createWritable();


    await writable.write(
        json
    );


    await writable.close();

}



/* =========================
   FALLBACK DOWNLOAD
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
    async function() {

        /*
           Modern browser picker.
        */

        if (
            window.showOpenFilePicker
        ) {

            try {

                const handles =
                    await window.showOpenFilePicker({

                        multiple:
                            false,

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


                const handle =
                    handles[0];


                currentFileHandle =
                    handle;


                const file =
                    await handle.getFile();


                const text =
                    await file.text();


                const data =
                    JSON.parse(
                        text
                    );


                loadBoard(
                    data
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


        /*
           Browser fallback.
        */

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


                    currentFileHandle =
                        null;


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
   LOAD BOARD
========================= */

function loadBoard(
    data
) {

    workspace.innerHTML =
        "";


    selectedObject =
        null;


    boardName =
        data.name ||
        "Untitled Board";


    if (
        data.background
    ) {

        backgroundColor.value =
            data.background;


        workspace.style.backgroundColor =
            data.background;


        board.style.backgroundColor =
            data.background;

    }


    if (
        data.penColor
    ) {

        penColor.value =
            data.penColor;

    }


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


            else if (
                object.type ===
                "page-text"
            ) {

                createPage(
                    "text",
                    object.x,
                    object.y,
                    object.pageName ||
                    object.title
                );

            }


            else if (
                object.type ===
                "page-image"
            ) {

                createPage(
                    "image",
                    object.x,
                    object.y,
                    object.pageName ||
                    object.title,
                    object.image
                );

            }

        }
    );


    /*
       Restore drawing.
    */

    if (
        data.drawing
    ) {

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
   PAGE OPEN
========================= */

function openPage(
    page
) {

    /*
       For now we create
       a separate board name
       for the page.

       This gives us the
       foundation for the
       multi-page system.
    */

    const name =
        page.dataset.pageName ||
        "New Page";


    const existing =
        localStorage.getItem(
            "pickdel-page-" +
            name
        );


    if (existing) {

        try {

            loadBoard(
                JSON.parse(
                    existing
                )
            );


            boardName =
                name;


            return;

        }

        catch {

            console.log(
                "Page could not be loaded."
            );

        }

    }


    /*
       New page.
    */

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


    boardName =
        name;


    alert(
        "Opened page: " +
        name
    );

}



/* =========================
   KEYBOARD
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

            loadButton.click();

        }


        if (
            event.key === "Escape"
        ) {

            setTool(
                "select"
            );

            pageDialog.style.display =
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
    function(event) {

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
    function(event) {

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

        }

        else {

            zoom -=
                0.1;

        }


        if (
            zoom < 0.3
        ) {

            zoom =
                0.3;

        }


        if (
            zoom > 3
        ) {

            zoom =
                3;

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


    document.getElementById(
        "zoomDisplay"
    ).textContent =
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

setTool(
    "select"
);


updateCamera();
