const vertex =
'attribute vec4 position; attribute vec3 normal; uniform mat4 projectionMatrix; uniform mat4 modelViewMatrix; varying vec3 vNormal; uniform float time;'+
'void main () { '+
  'vNormal = normal;'+
  'float dist = sin(time) * 0.5 + 0.5;'+
  'vec4 offset = position;'+
  'offset.xyz += normal * dist;'+
  'gl_Position = projectionMatrix * modelViewMatrix * offset;}'

  export default vertex;