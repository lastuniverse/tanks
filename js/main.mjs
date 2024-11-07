import { Game, Keyboard } from './paradigm/engine/index.mjs'
import { World } from './game/class.world.mjs'
import { Tank } from './game/class.tank.mjs'

const game = new Game();
game.pause = false;

// инициализация
game.once('engine.init', () => {
    console.log('engine.init');
    game.loader.baseURL = './';
});

// предзагрузка
game.once('engine.preload', () => {
    console.log('engine.preload');

    // game.loader.image.load('desert', '/images/desert.real.png', '/images/desert.json');

    game.loader.on('progress', progress => {
        console.log('progress', `${progress.count}/${progress.amount}`);
    });

    game.loader.once('load', progress => {
        console.log('load', `${progress.count}/${progress.amount}`);
    });
});


// создание игровых объектов
game.once('engine.create', () => {
    console.log('engine.create');


    game.world = new World(game, 256, 256);
    // game.world.angle = 30;y

    // const sprite = new Sprite(game, 'desert', 200, 200);
    // sprite.atlas.frame = 7;
    // game.scene.add(sprite)


    game.tank = new Tank(game, game.world, 200, 0);
    game.world.setFocus(game.tank);



    // setInterval(()=>{
    //     // запускаем анимацию взрыва в координатах цели
    //     const explodePoint = new Point( game.mouse.x, game.mouse.y );
    //     const explode = new Explode(game, explodePoint, 0);
    //     game.scene.add(explode);
    // }, 1000)


    window.addEventListener("wheel", e => {
        e = e || window.event;

        // wheelDelta не даёт возможность узнать количество пикселей
        var delta = e.deltaY || e.detail || e.wheelDelta;

        const minScale = 0.5;
        const maxScale = 2.0;
        if (delta > 0 && game.world.scale.x > minScale) {
            const ds = game.world.scale.x - minScale;
            game.world.scale.add(-(ds > 0.05 ? 0.05 : ds));
        } else if (delta < 0 && game.world.scale.x < maxScale) {
            game.world.scale.add(0.05);
        }

    });

    game.keyboard = new Keyboard({
        'W': (status, key) => {
            if (status === 'press') game.tank.moving = 1;
            else if (status === 'up') game.tank.moving = 0;
        },
        'S': (status, key) => {
            if (status === 'press') game.tank.moving = -1;
            else if (status === 'up') game.tank.moving = 0;
        },
        'A': (status, key, timer) => {
            if (status !== 'press') return
            game.tank.rotate -= game.tank.options.bodyRotateSpeed * timer.deltaTime;
        },
        'D': (status, key, timer) => {
            if (status !== 'press') return
            game.tank.rotate += game.tank.options.bodyRotateSpeed * timer.deltaTime;
        }


    }, this);

    game.keyboard.start();


});



// обновление
game.on('engine.update', (timer) => {
    if (game.pause) return;
    if (!game.tank) return;
    // console.log('engine.update', timer);    
    game.keyboard.update(timer);

    game.tank.target = {
        x: game.mouse.x,
        y: game.mouse.y,
    };

    // if (game.mouse.buttons.right) {
    //     game.tank.moving = true;
    // } else {
    //     game.tank.moving = false;
    // }

    if (game.mouse.buttons.left) {
        // game.tank.requestFire();  
        game.tank.fire();
    }

});










