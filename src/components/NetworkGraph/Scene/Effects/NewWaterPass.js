import React, { forwardRef, useMemo } from "react";
import { Uniform } from "three";
import { Effect } from "postprocessing";
import {
  Mesh,
  OrthographicCamera,
  PlaneBufferGeometry,
  Scene,
  ShaderMaterial,
  Vector2,
} from "three";

const fragmentShader = `uniform int byp; //should we apply the glitch ?
uniform float time;
uniform float factor;
uniform vec2 resolution;
uniform sampler2D texture;

varying vec2 vUv;

void main() {
  if (byp<1) {
    vec2 uv1 = vUv;
    vec2 uv = gl_FragCoord.xy/resolution.xy;
    float frequency = 6.0;
    float amplitude = 0.015 * factor;
    float x = uv1.y * frequency + time * .7;
    float y = uv1.x * frequency + time * .3;
    uv1.x += cos(x+y) * amplitude * cos(y);
    uv1.y += sin(x-y) * amplitude * cos(y);
    vec4 rgba = texture2D(texture, uv1);
    gl_FragColor = rgba;
  } else {
    gl_FragColor = texture2D(texture, vUv);
  }
}`;

const vertexShader = `varying vec2 vUv;
  void main(){
    vUv = uv;
    vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * modelViewPosition;
  }`;

let _uTime;
let _uFactor;
let _uUniforms;
let _uMaterial;
let _uCamera;
let _uScene;
let _uQuad;

// Effect implementation
class NewWaterPassImpl extends Effect {
  constructor({ factor = 0.0 } = {}) {
    const uniforms = new Map([
      ["byp", new Uniform(0)],
      ["texture", new Uniform(null)],
      ["time", new Uniform(0.0)],
      ["factor", new Uniform(factor)],
      ["resolution", new Uniform(null)],
    ]);

    _uUniforms = uniforms;

    const dt_size = 64;
    _uUniforms.get("resolution").value = new Vector2(dt_size, dt_size);

    _uMaterial = new ShaderMaterial({
      uniforms: _uUniforms,
      vertexShader,
      fragmentShader,
    });

    _uCamera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
    _uScene = new Scene();
    _uQuad = new Mesh(new PlaneBufferGeometry(2, 2), null);
    _uQuad.frustumCulled = false; // Avoid getting clipped
    _uScene.add(_uQuad);

    _uFactor = factor;
    _uTime = 0;

    super("NewWaterPass", fragmentShader, {
      uniforms,
      vertexShader,
    });

    this.time = _uTime;
    this.factor = _uFactor;
    this.uniforms = _uUniforms;
    this.material = _uMaterial;
    this.camera = _uCamera;
    this.scene = _uScene;
    this.quad = _uQuad;
  }

  update(renderer, readBuffer, deltaTime) {
    _uUniforms.get("factor").value = _uFactor;
    const factor = Math.max(0, _uFactor);
    _uUniforms.get("byp").value = factor ? 0 : 1;
    _uUniforms.get("texture").value = readBuffer.texture;
    _uUniforms.get("time").value = _uTime;
    _uUniforms.get("factor").value = _uFactor;
    _uTime += 0.05;
    _uQuad.material = _uMaterial;

    this.time = _uTime;
    this.factor = _uFactor;
    this.uniforms = _uUniforms;
    this.material = _uMaterial;
    this.camera = _uCamera;
    this.scene = _uScene;
    this.quad = _uQuad;
    if (this.renderToScreen) {
      renderer.setRenderTarget(null);
      renderer.render(_uScene, _uCamera);
    } else {
      // renderer.setRenderTarget(writeBuffer);
      if (this.clear) renderer.clear();
      renderer.render(_uScene, _uCamera);
    }
  }
}

// Effect component
export const NewWaterPass = forwardRef(({ factor }, ref) => {
  const effect = useMemo(() => new NewWaterPassImpl(factor), [factor]);
  return <primitive ref={ref} object={effect} dispose={null} />;
});
