import{
    Scene,
    PerspectiveCamera,
    DirectionalLight,
    Mesh,
    MeshBasicMaterial,
    Vector3,
    Color,
    Group,
    BoxGeometry,
    CapsuleGeometry,
    SphereGeometry,
    CircleGeometry,
    ConeGeometry,
    Clock,
    WebGLRenderer,
} from 'three'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'; 

class WebGLApp {

    constructor(parent){
        //the main function
        this.params = {
            color: 0xff0000,
            backgroundColor: 0xc892c7
        }
        const aspect = window.innerWidth / window.innerHeight
        const clock = new Clock()
        //set up scene
        this.scene = new Scene()
        this.scene.background = new Color(this.params.backgroundColor);
        this.camera = new PerspectiveCamera(75, aspect, 0.1, 1000)
        this.renderer = new WebGLRenderer({antialias:true})
        this.renderer.setSize(window.innerWidth, window.innerHeight)
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
        // this.camera.position.x = this.cursor.x * 5
        // this.camera.position.y = this.cursor.y * 5


        this.renderer.render( this.scene, this.camera )
        requestAnimationFrame( this.animate )
        this.controls.update();
    }

    resize = (width, height) => {
        this.camera.aspect = width / height
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(width, height)
        
    }

    makeScene = () => {

        //materials
        const skinMaterial = new MeshBasicMaterial({ color: 0xd1aa89 })
        const dressMaterial = new MeshBasicMaterial({ color: 0xfdff7a })
        const eyeWhite = new MeshBasicMaterial({ color: 'white' })
        const eyeBlack = new MeshBasicMaterial({ color: 'black' })

        //facial
        this.face = this.makeGeometry('sphere', [1.2,32,16], skinMaterial)
        this.face.position.set(0,0.5,0)
        this.scene.add(this.face)

        //eyes_white

        

        this.sclera_R = this.makeGeometry('circle', [0.2], eyeWhite)
        this.sclera_R.position.set(-0.3, 0.7, 1.2)
        this.sclera_R.rotateX(-0.22)

        this.sclera_L = this.makeGeometry('circle', [0.2], eyeWhite)
        this.sclera_L.position.set(0.3, 0.7, 1.2)
        this.sclera_L.rotateX(-0.22)
        //eyes_black
        this.pupil_R = this.makeGeometry('circle', [0.1], eyeBlack)
        this.pupil_R.position.set(-0.3, 0.6, 1.3)
        

        this.pupil_L = this.makeGeometry('circle', [0.1], eyeBlack)
        this.pupil_L.position.set(0.3, 0.6, 1.3)

        this.eye_L = new Group()
        this.eye_L.add( this.sclera_L )
        this.eye_L.add( this.pupil_L )

        this.eye_R = new Group()
        this.eye_R.add( this.sclera_R )
        this.eye_R.add( this.pupil_R )

        this.scene.add(this.eye_L, this.eye_R)

        //dress
        this.dress = this.makeGeometry('cone', [1.5,3.5,32], dressMaterial)
        this.dress.position.set(0,-2,0)
        this.scene.add(this.dress)

        //arms
        this.arm_L = this.makeGeometry('capsule', [0.2,1,10], skinMaterial)
        this.arm_L.position.set(-1.5, -1.74,0)
        this.arm_L.rotation.set(-0.4, -0.2,-1.7)
       
        this.arm_R = this.makeGeometry('capsule', [0.2,1,10], skinMaterial)
        this.arm_R.position.set(1.5, -1.74,0)
        this.arm_R.rotation.set(-0.4, -0.2,1.7)
        
        this.scene.add(this.arm_R, this.arm_L)

        //legs
        this.leg_R = this.makeGeometry('capsule', [0.2,2,10], skinMaterial)
        this.leg_R.position.set(-0.5, -4.5,0)
        
        this.leg_L = this.makeGeometry('capsule', [0.2,2,10], skinMaterial)
        this.leg_L.position.set(0.5, -4.5,0)
        
        this.scene.add(this.leg_R, this.leg_L)

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
        this.makeGUI(gui, "pupil_R", this.pupil_R)
        this.makeGUI(gui, "sclera_R", this.sclera_R)
        
        //scene
        gui
        .addColor(this.params, 'backgroundColor')
        .onChange(()=>{
            this.scene.background.set(this.params.backgroundColor)
        })

        gui.close()

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
        }

        //this.scene.add(box);
        return geometry
    }


  

}

export default WebGLApp;