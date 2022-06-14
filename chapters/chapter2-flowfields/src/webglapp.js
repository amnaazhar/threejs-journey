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
    PlaneGeometry
} from 'three'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'; 

class WebGLApp {

    constructor(parent){
        
        //the main function
        this.params = {
            color: 0xff0000,
            backgroundColor: 0xe2f0f9
        }
        const aspect = window.innerWidth / window.innerHeight
       // const clock = new Clock()
        //set up scene
        this.scene = new Scene()
        this.scene.background = new Color(this.params.backgroundColor);
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

        parent.appendChild(this.renderer.domElement)
        this.makeScene()
        this.animate()

    }

    resize = (width, height) => {
        this.camera.aspect = width / height
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(width, height)
        
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

            var x = Math.ceil((this.sphere.position.x + window.innerWidth/4)/this.resolution) - 1
            var y = Math.ceil((this.sphere.position.y + window.innerHeight/4)/this.resolution) - 1
            
            var temp = this.array_of_boxes[x][y]
            //console.log(this.array_of_boxes)
            temp.material.color = new Color(0xff0000);
            temp.material.needsUpdate = true;
        }

        this.renderer.render( this.scene, this.camera )
        requestAnimationFrame( this.animate )
        this.controls.update();
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
            var res = 50
            this.resolution = res
            const width = window.innerWidth
            const height = window.innerHeight
            var value;
            this.array_of_boxes = new Array();

            this.sphere  = new Mesh(new SphereGeometry(10, 10, 32), new MeshBasicMaterial( {color: 0x0000ff} ))            
            this.sphere.position.set(100, 200, 0)
            this.scene.add(this.sphere);

            for(var x = 0; x < width/2; x+=res ){
                //console.log(x/res)
                this.array_of_boxes[x/res] = new Array();
                for(var y = 0; y < height/2; y+=res){
                    
                    value = (x + y) * 0.01 * Math.PI * 2;
                    
                    var cube = new Mesh(new BoxGeometry(res, res, 1), new MeshBasicMaterial( {color: 0x00ff00, wireframe:true} ))
                    cube.position.set(x - width/4, y -height/4 , 10);
                    this.scene.add( cube );

                    this.array_of_boxes[x/res][y/res] = cube

                }

            }

            console.log(this.array_of_boxes.length)

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