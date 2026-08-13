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

const pageButton =
    document.getElementById("pageButton");

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

const folderButton =
    document.getElementById("folderButton");

const loadButton =
    document.getElementById("loadButton");

const backButton =
    document.getElementById("backButton");



/* =========================
   INPUTS
========================= */

const imageInput =
    document.getElementById("imageInput");

const boardInput =
    document.getElementById("boardInput");

const penColor =
    document.getElementById("penColor");

const penSize =
    document.getElementById("penSize");

const backgroundColor =
    document.getElementById(
        "backgroundColor"
    );



/* =========================
   CONTEXT MENU
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

const openPage =
    document.getElementById(
        "openPage"
    );



/* =========================
   VARIABLES
========================= */

let selectedObject = null;

let objectNumber = 1;

let boardName =
    "Untitled Board";

let currentImageType =
    "image";



/* =========================
   CAMERA
========================= */

let cameraX = 0;

let cameraY = 0;

let zoom = 1;

let panning = false;



/* =========================
   DRAWING
========================= */

let drawingMode = false;

let eraserMode = false;

let drawing = false;



drawingCanvas.width = 10000;

drawingCanvas.height = 10000;



/* =========================
   PAGES
========================= */

let currentPage = null;

let pages = {};



/* =========================
   FOLDER
========================= */

let saveDirectory = null;

let currentFileHandle = null;



/* =========================
   BACKGROUND
========================= */

function changeBackground(
    color
) {

    workspace.style.backgroundColor =
        color;
}


backgroundColor.addEventListener(
    "input",
    function() {

        changeBackground(
            backgroundColor.value
        );

    }
);



/* =========================
   DRAWING MODE
========================= */

