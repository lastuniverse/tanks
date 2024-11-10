import { Group, Sprite, Point } from '../paradigm/engine/index.mjs'
import { Explode } from './class.explode.mjs'
import bus from '/js/tools/tool.events.bus.mjs'

bus.once('engine.init', game => {
});

bus.once('engine.preload', game => {
    game.loader.image.load('tank', '/images/tanks/tank_01.png', '/images/tanks/tank_01.json');
    game.loader.image.load('gunflash', '/images/assets.gunflash.png', '/images/assets.gunflash.json');
    game.loader.audio.load('shoot', '/sounds/shoot.mp3');
});

bus.once('engine.create', game => {
});

const tanks = {
    baseTank: {
        acceleration: 0.0003,
        braking: 0.01,
        maxSpeed: 0.6,
        bodyRotateSpeed: 0.003,
        towerRotateSpeed: 0.0035,
        guns: {
            tower: {
                coolDown: 540,
                maxFireDist: 1000,
                ammo: 100,
                timeCount: 0,
                shotAnimationDuration: 140
            }
        }
    }
};

export class Tank extends Group {
    #PI2 = Math.PI * 2;
    #PIh = Math.PI / 2;
    options = tanks.baseTank;
    #gun = { ...tanks.baseTank.guns.tower, timeCount: 0 };
    #moving = 0;
    #fire = false;
    #fireTime = 0;
    #speed = 0;

    constructor(game, group, x, y) {
        super(game, x, y);

        this.shotSound = game.loader.audio.get('shoot');

        this.bodySprite = new Sprite(game, 'tank', 0, 0);
        this.bodySprite.atlas.frameName = 'body';
        this.bodySprite.tintColor = { r: 4, g: 6, b: 2 };
        this.bodySprite.tintOpacity = 0.5;

        this.add(this.bodySprite);

        this.tower = new Group(game, 0, 5);
        this.add(this.tower);

        this.towerSprite = new Sprite(game, 'tank', 0, 5);
        this.towerSprite.atlas.frameName = 'tower';
        this.towerSprite.pivot.y = 0.78;
        this.towerSprite.tintColor = { r: 6, g: 9, b: 3 };
        this.towerSprite.tintOpacity = 0.5;
        this.tower.add(this.towerSprite);

        this.fireSprite = new Sprite(game, 'gunflash', 0, -105);
        this.fireSprite.visible = false;
        this.fireSprite.angle = -90;
        this.tower.add(this.fireSprite);

        group.add(this);
    }

    get moving() {
        return this.#moving;
    }

    set moving(value) {
        this.#moving = typeof value === 'number' ? value : 0;
    }

    fire() {
        if (this.#fire) return;

        this.#fire = true;
        this.#fireTime = 0;

        this.shotSound?.play();

        const dx = this.game.mouse.x - this.game.width / 2;
        const dy = this.game.mouse.y - this.game.height / 2;

        // расстояние от танка до цели
        const dist = Math.hypot(dx, dy);

        // расстояние от центра экрана до мышки
        const explodePoint = new Point(
            dist * Math.cos(this.rotate + this.tower.rotate - this.#PIh),
            dist * Math.sin(this.rotate + this.tower.rotate - this.#PIh)
        )

        // учитываем теккущее значение скалирования мира
        explodePoint.divide(
            this.game.world.scale.x,
            this.game.world.scale.y
        );

        // позиция цели в мире
        explodePoint.add(
            this.position.x,
            this.position.y
        );

        // запускаем анимацию взрыва в координатах цели
        const explode = new Explode(this.game, explodePoint, dist);
        this.parent.add(explode);
    }

    init(data) {
        this.position.x = data.x ?? this.position.x;
        this.position.y = data.y ?? this.position.y;
        this.rotate = data.br ?? this.rotate;
        this.tower.rotate = data.tr ?? this.tower.rotate;
        this.utid = data.utid ?? this.utid;
    }

    update(timer) {
        if (this.#fire) {
            const q = this.#fireTime / this.#gun.shotAnimationDuration;
            this.fireSprite.visible = true;
            this.fireSprite.opacity = 1 - q;
            this.fireSprite.scale = 1 - q;

            const frame = Math.floor(this.fireSprite.atlas.frameDataList.length * q);
            this.fireSprite.atlas.frame = frame;

            this.#fireTime += timer.deltaTime;

            if (this.#fireTime > this.#gun.shotAnimationDuration) {
                this.fireSprite.visible = false;
            }

            if (this.#fireTime > this.#gun.coolDown) {
                this.#fire = false;
                this.#fireTime = 0;
            }
        }

        if (this.#moving) {
            this.#speed += this.#moving * timer.deltaTime * this.options.acceleration;
            if (Math.abs(this.#speed) > this.options.maxSpeed) this.#speed = this.#moving * this.options.maxSpeed;
        } else {
            this.#speed *= 1 - (timer.deltaTime * this.options.braking);
        }

        const dx = this.game.mouse.x - this.game.width / 2;
        const dy = this.game.mouse.y - this.game.height / 2;
        const angle = Math.atan2(dy, dx) + Math.PI / 2;

        const tower_delta_angle = this.#normaliseAngle(angle - (this.rotate + this.tower.rotate));
        const tower_temp_angle = this.options.towerRotateSpeed * timer.deltaTime;
        const tower_step_angle = Math.abs(tower_delta_angle) > tower_temp_angle ? tower_temp_angle * Math.sign(tower_delta_angle) : tower_delta_angle;
        this.tower.rotate += tower_step_angle;

        const pdx = Math.cos(this.rotate - this.#PIh) * this.#speed * timer.deltaTime;
        const pdy = Math.sin(this.rotate - this.#PIh) * this.#speed * timer.deltaTime;

        this.position.x += pdx;
        this.position.y += pdy;
    }

    #normaliseAngle(angle) {
        let da = angle % this.#PI2;
        if (da > Math.PI) return da - this.#PI2;
        if (da < -Math.PI) return da + this.#PI2;
        return da
    }
}


