// fractalWorker.js
self.onmessage = function(e) {
    const [width, height, offsetX, offsetY, scale, frequencyData] = e.data;
    const imageData = new Uint8Array(width * height * 4);
    const maxIter = 100;

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            let real = (x - width / 2 + offsetX) / (0.5 * scale * width);
            let imag = (y - height / 2 + offsetY) / (0.5 * scale * height);
            let n = 0;
            let r = real, i = imag;

            while (n < maxIter) {
                let r2 = r * r - i * i + real;
                i = 2 * r * i + imag;
                r = r2;

                if (r * r + i * i > 4) break;
                n++;
            }

            const pixelIndex = (x + y * width) * 4;
            const colorFactor = frequencyData[n % frequencyData.length] / 255;

            imageData[pixelIndex] = colorFactor * 255;         // Red
            imageData[pixelIndex + 1] = colorFactor * 200;     // Green
            imageData[pixelIndex + 2] = colorFactor * 150;     // Blue
            imageData[pixelIndex + 3] = 255;                   // Alpha
        }
    }

    self.postMessage(imageData);
};
