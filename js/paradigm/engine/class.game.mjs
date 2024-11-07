import ExtendEventEmitter from '/js/tools/class.extend.event.emitter.mjs'
import bus from '/js/tools/tool.events.bus.mjs'
import { Loader } from './class.loader.mjs'
import { Timer } from './class.timer.mjs'
import { ImageLoader } from './class.loader.image.mjs'
import { AudioLoader } from './class.loader.audio.mjs'
import { Sound } from './class.sound.mjs'
import { Mouse } from './class.mouse.mjs'
import { Group, Sprite, Point } from './class.group.mjs'
import { Vector2 } from './class.vector.mjs'

// console.log(window)



class Game extends ExtendEventEmitter {
    #scenes = {};
    #scenesList = [];
    constructor(width, height) {
        super();

        // общая шина событий
        this.bus = bus;

        // инициализация холста
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
        this.context.scale(1, 1);
        // window.devicePixelRatio

        this.canvas.id = 'canvas';
        this.canvas.style.zIndex = 8;
        this.canvas.style.position = 'absolute';
        // this.canvas.style.border = '1px solid red';
        var body = document.getElementsByTagName('body')[0];
        body.appendChild(this.canvas)
        this.resize(width, height);
        // window.addEventListener('resize', ()=>{
        //     this.emit('engine.resize', this);
        // });
        // window.innerWidth, window.innerHeight


        // инициализация мышки
        this.mouse = new Mouse(this.canvas);

        // инициализация мышки
        this.timer = new Timer();

        


        // инициализация лоадеров
        this.loader = new Loader();
        new ImageLoader(this.loader);
        new AudioLoader(this.loader);

        // инициализация сцены
        // this.scene = new Group(this, 0, 0);
        this.addScene('main');
        // this.scene.scale = {y:0.5}

        // this.timerData = {
        //     stop: false,
        //     frameCount: 0,
        //     fps: 10,
        //     // $results = $("#results");
        //     // , fpsInterval, startTime, now, then, elapsed;
        // }

        setTimeout(() => {
            this.bus.emit('engine.init', this);
            this.emit('engine.init', this);
            

            this.bus.emit('engine.preload', this);
            this.emit('engine.preload', this);
            

            this.loader.once('load', progress => {
                // console.log('load', `${progress.count}/${progress.amount}`);
                this.bus.emit('engine.create', this);
                this.emit('engine.create', this);
                this.ready = true;

                // this.timerData.fpsInterval = 1000 / this.timerData.fps;
                // this.timerData.then = Date.now();
                // this.timerData.startTime = this.timerData.then;

                this.timer.create('engine.timer', 60);
                // this.timer.speed = 1;
                this.timer.on('engine.timer', timer=>{
                    // console.log(timer.count)
                    this.#loop(timer);
                });
            });
        }, 0);
    }

    addScene(name, isActive=true){
        if(typeof name !== 'string') throw `Name of scene must be a string`;
        if(this.#scenes[name]) throw `Scene whith name ${name} allready exists`;
        const scene = new Group(this, 0, 0);
        scene.name = name;
        this.#scenes[name] = scene;
        this.#scenesList.push(scene);
        if(isActive) this.setScene('main');

    }
    
    setScene(name){
        if(typeof name !== 'string') throw `Name of scene must be a string`;
        if(!this.#scenes[name]) throw `Scene whith name ${name} is epsent`;
        this.scene = this.#scenes[name];        
    }
    
    deleteScene(name){
        if(typeof name !== 'string') throw `Name of scene must be a string`;
        if(!this.#scenes[name]) throw `Scene whith name ${name} is epsent`;
        if(this.#scenes[name] === this.scene) throw `Scene whith name ${name} is active now`;
        delete this.#scenes[name];
        this.#scenesList = Object.values(this.#scenes);
    }

    resize(width = Math.floor(window.innerWidth), height = Math.floor(window.innerHeight)) {
        this.width = width;
        this.height = height;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    #loop(timer, time, frame) {
        this.context.setTransform(1, 0, 0, 1, 0, 0);

      
        
        

        this.context.clearRect(0, 0, this.width, this.height);


        this.emit('engine.update', timer);
        this.bus.emit('engine.update', this, timer);
        if(this.scene){
            this.scene.update(timer);
            const state = {
                position: new Point(0),
                scale: new Point(1),
                pivot: new Point(0.5),
                rotate: 0,
            }
            // this.scene.scale = 0.5;
            this.scene.render(state);
        }
    }

    drawTest(color, x, y) {
        this.context.lineWidth = 3;
        this.context.fillStyle = '#000';
        this.context.strokeStyle = color;
    
        this.context.beginPath();
        this.context.arc(
            x, y,
            10,
            0, 2 * Math.PI
        );
        this.context.fill();
        this.context.stroke();
    
    }
}





export {
    Game,
    Loader,
    ImageLoader,
    Mouse,
    Timer,
    ExtendEventEmitter,
    Sound,
    Group,
    Sprite,
    Point,
    Vector2,
    bus
};
