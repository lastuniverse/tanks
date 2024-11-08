export class Frames {
    #frame;
    #frameName = 'default';

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
