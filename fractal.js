const canvas = document.getElementById('fractalCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const worker = new Worker('fractalWorker.js');

let offsetX = 0;
let offsetY = 0;
let scale = 1;
let mousePressed = false;
let lastX = 0;
let lastY = 0;

canvas.addEventListener('mousedown', (e) => {
    mousePressed = true;
    lastX = e.clientX;
    lastY = e.clientY;
});

canvas.addEventListener('mouseup', () => {
    mousePressed = false;
});

canvas.addEventListener('mousemove', (e) => {
    if (mousePressed) {
        offsetX += (e.clientX - lastX);
        offsetY += (e.clientY - lastY);
        lastX = e.clientX;
        lastY = e.clientY;
        updateFractal();
    }
});

canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    const scaleFactor = 1.1;
    if (e.deltaY < 0) {
        scale *= scaleFactor;
    } else {
        scale /= scaleFactor;
    }
    updateFractal();
});

worker.onmessage = function(e) {
    const imageData = new ImageData(new Uint8ClampedArray(e.data), canvas.width, canvas.height);
    ctx.putImageData(imageData, 0, 0);
};

function updateFractal() {
    worker.postMessage([canvas.width, canvas.height, offsetX, offsetY, scale]);
}

updateFractal();
