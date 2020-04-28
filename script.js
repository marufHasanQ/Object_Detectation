let video ;
  let canvas ;
  let pre ;
  let model = null;
  let predictions;
  let stream;
  let predict=false;
  let loadPre;
  let wikipages;
let imageUpload;
function setup() {
   video = document.getElementById("video");
   canvas = document.getElementById("canvas");
   pre = document.getElementById("predictions");
   model = null;
   video = document.getElementById("video");
 loadPre = document.getElementById("loadPre");
  wikipages=document.getElementById("wikipages");
  imageUpload=document.getElementById("imageUpload").addEventListener('change',handleImageUpload, false);;
  
  
 



  
  

  async function main() {
  //   try {
  //     model = await mobilenet.load();
      
  // } catch (e) {
  //     console.log("model is not loading"+e);

  // }
  // finally{
  //   console.log("it loaded")
  // }
  //   console.log("new")

  mobilenet.load()
  .then((result)=>{model=result;
    loadPre.innerHTML='model loaded';
                   
  })
  .catch ((e)=>{
    loadPre.innerHTML='Model failed to load';
    console.log("model is not loading"+e)
  }
        );
  
    
      
    
    
  }
  main();
  
}
async function loadModel(){
  loadPre.innerHTML='Model loading...again';
  mobilenet.load()
  .then((result)=>{model=result;
    loadPre.innerHTML='model loaded';
  })
  .catch ((e)=>{
    loadPre.innerHTML='Model failed to load';
    console.log("model is not loading"+e)
  }
        );
  
  
}

async function classifyImage() {
  
  predictions = await model.classify(canvas);
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
}
 async function handleImageUpload(e){
    var reader = new FileReader();
  reader.readAsDataURL(e.target.files[0]);
    reader.onload = function(event){
      let context = canvas.getContext("2d");
        var img = new Image();
        img.onload = function(){
            canvas.width = img.width;
            canvas.height = img.height;
            context.drawImage(img,0,0);
        }
        img.src = event.target.result;
    }
   const r = await model.classify(canvas);
  console.log(r);
  
  classifyImage();
         
}
function takeSnapshot() {
  let context = canvas.getContext("2d"),
    width = video.videoWidth,
    height = video.videoHeight;
    
  if (width && height) {
    // Setup a canvas with the same dimensions as the video.
    canvas.width =width;
    canvas.height =height;

    // Make a copy of the current frame in the video on the canvas.
    context.drawImage(video, 0, 0, width, height);
    if(predict){
      classifyImage();
    }
      
    
    
  }
}

function showDetails(){
    
   let a =predictions[0].className;
  //window.alert(a);

let b=a.split(',');let c=b[0].charAt(0).toUpperCase()+b[0].slice(1).replace(' ','_');

  wikipages.src="https://en.wikipedia.org/wiki/"+c;
  
  
}

function predictToggle(){
  predict=!predict;
  predictButton = document.getElementById("predictButton");
  predictButton.innerHTML = predict?'Stop Predicting':'Start Predicting';
}
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
  

  setInterval(() => takeSnapshot(), 3000);
}
