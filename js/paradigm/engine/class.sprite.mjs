import { TransfotmationObject } from './class.transformation.object.mjs'
import { Frames } from './class.frames.mjs'

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
