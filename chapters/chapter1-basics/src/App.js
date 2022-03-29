import './App.css';
import React, {useEffect, useRef} from "react"
import WebGLApp from "./webglapp";

function App() {

  const containerRef = useRef(null); // for the canvas
  const webglApp = useRef(null);

  useEffect(()=>{

    if(containerRef == null) return;

    webglApp.current = new WebGLApp(containerRef.current, {
      width: window.innerWidth,
      height: window.innerHeight,
    })

    function onResize () {
      webglApp.current.resize(window.innerWidth, window.innerHeight);
    }

    window.addEventListener('resize', onResize);

  },[])


  return (
    <div className="App" ref={containerRef}>
    </div>
  );
}

export default App;