function setTool(
    tool
) {

    drawingMode =
        tool === "draw";

    eraserMode =
        tool === "eraser";


    if (
        drawingMode ||
        eraserMode
    ) {

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
   SELECT
========================= */

selectButton.addEventListener(
    "click",
    function() {

        setTool("select");

    }
);



drawButton.addEventListener(
    "click",
    function() {

        setTool("draw");

    }
);



eraserButton.addEventListener(
    "click",
    function() {

        setTool("eraser");

    }
);



/* =========================
   DRAWING
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


        const p =
            getCanvasPosition(
                event
            );


        drawingContext.beginPath();

        drawingContext.moveTo(
            p.x,
            p.y
        );


        drawingContext.lineWidth =
            Number(
                penSize.value
            );


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


        const p =
            getCanvasPosition(
                event
            );


        drawingContext.lineTo(
            p.x,
            p.y
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


    if (object) {

        object.classList.add(
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

            ${escapeHTML(content)}

        </div>

        <div class="resize-handle"></div>

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


    setupObject(object);

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


    setupObject(object);

}



/* =========================
   CREATE PAGE
========================= */

function createPage(
    x,
    y,
    type,
    value,
    title = null
) {

    const id =
        "page_" +
        Date.now() +
        "_" +
        Math.floor(
            Math.random() * 10000
        );


    pages[id] = {

        name:
            title ||
            "New Page",

        objects: [],

        drawing: null,

        background:
            "#ffffff"

    };


    const object =
        document.createElement(
            "div"
        );


    object.className =
        "page-object board-object";


    object.dataset.pageId =
        id;


    object.style.left =
        x + "px";

    object.style.top =
        y + "px";


    if (type === "text") {

        object.innerHTML = `

            <div class="page-text">

                ${escapeHTML(value)}

            </div>

            <div class="resize-handle"></div>

        `;

    }

    else {

        object.innerHTML = `

            <img
                class="page-image"
                src="${value}"
            >

            <div class="resize-handle"></div>

        `;

    }


    workspace.appendChild(
        object
    );


    setupObject(object);

}



/* =========================
   PAGE BUTTON
========================= */

pageButton.addEventListener(
    "click",
    function() {

        const type =
            prompt(
                "PAGE BUTTON\n\nType TEXT or IMAGE:"
            );


        if (!type) {
            return;
        }


        if (
            type.toLowerCase() ===
            "text"
        ) {

            const value =
                prompt(
                    "What should the page button say?"
                );


            if (!value) {
                return;
            }


            createPage(
                200 - cameraX / zoom,
                150 - cameraY / zoom,
                "text",
                value,
                value
            );

        }

        else if (
            type.toLowerCase() ===
            "image"
        ) {

            currentImageType =
                "page";


            imageInput.click();

        }

        else {

            alert(
                "Please type TEXT or IMAGE."
            );

        }

    }
);



/* =========================
   IMAGE PICKER
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

                    createPage(
                        x,
                        y,
                        "image",
                        event.target.result,
                        "Image Page"
                    );

                }

            };


        reader.readAsDataURL(file);


        imageInput.value = "";

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


    setupEditing(object);

    setupDragging(object);

    setupResizing(object);

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
                    originalX +
                    dx +
                    "px";


                object.style.top =
                    originalY +
                    dy +
                    "px";

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


            selectObject(object);


            const startX =
                event.clientX;


            const startWidth =
                object.offsetWidth;


            function resize(event) {

                let width =
                    startWidth +
                    (
                        event.clientX -
                        startX
                    ) / zoom;


                if (width < 80) {
                    width = 80;
                }


                if (width > 1000) {
                    width = 1000;
                }


                if (
                    object.classList.contains(
                        "sticker"
                    )
                ) {

                    object.querySelector(
                        "img"
                    ).style.width =
                        width + "px";

                }

                else {

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



/* =========================
   OPEN PAGE
========================= */

function openPageObject(
    object
) {

    const id =
        object.dataset.pageId;


    if (!id || !pages[id]) {
        return;
    }


    saveCurrentPage();


    currentPage =
        id;


    workspace.innerHTML = "";


    drawingContext.clearRect(
        0,
        0,
        drawingCanvas.width,
        drawingCanvas.height
    );


    const page =
        pages[id];


    boardName =
        page.name;


    backgroundColor.value =
        page.background ||
        "#ffffff";


    changeBackground(
        backgroundColor.value
    );


    loadObjects(
        page.objects
    );


    if (page.drawing) {

        const image =
            new Image();


        image.onload =
            function() {

                drawingContext.drawImage(
                    image,
                    0,
                    0
                );

            };


        image.src =
            page.drawing;

    }


    backButton.style.display =
        "block";

}



/* =========================
   PAGE CONTEXT MENU
========================= */

openPage.addEventListener(
    "click",
    function() {

        if (
            selectedObject &&
            selectedObject.dataset.pageId
        ) {

            openPageObject(
                selectedObject
            );

        }

    }
);



/* =========================
   BACK
========================= */

backButton.addEventListener(
    "click",
    function() {

        saveCurrentPage();


        if (!currentPage) {
            return;
        }


        currentPage = null;


        workspace.innerHTML = "";


        drawingContext.clearRect(
            0,
            0,
            drawingCanvas.width,
            drawingCanvas.height
        );


        boardName =
            "Main Board";


        backgroundColor.value =
            "#ffffff";


        changeBackground(
            "#ffffff"
        );


        loadMainBoard();


        backButton.style.display =
            "none";

    }
);



/* =========================
   SAVE CURRENT PAGE
========================= */

function saveCurrentPage() {

    if (!currentPage) {
        return;
    }


    pages[currentPage].objects =
        getObjects();


    pages[currentPage].drawing =
        drawingCanvas.toDataURL();


    pages[currentPage].background =
        backgroundColor.value;

}



/* =========================
   GET OBJECTS
========================= */

function getObjects() {

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


                if (
                    object.dataset.pageId
                ) {

                    data.pageId =
                        object.dataset.pageId;

                }


                if (
                    object.classList.contains(
                        "page-object"
                    )
                ) {

                    data.pageType =
                        object.querySelector(
                            ".page-text"
                        )
                            ? "text"
                            : "image";

                }


                objects.push(
                    data
                );

            }
        );


    return objects;

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

        return "page";

    }

}



/* =========================
   LOAD OBJECTS
========================= */

function loadObjects(
    objects
) {

    if (!objects) {
        return;
    }


    objects.forEach(
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
                "page"
            ) {

                const page =
                    pages[
                        object.pageId
                    ];


                if (!page) {
                    return;
                }


                const pageObject =
                    document.createElement(
                        "div"
                    );


                pageObject.className =
                    "page-object board-object";


                pageObject.dataset.pageId =
                    object.pageId;


                pageObject.style.left =
                    object.x + "px";


                pageObject.style.top =
                    object.y + "px";


                if (
                    object.pageType ===
                    "image"
                ) {

                    pageObject.innerHTML = `

                        <img
                            class="page-image"
                            src="${object.image}"
                        >

                        <div
                            class="resize-handle"
                        ></div>

                    `;

                }

                else {

                    pageObject.innerHTML = `

                        <div class="page-text">

                            ${escapeHTML(
                                object.title
                            )}

                        </div>

                        <div
                            class="resize-handle"
                        ></div>

                    `;

                }


                workspace.appendChild(
                    pageObject
                );


                setupObject(
                    pageObject
                );

            }

        }
    );

}



/* =========================
   SAVE BOARD DATA
========================= */

function getBoardData() {

    saveCurrentPage();


    return {

        version: 3,

        name:
            boardName,

        objects:
            getObjects(),

        drawing:
            drawingCanvas.toDataURL(),

        background:
            backgroundColor.value,

        pages:
            pages

    };

}



/* =========================
   SAVE TO FOLDER
========================= */

