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

const saveButton =
    document.getElementById("saveButton");

const loadButton =
    document.getElementById("loadButton");

const boardInput =
    document.getElementById("boardInput");


const contextMenu =
    document.getElementById("contextMenu");

const deleteObject =
    document.getElementById("deleteObject");

const duplicateObject =
    document.getElementById("duplicateObject");


const zoomDisplay =
    document.getElementById("zoomDisplay");



/* =========================
   VARIABLES
========================= */

let objectNumber = 1;

let selectedObject = null;

let currentImageType = "image";


let cameraX = 0;

let cameraY = 0;

let zoom = 1;


let panning = false;

let panStartX = 0;

let panStartY = 0;

let cameraStartX = 0;

let cameraStartY = 0;



/* =========================
   SELECTION
========================= */

function selectObject(object) {

    if (selectedObject) {

        selectedObject.classList.remove(
            "selected"
        );

    }


    selectedObject = object;


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
        document.createElement("div");


    note.className =
        "note board-object";


    note.style.left =
        x + "px";


    note.style.top =
        y + "px";


    note.innerHTML = `

        <div
            class="note-title"
        >
            ${escapeHTML(
                title ||
                "Note " +
                objectNumber
            )}
        </div>

        <div
            class="note-content"
        >
            ${escapeHTML(content)}
        </div>

        <div
            class="resize-handle"
        ></div>

    `;


    workspace.appendChild(note);


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
        document.createElement("div");


    imageObject.className =
        "image-object board-object";


    imageObject.style.left =
        x + "px";


    imageObject.style.top =
        y + "px";


    imageObject.style.width =
        width + "px";


    imageObject.innerHTML = `

        <div
            class="image-title"
        >
            ${escapeHTML(
                title ||
                "Image " +
                objectNumber
            )}
        </div>

        <div class="image-content">

            <img
                src="${imageData}"
            >

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
        document.createElement("div");


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


    setupObject(sticker);

}



/* =========================
   OBJECT SETUP
========================= */

function setupObject(object) {


    object.addEventListener(
        "mousedown",
        function(event) {

            selectObject(object);

        }
    );


    object.addEventListener(
        "contextmenu",
        function(event) {

            event.preventDefault();

            selectObject(object);

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
            function(event) {

                event.stopPropagation();

                title.contentEditable =
                    "true";

                title.classList.add(
                    "editing"
                );

                title.focus();

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

function setupDragging(object) {

    let handle =
        object.querySelector(
            ".note-title, .image-title"
        );


    if (!handle) {

        handle = object;

    }


    handle.addEventListener(
        "mousedown",
        function(event) {

            if (event.button !== 0) {
                return;
            }


            if (
                handle.isContentEditable &&
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
        function(event) {

            event.preventDefault();

            event.stopPropagation();


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


                if (newWidth < 80) {

                    newWidth = 80;

                }


                if (newWidth > 1000) {

                    newWidth = 1000;

                }


                object.style.width =
                    newWidth + "px";


                /*
                   Stickers use their
                   image width instead.
                */

                if (
                    object.classList.contains(
                        "sticker"
                    )
                ) {

                    const image =
                        object.querySelector(
                            "img"
                        );


                    image.style.width =
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

                } else {

                    createSticker(
                        event.target.result,
                        x,
                        y
                    );

                }

            };


        reader.readAsDataURL(file);


        imageInput.value = "";

    }
);



/* =========================
   RIGHT CLICK MENU
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

        selectObject(copy);

    }
);



/* =========================
   SAVE BOARD
========================= */

function saveBoard() {

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


                objects.push(data);

            }
        );


    const boardData = {

        version: 1,

        objects: objects

    };


    const json =
        JSON.stringify(
            boardData,
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


    link.href = url;

    link.download =
        "my-board.json";


    link.click();


    URL.revokeObjectURL(url);

}



/* =========================
   GET OBJECT TYPE
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

    workspace.innerHTML = "";

    selectedObject = null;


    if (
        !data ||
        !Array.isArray(
            data.objects
        )
    ) {

        alert(
            "This doesn't look like a valid board file."
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

}



/* =========================
   LOAD BUTTON
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


                    loadBoard(data);

                }

                catch {

                    alert(
                        "Could not load this board."
                    );

                }

            };


        reader.readAsText(file);


        boardInput.value = "";

    }
);



/* =========================
   KEYBOARD SHORTCUTS
========================= */

document.addEventListener(
    "keydown",
    function(event) {

        /*
           Ctrl + S
        */

        if (
            event.ctrlKey &&
            event.key.toLowerCase() === "s"
        ) {

            event.preventDefault();

            saveBoard();

        }


        /*
           Ctrl + O
        */

        if (
            event.ctrlKey &&
            event.key.toLowerCase() === "o"
        ) {

            event.preventDefault();

            boardInput.click();

        }


        /*
           Delete selected object
        */

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

        board.style.cursor =
            "default";

    }
);



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
   HTML SAFETY
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

updateCamera();
