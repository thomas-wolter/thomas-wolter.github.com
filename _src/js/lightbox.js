window.addEventListener("keyup", function(e) {
    if (e.key == "Escape") {
        console.log()
        if (document.getElementById('lightbox-background').style.display !== "none") {
            closeLightbox();
        }
    }
}, true);

window.openLightbox = () => {
    document.getElementById('lightbox-background').style.display = "flex";
    document.body.style.userSelect = 'none';
}

window.updateLightbox = (humanNotation = '', euler = [0, 0, 0]) => {
    window.snakeCreate();
    window.snakeUpdate(humanNotation, euler);
    window.snakeAnimate();
}

window.closeLightbox = () => {
    document.getElementById('lightbox-background').style.display = "none";
    document.body.style.overflow = 'auto';
    document.body.style.userSelect = 'auto';
}