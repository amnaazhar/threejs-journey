/* eslint-disable no-array-constructor */
import{
    Scene,
    PerspectiveCamera,
    Mesh,
    MeshBasicMaterial,
    PCFSoftShadowMap,
    Color,
    SphereGeometry,
    ConeGeometry,
    WebGLRenderer,
    AmbientLight,
    PointLight,
    Fog,
    Group
} from 'three'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'; 
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { AfterimagePass } from 'three/examples/jsm/postprocessing/AfterimagePass.js';
import { ImprovedNoise } from 'three/examples/jsm/math/ImprovedNoise.js';
import colors from './colors.js'

class WebGLApp {

    constructor(parent){
        
        //the main function

        // --- V A R S ----
        this.params = {
            color: 0xff0000,
            backgroundColor: 0xe2f0f9,
            field: true,
            noise_value: 2
        }
        this.colorsArray = colors()
        this.switch_field = false
        this.perlin = new ImprovedNoise()
    
        // ---- BASIC SCENE SETUP----
        const aspect = window.innerWidth / window.innerHeight
        // const clock = new Clock()
       
        //scene
        this.scene = new Scene()
        //this.scene.background = new Color(this.params.backgroundColor);
        
        //add fog for trail fade
        this.scene.fog = new Fog( 0x000000, 1, 1000 );
        // fog end
        
        //camera setup
        this.camera = new PerspectiveCamera(75, aspect, 0.1, 1000)
        this.camera.position.z = -300
        this.scene.add( this.camera )

        //renderer set up
        this.renderer = new WebGLRenderer({antialias:true})
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = PCFSoftShadowMap;
        parent.appendChild(this.renderer.domElement)

        // postprocessing
        this.composer = new EffectComposer( this.renderer );
        this.composer.addPass( new RenderPass( this.scene, this.camera));
        this.afterimagePass = new AfterimagePass();
        this.composer.addPass( this.afterimagePass );

        // controls set up
        this.controls = new OrbitControls( this.camera, this.renderer.domElement );
       
        //for cursor interaction
        // this.cursor = {
        //         x: 0,
        //         y: 0
        // }

        //call init function here
        this.addLights()
        this.makeScene()
        this.animate()
        this.createGUI()

    }

    getRandomColor(){

        //random color
        var color = new Color();
        color.setHex(`0x${this.colorsArray[Math.floor(Math.random() * this.colorsArray.length)]}`);
        if (color < 500) {
            color.setHex(500);
        }
        return color

    }

    resize = (width, height) => {
        this.camera.aspect = width / height
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(width, height)
        this.composer.setSize(width, height);
        
    }

    addLights= () =>{
        this.createAmbientLight();
        this.createPointLight();
    }

    createAmbientLight = () => {
        this.ambientLight = new AmbientLight(0x999999, 1);
        this.scene.add(this.ambientLight);
    };
    
    createPointLight = () => {
        this.light = new PointLight(0xffffff, 0.3, 0);
        this.light.castShadow = true;
        this.light.shadow.mapSize.width = 5000;
        this.light.shadow.mapSize.height = 5000;
        this.light.position.set(0,20,-5);
        this.scene.add(this.light);

        const light = new PointLight(0xffffff, 0.2, 0);
        light.castShadow = false;
        light.position.set(0,30,50);
        this.scene.add(light);
    };


    animate = () => {
        
        if (this.particleArr != null){
            for(var i = 0; i < this.particleArr.length ; i++){
                this.moveParticle(i)
            }
        }

        this.composer.render();
        requestAnimationFrame( this.animate )
        this.controls.update();
    }

