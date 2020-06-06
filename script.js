let video;
let canvas;
let pre;
let model = null;
let predictions;
let stream;
let predict = false;
let loadPre;
let wikipages;
let imageUpload;
let smallCanvas;
let autoImage;
let speakButton;
let speakFlag = true;
let autoImageInterval;
//const startCameraButton;
let count = 0;
//let img = [];

function openPage(element) {
  let tablinks = element;

  let tabcontent = document.getElementsByClassName("content");
  console.log("tab length" + tabcontent.length);
  //   document.getElementById('cameraPan').style.backgroundColor = "DodgerBlue";
  //   document.getElementById('uploadPan').style.backgroundColor = "MediumSeaGreen
  // ";

  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  if (tablinks == "cameraPan") {
    console.log(`hello
${tablinks}

${tabcontent.length}`);

    clearInterval(autoImageInterval);
    document.getElementById("video").style.display = "block";
    document.getElementById("canvas").style.display = "block";

    //    console.log("clicked" + tablinks);
  } else if (tablinks == "uploadPan") {
    console.log(`hello
${tablinks}

${tabcontent.length}`);

    clearInterval(autoImageInterval);
    if (stream !== undefined) {
      video.pause();
      video.src = "";
      stream.getTracks().forEach((track) => track.stop());
    }
    document.getElementById("canvas").style.display = "block";
    document.getElementById(tablinks).style.borderWidth = "thick";
    //    console.log("clicked" + tablinks);
  } else if (tablinks == "autoImagePan") {
    if (stream !== undefined) {
      video.pause();
      video.src = "";
      stream.getTracks().forEach((track) => track.stop());
    }
    document.getElementById("autoImage").style.display = "block";
    autoImageInterval = setInterval(() => autoImageUploader(), 12000);
  }
}

function setup() {
  video = document.getElementById("video");
  canvas = document.getElementById("canvas");
  pre = document.getElementById("predictions");
  model = null;
  video = document.getElementById("video");
  loadPre = document.getElementById("loadPre");
  wikipages = document.getElementById("wikipages");
  autoImage = document.getElementById("autoImage");
  speakButton = document.getElementById("speakButton");

  console.log(autoImage);

  imageUpload = document
    .getElementById("imageUpload")
    .addEventListener("change", handleImageUpload, false);

  async function main() {
    console.log(
      "does responsiveVoice loaded: " + (responsiveVoice ? true : false)
    );
    console.log("does tensorflowjs loaded: " + (tf ? true : false));

    //   try {
    //     model = await mobilenet.load();

    // } catch (e) {
    //     console.log("model is not loading"+e);

    // }
    // finally{
    //   console.log("it loaded")
    // }
    //   console.log("new")

    mobilenet
      .load()
      .then((result) => {
        model = result;
        loadPre.innerHTML = "model loaded";

        document.getElementsByClassName("first")[0].style.backgroundColor =
          "green";
      })
      .catch((e) => {
        loadPre.innerHTML = "Model failed to load";
        console.log("model is not loading" + e);
      });
  }
  console.log("stream" + stream);
  main();
  autoImageInterval = setInterval(() => autoImageUploader(), 12000);
}
async function loadModel() {
  loadPre.innerHTML = "Model loading...again";
  mobilenet
    .load()
    .then((result) => {
      model = result;
      loadPre.innerHTML = "model loaded";
    })
    .catch((e) => {
      loadPre.innerHTML = "Model failed to load";
      console.log("model is not loading" + e);
    });
}

async function classifyImage(imgObject) {
  console.log("inside classify " + imgObject.src);
  predictions = await model.classify(imgObject);
  console.log("inside classify " + predictions);
  displayPredictions(predictions);
}

function displayPredictions(predictions) {
  //window.alert(predictions[0].className);

  let val = "";

  for (prediction of predictions) {
    let perc = (prediction.probability * 100).toFixed(2);
    val += `${perc}% | ${prediction.className}\n`;
  }

  pre.innerHTML = val;

  speakPrediction(predictions[0].className);
}
function speakingToggle() {
  if (predictions == undefined) {
    responsiveVoice.speak("start predicting first");
    return 0;
  }
  console.log("speakButton" + speakButton);

  speakFlag = !speakFlag;
  if (speakFlag) {
    responsiveVoice.speak("muting");
    speakButton.innerHTML = "mute";
  } else {
    responsiveVoice.speak("speaking");
    speakButton.innerHTML = "speak";
  }
}

function speakPrediction(speaking_word) {
  if (model == undefined) {
    responsiveVoice.speak("Hello");
    console.log("working");
    return 0;
  }

  console.log("speakFlag:" + speakFlag);
  if (speakFlag) {
    responsiveVoice.speak(speaking_word);
  }

  // speechSynthesis.getVoices().forEach(function (voice, index) {
  //   console.log(voice.name);
  //   if (voice.name == "Google हिन्दी") {
  //     console.log("y");
  //   }
  //   voiceSpeaker = voice;
  // });
}

async function autoImageUploader(e) {
  count++;
  // if (count > 10) {
  //   return;
  // }

  //   if (autoImage.src == "https://picsum.photos/500/500/?random") {
  //     autoImage.src = "https://loremflickr.com/320/240";
  //   } else {

  //   }
  autoImage.src = "https://picsum.photos/id/" + (count + 250) + "/500";
  //   autoImage.setAttribute("crossOrigin", "anonymous");

  //   setTimeout(() => {}, 2000);

  //   let img = new Image();
  //   //img.crossOrigin = "anonymous";
  // img.src = "https://picsum.photos/200/300"; //"https://i.picsum.photos/id/44/200/300.jpg";

  //   // "https://i.picsum.photos/id/88" + "/200/300.jpg";
  //   img.width = 224;
  //   img.height = 224;
  //   //console.log(autoImage.src);
  console.log(autoImage.src + count);
  classifyImage(autoImage);
  // t = autoImage;
  // const r = await model.classify(t);
  //console.info("from auto load" + r);

  //delete t;

  // setTimeout(
  //   model.classify(autoImage).then((r) => console.log(r)),
  //   3000
  // );
}
async function handleImageUpload(e) {
  var reader = new FileReader();
  reader.readAsDataURL(e.target.files[0]);
  reader.onload = function (event) {
    let context = canvas.getContext("2d");
    var img = new Image();
    img.onload = function () {
      canvas.width = 250;
      canvas.height = 250;
      context.drawImage(img, 0, 0);
    };
    img.src = event.target.result;
  };
  const r = await model.classify(canvas);
  console.log(r);

  classifyImage(canvas);
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
    if (predict) {
      classifyImage(canvas);
    }
  }
}

function showDetails() {
  let a = predictions[0].className;
  //window.alert(a);

  let b = a.split(",");
  let c = b[0].charAt(0).toUpperCase() + b[0].slice(1).replace(" ", "_");

  wikipages.src = "https://en.wikipedia.org/wiki/" + c;
}

function predictToggle() {
  predict = !predict;
  predictButton = document.getElementById("predictButton");
  predictButton.innerHTML = predict ? "Stop Predicting" : "Start Predicting";
}
async function startCamera() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    console.log("mediaDevices");
  } catch (err) {
    console.log("mediaDevices error" + err); // TypeError: failed to fetch
  }
  if ("srcObject" in video) {
    video.srcObject = stream;
    console.log("src object");
  } else {
    console.log("no src object");
  }

  try {
    await video.play();
  } catch (err) {
    console.log(err);
  }

  setInterval(() => takeSnapshot(), 3000);
}
