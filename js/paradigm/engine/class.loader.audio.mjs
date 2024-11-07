import { BaseLoader, Loader } from './class.loader.mjs'
import { audioContext, Sound } from './class.sound.mjs'

export class AudioLoader extends BaseLoader {
    constructor(loader) {
        super();

        if (!loader instanceof Loader) return;

        this.loader = loader;
        this.loader.audio = this;

        this.baseURL = loader.baseURL;
        loader.on('setBaseURL', baseURL => {
            this.baseURL = baseURL;
        });
    }

    load(name, audioURL) {
        if (!name || typeof name !== 'string') throw `Name must be a non-empty string`;
        if (this.cache.get(name)) throw `Image with name '${name}' already loaded. Change image name for load.`;

        this.amount++;

        this.loader.load(audioURL)
            .then(response => response.arrayBuffer())
            .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
            .then(audioBuffer => {
                this.count++;
                this.cache.insert(name, new Sound(audioBuffer));
            });
    }
}



