const fileInput = document.getElementById('audioFile');
const startRecordingButton = document.getElementById('startRecording');
const stopRecordingButton = document.getElementById('stopRecording');
const canvas = document.getElementById('visualizerCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let audioContext, analyser, source;
let frequencyData;
let rotationAngle = 0;
let geometries = [];
let capturer;

fileInput.addEventListener('change', function() {
    const files = this.files;
    if (files.length === 0) return;

    const file = files[0];
    if (source) source.disconnect();  // Disconnect existing source if any

    const reader = new FileReader();
    reader.onload = function(e) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        audioContext.decodeAudioData(e.target.result, function(buffer) {
            source = audioContext.createBufferSource();
            source.buffer = buffer;
            source.connect(analyser);
            analyser.connect(audioContext.destination);
            source.start(0);
            analyser.fftSize = 256;
            frequencyData = new Uint8Array(analyser.frequencyBinCount);
            createGeometries();
            animate();
        }, function(e) { console.error("Error with decoding audio data", e); });
    };
    reader.readAsArrayBuffer(file);
});

startRecordingButton.addEventListener('click', function() {
    capturer = new CCapture({ format: 'webm', framerate: 30 });
    capturer.start();
});

stopRecordingButton.addEventListener('click', function() {
    capturer.stop();
    capturer.save();
});

function createGeometries() {
    const numGeometries = 15; // Increased number of geometries for more dynamic visuals
    for (let i = 0; i < numGeometries; i++) {
        const geometry = {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            baseRadius: Math.random() * 100 + 50,
            rotation: Math.random() * Math.PI * 2,
            color: getRandomColor(),
            type: getRandomPolygonType(),
            sizeChangeSpeed: (Math.random() * 0.01 + 0.01) * (Math.random() > 0.5 ? 1 : -1),
            opacity: Math.random() * 0.5 + 0.5 // Add opacity to make shapes more transparent
        };
        geometries.push(geometry);
    }
}

function animate() {
    requestAnimationFrame(animate);
    analyser.getByteFrequencyData(frequencyData);
    drawBackground();
    drawSacredGeometries();
    rotationAngle += 0.01;  // Adjust this value to control the speed of rotation

    if (capturer) {
        capturer.capture(canvas);
    }
}

function drawBackground() {
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, 'red');
    gradient.addColorStop(0.2, 'orange');
    gradient.addColorStop(0.4, 'yellow');
    gradient.addColorStop(0.6, 'green');
    gradient.addColorStop(0.8, 'blue');
    gradient.addColorStop(1, 'purple');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSacredGeometries() {
    geometries.forEach(geometry => {
        ctx.save();
        ctx.translate(geometry.x, geometry.y);
        ctx.rotate(rotationAngle);

        ctx.globalAlpha = geometry.opacity; // Set the transparency of shapes

        if (geometry.type === 'hexagon') {
            drawHexagon(0, 0, geometry.baseRadius, geometry.rotation, geometry.color);
        } else if (geometry.type === 'triangle') {
            drawTriangle(0, 0, geometry.baseRadius, geometry.rotation, geometry.color);
        } else if (geometry.type === 'square') {
            drawSquare(0, 0, geometry.baseRadius, geometry.rotation, geometry.color);
        } else if (geometry.type === 'pentagon') {
            drawPentagon(0, 0, geometry.baseRadius, geometry.rotation, geometry.color);
        } else if (geometry.type === 'star') {
            drawStar(0, 0, geometry.baseRadius, geometry.rotation, geometry.color);
        }

        geometry.baseRadius += geometry.sizeChangeSpeed * frequencyData[Math.floor(Math.random() * frequencyData.length)] / 256;

        if (geometry.baseRadius > 200 || geometry.baseRadius < 50) {
            geometry.sizeChangeSpeed *= -1;
        }

        ctx.restore();
    });
}

function drawHexagon(x, y, radius, rotation, color) {
    drawPolygon(x, y, radius, 6, rotation, color);
}

function drawTriangle(x, y, radius, rotation, color) {
    drawPolygon(x, y, radius, 3, rotation, color);
}

function drawSquare(x, y, radius, rotation, color) {
    drawPolygon(x, y, radius, 4, rotation, color);
}

function drawPentagon(x, y, radius, rotation, color) {
    drawPolygon(x, y, radius, 5, rotation, color);
}

function drawStar(x, y, radius, rotation, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);

    const gradient = ctx.createLinearGradient(-radius, -radius, radius, radius);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0.5)'); // Adjust transparency for neon effect

    ctx.strokeStyle = gradient;
    ctx.lineWidth = 5;

    const spikes = 5;
    const step = Math.PI / spikes;
    let outerRadius = radius;
    let innerRadius = radius / 2;

    ctx.beginPath();
    for (let i = 0; i < 2 * spikes; i++) {
        const r = (i % 2 === 0) ? outerRadius : innerRadius;
        const angle = i * step;
        const xPos = r * Math.cos(angle);
        const yPos = r * Math.sin(angle);
        if (i === 0) {
            ctx.moveTo(xPos, yPos);
        } else {
            ctx.lineTo(xPos, yPos);
        }
    }
    ctx.closePath();
    ctx.stroke();

    ctx.restore();
}

function drawPolygon(x, y, radius, sides, rotation, color) {
    if (!isFinite(x) || !isFinite(y) || !isFinite(radius)) {
        return;
    }

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);

    const gradient = ctx.createLinearGradient(-radius, -radius, radius, radius);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0.5)'); // Adjust transparency for neon effect

    ctx.strokeStyle = gradient;
    ctx.lineWidth = 5;

    ctx.beginPath();
    for (let i = 0; i < sides; i++) {
        const angle = (i / sides) * Math.PI * 2;
        const xPos = radius * Math.cos(angle);
        const yPos = radius * Math.sin(angle);
        if (!isFinite(xPos) || !isFinite(yPos)) {
            continue;
        }
        if (i === 0) {
            ctx.moveTo(xPos, yPos);
        } else {
            ctx.lineTo(xPos, yPos);
        }
    }
    ctx.closePath();
    ctx.stroke();

    ctx.restore();
}

function getRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgba(${r}, ${g}, ${b}, 0.5)`; // Adjust transparency for psychedelic effect
}

function getRandomPolygonType() {
    const types = ['hexagon', 'triangle', 'square', 'pentagon', 'star'];
    return types[Math.floor(Math.random() * types.length)];
}
