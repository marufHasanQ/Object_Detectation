function setup() {
  let video = document.getElementById("video");
  let canvas = document.getElementById("canvas");
  let pre = document.getElementById("predictions");
  let model = null;
  let stream;

  async function startCamera() {
    try {
      
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        console.log("mediaDevices");
  } catch(err) {
    console.log("mediaDevices error"+err); // TypeError: failed to fetch
  }
    if ("srcObject" in video) {
      video.srcObject = stream;
      console.log("src object");
    } else {
      console.log("no src object");
    }
    
    try {
      await video.play();
       
  } catch(err) {
    console.log(err);
  }
    

    setInterval(() => takeSnapshot(), 1000);
  }

  function takeSnapshot() {
    let context = canvas.getContext("2d"),
      width = video.videoWidth,
      height = video.videoHeight;

    if (width && height) {
      // Setup a canvas with the same dimensions as the video.
      canvas.width = width;
      canvas.height = height;

      // Make a copy of the current frame in the video on the canvas.
      context.drawImage(video, 0, 0, width, height);

      classifyImage();
    }
  }

  async function classifyImage() {
    predictions = await model.classify(canvas);
    displayPredictions(predictions);
  }

  function displayPredictions(predictions) {
    let val = "";

    for (prediction of predictions) {
      let perc = (prediction.probability * 100).toFixed(2);
      val += `${perc}% | ${prediction.className}\n`;
      
    }
    pre.innerHTML = val;
  }

  async function main() {
    
    model = await mobilenet.load();
      
    await startCamera();  
    
    
  }
  main();
}
