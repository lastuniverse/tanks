import { Frames } from './class.loader.image.mjs'
const toRadMultiplier = Math.PI / 180;
const toGradMultiplier = 180 / Math.PI;

export class Point {
    #x = 0;
    #y = 0;

    constructor(x, y) {
        this.init(x, y);
    }


    get x() {
        return this.#x;
    }

    set x(value) {
        this.#x = value ?? this.#x ?? 0;
    }

    get y() {
        return this.#y;
    }

    set y(value) {
        this.#y = value ?? this.#y ?? 0;
    }

    #paramsToPoint(x, y, defaultParams = {}) {
        const p = { x: 0, y: 0 };
        if (Array.isArray(x)) {
            p.x = x?.[0] ?? defaultParams?.x ?? 0;
            p.y = x?.[1] ?? defaultParams?.y ?? 0;
        } else if (typeof x === 'object') {
            p.x = x.x ?? defaultParams?.x ?? 0;
            p.y = x.y ?? defaultParams?.y ?? 0;
        } else {
            p.x = x ?? defaultParams?.x ?? 0;
            p.y = y ?? x ?? defaultParams?.y ?? 0;
        }
        return p;
    }

    add(x, y) {
        const p = this.#paramsToPoint(x, y);
        this.#x += p.x;
        this.#y += p.y;
    }

    substract(x, y) {
        const p = this.#paramsToPoint(x, y);
        this.#x -= p.x;
        this.#y -= p.y;
    }

    multiply(x, y) {
        const p = this.#paramsToPoint(x, y);
        this.#x *= p.x;
        this.#y *= p.y;
    }

    divide(x, y) {
        const p = this.#paramsToPoint(x, y);
        this.#x /= p.x;
        this.#y /= p.y;
    }

    init(x, y, context = this) {
        const p = this.#paramsToPoint(x, y, context);
        this.#x = p.x;
        this.#y = p.y;
    }
}

export class TransfotmationObject {
    #position = new Point();
    #scale = new Point(1, 1);
    #pivot = new Point(0.5, 0.5);
    #rotate = 0;
    #opacity = 1;
    smoothing = false;
    visible = true;
    mustDestroyed = false;
    pause = false;

    constructor(game) {
        this.game = game;
        this.context = game.context;
    }

    get position() {
        return this.#position;
    }

    set position(value) {
        this.#position.init(value);
    }

    get scale() {
        return this.#scale;
    }

    set scale(value) {
        this.#scale.init(value);
    }

    get pivot() {
        return this.#pivot;
    }

    set pivot(value) {
        this.#pivot.init(value);
    }

    get anchor() {
        return this.#pivot;
    }

    set anchor(value) {
        this.#pivot.init(value);
    }

    get rotate() {
        return this.#rotate;
    }

    set rotate(value) {
        this.#rotate = value ?? this.#rotate ?? 0;
    }

    get angle() {
        return this.#rotate * toGradMultiplier;
    }

    set angle(value) {
        this.#rotate = (value ?? this.#rotate ?? 0) * toRadMultiplier;
    }

    get opacity() {
        return this.#opacity;
    }

    set opacity(value) {
        this.#opacity = value ?? this.#opacity ?? 0;
    }

    destroy() {
        this.mustDestroyed = true;
    }

    update() {
    }

    render() {
    }
}


export class Group extends TransfotmationObject {
    #childrens = [];

    constructor(game, x, y) {
        super(game);
        this.position = { x, y };

    }

    get childrens() {
        return this.#childrens;
    }

    clear() {
        this.#childrens = [];
    }

    add(item) {
        if (item instanceof TransfotmationObject)
            this.#childrens.push(item);
        item.parent = this;
    }

    update(timer) {
        if (this.pause) return;
        if (this.mustDestroyed) return;

        this.#childrens = this.#childrens.filter(item => {
            if (item.mustDestroyed) return false;
            item.update(timer);
            return true;
        });
    }

    render() {
        if (!this.visible) return;
        if (this.mustDestroyed) return;

        this.context.save();

        this.context.translate(this.position.x, this.position.y);
        this.context.scale(this.scale.x, this.scale.y);
        this.context.rotate(this.rotate);
        this.context.globalAlpha *= this.opacity;
        this.context.imageSmoothingEnabled = this.smoothing;

        this.#childrens.forEach(item => {
            if (!item.visible) return;
            if (item.mustDestroyed) return;
            item.render();
        });

        this.context.restore();
    }
}

export class Sprite extends TransfotmationObject {

    constructor(game, name, x, y) {
        super(game);
        this.position = { x, y };

        const atlas = game.loader.image.cache.get(name);
        if (!atlas) throw `Image with name '${name}' not found in cache. You must download it before using it.`

        this.atlas = new Frames(atlas.image, atlas);

    }

    update() {

    }

    render() {
        if (!this.visible) return;
        if (this.mustDestroyed) return;

        const px = this.pivot.x * this.atlas.width;
        const py = this.pivot.y * this.atlas.height;

        this.context.save();

        this.context.translate(this.position.x, this.position.y);
        this.context.scale(this.scale.x, this.scale.y);
        this.context.rotate(this.rotate);
        this.context.globalAlpha *= this.opacity;
        this.context.imageSmoothingEnabled = this.smoothing;

        this.atlas.draw(this.context, -px, -py, this.atlas.width, this.atlas.height);

        this.context.restore();
    }
}
