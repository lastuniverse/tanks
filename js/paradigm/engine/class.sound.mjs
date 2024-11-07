
const AudioContext = window.AudioContext || window.webkitAudioContext;
if (AudioContext === undefined) throw 'AudioContext not supported in your browser'

export const audioContext = new AudioContext();


class GlobalAudio {
    #volume = 1;
    #mute = false;

    constructor(){
        this.gainNode = audioContext.createGain();
        this.gainNode.connect(audioContext.destination);
        this.volume = 0.05;
    }

    mute(){
        if(this.#mute) return;
        this.gainNode.gain.value = 0;
    }
    unmute(){
        if(!this.#mute) return;
        this.gainNode.gain.value = this.#volume;
    }

    get volume(){
        return this.gainNode.gain.value;
    }
    set volume(value){
        this.#volume = value;
        if(this.#mute) return;
        this.gainNode.gain.value = value;
    }

}

export const audio = new GlobalAudio();

// window.addEventListener("wheel", e=>{
//     e = e || window.event;

//     // wheelDelta не даёт возможность узнать количество пикселей
//     var delta = e.deltaY || e.detail || e.wheelDelta;

//     if(delta>0 && audio.volume>0){
//         audio.volume -= 0.05;
//     }else if(delta<0 && audio.volume<1){
//         audio.volume += 0.05;
//     }
    
//     // console.log(audio.volume);
// });




export class Sound{
    constructor(buffer){
        this.buffer = buffer;
        this.gainNode = audioContext.createGain();
        // this.gainNode.connect(audioContext.destination);
        this.gainNode.connect(audio.gainNode);
        
    }

    play(volume=1){
        this.source = audioContext.createBufferSource();
        this.source.buffer = this.buffer;
        
        // this.gainNode = audioContext.createGain();
        this.source.connect(this.gainNode);

        // this.gainNode.connect(audioContext.destination);
        this.gainNode.gain.value = volume;

        this.source.start();
    }
    stop(){
        this.source.stop();
    }

}


// const oscillator = audioContext.createOscillator();
// oscillator.connect(audioContext.destination);
// // oscillator.start();

// var sourceNode = audioContext.createBufferSource();

// export class Sound {
//     constructor(game) {
//         this.game = game;
//         this.audio = game.loader.audio;
//         this.sampleRate = 44100;
//     }
//     play(name, volume) {
//         const sound = this.audio.get(name);
        
//         // const sourceNode = audioContext.createBufferSource(sound);
//         // sourceNode.connect(audioContext.destination);
//         // sourceNode.start(0);
//         // sourceNode.stop();

        
//         // create empty fake buffer in the right sample rate
//         // const emptyBuffer = audioContext.createBuffer(1, 1, this.sampleRate);
        
//         // play it once to make sure sample rate is set
//         // AND the sound is unmuted.
//         // const source = audioContext.createBufferSource();
//         // source.buffer = audioContext.decodeAudioData(sound);
//         const source = audioContext.createMediaElementSource(sound);
//         console.log(source)

//         source.connect(audioContext.destination);
//         // source.start(0, 0, 0);
//         source.play();
//         // sound.play();
//     }
// }