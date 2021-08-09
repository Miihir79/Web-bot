const modelParams = {
    flipHorizontal: true,   // flip e.g for video 
    imageScaleFactor: 0.7,  // reduce input image size for gains in speed.
    maxNumBoxes: 2,        // maximum number of boxes to detect
    iouThreshold: 0.5,      // ioU threshold for non-max suppression
    scoreThreshold: 0.79,    // confidence threshold for predictions.
  }

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || window.msSpeechRecognition || window.mozSpeechRecognition;
const recognition = new SpeechRecognition();
const video = document.querySelector('#video');

const text = document.querySelector('#text');
const button = document.querySelector('#click');


let model;

//personalise it 
const greetings = ['Hello, I am your personal assistant created by Mihir Shah',
'Hey there How can I help you today?']

const weather = ['Its is a good weather today. The forcast shows lots of love.',
'Weather seams rough today you need a hug']

const sad = ['haww this needs to be brought imediatly to the notice of my master.',
'Thats sad, but remember a big loves you and has designed me for you.'] 

const happy = ['Yaayy,  me too my master designed me to keep you happy.', 'That is great such a human thing, I wish I were you.']

const whatToDO = ['I think taking a break is important',
'You are talented, Think there is a lot to do']

handTrack.load(modelParams).then(lmodel =>{
    model= lmodel;
});

handTrack.startVideo(video)
    .then(status=> {
    if(status){
        navigator.getUserMedia(
            { video:{} },
             stream =>{
                video.srcObject = stream;
                setInterval(runDetection,1000)
             },
              err=> console.log(err)
        );
    }
});

function runDetection(){
    model.detect(video)
        .then(predictions =>{
            if(predictions.length != 0){
                console.log(predictions);
                let hand1 = predictions[0].bbox;
                let x = hand1[0];
                let y = hand1[1];
                console.log(x,y);

                if(x>230){
                    
                    document.getElementById('TextHolder').classList.remove('Disappear');
                    recognition.start();
                }
            }            
        });
}

button.addEventListener('click',()=>{
    console.log('button clicked')
    recognition.start();
});


recognition.onstart = function(){
    console.log("its started");
};

recognition.onresult = function(event){
    console.log(event);
    const current = event.resultIndex;
    const transcript = event.results[current][0].transcript;
    console.log(transcript);
    readOutMessage(transcript);
    document.getElementById('TextHolder').classList.add('Disappear');
};

function readOutMessage(speechMessage){
    console.log(speechMessage);
    const speech = new SpeechSynthesisUtterance();
    if(speechMessage.includes('how are you?')|| speechMessage.includes('How are you?') ||speechMessage=='Hello.'||speechMessage == 'Hi'){
        const finaltext = greetings[Math.floor(Math.random() * greetings.length)];
        speech.text = finaltext
    }
    else if(speechMessage.includes('weather')){
        const finaltext = weather[Math.floor(Math.random() * weather.length)];
        speech.text = finaltext
    }
    else if(speechMessage.includes('I am feeling sad.') || speechMessage.includes('I am sad') || speechMessage.includes('feeling low')){
        const finaltext = sad[Math.floor(Math.random() * sad.length)];
        speech.text = finaltext
    }
    else if(speechMessage.includes('I am happy')|| speechMessage.includes('happy')){
        const finaltext = happy[Math.floor(Math.random() * happy.length)];
        speech.text = finaltext
    }
    else if (speechMessage.includes('What to do?') || speechMessage.includes('What should I do?') || speechMessage.includes('boared')){
        const finaltext = whatToDO[Math.floor(Math.random() * whatToDO.length)];
        speech.text = finaltext
    }
    else if(speechMessage.includes('dark mode') ||speechMessage.includes('Dark mode')){
        if(document.body.style.backgroundColor == "black"){
            document.body.style.backgroundColor = "white";
        }
        else{
            document.body.style.backgroundColor = "black";
        }
        speech.text = 'Done!'
    }
    else{
        speech.text = 'I am sorry Big did not program me for it, you may wanna ask him directly';
    }
    
    speech.volume = 1;
    speech.rate = 1;
    speech.pitch = 1;
    
    window.speechSynthesis.speak(speech);
}