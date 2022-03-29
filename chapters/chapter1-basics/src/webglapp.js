import{
    Scene,
    PerspectiveCamera,
    DirectionalLight,
    Mesh,
    MeshBasicMaterial,
    Vector3,
    BoxGeometry,
    Clock,
    WebGLRenderer,
} from 'three'

class WebGLApp {

    constructor(parent){
        //the main function

        const aspect = window.innerWidth / window.innerHeight
        const clock = new Clock()
        //set up scene
        this.scene = new Scene()
        this.camera = new PerspectiveCamera(75, aspect, 0.1, 1000)
        this.renderer = new WebGLRenderer({antialias:true});
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.scene.add( this.camera )
        this.camera.position.z = 5;
       // this.resize(window.innerWidth, window.innerHeight)
        parent.appendChild(this.renderer.domElement)
        this.makeBox()
        this.animate()
    }

    resize = (width, height) => {
        this.camera.aspect = width / height
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(width, height)
        
    }

    makeScene = () => {

        this.box = this.makeBox();
       // this.scene.add(this.box);

    }

    animate = () => {
        this.renderer.render( this.scene, this.camera );
        requestAnimationFrame( this.animate );
    }

    // U T I L I T Y

    makeBox = () => {

        let boxMesh = new BoxGeometry()
        let boxMat = new MeshBasicMaterial({ color: 0x00ff00 })
        let box = new Mesh(boxMesh, boxMat);
        this.scene.add(box);
       // return box;
    }

}

export default WebGLApp;