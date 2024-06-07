<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Psychedelic Audio Reactive Visualizer</title>
    <style>
        body {
            margin: 0;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: black;
            overflow: hidden;
            flex-direction: column;
        }
        canvas {
            display: block;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }
        #audioFile, #startRecording, #stopRecording {
            position: relative;
            z-index: 1;
        }
    </style>
</head>
<body>
    <input type="file" id="audioFile" accept="audio/*">
    <button id="startRecording">Start Recording</button>
    <button id="stopRecording">Stop Recording</button>
    <canvas id="visualizerCanvas"></canvas>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/ccapture.js/1.1.0/CCapture.all.min.js"></script>
    <script src="visualizer.js"></script>
</body>
</html>
