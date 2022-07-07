import{
    Scene,
    PerspectiveCamera,
    DirectionalLight,
    Mesh,
    MeshBasicMaterial,
    Vector3,
    PCFSoftShadowMap,
    Color,
    Group,
    BoxGeometry,
    CapsuleGeometry,
    SphereGeometry,
    CircleGeometry,
    ConeGeometry,
    Clock,
    WebGLRenderer,
    TextureLoader,
    BufferGeometry,
    BufferAttribute,
    CylinderGeometry,
    MeshPhongMaterial,
    DoubleSide,
    AmbientLight,
    PointLight,
    PlaneGeometry,
    Fog
} from 'three'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'; 
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { AfterimagePass } from 'three/examples/jsm/postprocessing/AfterimagePass.js';

class WebGLApp {

    constructor(parent){
        
        this.angle = -2; // clean up: whats this?
        //the main function
        this.params = {
            color: 0xff0000,
            backgroundColor: 0xe2f0f9
        }
        const aspect = window.innerWidth / window.innerHeight
       // const clock = new Clock()
        
       //set up scene
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


        // Random Array
        this.colorsArray = [
            "63b598", "ce7d78", "ea9e70", "a48a9e", "c6e1e8", "648177", "0d5ac1",
            "f205e6", "1c0365", "14a9ad", "4ca2f9", "a4e43f", "d298e2", "6119d0",
            "d2737d", "c0a43c", "f2510e", "651be6", "79806e", "61da5e", "cd2f00",
            "9348af", "01ac53", "c5a4fb", "996635", "b11573", "4bb473", "75d89e",
            "2f3f94", "2f7b99", "da967d", "34891f", "b0d87b", "ca4751", "7e50a8",
            "c4d647", "e0eeb8", "11dec1", "289812", "566ca0", "ffdbe1", "2f1179",
            "935b6d", "916988", "513d98", "aead3a", "9e6d71", "4b5bdc", "0cd36d",
            "250662", "cb5bea", "228916", "ac3e1b", "df514a", "539397", "880977",
            "f697c1", "ba96ce", "679c9d", "c6c42c", "5d2c52", "48b41b", "e1cf3b",
            "5be4f0", "57c4d8", "a4d17a", "225b8", "be608b", "96b00c", "088baf",
            "f158bf", "e145ba", "ee91e3", "05d371", "5426e0", "4834d0", "802234",
            "6749e8", "0971f0", "8fb413", "b2b4f0", "c3c89d", "c9a941", "41d158",
            "fb21a3", "51aed9", "5bb32d", "807fb", "21538e", "89d534", "d36647",
            "7fb411", "0023b8", "3b8c2a", "986b53", "f50422", "983f7a", "ea24a3",
            "79352c", "521250", "c79ed2", "d6dd92", "e33e52", "b2be57", "fa06ec",
            "1bb699", "6b2e5f", "64820f", "1c271", "21538e", "89d534", "d36647",
            "7fb411", "0023b8", "3b8c2a", "986b53", "f50422", "983f7a", "ea24a3",
            "79352c", "521250", "c79ed2", "d6dd92", "e33e52", "b2be57", "fa06ec",
            "1bb699", "6b2e5f", "64820f", "1c271", "9cb64a", "996c48", "9ab9b7",
            "06e052", "e3a481", "0eb621", "fc458e", "b2db15", "aa226d", "792ed8",
            "73872a", "520d3a", "cefcb8", "a5b3d9", "7d1d85", "c4fd57", "f1ae16",
            "8fe22a", "ef6e3c", "243eeb", "1dc18", "dd93fd", "3f8473", "e7dbce",
            "421f79", "7a3d93", "635f6d", "93f2d7", "9b5c2a", "15b9ee", "0f5997",
            "409188", "911e20", "1350ce", "10e5b1", "fff4d7", "cb2582", "ce00be",
            "32d5d6", "17232", "608572", "c79bc2", "00f87c", "77772a", "6995ba",
            "fc6b57", "f07815", "8fd883", "060e27", "96e591", "21d52e", "d00043",
            "b47162", "1ec227", "4f0f6f", "1d1d58", "947002", "bde052", "e08c56",
            "28fcfd", "bb09b", "36486a", "d02e29", "1ae6db", "3e464c", "a84a8f",
            "911e7e", "3f16d9", "0f525f", "ac7c0a", "b4c086", "c9d730", "30cc49",
            "3d6751", "fb4c03", "640fc1", "62c03e", "d3493a", "88aa0b", "406df9",
            "615af0", "4be47", "2a3434", "4a543f", "79bca0", "a8b8d4", "00efd4",
            "7ad236", "7260d8", "1deaa7", "06f43a", "823c59", "e3d94c", "dc1c06",
            "f53b2a", "b46238", "2dfff6", "a82b89", "1a8011", "436a9f", "1a806a",
            "4cf09d", "c188a2", "67eb4b", "b308d3", "fc7e41", "af3101", "ff065",
            "71b1f4", "a2f8a5", "e23dd0", "d3486d", "00f7f9", "474893", "3cec35",
            "1c65cb", "5d1d0c", "2d7d2a", "ff3420", "5cdd87", "a259a4", "e4ac44",
            "1bede6", "8798a4", "d7790f", "b2c24f", "de73c2", "d70a9c", "25b67",
            "88e9b8", "c2b0e2", "86e98f", "ae90e2", "1a806b", "436a9e", "0ec0ff",
            "f812b3", "b17fc9", "8d6c2f", "d3277a", "2ca1ae", "9685eb", "8a96c6",
            "dba2e6", "76fc1b", "608fa4", "20f6ba", "07d7f6", "dce77a", "77ecca"]

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
        //this.renderer.render( this.scene, this.camera )
        requestAnimationFrame( this.animate )
        this.controls.update();
    }

