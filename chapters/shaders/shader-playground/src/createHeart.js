

module.exports = function () {
    // Set up our geometry
    //const geometry = new THREE.BufferGeometry();
  
    // // -- EDIT START
    const heartShape = new THREE.Shape();
  
    heartShape.moveTo( 25, 25 );
    heartShape.bezierCurveTo( 25, 25, 20, 0, 0, 0 );
    heartShape.bezierCurveTo( - 30, 0, - 30, 35, - 30, 35 );
    heartShape.bezierCurveTo( - 30, 55, - 10, 77, 25, 95 );
    heartShape.bezierCurveTo( 60, 77, 80, 55, 80, 35 );
    heartShape.bezierCurveTo( 80, 35, 80, 0, 50, 0 );
    heartShape.bezierCurveTo( 35, 0, 25, 25, 25, 25 );
  
    const extrudeSettings = { depth: 8, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };
  
    const geometry = new THREE.ExtrudeGeometry( heartShape, extrudeSettings );
  // // -- EDIT END
  
    // This is a ThreeJS utility to position the vertices
    // into world center [ 0, 0, 0 ]
    geometry.center();
  
    // Another utility to scale all the vertices
    geometry.scale(0.2, 0.2, 0.2);
  
    // Now compute a normal for each vertex
    // This will add a new attribute called 'normal'
    geometry.computeVertexNormals();
  
    return geometry;
  };
  
  
  // // -- EDIT START
  // const heartShape = new THREE.Shape();
  
  // heartShape.moveTo( 25, 25 );
  // heartShape.bezierCurveTo( 25, 25, 20, 0, 0, 0 );
  // heartShape.bezierCurveTo( - 30, 0, - 30, 35, - 30, 35 );
  // heartShape.bezierCurveTo( - 30, 55, - 10, 77, 25, 95 );
  // heartShape.bezierCurveTo( 60, 77, 80, 55, 80, 35 );
  // heartShape.bezierCurveTo( 80, 35, 80, 0, 50, 0 );
  // heartShape.bezierCurveTo( 35, 0, 25, 25, 25, 25 );
  
  // const extrudeSettings = { depth: 8, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };
  
  // const geometry_heart = new THREE.ExtrudeGeometry( heartShape, extrudeSettings );
  // // -- EDIT END