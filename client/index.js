const keys = document.querySelectorAll('.key')
const recordButton = document.querySelector('.record')
const playButton = document.querySelector('.play')
const saveButton = document.querySelector('.save')
let recordingStartTime
let songNotes

class Sprite {
    constructor(settingsObj) {
        this.src = settingsObj.src
        this.samples = settingsObj.sprite

        this.init()
    }

    async init() {
        // Set up web audio
        const AudioCtx = window.AudioContext
        this.ctx = new AudioCtx

        this.audioBuffer = await this.getFile()
    }
        // Load file
    async getFile() {
        // Request file
        const response = await fetch(this.src)
        
        if(!response.ok){
            console.log(`${response.url} ${response.statusText}`)
            throw new Error(`${response.url} ${response.statusText}`)
        }

        const arrayBuffer = await response.arrayBuffer()
        const audioBuffer = await this.ctx.decodeAudioData(arrayBuffer)

        return audioBuffer
    }

    play(sampleName) {
        if (isRecording()) recordNote(sampleName)
        const startTime = this.samples[sampleName][0] / 1000
        const duration = this.samples[sampleName][1] / 1000

        const sampleSource = this.ctx.createBufferSource();
        sampleSource.buffer = this.audioBuffer
        sampleSource.connect(this.ctx.destination)

        sampleSource.start(this.ctx.currentTime, startTime, duration)
    }
}

const firstKit = new Sprite ({
    "src": './audio/firstKit.webm',
    "sprite": {
        "1": [ //hi-hat
          0,
          248.27664399092973
        ],
        "2": [ //cowbell
          2000,
          1358.1179138321993
        ],
        "3": [ //crash
          5000,
          4354.784580498866
        ],
        "4": [ //kick
          11000,
          728.3900226757361
        ],
        "5": [ //shaker
          13000,
          1412.1315192743768
        ],
        "6": [ //snare
          16000,
          824.2630385487537
        ]
      }
})


const playKey = (e) => {
  const keyDiv = document.getElementById(`${e.key}`)
  if (e.repeat) return
  firstKit.play(`${e.key}`)
  keyDiv.classList.add('active') 
  setTimeout(() => {
    keyDiv.classList.remove('active')
  }, 250);
}


const playClick = (e) => {
  const keyDiv = document.getElementById(`${e.target.id}`)
  if (e.repeat) return
  firstKit.play(`${e.target.id}`)
  keyDiv.classList.add('active')
  setTimeout(() => {
    keyDiv.classList.remove('active')
  }, 250);
}

const keyPress = document.addEventListener("keydown", playKey)
const keyclick = keys.forEach(key => key.addEventListener("click", playClick))



recordButton.addEventListener('click', toggleRecording)
saveButton.addEventListener('click', saveSong)
playButton.addEventListener('click', playSong)

function toggleRecording() {
  recordButton.classList.toggle('active')
  if (isRecording()){
    startRecording()
  } else {
    stopRecording()
  }
}
function isRecording(){
  return recordButton != null && recordButton.classList.contains('active')
}
function startRecording() {
  recordingStartTime = Date.now()
  songNotes = []
  playButton.classList.remove('show')
  saveButton.classList.remove('show')
}
function stopRecording() {
  playSong()
  playButton.classList.add('show')
  saveButton.classList.add('show')
}
function playSong(){
  console.log(songNotes)
  if (songNotes.length === 0) return
  songNotes.forEach(note => {
    setTimeout(() => {
      firstKit.play(note.key)
    }, note.startTime)
  })
}
function recordNote(note){
  songNotes.push({
    key: note,
    startTime: Date.now() - recordingStartTime
  })
}

function saveSong(){
  
}