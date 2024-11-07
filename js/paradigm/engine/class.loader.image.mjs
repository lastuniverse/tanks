// import { Cache } from './class.cache.js'
import { tint } from '/js/tools/image.tint.mjs'
import { BaseLoader, Loader, cacheURLs } from './class.loader.mjs'


// export const cacheURLs = new Cache();


// img.frames = {
//     '0': {
//         "frame": {
//             "x": 0,
//             "y": 0,
//             "w": img.width,
//             "h": img.height
//         },
//         "rotated": false,
//         "trimmed": true,
//         "spriteSourceSize": {
//             "x": 0,
//             "y": 3,
//             "w": 117,
//             "h": 48
//         },
//         "sourceSize": {
//             "w": 117,
//             "h": 51
//         },
//         "pivot": {
//             "x": 0.5,
//             "y": 0.5
//         }
//     }
// };


export class Frames {
    #frame;
    #frameName = 'default';
    get frame() {
        return this.#frame;
    }
    set frame(value) {
        if (typeof value === 'number') {
            const frame = this.frameDataList[value];
            if (!frame) return;
            this.#frame = frame;
            this.#frameName = frame.name;
            this.width = frame.frame.w;
            this.height = frame.frame.h;

        } else {
            this.frameName = value;
        }
    }

    get frameName() {
        return this.#frameName;
    }
    set frameName(value) {
        if (typeof value === 'string') {
            const frame = this.frameDataHash[value];
            if (!frame) return;
            this.#frame = frame;
            this.#frameName = value;
            this.width = frame.frame.w;
            this.height = frame.frame.h;
        }
    }


    constructor(image, data) {
        this.image = image;
        if (data) {
            this.setAtlasData(data);
        } else {
            this.#frame = {
                name: 'default',
                frame: {
                    x: 0,
                    y: 0,
                    w: this.image.width,
                    h: this.image.height
                },
                rotated: false,
                trimmed: false,
                spriteSourceSize: {
                    x: 0,
                    y: 0,
                    w: this.image.width,
                    h: this.image.height
                },
                sourceSize: {
                    w: this.image.width,
                    h: this.image.height
                },
                pivot: {
                    x: 0.5,
                    y: 0.5
                },
            };

            this.frameDataHash = {
                default: this.#frame
            };
            this.frameDataList = [
                this.#frame
            ];
            this.width = this.image.width;
            this.height = this.image.height;
        }
    }

    setAtlasData(data) {
        this.frameDataHash = data.frames ?? data.frameDataHash;
        this.frameDataList = Object.keys(this.frameDataHash).map(key => {
            this.frameDataHash[key].name = key;
            return this.frameDataHash[key];
        });
        this.#frame = this.frameDataList[0];
        this.#frameName = this.#frame.name;
        this.width = this.#frame.frame.w;
        this.height = this.#frame.frame.h;
    }

    draw(context, x, y, w, h) {
        const frame = this.#frame.frame;
        context.drawImage(this.image,
            frame.x, frame.y,
            frame.w, frame.h,
            x, y,
            w, h
        );
    }
}




export class ImageLoader extends BaseLoader {
    constructor(loader) {
        super();

        if (!loader instanceof Loader) return;
        this.loader = loader;
        this.loader.image = this;

        this.baseURL = loader.baseURL;
        loader.on('setBaseURL', baseURL => {
            this.baseURL = baseURL;
        });
    }

    load(name, imageURL, atlasURL) {
        if (!name || typeof name !== 'string') throw `Name must be a non-empty string`;
        if (this.cache.get(name)) throw `Image with name '${name}' already loaded. Change image name for load.`;


        this.amount++;
        const img = new Image();

        if (atlasURL) {
            this.loader.load(atlasURL)
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    img.addEventListener('load', () => {
                        const frames = new Frames(img);
                        frames.setAtlasData(data);
                        this.cache.insert(name, frames);
                        this.count++;
                    }, false);

                    img.src = this.baseURL + imageURL;
                });

        } else {
            const img = new Image();
            img.addEventListener('load', () => {
                const frames = new Frames(img);
                this.cache.insert(name, frames);
                this.count++;
            }, false);

            img.src = this.baseURL + imageURL;
        }


    }

    tint(name, sourceName, hue = 0.5, saturation = 1, white = 1, black = 0) {
        if (!name || typeof name !== 'string') throw `Name must be a non-empty string`;
        if (this.cache.get(name)) throw `Image with name '${name}' already exists. Change image name for use tint().`;

        if (!sourceName || typeof sourceName !== 'string') throw `SourceName must be a non-empty string`;
        const sourceFrames = this.cache.get(sourceName);

        if (!sourceFrames) throw `Image with sourceName '${sourceName}' not found in cache. You must download it before using it.`


        const destinationImage = tint(sourceFrames.image, hue, saturation, white, black);
        const destinationFrames = new Frames(destinationImage, sourceFrames);

        this.cache.insert(name, destinationFrames);
    }
}



