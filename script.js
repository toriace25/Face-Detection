// Victoria Scavetta
// Final Project

let video = document.getElementById("video");
let model;
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

function playVideo() {
    navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {width: 600, height: 400}
    })
    .then((stream) => {
        video.srcObject = stream;
    });
};

async function faceDetection() {
    const predictions = await model.estimateFaces(video, false);    // Make predictions using the webcam input and the blazeface model
    document.getElementById('status').innerHTML = 'Predictions are ready.';
    console.log(predictions);
    ctx.drawImage(video, 0, 0, 600, 400);   // Draws the video in the 2D canvas

    predictions.forEach((prediction) => {
        ctx.beginPath();    // This makes it so new rectangles can be drawn for each prediction
        ctx.lineWidth = "2";
        ctx.strokeStyle = "green";

        // Create a rectangle around the predicted face
        ctx.rect(
            prediction.topLeft[0],  // The x-coordinate of the top left of the predicted face
            prediction.topLeft[1],  // The y-coordinate of the top left of the predicted face
            prediction.bottomRight[0] - prediction.topLeft[0],  // The width of the predicted face
            prediction.bottomRight[1] - prediction.topLeft[1]   // The height of the predicted face
        );
        ctx.stroke();

        ctx.fillStyle = "blue";

        // Put a small square on top of the eyes, nose, ears, and mouth
        prediction.landmarks.forEach((landmark) => {
            ctx.fillRect(landmark[0], landmark[1], 5, 5);
        });
    });
};

video.addEventListener("loadeddata", async function () {
    model = await blazeface.load();
    document.getElementById('status').innerHTML = 'Making predictions...';    // Update the text so the user knows the model is ready and making predictions
    setInterval(faceDetection, 50);
});

playVideo();