export class Frames {
    #frame;
    #frameName = 'default';
    _tint;
    _brightness;
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
        if (this._tint == value) return;
        this._tint = value;
        this.generateTintedFrame();
    }

    get tintBrightness() {
        return this._brightness ?? 0.5;
    }

    set tintBrightness(value) {
        if (!isFinite(value)) {
            this._brightness = undefined
            return;
        }
        value = Math.min(1, Math.max(0, value));
        if (this._brightness == value) return;
        this._brightness = value;
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
        const isTinted = this._tint || isFinite(this._brightness);
        context.drawImage(
            isTinted ? this._tintImage : this.image,
            isTinted ? 0 : frame.x,
            isTinted ? 0 : frame.y,
            frame.w, frame.h,
            x, y,
            w, h
        );
    }

    generateTintedFrame() {
        if (!this._tint && !this._brightness) return;

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
        if (this._tint) {
            this._tintCtx.globalCompositeOperation = 'source-atop';
            this._tintCtx.fillStyle = this._tint;
            this._tintCtx.fillRect(0, 0, frame.w, frame.h);
        }

        // Определяем цвет и прозрачность для эффекта освещения
        if (this._brightness) {
            let overlayColor;
            if (this._brightness > 0.5) {
                // Для осветления используем белый цвет с прозрачностью, пропорциональной яркости
                overlayColor = `rgba(255, 255, 255, ${2 * (this._brightness - 0.5)})`;
            } else {
                // Для затемнения используем черный цвет с прозрачностью, пропорциональной обратной яркости
                overlayColor = `rgba(0, 0, 0, ${1 - this._brightness * 2})`;
            }

            // Накладываем цвет освещения
            this._tintCtx.globalCompositeOperation = 'source-atop';
            this._tintCtx.fillStyle = overlayColor;
            this._tintCtx.fillRect(0, 0, frame.w, frame.h);
        }
    }
}
