const keys = document.querySelectorAll('.key')
const recordButton = document.querySelector('#record')
const deleteButton = document.getElementById('delete')
const playButton = document.querySelector('.play')
const saveButton = document.querySelector('.save')
const pickAPack = document.querySelector('select')
let beatTitleInput = document.querySelector('.b-name')
let beatTitle
beatTitleInput.addEventListener('click', () => beatTitle = document.querySelector('.b-name').value) 
let userid = Number(sessionStorage.getItem('userId'))
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

const eighties = new Sprite ({
    "src": './audio/80s.webm',
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
const electro = new Sprite ({
  "src": "./audio/Electro.webm",
  "sprite": {
    "1": [ //Kick01
      0,
      1382.3356009070296
    ],
    "2": [ //Kick02
      3000,
      1158.2993197278918
    ],
    "3": [ //Kick03
      6000,
      1166.09977324263
    ],
    "4": [ //Hat01
      9000,
      1550.2267573696145
    ],
    "5": [ //Hat02
      12000,
      1166.09977324263
    ],
    "6": [ //Hat03
      15000,
      1166.0997732426317
    ],
    "7": [ //Clap
      18000,
      1365.5782312925169
    ],
    "8": [ //Snare01
      21000,
      2042.8571428571445
    ],
    "9": [ //Snare02
      25000,
      2140.8616780045336
    ]
  }
})
const vinyl = new Sprite ({
  "src": "./audio/Vinyl.webm",
  "sprite": {
    "1": [ //Tom01
      0,
      2771.746031746032
    ],
    "2": [ //Tom02
      4000,
      3060.5442176870747
    ],
    "3": [ //Tom3
      9000,
      2738.344671201814
    ],
    "4": [ //Kick01
      13000,
      1365.2834467120183
    ],
    "5": [ //Kick02
      16000,
      1280.793650793651
    ],
    "6": [ //Snare
      19000,
      1599.5691609977314
    ],
    "7": [ //China
      22000,
      5110.544217687075
    ],
    "8": [ //Hat
      29000,
      1333.3106575963711
    ],
    "9": [ //Ride
      32000,
      8529.18367346939
    ]
  }
})



const playKey = (e) => {
  const keyDiv = document.getElementById(`${e.key}`)
  if (e.repeat) return
  if(pickAPack.value === "eighties") eighties.play(`${e.key}`)
  if(pickAPack.value === "vinyl") vinyl.play(`${e.key}`)
  if(pickAPack.value === "electro") electro.play(`${e.key}`)
  keyDiv.classList.add('active') 
  setTimeout(() => {
    keyDiv.classList.remove('active')
  }, 250);
}


const playClick = (e) => {
  console.log(typeof `${e.target.id}`)
  const keyDiv = document.getElementById(`${e.target.id}`)
  if (e.repeat) return
  if(pickAPack.value === "eighties") eighties.play(`${e.target.key}`)
  if(pickAPack.value === "vinyl") vinyl.play(`${e.target.key}`)
  if(pickAPack.value === "electro") electro.play(`${e.target.key}`)
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
  songNotes = {
    beatName: beatTitle,
    user: userid,
    drumpack: pickAPack.value,
    notes: []
  }
  playButton.classList.remove('show')
  saveButton.classList.remove('show')
}
function stopRecording() {
  playButton.classList.add('show')
  saveButton.classList.add('show')
  console.log(songNotes)
}
function playSong(){
  console.log(songNotes)
  if (songNotes.length === 0) return
  songNotes.notes.forEach(note => {
   if(songNotes.drumpack === 'eighties') setTimeout(() => eighties.play(note.key), note.startTime)
   if(songNotes.drumpack === 'vinyl') setTimeout(() => vinyl.play(note.key), note.startTime)
   if(songNotes.drumpack === 'electro') setTimeout(() => electro.play(note.key), note.startTime)
  })
}
function recordNote(note){
  songNotes.notes.push({
    key: note,
    startTime: Date.now() - recordingStartTime
  })
}
function saveSong(){
  axios
    .post('/saveSong', songNotes) //song notes initialized on line 216
    .then(alert('Song Saved!'))
    .catch(err => console.log(err))
  
  getUserBeats()
}

function getUserBeats() {
  let i = 0
  axios
    .get(`/getUserBeats/${userid}`)
    .then(res => {
      //console.log(res.data[i].beat_notes.notes)
      // let arr = JSON.parse(res.data.beat_notes.notes)
      // console.log(arr)
      document.querySelector('.user-beats').innerHTML = ''
      res.data.forEach(obj => {
        let beat = document.createElement('div')
        beat.classList.add('recorder')
        
        let title = document.createElement('div')
        beat.appendChild(title)
        let titleText = document.createElement('h3')
        titleText.textContent = obj.beat_name
        title.appendChild(titleText)
        
        let controls = document.createElement('div')
        controls.classList.add('record-buttons')
        beat.appendChild(controls)
        
        let playBeat = document.createElement('ion-icon')
        playBeat.name = "play-outline"
        playBeat.size = "large"
        playBeat.classList.add(`btn`)
        playBeat.classList.add(`beat-play${i}`)
        playBeat.addEventListener('click', () => {
          if(obj.beat_kit === 'eighties') {
            obj.beat_notes.notes.forEach(note => {
              setTimeout(() => eighties.play(note.key), note.startTime)
            })
          }


          if(obj.beat_kit === 'vinyl') {
            obj.beat_notes.notes.forEach(note => {
              setTimeout(() => vinyl.play(note.key), note.startTime)
            })
          }


          if(obj.beat_kit === 'electro') {
            obj.beat_notes.notes.forEach(note => {
              setTimeout(() => electro.play(note.key), note.startTime)
            })
          }
          //console.log(obj.beat_notes.notes[0])
        })
        controls.appendChild(playBeat)
        
        let deleteBeat = document.createElement('ion-icon')
        deleteBeat.name = "close-circle-outline"
        deleteBeat.size = "large"
        deleteBeat.classList.add(`btn`)
        deleteBeat.classList.add(`beat-delete${i}`)
        controls.appendChild(deleteBeat)
        
       document.querySelector('.user-beats').appendChild(beat)
       i++
      })
    })
}
// const testBtn = document.querySelector('.beat-play')
// testBtn.addEventListener('click', getUserBeats)
getUserBeats()