const fragment =
'precision highp float; varying vec3 vNormal; void main () {gl_FragColor = vec4(vNormal, 1.0);}';
export default fragment;