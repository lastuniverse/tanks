import { Game, Group, Sprite, Point, Sound } from './paradigm/engine/class.game.mjs'

import { Tank, Explode } from './game/class.tank.mjs'
import { World } from './game/class.world.mjs'

import { WS } from '/js/tools/class.ws.mjs'


const game = new Game();
game.pause = true;





// инициализация
game.once('engine.init', () => {
    console.log('engine.init');
    game.loader.baseURL = '';

    game.tanks = {};
    game.uuid = localStorage.getItem('uuid');

});

// предзагрузка
game.once('engine.preload', () => {
    console.log('engine.preload');

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


    // game.tank = new Tank(game, game.world, 0, 0);
    // game.tanks.push(game.tank);
    // game.world.setFocus(game.tank);


    game.timer.create('game.userdata', 1000 / 120);


    const sprite = new Sprite(game, 'desert', 200, 200);
    sprite.atlas.frame = 7;
    game.scene.add(sprite)


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



});



// обновление
game.on('engine.update', (dt) => {
    // console.log('engine.update', dt);


    if (game.pause) return;
    if (!game.tank) return;


    game.tank.target = {
        x: game.mouse.x,
        y: game.mouse.y,
    };

    if (game.mouse.buttons.right) {
        game.tank.moving = true;
    } else {
        game.tank.moving = false;
    }

    if (game.mouse.buttons.left && game.ws) {
        game.tank.requestFire();        
    }
});










game.ws = new WS({
    pathname: "/ws",
    // port: 3081
});


// идентифицируемся
game.ws.on('open', (...args) => {
    game.ws.send('game.uuid', { uuid: game.uuid });
});


// ожидание старата
game.ws.on('game.init', data => {
    console.log('game.init', data);

    // получаем uuid (если был всеравно перезаписываем)
    game.uuid = data.uuid;
    game.utid = data.utid;
    localStorage.setItem('uuid', data.uuid);

    game.pause = false;

});


// обработка действий пользователя
game.timer.on('game.userdata', timer => {
    if (game.pause) return;

    const dx = game.mouse.x - game.width / 2;
    const dy = game.mouse.y - game.height / 2;
    const angle = Math.atan2(dy, dx) + Math.PI / 2;

    const data = {
        a: angle,
        m: game?.tank?.moving ?? false,
    };

    game.ws.send('game.userdata', data);
});


// ожидание действий танков с сервера
game.ws.on('game.userdata', userdata => {
    // console.log(list)
    if (!game.ready) return;

    if(userdata?.f?.length>0) console.log(userdata.f);

    const hash = game.tanks;

    game.tanks = {};
    userdata.forEach(tdata => {
        let tank = hash[tdata.utid];

        if (tank) {
            delete hash[tdata.utid];
            tank.nextState(tdata);
        } else {
            tank = new Tank(game, game.world, 0, 0);
            tank.init(tdata);
        }

        game.tanks[tdata.utid] = tank;




        if (tank.utid === game.utid) {
            game.tank = tank;
            game.world.setFocus(game.tank);
        }
    });

    Object.values(hash).forEach(item => {
        item.destroy();
    });


});



