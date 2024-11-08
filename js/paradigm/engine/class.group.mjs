import { TransfotmationObject } from './class.transformation.object.mjs'

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
