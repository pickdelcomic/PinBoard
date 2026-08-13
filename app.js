const notes = document.querySelectorAll(".note");

notes.forEach(note => {
    let dragging = false;
    let offsetX = 0;
    let offsetY = 0;

    note.addEventListener("mousedown", function (event) {
        dragging = true;

        offsetX = event.clientX - note.offsetLeft;
        offsetY = event.clientY - note.offsetTop;

        note.style.zIndex = 100;
    });

    document.addEventListener("mousemove", function (event) {
        if (!dragging) return;

        note.style.left = (event.clientX - offsetX) + "px";
        note.style.top = (event.clientY - offsetY) + "px";
    });

    document.addEventListener("mouseup", function () {
        dragging = false;
    });
});
