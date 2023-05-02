import {
  Scene,
  PerspectiveCamera,
  PCFSoftShadowMap,
  Color,
  WebGLRenderer,
  AmbientLight,
  ShaderMaterial,
  SphereBufferGeometry,
  InstancedMesh,
  Matrix4,
  InstancedBufferAttribute,
  DynamicDrawUsage,
  Vector3,
  Object3D,
  MeshBasicMaterial,
} from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

class WebGLApp {
  constructor(parent) {
    //the main function
    this.params = {
      color: 0xff0000,
      backgroundColor: 0xe2f0f9,
    };
    const aspect = window.innerWidth / window.innerHeight;
    // const clock = new Clock()
    //set up scene
    this.scene = new Scene();
    this.scene.background = new Color(this.params.backgroundColor);
    this.camera = new PerspectiveCamera(75, aspect, 0.1, 1000);

    this.renderer = new WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = PCFSoftShadowMap;

    this.scene.add(this.camera);
    this.camera.position.z = 10;

    // controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    // this.resize(window.innerWidth, window.innerHeight)
    this.cursor = {
      x: 0,
      y: 0,
    };

    parent.appendChild(this.renderer.domElement);
    this.makeScene();
    this.animate();
  }
  mousemove = (clientX, clientY) => {
    this.cursor.x = clientX / window.innerWidth - 0.5;
    this.cursor.y = -(clientY / window.innerHeight - 0.5);
  };
  animate = () => {
    this.renderer.render(this.scene, this.camera);
    //////
    const time = performance.now() * 0.003;
    //const opacity = Math.sin(time) * 0.5 + 0.5; // sine wave from 0 to 1
    const opacity = Math.sin(time) * 0.5 + 0.5;
    for (var i = 0; i < 1000; i++) {
      this.opacityAttributeBuffer.setX(i, opacity);
    }
    //this.MeshInstanced.material.uniforms.opacity.value = opacity;

    this.opacityAttributeBuffer.needsUpdate = true;
    this.MeshInstanced.instanceMatrix.needsUpdate = true;
    //////
    requestAnimationFrame(this.animate);
    this.controls.update();
  };

  resize = (width, height) => {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };

  addLights = () => {
    this.createAmbientLight();
  };

  createAmbientLight = () => {
    this.ambientLight = new AmbientLight(0x999999, 1);
    this.scene.add(this.ambientLight);
  };

  makeScene = () => {
    this.addLights();
    this.sphereGeometry = new SphereBufferGeometry(1, 32, 32);
    // create custom shader material
    this.sphereMaterial = new MeshBasicMaterial();
    this.sphereMaterial = new ShaderMaterial({
      transparent: true,
      uniforms: { color: { value: new Color("purple") } },
      vertexShader: `
        varying vec2 vUv;
        attribute float opacity;
        varying float vOpacity;
        void main() {
          vUv = uv;
          vOpacity  = opacity;
          gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying float vOpacity;
        uniform vec3 color;
        void main() {
          gl_FragColor = vec4(color, vOpacity);
        }
      `,
    });
    this.MeshInstanced = new InstancedMesh(
      this.sphereGeometry,
      this.sphereMaterial,
      1000
    );

    const dummy = new Object3D();
    // create array set all in once
    this.opacityArray = new Float32Array(1000);
    // this.opacityAttributeBuffer = new InstancedBufferAttribute();

    for (var i = 0; i < 1000; i++) {
      dummy.position.x = Math.random() * 40 - 20;
      dummy.position.y = Math.random() * 40 - 20;
      dummy.position.z = Math.random() * 40 - 20;
      dummy.scale.setScalar(Math.random());
      dummy.updateMatrix();
      //push the opacity value inside the array
      this.opacityArray[i] = Math.random();

      this.MeshInstanced.setMatrixAt(i, dummy.matrix);

      // this.MeshInstanced.setColorAt(i, new Color(Math.random() * 0xffffff));
    }

    this.opacityAttributeBuffer = new InstancedBufferAttribute(
      this.opacityArray,
      1,
      true
    );
    this.MeshInstanced.geometry.setAttribute(
      "opacity",
      this.opacityAttributeBuffer
    );

    this.MeshInstanced.instanceMatrix.setUsage(DynamicDrawUsage);
    this.scene.add(this.MeshInstanced);
    //set the instance mesh geometry. set attribute -> the opacity to the array value
    //instance buffer attribute

    //console.log(this.MeshInstanced);
  };
}

export default WebGLApp;
