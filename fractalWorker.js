onmessage = function(e) {
    const data = e.data;
    if (!data || data.length !== 5) {
        console.error('Expected data array of length 5');
        return;
    }
    const [width, height, offsetX, offsetY, scale] = data;
    const imageData = new Uint8ClampedArray(width * height * 4);

    // Simple example processing: Fill with a solid color
    for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
            const index = (i + j * width) * 4;
            imageData[index] = 255; // Red
            imageData[index + 1] = 0; // Green
            imageData[index + 2] = 255; // Blue
            imageData[index + 3] = 255; // Alpha
        }
    }
    postMessage(imageData);
};