async function saveToFolder() {

    const data =
        getBoardData();


    const json =
        JSON.stringify(
            data,
            null,
            2
        );


    /*
       Modern browsers can save
       directly into a selected
       folder.
    */

    if (
        saveDirectory &&
        currentFileHandle
    ) {

        const writable =
            await currentFileHandle.createWritable();


        await writable.write(
            json
        );


        await writable.close();


        return;

    }


    /*
       If no folder has been
       selected, ask for one.
    */

    if (
        window.showDirectoryPicker
    ) {

        saveDirectory =
            await window.showDirectoryPicker();


        await writeBoardFile(
            saveDirectory,
            json
        );

    }

    else {

        downloadBoard(
            json
        );

    }

}



/* =========================
   WRITE FILE
========================= */

async function writeBoardFile(
    directory,
    json
) {

    const fileName =
        boardName
            .replace(
                /[\\/:*?"<>|]/g,
                "_"
            ) +
        ".json";


    currentFileHandle =
        await directory.getFileHandle(
            fileName,
            {
                create: true
            }
        );


    const writable =
        await currentFileHandle.createWritable();


    await writable.write(
        json
    );


    await writable.close();


    alert(
        "Saved to your selected folder."
    );

}



/* =========================
   SAVE
========================= */

saveButton.addEventListener(
    "click",
    async function() {

        try {

            await saveToFolder();

        }

        catch (error) {

            console.log(error);

        }

    }
);



/* =========================
   SAVE AS
========================= */

saveAsButton.addEventListener(
    "click",
    async function() {

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


        currentFileHandle =
            null;


        try {

            await saveToFolder();

        }

        catch (error) {

            console.log(error);

        }

    }
);



/* =========================
   CHOOSE FOLDER
========================= */

folderButton.addEventListener(
    "click",
    async function() {

        if (
            !window.showDirectoryPicker
        ) {

            alert(
                "Your browser does not support folder saving. Chrome or Edge is recommended."
            );

            return;

        }


        try {

            saveDirectory =
                await window.showDirectoryPicker();


            currentFileHandle =
                null;


            alert(
                "Folder selected."
            );

        }

        catch (error) {

            console.log(error);

        }

    }
);



/* =========================
   DOWNLOAD FALLBACK
========================= */

function downloadBoard(
    json
) {

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
   LOAD FILE
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
   LOAD BOARD
========================= */

function loadBoard(
    data
) {

    workspace.innerHTML = "";


    drawingContext.clearRect(
        0,
        0,
        drawingCanvas.width,
        drawingCanvas.height
    );


    selectedObject =
        null;


    boardName =
        data.name ||
        "Untitled Board";


    pages =
        data.pages ||
        {};


    currentPage =
        null;


    backgroundColor.value =
        data.background ||
        "#ffffff";


    changeBackground(
        backgroundColor.value
    );


    loadObjects(
        data.objects
    );


    if (data.drawing) {

        const image =
            new Image();


        image.onload =
            function() {

                drawingContext.drawImage(
                    image,
                    0,
                    0
                );

            };


        image.src =
            data.drawing;

    }


    backButton.style.display =
        "none";

}



/* =========================
   NEW BOARD
========================= */

newButton.addEventListener(
    "click",
    function() {

        if (
            !confirm(
                "Start a new board? Unsaved changes will be lost."
            )
        ) {

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


        pages = {};


        currentPage =
            null;


        objectNumber =
            1;


        boardName =
            "Untitled Board";


        backgroundColor.value =
            "#ffffff";


        changeBackground(
            "#ffffff"
        );


        backButton.style.display =
            "none";

    }
);



/* =========================
   RIGHT CLICK
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


    if (
        selectedObject &&
        selectedObject.dataset.pageId
    ) {

        openPage.style.display =
            "block";

    }

    else {

        openPage.style.display =
            "none";

    }

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
            selectedObject.offsetLeft +
            30 +
            "px";


        copy.style.top =
            selectedObject.offsetTop +
            30 +
            "px";


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
   PAN
========================= */

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


            const startX =
                event.clientX;

            const startY =
                event.clientY;


            const startCameraX =
                cameraX;

            const startCameraY =
                cameraY;


            function move(event) {

                cameraX =
                    startCameraX +
                    event.clientX -
                    startX;


                cameraY =
                    startCameraY +
                    event.clientY -
                    startY;


                updateCamera();

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


                panning = false;

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


    document.getElementById(
        "zoomDisplay"
    ).textContent =
        Math.round(
            zoom * 100
        ) + "%";

}



/* =========================
   MAIN BOARD
========================= */

function loadMainBoard() {

    const data = {

        objects: [],

        drawing: null,

        background:
            "#ffffff"

    };


    loadObjects(
        data.objects
    );

}



/* =========================
   HTML ESCAPE
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

setTool("select");

updateCamera();

changeBackground(
    "#ffffff"
);
