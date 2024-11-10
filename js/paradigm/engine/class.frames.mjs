export class Frames {
    #frame;
    #frameName = 'default';
    _tint;
    _tintImage;

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

    get tint() {
        return this._tint;
    }

    set tint(value) {
        if(this._tint == value) return;
        this._tint = value;
        this.generateTintedFrame();
    }

    get frame() {
        return this.#frame;
    }

    set frame(value) {
        if (typeof value === 'number') {
            const frame = this.frameDataList[value];
            if (!frame) return;
            if (this.#frame === frame) return;
            this.#frame = frame;
            this.#frameName = frame.name;
            this.width = frame.frame.w;
            this.height = frame.frame.h;
            this.generateTintedFrame();
        } else {
            this.frameName = value;
        }
    }

    get frameName() {
        return this.#frameName;
    }

    set frameName(value) {
        if (typeof value !== 'string') return;
        if (this.#frameName === value) return;
        const frame = this.frameDataHash[value];
        if (!frame) return;
        this.#frame = frame;
        this.#frameName = value;
        this.width = frame.frame.w;
        this.height = frame.frame.h;
        this.generateTintedFrame();
    }

    setAtlasData(data) {
        this.frameDataHash = data.frames ?? data.frameDataHash;
        this.frameDataList = Object.keys(this.frameDataHash).map(key => {
            this.frameDataHash[key].name = key;
            return this.frameDataHash[key];
        });
        this.frame = 0;
    }

    draw(context, x, y, w, h) {
        const frame = this.#frame.frame;
        context.drawImage(
            this._tint ? this._tintImage : this.image,
            this._tint ? 0 : frame.x,
            this._tint ? 0 : frame.y,
            frame.w, frame.h,
            x, y,
            w, h
        );
    }

    generateTintedFrame() {
        if (!this._tint) return;

        // Создаем временный холст
        if (!this._tintImage) {
            this._tintImage = document.createElement('canvas');
            this._tintCtx = this._tintImage.getContext('2d');
        }

        // Рисуем изображение на временном холсте
        const frame = this.#frame.frame;
        this._tintImage.width = frame.w;
        this._tintImage.height = frame.h;

        this._tintCtx.drawImage(this.image,
            frame.x, frame.y,
            frame.w, frame.h,
            0, 0,
            frame.w, frame.h
        );

        // Накладываем цветовой оттенок
        this._tintCtx.globalCompositeOperation = 'source-atop';
        this._tintCtx.fillStyle = this._tint;
        this._tintCtx.fillRect(0, 0, frame.w, frame.h);
    }
}
