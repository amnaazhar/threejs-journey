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
        
        this.angle = -2;
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
        //this.scene.background = new Color(this.params.backgroundColor);
        this.scene.fog = new Fog( 0x000000, 1, 1000 );
        // fog end
        this.camera = new PerspectiveCamera(75, aspect, 0.1, 1000)

        this.renderer = new WebGLRenderer({antialias:true})
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = PCFSoftShadowMap;

        this.scene.add( this.camera )
        this.camera.position.z = -300

        // controls
        this.controls = new OrbitControls( this.camera, this.renderer.domElement );
       // this.resize(window.innerWidth, window.innerHeight)
       this.cursor = {
            x: 0,
            y: 0
        }

        // postprocessing

        this.composer = new EffectComposer( this.renderer );
        this.composer.addPass( new RenderPass( this.scene, this.camera ) );

        this.afterimagePass = new AfterimagePass();
        this.composer.addPass( this.afterimagePass );

        parent.appendChild(this.renderer.domElement)
        this.makeScene()
        this.animate()
        this.createGUI()

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
        
        if (this.sphere != null){


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
            var x = Math.ceil((this.p.x)/this.resolution)
            var y = Math.ceil((this.p.y)/this.resolution)
            console.log("Value of boxes is:", x, y)
            console.log("P.x: ", this.p.x,"P.y: ", this.p.y)
            var value = this.array_of_dir[x-1][y-1]
            this.p.vx += Math.cos(value) * -0.01
            this.p.vy += Math.sin(value) * 0.01
            //this.p.x = x
            //this.p.y = y

            this.p.x += this.p.vx;
            this.p.y += this.p.vy;

            // apply some friction so point doesn't speed up too much
            this.p.vx *= 0.99;
            this.p.vy *= 0.99;

            // wrap around edges of screen
            if(this.p.x > this.width) this.p.x = 1;
            if(this.p.y > this.height) this.p.y = 1;
            if(this.p.x < 0) this.p.x = this.width;
            if(this.p.y < 0) this.p.y = this.height;


            this.sphere.position.set(this.p.x - this.width/2, this.p.y - this.height/2)

        }
        this.composer.render();
        //this.renderer.render( this.scene, this.camera )
        requestAnimationFrame( this.animate )
        this.controls.update();
    }

    createGUI = () => {

        const gui = new GUI();
        gui
            .add( this.afterimagePass.uniforms[ 'damp' ], 'value', 0, 1 )
            .step( 0.001 )
            .name('Afterimage Damp')

    }


    makeScene = () => {

        this.addLights()
        // const gui = new GUI;

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
            var res = 25
            this.resolution = res
            const width = 450
            const height = 450
            var value;
            this.width = width
            this.height = height
            
            //make a point with position and velocity
            this.p = {
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                vx: 0,
                vy: 0
            }


            this.array_of_boxes = new Array();
            this.array_of_dir = new Array();
            console.log("P is ", this.p)
            console.log("width height is", this.width, this.height)

            //with triangles

            for(var x = 0; x < width; x+=res ){
                //console.log(x/res)
                this.array_of_dir[x/res] = new Array();
                this.array_of_boxes[x/res] = new Array();
                for(var y = 0; y < height; y+=res){
                    
                    value = Math.PI/6

                    const geometry = new ConeGeometry( 5, 25, 3 )
                    const cone = new Mesh( geometry, new MeshBasicMaterial( {color: 0x000000, wireframe:true} ))
                   
                    //var cube = new Mesh(new BoxGeometry(res, res, 1), new MeshBasicMaterial( {color: 0x00ff00, wireframe:true} ))
                    cone.position.set(x-width/2+res/2, y-height/2+res/2, 10)
                    cone.rotateZ(value)
                    this.scene.add( cone )

                    this.array_of_dir [x/res][y/res] = value
                    this.array_of_boxes[x/res][y/res] = cone

                }

            }
            this.sphere  = new Mesh(new SphereGeometry(5, 5, 32), new MeshBasicMaterial( {color: 0x0000ff} ))            
            // this.sphere.position.set(width/2, height/2, 10)
             this.sphere.position.set(this.p.x, this.p.y)
             this.scene.add(this.sphere);

            //with rectangles
            // for(var x = 0; x < width; x+=res ){
            //     //console.log(x/res)
            //     this.array_of_boxes[x/res] = new Array();
            //     for(var y = 0; y < height; y+=res){
                    
            //         value = (x + y) * 0.01 * Math.PI * 2;
                    
            //         var cube = new Mesh(new BoxGeometry(res, res, 1), new MeshBasicMaterial( {color: 0x00ff00, wireframe:true} ))
            //         cube.position.set(x-width/2+res/2, y-height/2+res/2, 10);
            //         this.scene.add( cube );

            //         this.array_of_boxes[x/res][y/res] = cube

            //     }

            // }

        // //scene
        // gui
        // .addColor(this.params, 'backgroundColor')
        // .onChange(()=>{
        //     this.scene.background.set(this.params.backgroundColor)
        // })

        // gui.close()
        // this.scene.add(gui)

    }

    makeGUI = (gui, folderName, obj) => {
        //gui face
        const objGUI = gui.addFolder(folderName);
        objGUI
            .add(obj.position,'x')
            .min(-10)
            .max(10)
            .step(0.01)
        objGUI
            .add(obj.position,'y')
            .min(-10)
            .max(10)
            .step(0.01)
        objGUI
            .add(obj.position,'z')
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.01)
        objGUI
            .add(obj.rotation,'x')
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.01)
            .name('rotX')
        objGUI
            .add(obj.rotation,'y')
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.01)
            .name('rotY')
        objGUI
            .add(obj.rotation,'z')
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.01)
            .name('rotZ')
        objGUI
            .addColor(this.params, 'color')
            .onChange(()=>{
                obj.material.color.set(this.params.color)
            })
        objGUI.close()
    }

  

}

export default WebGLApp;



// for (x=0; x < width ; x +-3){

//     for (y = 0 y <height ; y +=3){

//         cube (3,3)
//         cube.position (x,y)


//     }
// }