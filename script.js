let audioContext, mic, pitch;
let gestorI, gestorPitch;
let antesHabiaSonido = false;
let tiempoInicioSonido = 0;

let imagenActual = null;
let mostrarImagen = false;

let minimoI = 0; //el valor mínimo de intensidad (volumen) del miccc
let maximoI = 0.3; //valor máximo de intensidad (volumen) 
let minNota = 20; // valor mínimo de nota MIDI q se usa para el filtro pitch
let maxNota = 40; //
let umbral = 0.1; //

let indiceGraveSecuencia = 0; // para mostrar figuras graves en orden

const agudos = [];
const graves = [];
const cortos = [];
const largos = [];

function setup() {
  createCanvas(656, 1020);
  background(255);
  angleMode(DEGREES);
  noStroke();

 
  for (let i = 0; i < 3; i++) {
    graves[i] = loadImage("img/Graves/grave" + i + ".png");
  }


  audioContext = getAudioContext();
  mic = new p5.AudioIn();
  mic.start(startPitch);
  userStartAudio();

  gestorI = new GestorSenial(minimoI, maximoI);//gestor intensidad(volumen del sonido)
  gestorPitch = new GestorSenial(minNota, maxNota);// gestiona la altura de una nota sonora o su frecuencia, en este caso convertida a nota MIDI
}


function draw() {

  let intensidad = mic.getLevel();
  gestorI.actualizar(intensidad);

  let haySonido = gestorI.filtrada > umbral;
  let empezoElSonido = !antesHabiaSonido && haySonido;
  let terminoElSonido = antesHabiaSonido && !haySonido;

  if (empezoElSonido) {
    tiempoInicioSonido = millis();
  }

  if (terminoElSonido) {
    let duracion = millis() - tiempoInicioSonido;
    let nota = gestorPitch.filtrada;

    let esGrave = nota < 60;

    if (esGrave) {
      imagenActual = graves[indiceGraveSecuencia];
      indiceGraveSecuencia = (indiceGraveSecuencia + 1) % graves.length;
      mostrarImagen = true;

      // muestra y almacena cada imagen en pos vertical
      let y = indiceGraveSecuencia; 
      image(imagenActual, 0, 0);
    }
  }


  antesHabiaSonido = haySonido;
}


function startPitch() {
  let model_url = 'https://cdn.jsdelivr.net/gh/ml5js/ml5-data-and-models/models/pitch-detection/';
  pitch = ml5.pitchDetection(model_url, audioContext, mic.stream, modelLoaded);
}

function modelLoaded() {
  getPitch();
}

function getPitch() {
  pitch.getPitch(function (err, frequency) {
    if (frequency) {
      let midiNote = freqToMidi(frequency);
      gestorPitch.actualizar(midiNote);
    }
    getPitch();
  });
}



