import { Point } from './class.point.mjs'
const toRadMultiplier = Math.PI / 180;
const toGradMultiplier = 180 / Math.PI;

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