    moveParticle = (i) => {

        var x = Math.ceil((this.particleArr [i].p.x)/this.res)-1
        var y = Math.ceil((this.particleArr [i].p.y)/this.res)-1
        // console.log("Value of boxes is:", x, y)
        // console.log("P.x: ", this.p.x,"P.y: ", this.p.y)
        var value = this.array_of_dir[x][y]

        this.particleArr [i].p.vx += Math.cos(value) * -0.01
        this.particleArr [i].p.vy += Math.sin(value) * 0.01
        //this.p.x = x
        //this.p.y = y

        this.particleArr [i].p.x +=  this.particleArr [i].p.vx;
        this.particleArr [i].p.y +=  this.particleArr [i].p.vy;

        // apply some friction so point doesn't speed up too much
        this.particleArr [i].p.vx *= 0.99;
        this.particleArr [i].p.vy *= 0.99;

        // wrap around edges of screen
        if(this.particleArr [i].p.x > this.width) this.particleArr [i].p.x = 1;
        if(this.particleArr [i].p.y > this.height) this.particleArr [i].p.y = 1;
        if(this.particleArr [i].p.x < 0) this.particleArr [i].p.x = this.width;
        if(this.particleArr [i].p.y < 0) this.particleArr [i].p.y = this.height;

        this.particleArr [i].sphere.position.set(this.particleArr [i].p.x - this.width/2, this.particleArr [i].p.y - this.height/2)

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

        // console.log("P is ", this.p)
        // console.log("width height is", this.width, this.height)

        //with wireframed cones to visualize

        var value; // for field
        for(var x = 0; x < this.width; x+=this.res ){
            //console.log(x/res)
            this.array_of_dir[x/this.res] = new Array();
            this.array_of_boxes[x/this.res] = new Array();

            for(var y = 0; y < this.height; y+=this.res){
                
                value = Math.PI/6

                const geometry = new ConeGeometry( 5, 25, 3 )
                const cone = new Mesh( geometry, new MeshBasicMaterial( {color: 0x000000, wireframe:true} ))
                
                //var cube = new Mesh(new BoxGeometry(res, res, 1), new MeshBasicMaterial( {color: 0x00ff00, wireframe:true} ))
                cone.position.set(x-this.width/2+this.res/2, y-this,this.height/2+this.res/2, 10)
                cone.rotateZ(value)
                this.scene.add( cone )

                this.array_of_dir [x/this.res][y/this.res] = value
                this.array_of_boxes[x/this.res][y/this.res] = cone

            }
        }
    }
    

