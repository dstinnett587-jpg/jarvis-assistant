const messages=document.getElementById('messages');
const mic=document.getElementById('mic');
const stop=document.getElementById('stop');
const route=document.getElementById('route');

function add(text,who='jarvis'){const d=document.createElement('div');d.className=`msg ${who}`;d.textContent=text;messages.appendChild(d);messages.scrollTop=messages.scrollHeight}
function speak(text){if('speechSynthesis' in window){speechSynthesis.cancel();speechSynthesis.speak(new SpeechSynthesisUtterance(text))}}

function updateRoute(){
  // Web apps cannot directly enumerate iOS Bluetooth routes for privacy.
  // The audio route selected by iOS is used by the browser for supported media.
  route.textContent='Ready — iOS controls the connected audio device';
}
updateRoute();

const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
let rec=null;
if(SR){
  rec=new SR(); rec.lang='en-US'; rec.interimResults=false; rec.continuous=false;
  rec.onstart=()=>mic.textContent='🔴 Listening…';
  rec.onend=()=>mic.textContent='🎙️ Talk to JARVIS';
  rec.onerror=e=>add('Microphone error: '+e.error);
  rec.onresult=async e=>{
    const text=e.results[0][0].transcript.trim();
    add(text,'you');
    await askJarvis(text);
  };
}else{
  mic.disabled=true;
  mic.textContent='Voice input unavailable';
  add('Your browser does not expose speech recognition. We can add a server-side speech-to-text layer in the next build.');
}

mic.onclick=async()=>{
  try{await navigator.mediaDevices.getUserMedia({audio:true}); rec?.start();}
  catch(e){add('Please allow microphone access for this JARVIS website.');}
};
stop.onclick=()=>{rec?.stop();speechSynthesis?.cancel();};

async function askJarvis(text){
  // Safe starter: no API key is stored in the browser.
  // Replace this endpoint with your secured JARVIS backend.
  const local=text.toLowerCase();
  if(local.includes('time')){
    const answer=new Date().toLocaleTimeString([], {hour:'numeric',minute:'2-digit'});
    add('It is '+answer+'.'); speak('It is '+answer+'.'); return;
  }
  if(local.includes('hello')||local.includes('hi jarvis')){
    const answer='Hello. JARVIS is ready.';
    add(answer); speak(answer); return;
  }
  const answer='I heard: '+text+'. The secure AI brain will be connected in the next step.';
  add(answer); speak(answer);
}
