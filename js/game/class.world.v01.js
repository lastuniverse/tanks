import { Group, Sprite, Point, bus } from '../paradigm/engine/class.game.js'
import { Rerandom } from '../paradigm/tools/class.rerandom.js'


bus.once('engine.init', game => {

});

bus.once('engine.preload', game => {
    game.loader.image.load('desert', '/images/desert.png', '/images/desert.json');
    // game.loader.image.load('grass1', '/images/temp/ground/MM_OGRMR_ROAD_01.jpg');
    // game.loader.image.load('grass1', '/images/temp/ground/MM_DWRF_FLOOR_01.jpg');
    // game.loader.image.load('grass1', '/images/temp/ground/MM_CAVEFLOOR_03.jpg');
    // game.loader.image.load('grass1', '/images/temp/ground/JLO_SNKNTMP_SOLID.jpg');
    // game.loader.image.load('grass1', '/images/temp/ground/JLO_MCAVES_GROUND.jpg');
    // game.loader.image.load('grass1', '/images/temp/ground/JLO_MCAVES_GROUND2.1.jpg');
    // game.loader.image.load('grass1', '/images/temp/ground/JLO_RFUNDEAD_FLOOR01.jpg');
    // game.loader.image.load('grass1', '/images/temp/ground/JLO_DMAUL_RUBBLE02.jpg');
    // game.loader.image.load('grass1', '/images/temp/ground/JLO_DMAUL_FLOOR01.jpg');
    // game.loader.image.load('grass1', '/images/temp/ground/JLO_DMAUL_CEILING.jpg');
    // game.loader.image.load('grass1', '/images/temp/ground/JLO_CVRNS_SAND.jpg');
    // game.loader.image.load('grass1', '/images/temp/ground/JLO_BLOODELF_FLOOR_02.jpg');
    // game.loader.image.load('grass1', '/images/temp/ground/JC_SLVRMN_PLAINSTONE01.jpg');
    // game.loader.image.load('grass1', '/images/temp/ground/JACRYPTFLOOR01.jpg');
    // game.loader.image.load('grass1', '/images/temp/ground/BM_ZUL_TILEFLOOR01.jpg');
    // game.loader.image.load('grass1', '/images/temp/ground/BM_ULDAMAN_TILEFLOOR01.jpg');
    // game.loader.image.load('grass1', '/images/temp/ground/BM_ULDAMAN_SANDFLR01.jpg');
    // game.loader.image.load('grass1', '/images/temp/ground/BM_ULDAMAN_DIRTFLR01.jpg');
    // game.loader.image.load('grass1', '/images/temp/ground/BM_THUNDER_POOLROCK_02.jpg');
    // game.loader.image.load('grass1', '/images/temp/ground/BM_SKOL_TILEFLOOR01.jpg');
    // game.loader.image.load('grass1', '/images/temp/ground/BM_SKL_LIGHTFLOOR01.jpg');
    // game.loader.image.load('grass1', '/images/temp/ground/BM_SHDWFANG_KCHNFLR_01.jpg');
    // game.loader.image.load('grass1', '/images/temp/ground/BM_SHDWFANG_COBBLESTONE_01.jpg');
    // game.loader.image.load('grass1', '/images/temp/ground/BM_PVP_INTFLOOR01.jpg');
    // game.loader.image.load('grass1', '/images/temp/ground/BM_MRDN_DIRTFLOOR01.jpg');
    // game.loader.image.load('grass1', '/images/temp/ground/BM_MRDN_ROCKCLNG01.jpg');
    // game.loader.image.load('grass1', '/images/temp/ground/BM_LDRN_STONEFLOOR01.jpg');
    // game.loader.image.load('grass1', '/images/temp/ground/BM_KZN_INTFLOOR_WORN01.jpg');
    // game.loader.image.load('grass1', '/images/temp/ground/BM_BRSPIRE_ROCKFLR01.jpg');
    // game.loader.image.load('grass1', '/images/temp/ground/BM_BRSPIRE_CUBEROCK01.jpg');
    // game.loader.image.load('grass1', '/images/temp/ground/BM_BF_INTFLOOR02.jpg');
    // game.loader.image.load('grass1', '/images/temp/ground/BM_BF_EXTFLOOR01.jpg');
    // game.loader.image.load('grass1', '/images/temp/ground/AU_WALL_SLATE_DARK.jpg');
    // game.loader.image.load('grass1', '/images/temp/ground/AU_WALL_SLATE.jpg');



});

