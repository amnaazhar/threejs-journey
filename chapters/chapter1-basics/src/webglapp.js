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
        this.camera.position.z = 10

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
    mousemove = (clientX, clientY) => {
        this.cursor.x = clientX / window.innerWidth - 0.5
        this.cursor.y = - (clientY / window.innerHeight - 0.5)
        
    }
    animate = () => {
        // console.log(this.cursor.x);
        this.eye_R.rotation.y = Math.sin(this.cursor.x * Math.PI * 2) 
        this.eye_R.rotation.x = Math.cos(this.cursor.y * Math.PI * 2)
        console.log(this.eye_R.rotation.y)

        this.eye_L.rotation.y = Math.sin(this.cursor.x * Math.PI * 2) 
        this.eye_L.rotation.x = Math.cos(this.cursor.y * Math.PI * 2) 

        this.arm_L.rotation.x = Math.sin(this.cursor.x * Math.PI)
        this.arm_R.rotation.x = -Math.sin(this.cursor.x * Math.PI) 
       // this.arm_L.rotation.y = Math.cos(this.cursor.x * Math.PI * 2) 
        this.leg_L.rotation.x = Math.sin(this.cursor.x * Math.PI * 0.3)
        this.leg_R.rotation.x = -Math.sin(this.cursor.x * Math.PI * 0.3) 

        this.dress.rotation.z = -Math.sin(this.cursor.x * Math.PI * 0.05) 
        this.face.position.x = -Math.sin(this.cursor.x * Math.PI * 0.05) 

        this.hair.rotation.z = -Math.sin(this.cursor.x * Math.PI * 0.05) 


        this.renderer.render( this.scene, this.camera )
        requestAnimationFrame( this.animate )
        this.controls.update();
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

    makeScene = () => {

        this.addLights()

        //materials
        // const skinMaterial = new MeshBasicMaterial({ color: 0xd1aa89 })
        // const dressMaterial = new MeshBasicMaterial({ color: 0xfdff7a })
        const skinMaterial = new MeshPhongMaterial({
            color: 0xd1aa89,
            flatShading: true,
        });
        const dressMaterial = new MeshPhongMaterial({
            color: 0xfdff7a,
            flatShading: true
        });
        const blackMaterial = new MeshPhongMaterial({
            color: 0x000000,
            flatShading: true,
        });
    
        const texture = new TextureLoader().load( 'assets/textures/Vector.jpg' );
        const eyeWhite = new MeshBasicMaterial({ map: texture })

        //facial
        this.face = this.makeGeometry('sphere', [1.2,32,16], skinMaterial)
        this.face.position.set(0,0.5,0)
        this.scene.add(this.face)

        //EYES - sphere
        this.eye_L = this.makeGeometry('sphere', [0.25,32,16], eyeWhite)
        this.eye_L.position.set(0.35, 0.5, 1.1)
        this.eye_R = this.makeGeometry('sphere', [0.25,32,16], eyeWhite)
        this.eye_R.position.set(-0.35, 0.5, 1.1)
        // //eyes_white

        this.scene.add(this.eye_L,this.eye_R)


        //dress
        this.dress = this.makeGeometry('cone', [1.4,2.5,32], dressMaterial)
        this.dress.position.set(0,-2,0)
        this.dress.castShadow = true
        this.scene.add(this.dress)

        //arms
        this.arm_L = this.makeGeometry('capsule', [0.2,1,10], skinMaterial)
        this.arm_L.position.set(-1.5, -1.74,0)
        this.arm_L.rotation.set(-0.4, -0.2,-1.7)
       
        this.arm_R = this.makeGeometry('capsule', [0.2,1,10], skinMaterial)
        this.arm_R.position.set(1.5, -1.74,0)
        this.arm_R.rotation.set(-0.4, -0.2,1.7)
        this.arm_L.castShadow = true
        this.arm_R.castShadow = true
        this.scene.add(this.arm_R, this.arm_L)

        //legs
        this.leg_R = this.makeGeometry('capsule', [0.2,2,10], skinMaterial)
        this.leg_R.position.set(-0.5, -4.5,0)
        
        this.leg_L = this.makeGeometry('capsule', [0.2,2,10], skinMaterial)
        this.leg_L.position.set(0.5, -4.5,0)

        this.leg_L.castShadow = true
        this.leg_R.castShadow = true
        
        this.scene.add(this.leg_R, this.leg_L)

        //hair
        this.hair_top = this.makeGeometry('cone', [1.6, 0.7,32], blackMaterial)
        this.hair_top.position.set(0,1.5,0)
       // this.scene.add(this.hair_top)


        //hair
        this.hair_back = this.makeGeometry('cylinder', [1.6, 2, 2.4, 32], blackMaterial)
        this.hair_back.position.set(0,0,0)
        this.hair_back.rotation.set(0,Math.PI/2,0)
       // this.scene.add(this.hair)

       //ground
       const ground = new Mesh(new PlaneGeometry( 10,38 ), new MeshPhongMaterial({ //0xc1d5e1
        color: 0xc1d5e1,
        flatShading: true, }))
        ground.position.set(0,-5,-8)
        ground.rotation.set(-Math.PI/2.2,0,0)
        ground.receiveShadow = true
        this.scene.add( ground )


        //GUI
        //Debug Controls
        const gui = new GUI()

        //objects
        this.makeGUI(gui, "face", this.face)
        this.makeGUI(gui, "dress", this.dress)
        this.makeGUI(gui, "leg_Right", this.leg_R)
        this.makeGUI(gui, "leg_Left", this.leg_L)
        this.makeGUI(gui, "arm_Left", this.arm_L)
        this.makeGUI(gui, "arm_Right", this.arm_R)
        this.makeGUI(gui, "eye_R", this.eye_R)
        // this.makeGUI(gui, "sclera_R", this.sclera_R)
        
        //scene
        gui
        .addColor(this.params, 'backgroundColor')
        .onChange(()=>{
            this.scene.background.set(this.params.backgroundColor)
        })

        gui.close()

        //hair

        const geometry = new BufferGeometry();
        // create a simple square shape. We duplicate the top left and bottom right
        // vertices because each vertex needs to appear once per triangle.
        const vertices = new Float32Array( [
            -2, -1.2,  1.0,
           2, -1.2,  1.0,
            1.55,  1.2,  1.0,
       
            1.55,  1.2,  1, //1.6, 2, 2.4
           -1.55,  1.2,  1.0,
           -2.0, -1.2,  1.0
        ] );

        // itemSize = 3 because there are 3 values (components) per vertex
        geometry.setAttribute( 'position', new BufferAttribute( vertices, 3 ) );
        const hair_front = new Mesh( geometry, blackMaterial);
        hair_front.position.set(0,-0,-1.1)
      //  this.scene.add(hair_front)
        // this.hair_back.castShadow = true
        // this.hair_top.castShadow = true
        // hair_front.castShadow = true

        this.hair = new Group()
        this.hair.add( this.hair_back, this.hair_top, hair_front )

        this.scene.add(this.hair)


    }

    makeClouds = () => {


      //  const cloud_1 = this.makeGeometry('sphere', [0.25,32,16], eyeWhite))
        
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


    // U T I L I T Y

    //GEOMETRIES

    makeGeometry = (name, params, material) => {

        let geometry;
        // eslint-disable-next-line default-case
        switch (name){
            case "cube":
                geometry = new Mesh(
                    new BoxGeometry(params[0], params[1], params[2]), // width height depth
                    material
                );
                break
            case "sphere":
                geometry = new Mesh(
                    new SphereGeometry(params[0], params[1], params[2]), // radius height segs depth segs
                    material
                );
                break
            case "cone":
                geometry = new Mesh(
                    new ConeGeometry(params[0], params[1], params[2]), // radius height radial segs
                    material
                );
                break
            case "capsule":
                geometry = new Mesh(
                    new CapsuleGeometry(params[0], params[1], params[2],32), // radius len cap-divisions rad-segs
                    material
                );
                break
            case "circle":
                geometry = new Mesh(
                    new CircleGeometry(params[0], 32), // radius segs
                    material
                );
                break
            case "cylinder":
                geometry = new Mesh(
                    new CylinderGeometry(params[0],params[1], params[2], params[3], 1, false, 0, Math.PI), //radiusTop : Float, radiusBottom : Float, height : Float, radialSegments
                    material
                );
                break
        }

        //this.scene.add(box);
        return geometry
    }


  

}

export default WebGLApp;