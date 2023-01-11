import{
    Scene,
    PerspectiveCamera,
    Mesh,
    PCFSoftShadowMap,
    Color,
    Shape,
    ExtrudeGeometry,
    WebGLRenderer,
    MeshPhongMaterial,
    AmbientLight,
    RawShaderMaterial,
    PointLight} from 'three'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import vertex from './vertex.js'
import fragment from './fragment.js'
const createLoop = require('raf-loop');

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

        parent.appendChild(this.renderer.domElement)
        this.addLights()
        this.makeScene()
        this.animate()

    }

    animate = () => {
        // this.renderer.render( this.scene, this.camera )
        // requestAnimationFrame( this.animate )
        // this.controls.update();
        let time = 0;


        // Start our render loop
        createLoop((dt) => {
        // update time
        time += dt / 500;
        this.material.uniforms.time.value = time;
        console.log("running?");
        // render
        this.controls.update();
        this.renderer.render( this.scene, this.camera )
        }).start();
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

        const geometry = this.makeHeart();
        
        
        //material simple
        // const material = new MeshPhongMaterial({
        //     color: 0xff0000,
        //     flatShading: true
        // });
        
        // material Shaders
        this.material = new RawShaderMaterial({
            vertexShader: vertex,
            fragmentShader: fragment,
            uniforms: {
              time: { type: 'f', value: 3 }
            }
          });



        const mesh = new Mesh(geometry, this.material);
        this.scene.add(mesh);

      //  this.scene.add(this.hair)


    }

    makeHeart = () => {

        const heartShape = new Shape();
  
        heartShape.moveTo( 25, 25 );
        heartShape.bezierCurveTo( 25, 25, 20, 0, 0, 0 );
        heartShape.bezierCurveTo( - 30, 0, - 30, 35, - 30, 35 );
        heartShape.bezierCurveTo( - 30, 55, - 10, 77, 25, 95 );
        heartShape.bezierCurveTo( 60, 77, 80, 55, 80, 35 );
        heartShape.bezierCurveTo( 80, 35, 80, 0, 50, 0 );
        heartShape.bezierCurveTo( 35, 0, 25, 25, 25, 25 );
      
        const extrudeSettings = { depth: 8, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };
      
        const geometry = new ExtrudeGeometry( heartShape, extrudeSettings );
      // // -- EDIT END
      
        // This is a ThreeJS utility to position the vertices
        // into world center [ 0, 0, 0 ]
        geometry.center();
      
        // Another utility to scale all the vertices
        geometry.scale(0.08, 0.08, 0.08);
        geometry.rotateZ(Math.PI);
      
        // Now compute a normal for each vertex
        // This will add a new attribute called 'normal'
        geometry.computeVertexNormals();
      
        return geometry;
    }


}

export default WebGLApp;