bus.once('engine.create', game => {
    // game.loader.image.tint('tank_wite', 'tank', 0.5, 0, 2.5, 0.5);
});

// const prng = new Rerandom(Math.floor(Math.random() * 1024));
const prng = new Rerandom(4);

export class World extends Group {
    // frames = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    frames = [4, 4, 4, 4, 5, 5, 7, 7, 8];

    spriteSize = 100;//128;
    chankSize;
    worldWidth;
    worldWidth;
    chankAmountX;
    chankAmountY;
    chanks = [];

    setChankSize(size = 8) {
        this.chankSize = size;
        this.initChanks()
    }
    initChanks() {
        this.chankAmountX = Math.ceil(this.worldWidth / this.chankSize);
        this.chankAmountY = Math.ceil(this.worldHeight / this.chankSize);
        this.chanks = [];
        for (var x = 0; x < this.chankAmountX; x++) {
            this.chanks[x] = [];
            for (var y = 0; y < this.chankAmountY; y++) {
                this.chanks[x][y] = this.initChank(x, y);
            }
        }
        // console.log(this.chanks)
    }

    initChank(chankX, chankY) {
        const size = this.spriteSize * this.chankSize;
        const chank = this.chanks[chankX][chankY] = {
            ground: new Group(this.game, size * chankX, size * chankY),
            decales: new Group(this.game, size * chankX, size * chankY),
            assets: new Group(this.game, size * chankX, size * chankY),
        };
        this.layers.ground.add(chank.ground);

        for (var x = 0; x < this.chankSize; x++) {
            const worldX = this.chankSize * chankX + x;
            for (var y = 0; y < this.chankSize; y++) {
                const worldY = this.chankSize * chankY + y;
                const tile = this.generateTile(worldX, worldY);
                chank.ground.add(tile);
                // this.setTile(tile, worldX, worldY);
            }
        };
        return chank;
    }

    getChank(chankX, chankY) {
        const chank = this.chanks?.[chankX]?.[chankY];
        // console.log(chank, chankX, chankY);        
        return chank;
    }

    setTile(sprite, worldX, worldY) {


    }

    generateTile(worldX, worldY) {

        const x = this.spriteSize * (worldX % this.chankSize);
        const y = this.spriteSize * (worldY % this.chankSize);
        const sprite = new Sprite(this.game, 'desert', x, y);

        sprite.scale.x *= Math.round(prng.random(worldX, worldY, 1)) * 2 - 1;
        sprite.angle = Math.floor(prng.random(worldX, worldY, 3) * 360);
        sprite.atlas.frame = this.frames[Math.floor(prng.random(worldX, worldY) * this.frames.length)];
        return sprite;
    }

    constructor(game, width, height) {
        super(game, 0, 0);
        this.worldWidth = width;
        this.worldHeight = height;

        this.layers = {
            ground: new Group(this.game, 0, 0),
            decales: new Group(this.game, 0, 0),
            assets: new Group(this.game, 0, 0),
        }

        Object.values(this.layers).forEach(layer => {
            this.add(layer);
        });
        game.scene.add(this);

        this.setChankSize(8);

    }

    setFocus(object) {
        this.focus = object;
        // this.calculateVisibleChanks();
    };

    calculateVisibleChanks() {
        this.layers.ground.clear();

        const divider = this.spriteSize * this.chankSize;
        const dx = this.game.width / 2;// + this.spriteSize;
        const dy = this.game.height / 2;// + this.spriteSize;
        const x1 = Math.floor((this.focus.position.x - dx) / divider);
        const y1 = Math.floor((this.focus.position.y - dy) / divider);
        const x2 = Math.ceil((this.focus.position.x + dx) / divider);
        const y2 = Math.ceil((this.focus.position.y + dy) / divider);
        // let text='';
        for (var chankX = x1; chankX <= x2; chankX++) {
            for (var chankY = y1; chankY <= y2; chankY++) {
                // text += '['+chankX+','+chankY+'], ';
                const chank = this.getChank(chankX, chankY);
                if (!chank) continue;
                this.layers.ground.add(chank.ground);
            }
        }
        // if(text !== this.text){
        //     this.text=text;
        //     console.log(text);
        // }

    }


    update(dt) {
        this.calculateVisibleChanks();
        super.update(dt);

        this.position.x = -this.focus.position.x + this.game.width / 2;
        this.position.y = -this.focus.position.y + this.game.height / 2;
        // this.rotate = -this.focus.rotate;

    }


}