    createGUI = () => {

        const gui = new GUI();
        gui
            .add( this.afterimagePass.uniforms[ 'damp' ], 'value', 0, 1 )
            .step( 0.001 )
            .name('Afterimage Damp')

    }
}

export default WebGLApp;




    // makeGUI = (gui, folderName, obj) => {
    //     //gui face
    //     const objGUI = gui.addFolder(folderName);
    //     objGUI
    //         .add(obj.position,'x')
    //         .min(-10)
    //         .max(10)
    //         .step(0.01)
    //     objGUI
    //         .add(obj.position,'y')
    //         .min(-10)
    //         .max(10)
    //         .step(0.01)
    //     objGUI
    //         .add(obj.position,'z')
    //         .min(-Math.PI)
    //         .max(Math.PI)
    //         .step(0.01)
    //     objGUI
    //         .add(obj.rotation,'x')
    //         .min(-Math.PI)
    //         .max(Math.PI)
    //         .step(0.01)
    //         .name('rotX')
    //     objGUI
    //         .add(obj.rotation,'y')
    //         .min(-Math.PI)
    //         .max(Math.PI)
    //         .step(0.01)
    //         .name('rotY')
    //     objGUI
    //         .add(obj.rotation,'z')
    //         .min(-Math.PI)
    //         .max(Math.PI)
    //         .step(0.01)
    //         .name('rotZ')
    //     objGUI
    //         .addColor(this.params, 'color')
    //         .onChange(()=>{
    //             obj.material.color.set(this.params.color)
    //         })
    //     objGUI.close()
    // }


// for (x=0; x < width ; x +-3){

//     for (y = 0 y <height ; y +=3){

//         cube (3,3)
//         cube.position (x,y)


//     }
// }



// COLORING BOXES CODE INSIDE ANIMATE FUNCTION



            //apply boundaries here

            // var x = Math.ceil((this.sphere.position.x + this.width/2)/this.resolution) - 1
            // var y = Math.ceil((this.sphere.position.y + this.height/2)/this.resolution) - 1
            
            // // helper code -- TODO: replace it with reading box values and applying it to particle
            // for (var m=0; m<this.array_of_boxes.length; m++){
            //     for (var n=0; n<this.array_of_boxes.length; n++){

            //         var temp = this.array_of_boxes[m][n]
            //         //console.log(this.array_of_boxes)
            //         temp.material.color = new Color(0x000000)
            //         temp.material.needsUpdate = true

            //        // this.sphere.
                
            //     }
            // }
            // var temp = this.array_of_boxes[x][y]
            // //console.log(this.array_of_boxes)
            // temp.material.color = new Color(0xff0000)
            // temp.material.needsUpdate = true

            // end of  helper code 



            //MOVING: just animating the sphere
            // this.angle+=0.5;
            // if(this.angle> 360){
            //     this.angle=0;
            // }
            // this.sphere.position.x = Math.cos (this.angle * (Math.PI / 180)) * 120
            // this.sphere.position.y = Math.sin (this.angle * (Math.PI / 180)) * 120
            
            //get value
            // calculate new acceleration factor based on value direction
            // and add that to point's velocity



                    /*
        In pseudocode, that's something like:

        // starting point x = 500 y = 100
        begin_curve()
        for (n in [0..num_steps]) {
            draw_vertex(x, y)
            x_offset = x - left_x     y_offset = y - top_y
            column_index = int(x_offset / resolution)     row_index = int(y_offset / resolution)
            // NOTE: normally you want to check the bounds here     grid_angle = grid[column_index][row_index]
            x_step = step_length * cos(grid_angle)     y_step = step_length * sin(grid_angle)
            x = x + x_step     y = y + y_step }
        end_curve()
        */