    moveParticle = (i) => {

        var x = Math.ceil((this.particleArr[i].p.x)/this.res)-1
        var y = Math.ceil((this.particleArr[i].p.y)/this.res)-1
        var value = this.array_of_dir[x][y]

        this.particleArr[i].p.vx += Math.cos(value) * -0.01
        this.particleArr[i].p.vy += Math.sin(value) * 0.01

        this.particleArr[i].p.x +=  this.particleArr[i].p.vx;
        this.particleArr[i].p.y +=  this.particleArr[i].p.vy;

        // apply some friction so point doesn't speed up too much
        this.particleArr[i].p.vx *= 0.99;
        this.particleArr[i].p.vy *= 0.99;

        // wrap around edges of screen - boundaries
        if(this.particleArr[i].p.x > this.width) this.particleArr[i].p.x = 1;
        if(this.particleArr[i].p.y > this.height) this.particleArr[i].p.y = 1;
        if(this.particleArr[i].p.x < 0) this.particleArr[i].p.x = this.width;
        if(this.particleArr[i].p.y < 0) this.particleArr[i].p.y = this.height;

        this.particleArr[i].sphere.position.set(this.particleArr[i].p.x - this.width/2, this.particleArr[i].p.y - this.height/2)

    }
    

    makeScene = () => {

        //field setup
        this.res = 25 // resolution
        this.width = 450 // flowfield width and height
        this.height = 450
        this.num_p = 25 // number of particles
        
        //make an array of particles with position and velocity
        this.particleArr = new Array()

        for (var i = 0; i < this.num_p; i++){

            var p = {
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                vx: 0,
                vy: 0
            }

            var color = this.getRandomColor()
            var sphere  = new Mesh(new SphereGeometry(5, 5, 32), new MeshBasicMaterial( {color: color} ))
            sphere.position.set(p.x, p.y)
            this.scene.add(sphere);

            var particle = {
                p:p, sphere:sphere
            }

            this.particleArr[i] = particle
            
        }


        //making array to store field values
        this.array_of_boxes = new Array() // helper code to visualize field
        this.array_of_dir = new Array() // array with all the vectors of the field

        //with wireframed cones to visualize

        //TO DO: data from perlin
       // understanding the data
       // get the debug working
       // to the image

        var value; // for field
        for(var x = 0; x < this.width; x+=this.res ){
            //console.log(x/res)
            this.array_of_dir[x/this.res] = new Array();
            this.array_of_boxes[x/this.res] = new Array();

            for(var y = 0; y < this.height; y+=this.res){

                value = this.perlin.noise( x * 0.65, y * 65, 0.65);

                this.array_of_dir[x/this.res][y/this.res] = value * this.params.noise_value

            }
        }

        this.makeField();
    }

    makeField = () => {

        let angle = 0;
        this.field_lines = new Group();
       
        for(var x = 0; x < this.width; x+=this.res ){

            for(var y = 0; y < this.height; y+=this.res){
                
                angle = this.array_of_dir[x/this.res][y/this.res]
                //console.log("show field ", angle)

                const geometry = new ConeGeometry( 1, 25, 1 )
                const cone = new Mesh( geometry, new MeshBasicMaterial( {color: 0xffffff, wireframe:true} )) //white color
                cone.position.set(x-this.width/2+this.res/2, y-this.height/2+this.res/2, 10)
                cone.rotateZ(angle)
                this.field_lines.add(cone)

            }
        }
        //field lines needs to be rotated horizontally to go from ' | ' to ' __ '
        this.field_lines.rotateZ (Math.PI/2)

        this.showField();

    }

    showField = () => {

        if(this.params.field) this.scene.add(this.field_lines)
        else this.scene.remove(this.field_lines)

    }
    

    createGUI = () => {

        const gui = new GUI();
        gui
            .add( this.afterimagePass.uniforms[ 'damp' ], 'value', 0, 1 )
            .step( 0.001 )
            .name('PostProcessing Damp')
        gui
            .add(this.params, "field")
            .onChange(this.showField)
            .name('Show field')
        // gui
        //     .add(this.params, "noise_value" , 'value', 0, 5)
        //     .step( 0.1 )
        //     .name('Noise value')
    }
}

export default WebGLApp;
