import { Game, Group, Sprite, Point, Sound } from './paradigm/engine/class.game.mjs'
import { World } from './game/class.world.mjs'
import { Explode } from './game/class.explode.mjs'





const game = new Game();
game.pause = true;





// инициализация
game.once('engine.init', () => {
    console.log('engine.init');
    game.loader.baseURL = '';
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

    const sprite = new Sprite(game, 'desert', 200, 200);
    sprite.atlas.frame = 7;
    game.scene.add(sprite)


    setInterval(()=>{
        // запускаем анимацию взрыва в координатах цели
        const explodePoint = new Point( game.mouse.x, game.mouse.y );
        const explode = new Explode(game, explodePoint, 0);
        game.scene.add(explode);
    }, 1000)


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

});











