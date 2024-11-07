import { Group, Sprite, Point, bus } from '../paradigm/engine/class.game.mjs'

bus.once('engine.init', game => {

});

bus.once('engine.preload', game => {
    game.loader.image.load('tank', '/images/tanks/tank_01.png', '/images/tanks/tank_01.json');
    game.loader.image.load('gunflash', '/images/assets.gunflash.png', '/images/assets.gunflash.json');
    game.loader.image.load('explode', '/images/assets.explode.png', '/images/assets.explode.json');
    game.loader.image.load('explode.my', '/images/explode.my.png', '/images/explode.my.json');
    // game.loader.image.load('sparks', '/images/assets.sparks.png', '/images/assets.sparks.json');


    game.loader.audio.load('shoot', '/sounds/shoot.mp3');
    game.loader.audio.load('explode', '/sounds/explode.02.mp3');


});

bus.once('engine.create', game => {
    // game.loader.image.tint('tank_green', 'tank', 0.25, 0.5, 1.8, 0);
    // game.loader.image.tint('tank_blue', 'tank', 0.6, 0.5, 1.8, 0.0);
    // game.loader.image.tint('tank_yellow', 'tank', 0.1, 0.35, 1.8, 0.1);
    // game.loader.image.tint('tank_red', 'tank', 0.0, 0.8, 1.5, 0.0);
    // game.loader.image.tint('tank_wite', 'tank', 0.5, 0, 1.5, 0.25);
    game.loader.image.tint('tank_color', 'tank', 0.25, 0.2, 1.0, 0.1);


    // game.loader.image.tint('explode_wite', 'explode', 0.5, 0, 1.0, 0.0);
    // game.loader.image.tint('sparks_wite', 'sparks', 0.5, 0, 0.9, -0.1);

});




export class Explode extends Group {
    #time = 0;
    #startTime = 0;

    #duration = 800;

    constructor(game, position, time) {
        super(game, position.x, position.y);
        this.#startTime = time / 2;

        this.visible = false;

        this.explodeSound = game.loader.audio.get('explode');


        const sign = Math.round(Math.random()) * 2 - 1

        this.explodeSprite = new Sprite(game, 'explode', 0, 0);
        this.explodeSprite.scale = (0.5 + 0.5 * Math.random());
        this.explodeSprite.scale.x *= sign;
        this.add(this.explodeSprite);


        // this.sparksSprite = new Sprite(game, 'sparks', 0, 0);
        // this.sparksSprite.scale = 0.5;
        // this.sparksSprite.scale.x *= sign;
        // this.add(this.sparksSprite);

    }

    update(timer) {
        this.#startTime -= timer.deltaTime;
        if (this.#startTime > 0) return;

        this.#time += timer.deltaTime;

        if (!this.visible) {
            this.visible = true;
            this.explodeSound.play(0.7);
        }



        const q = this.#time / this.#duration;

        const explodeFrameIndex = Math.floor(this.explodeSprite.atlas.frameDataList.length * q);
        this.explodeSprite.atlas.frameName = ('000' + explodeFrameIndex).substr(-3);

        // const sparksFrameIndex = Math.floor(this.sparksSprite.atlas.frameDataList.length * q);
        // this.sparksSprite.atlas.frameName = ('000' + sparksFrameIndex).substr(-3);

        this.opacity = 1 - q;

        if (this.#time > this.#duration) {
            this.visible = false;
            this.destroy();
        }
    }
}



const tanks = {
    baseTank: {
        acceleration: 0.003,
        maxSpeed: 5,
        bodyRotateSpeed: 0.03,
        towerRotateSpeed: 0.05,
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
}



export class Tank extends Group {
    #options = tanks.baseTank;
    #gun = {...tanks.baseTank.guns.tower, timeCount: 0};

    #moving = false;
    #fire = false;
    #fireTime = 0;


    get moving() {
        return this.#moving;
    }
    set moving(value) {
        this.#moving = value ? true : false;
    }

    constructor(game, group, x, y) {
        super(game, x, y);
        

        this.shotSound = game.loader.audio.get('shoot');

        const colors = ['', '_green', '_yellow', '_wite']; //, '_red', '_blue'
        const color = '_color';//colors[Math.floor(Math.random() * colors.length)];

        this.bodySprite = new Sprite(game, 'tank' + color, 0, 0);
        this.bodySprite.atlas.frameName = 'body';
        this.add(this.bodySprite);


        this.tower = new Group(game, 0, 5);
        this.add(this.tower);

        this.towerSprite = new Sprite(game, 'tank' + color, 0, 5);
        this.towerSprite.atlas.frameName = 'tower';
        this.towerSprite.pivot.y = 0.78;
        this.tower.add(this.towerSprite);


        this.fireSprite = new Sprite(game, 'gunflash', 0, -105);
        //this.fireSprite.atlas.frameName = '000';
        this.fireSprite.visible = false;
        this.fireSprite.angle = -90;
        // this.fireSprite.scale = 0.7;
        // this.fireSprite.pivot.y = 0.0;
        this.tower.add(this.fireSprite);

        group.add(this);

        // game.scene.add(this);
    }

    requestFire() {
        if (Date.now()-this.#gun.startRequest < 120 ) return;
        this.#gun.startRequest = Date.now();

        this.game.ws.send('game.user.fire', {
            type: 'tower',
            x: this.game.mouse.x - this.game.width / 2,
            y: this.game.mouse.y - this.game.height / 2
        });
    }

    fire() {
        if (this.#fire) return;

        this.#fire = true;
        this.#fireTime = 0;

        this.shotSound.play();


        // расстояние от центра экрана до мышки
        const explodePoint = new Point(
            this.game.mouse.x - this.game.width / 2,
            this.game.mouse.y - this.game.height / 2
        )

        // учитываем теккущее значение скалирования мира
        explodePoint.divide(
            this.game.world.scale.x,
            this.game.world.scale.y
        );

        // расстояние от танка до цели
        const dist = Math.hypot(
            explodePoint.x,
            explodePoint.y,
        );

        // позиция цели в мире
        explodePoint.add(
            this.position.x,
            this.position.y
        );

        // запускаем анимацию взрыва в координатах цели
        const explode = new Explode(this.game, explodePoint, dist);
        this.parent.add(explode);
        // this.game.scene.add(explode);
    }

    init(data) {
        this.position.x = data.x ?? this.position.x;
        this.position.y = data.y ?? this.position.y;
        this.rotate = data.br ?? this.rotate;
        this.tower.rotate = data.tr ?? this.tower.rotate;
        this.utid = data.utid ?? this.utid;
    }

    nextState(data) {
        this.next = data ?? this.next;
    }

    update(timer) {

        if (this.next) {
            const q = timer.deltaTime / 120;

            const dbr = (this.next.br - this.rotate) * q;
            const dtr = (this.next.tr - this.tower.rotate) * q;

            this.rotate += dbr;
            this.tower.rotate += dtr;

            const dx = (this.next.x - this.position.x) * q;
            const dy = (this.next.y - this.position.y) * q;

            this.position.x += dx;
            this.position.y += dy;


            // this.position.x = this.next.x
            // this.position.y = this.next.y
            // this.rotate = this.next.br
            // this.tower.rotate = this.next.tr
        }


        // const normalizeFPS = timer.deltaFrame; // timer.deltaTime/(1000/60);

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

    }


}