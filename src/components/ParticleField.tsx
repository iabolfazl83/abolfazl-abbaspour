"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { sceneState } from "@/lib/scene";
import { onReady } from "@/lib/ready";
import { prefersReducedMotion } from "@/lib/scroll";

/* ------------------------------------------------------------------ */
/*  Shape generators — every shape returns exactly `n` xyz points      */
/* ------------------------------------------------------------------ */

type Rand = () => number;

function mulberry32(seed: number): Rand {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function rotate(out: Float32Array, rx: number, ry: number, rz: number) {
  const m = new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(rx, ry, rz));
  const v = new THREE.Vector3();
  for (let i = 0; i < out.length; i += 3) {
    v.set(out[i], out[i + 1], out[i + 2]).applyMatrix4(m);
    out[i] = v.x;
    out[i + 1] = v.y;
    out[i + 2] = v.z;
  }
  return out;
}

function sphere(n: number, r: Rand) {
  const out = new Float32Array(n * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const radius = Math.sqrt(1 - y * y);
    const theta = golden * i;
    const R = 2.2 * (0.94 + r() * 0.08);
    out[i * 3] = Math.cos(theta) * radius * R;
    out[i * 3 + 1] = y * R;
    out[i * 3 + 2] = Math.sin(theta) * radius * R;
  }
  return out;
}

function helix(n: number, r: Rand) {
  const out = new Float32Array(n * 3);
  const turns = 3.2;
  const height = 7.2;
  for (let i = 0; i < n; i++) {
    const t = r();
    const angle = t * Math.PI * 2 * turns;
    const y = (t - 0.5) * height;
    if (r() < 0.18) {
      // rungs between the two strands
      const k = Math.round(t * 42) / 42;
      const a = k * Math.PI * 2 * turns;
      const s = r() * 2 - 1;
      out[i * 3] = Math.cos(a) * 1.15 * s;
      out[i * 3 + 1] = (k - 0.5) * height;
      out[i * 3 + 2] = Math.sin(a) * 1.15 * s;
    } else {
      const strand = r() < 0.5 ? 0 : Math.PI;
      const j = 0.12;
      out[i * 3] = Math.cos(angle + strand) * 1.15 + (r() - 0.5) * j;
      out[i * 3 + 1] = y + (r() - 0.5) * j;
      out[i * 3 + 2] = Math.sin(angle + strand) * 1.15 + (r() - 0.5) * j;
    }
  }
  return rotate(out, 0.2, 0, -0.55);
}

function galaxy(n: number, r: Rand) {
  const out = new Float32Array(n * 3);
  const branches = 4;
  for (let i = 0; i < n; i++) {
    const radius = Math.pow(r(), 1.4) * 3.8 + 0.08;
    const branch = ((i % branches) / branches) * Math.PI * 2;
    const spin = radius * 1.25;
    const spread = 0.35 * radius;
    const rx = Math.pow(r(), 3) * (r() < 0.5 ? 1 : -1) * spread;
    const ry = Math.pow(r(), 3) * (r() < 0.5 ? 1 : -1) * spread * 0.5;
    const rz = Math.pow(r(), 3) * (r() < 0.5 ? 1 : -1) * spread;
    out[i * 3] = Math.cos(branch + spin) * radius + rx;
    out[i * 3 + 1] = ry;
    out[i * 3 + 2] = Math.sin(branch + spin) * radius + rz;
  }
  return rotate(out, 0.95, 0, 0.25);
}

function grid(n: number, r: Rand) {
  const out = new Float32Array(n * 3);
  const cols = Math.round(Math.sqrt(n * 1.6));
  const rows = Math.ceil(n / cols);
  const w = 9.5;
  const d = 6;
  for (let i = 0; i < n; i++) {
    const cx = i % cols;
    const cz = Math.floor(i / cols);
    const x = (cx / (cols - 1) - 0.5) * w;
    const z = (cz / (rows - 1) - 0.5) * d;
    const y = Math.sin(x * 0.9) * Math.cos(z * 1.1) * 0.45 + Math.sin(x * 0.35 + z * 0.6) * 0.35;
    out[i * 3] = x + (r() - 0.5) * 0.02;
    out[i * 3 + 1] = y;
    out[i * 3 + 2] = z;
  }
  return rotate(out, 0.62, 0, 0);
}

function glyph(n: number, r: Rand, text: string) {
  const out = new Float32Array(n * 3);
  const W = 720;
  const H = 300;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  const pts: number[] = [];
  if (ctx) {
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "700 250px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
    ctx.fillText(text, W / 2, H / 2 + 8);
    const data = ctx.getImageData(0, 0, W, H).data;
    for (let y = 0; y < H; y += 2) {
      for (let x = 0; x < W; x += 2) {
        if (data[(y * W + x) * 4 + 3] > 140) pts.push(x, y);
      }
    }
  }
  const count = pts.length / 2;
  for (let i = 0; i < n; i++) {
    if (count === 0) {
      out[i * 3] = (r() - 0.5) * 6;
      out[i * 3 + 1] = (r() - 0.5) * 2;
      out[i * 3 + 2] = 0;
      continue;
    }
    const k = Math.floor(r() * count);
    const scale = 6.4 / W;
    out[i * 3] = (pts[k * 2] - W / 2) * scale + (r() - 0.5) * 0.03;
    out[i * 3 + 1] = -(pts[k * 2 + 1] - H / 2) * scale + (r() - 0.5) * 0.03;
    out[i * 3 + 2] = (r() - 0.5) * 0.6;
  }
  return out;
}

function portal(n: number, r: Rand) {
  const out = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const a = r() * Math.PI * 2;
    const halo = r() < 0.28;
    const R = halo ? 2.1 + (r() - 0.3) * 1.6 : 2.1;
    const tube = halo ? r() * 0.1 : Math.sqrt(r()) * 0.3;
    const b = r() * Math.PI * 2;
    out[i * 3] = (R + Math.cos(b) * tube) * Math.cos(a);
    out[i * 3 + 1] = (R + Math.cos(b) * tube) * Math.sin(a);
    out[i * 3 + 2] = Math.sin(b) * tube + (halo ? (r() - 0.5) * 0.4 : 0);
  }
  return rotate(out, 0.45, -0.35, 0);
}

function globe(n: number, r: Rand) {
  const out = new Float32Array(n * 3);
  const R = 2.35;
  const lats = 13;
  const longs = 18;
  for (let i = 0; i < n; i++) {
    const kind = r();
    let x: number, y: number, z: number;
    if (kind < 0.45) {
      const li = Math.floor(r() * lats) + 1;
      const phi = (li / (lats + 1)) * Math.PI;
      const theta = r() * Math.PI * 2;
      x = Math.sin(phi) * Math.cos(theta);
      y = Math.cos(phi);
      z = Math.sin(phi) * Math.sin(theta);
    } else if (kind < 0.9) {
      const lo = Math.floor(r() * longs);
      const theta = (lo / longs) * Math.PI * 2;
      const phi = r() * Math.PI;
      x = Math.sin(phi) * Math.cos(theta);
      y = Math.cos(phi);
      z = Math.sin(phi) * Math.sin(theta);
    } else {
      const u = r() * 2 - 1;
      const t = r() * Math.PI * 2;
      const s = Math.sqrt(1 - u * u);
      x = s * Math.cos(t);
      y = u;
      z = s * Math.sin(t);
    }
    out[i * 3] = x * R;
    out[i * 3 + 1] = y * R;
    out[i * 3 + 2] = z * R;
  }
  return rotate(out, 0.35, 0, 0.18);
}

/* ------------------------------------------------------------------ */
/*  Shaders                                                            */
/* ------------------------------------------------------------------ */

const noise = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
`;

const vertexShader = /* glsl */ `
uniform float uTime;
uniform float uMorph;
uniform float uIntro;
uniform float uPixelRatio;
uniform float uSize;
uniform float uVelocity;
uniform vec3 uMouse;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorC;

attribute vec3 aS1;
attribute vec3 aS2;
attribute vec3 aS3;
attribute vec3 aS4;
attribute vec3 aS5;
attribute vec3 aS6;
attribute vec4 aRand;

varying vec3 vColor;
varying float vAlpha;

${noise}

float seg(float i){
  // per-particle staggered progress for segment i -> i+1
  return smoothstep(0.0, 1.0, clamp((uMorph - i) * 1.45 - aRand.y * 0.45, 0.0, 1.0));
}

void main(){
  vec3 p = position;
  p = mix(p, aS1, seg(0.0));
  p = mix(p, aS2, seg(1.0));
  p = mix(p, aS3, seg(2.0));
  p = mix(p, aS4, seg(3.0));
  p = mix(p, aS5, seg(4.0));
  p = mix(p, aS6, seg(5.0));

  float f = fract(uMorph);
  float transition = sin(clamp(f, 0.0, 1.0) * 3.14159265);

  float t = uTime * 0.12;
  vec3 q = p * 0.55 + vec3(0.0, 0.0, aRand.y * 2.0);
  vec3 n = vec3(
    snoise(q + vec3(t, 0.0, 0.0)),
    snoise(q + vec3(0.0, t + 13.7, 0.0)),
    snoise(q + vec3(0.0, 0.0, t + 27.1))
  );
  float amp = 0.05 + transition * 0.85 + uVelocity * 0.35;
  p += n * amp;

  // intro: particles fly in from a wide cloud and assemble
  vec3 scattered = normalize(p + vec3(0.001)) * (7.0 + aRand.x * 9.0) + n * 3.0;
  float intro = smoothstep(0.0, 1.0, clamp(uIntro * 1.35 - aRand.y * 0.35, 0.0, 1.0));
  p = mix(scattered, p, intro);

  vec4 world = modelMatrix * vec4(p, 1.0);

  // mouse repulsion in world space
  vec2 d = world.xy - uMouse.xy;
  float dist = length(d);
  float force = smoothstep(1.6, 0.0, dist) * uMouse.z;
  world.xy += normalize(d + vec2(0.0001)) * force * 0.55;
  world.z += force * 0.6;

  vec4 mv = viewMatrix * world;
  gl_Position = projectionMatrix * mv;

  float sparkle = step(0.975, aRand.w);
  float size = uSize * (0.35 + aRand.x * 0.9) * (1.0 + sparkle * 1.4) * (1.0 + transition * 0.5);
  gl_PointSize = size * uPixelRatio / -mv.z;

  float h = clamp(p.y * 0.18 + 0.5, 0.0, 1.0);
  vec3 col = mix(uColorA, uColorB, clamp(aRand.z * 0.7 + h * 0.6 - 0.15, 0.0, 1.0));
  col = mix(col, uColorC, smoothstep(0.82, 1.0, aRand.z) * 0.8);
  col = mix(col, vec3(1.0), sparkle * 0.85 + force * 0.4);
  vColor = col;

  float twinkle = 0.65 + 0.35 * sin(uTime * (1.2 + aRand.x * 2.0) + aRand.y * 40.0);
  float depthFade = smoothstep(-16.0, -5.0, mv.z);
  vAlpha = twinkle * depthFade * intro;
}
`;

const fragmentShader = /* glsl */ `
uniform float uAlpha;
varying vec3 vColor;
varying float vAlpha;

void main(){
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.0, d);
  a = pow(a, 1.8);
  if (a < 0.01) discard;
  gl_FragColor = vec4(vColor * 1.15, a * vAlpha * uAlpha);
}
`;

/* ------------------------------------------------------------------ */

export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduced = prefersReducedMotion();
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: false,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      return; // no WebGL — the CSS background still carries the page
    }

    const isSmall = window.innerWidth < 768;
    const COUNT = isSmall ? 6500 : 13000;
    let dpr = Math.min(window.devicePixelRatio || 1, isSmall ? 1.5 : 1.75);
    renderer.setPixelRatio(dpr);
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 9);

    const rand = mulberry32(1337);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(sphere(COUNT, rand), 3));
    geometry.setAttribute("aS1", new THREE.BufferAttribute(helix(COUNT, rand), 3));
    geometry.setAttribute("aS2", new THREE.BufferAttribute(galaxy(COUNT, rand), 3));
    geometry.setAttribute("aS3", new THREE.BufferAttribute(grid(COUNT, rand), 3));
    geometry.setAttribute("aS4", new THREE.BufferAttribute(glyph(COUNT, rand, "</>"), 3));
    geometry.setAttribute("aS5", new THREE.BufferAttribute(portal(COUNT, rand), 3));
    geometry.setAttribute("aS6", new THREE.BufferAttribute(globe(COUNT, rand), 3));
    const r4 = new Float32Array(COUNT * 4);
    for (let i = 0; i < r4.length; i++) r4[i] = rand();
    geometry.setAttribute("aRand", new THREE.BufferAttribute(r4, 4));
    geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 20);
    // Shuffled index so shrinking the draw range drops a random subset, not one side of a shape.
    const order = new Uint32Array(COUNT);
    for (let i = 0; i < COUNT; i++) order[i] = i;
    for (let i = COUNT - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    geometry.setIndex(new THREE.BufferAttribute(order, 1));

    const uniforms = {
      uTime: { value: 0 },
      uMorph: { value: 0 },
      uIntro: { value: reduced ? 1 : 0 },
      uAlpha: { value: 0 },
      uPixelRatio: { value: dpr },
      uSize: { value: isSmall ? 30 : 34 },
      uVelocity: { value: 0 },
      uMouse: { value: new THREE.Vector3(99, 99, 0) },
      uColorA: { value: new THREE.Color("#38e8ff") },
      uColorB: { value: new THREE.Color("#7c5cff") },
      uColorC: { value: new THREE.Color("#ff7ad9") },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const group = new THREE.Group();
    const points = new THREE.Points(geometry, material);
    group.add(points);
    scene.add(group);

    /* ---------- sizing ---------- */
    let width = 0;
    let height = 0;
    let fitScale = 1;
    let isDesktop = true;
    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      isDesktop = width >= 1024;
      fitScale = Math.min(1, Math.max(0.55, camera.aspect / 1.25));
    };
    resize();
    window.addEventListener("resize", resize);

    /* ---------- mouse ---------- */
    const mouseNdc = new THREE.Vector2(10, 10);
    let mouseActive = 0;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      mouseNdc.set((e.clientX / width) * 2 - 1, -(e.clientY / height) * 2 + 1);
      mouseActive = 1;
    };
    const onLeave = () => (mouseActive = 0);
    window.addEventListener("pointermove", onMove);
    document.addEventListener("pointerleave", onLeave);
    const ray = new THREE.Vector3();
    const mouseWorld = new THREE.Vector3();
    const tilt = { x: 0, y: 0 };

    /* ---------- intro ---------- */
    const intro = { value: reduced ? 1 : 0, start: 0 };
    const unReady = onReady(() => {
      intro.start = performance.now();
    });

    /* ---------- adaptive quality ---------- */
    // If frames take too long, step down resolution and particle count (never back up,
    // so quality can't oscillate). Measured after the intro, once shaders have compiled.
    const quality = { level: 0, frames: 0, total: 0, since: performance.now() + 3000 };
    const degrade = (avgMs: number) => {
      if (quality.level >= 3 || avgMs < 21) return;
      quality.level++;
      dpr = Math.max(0.75, dpr * 0.8);
      renderer.setPixelRatio(dpr);
      renderer.setSize(width, height, false);
      uniforms.uPixelRatio.value = dpr;
      geometry.setDrawRange(0, Math.floor(COUNT * (1 - quality.level * 0.18)));
    };

    /* ---------- loop ---------- */
    let raf = 0;
    let last = performance.now();
    let elapsed = 0;
    const s = sceneState;

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const frameMs = now - last;
      const dt = Math.min(frameMs / 1000, 0.05);
      last = now;
      if (now > quality.since && frameMs < 250) {
        quality.frames++;
        quality.total += frameMs;
        if (quality.frames >= 90) {
          degrade(quality.total / quality.frames);
          quality.frames = 0;
          quality.total = 0;
        }
      }
      if (!reduced) elapsed += dt;

      const k = 1 - Math.exp(-dt * 3.2);
      const kFast = 1 - Math.exp(-dt * 6);
      s.morph += (s.morphTarget - s.morph) * kFast;
      s.alpha += (s.alphaTarget - s.alpha) * k;
      s.x += (s.xTarget * (isDesktop ? 1 : 0) - s.x) * k;
      s.y += (s.yTarget - s.y) * k;
      s.scale += (s.scaleTarget - s.scale) * k;
      if (Math.abs(s.morphTarget - s.morph) < 0.0005) s.morph = s.morphTarget;

      if (intro.start > 0 && intro.value < 1) {
        intro.value = Math.min(1, (now - intro.start) / 2600);
      }
      const e = 1 - Math.pow(1 - intro.value, 3);

      uniforms.uTime.value = elapsed;
      uniforms.uMorph.value = s.morph;
      uniforms.uIntro.value = e;
      uniforms.uAlpha.value = s.alpha * (isDesktop ? 1 : 0.75);
      uniforms.uVelocity.value += (Math.min(Math.abs(s.velocity) / 40, 1) - uniforms.uVelocity.value) * k;

      tilt.x += ((mouseActive ? mouseNdc.y * 0.12 : 0) - tilt.x) * k;
      tilt.y += ((mouseActive ? mouseNdc.x * 0.18 : 0) - tilt.y) * k;

      group.position.set(s.x, s.y, 0);
      group.scale.setScalar(s.scale * fitScale);
      group.rotation.y = Math.sin(elapsed * 0.16) * 0.35 + tilt.y + (1 - e) * 1.2;
      group.rotation.x = Math.sin(elapsed * 0.11) * 0.08 - tilt.x;
      group.updateMatrixWorld();

      // mouse ray → world point on z = 0
      ray.set(mouseNdc.x, mouseNdc.y, 0.5).unproject(camera).sub(camera.position).normalize();
      const dist = -camera.position.z / ray.z;
      mouseWorld.copy(camera.position).add(ray.multiplyScalar(dist));
      const u = uniforms.uMouse.value;
      u.x += (mouseWorld.x - u.x) * kFast;
      u.y += (mouseWorld.y - u.y) * kFast;
      u.z += ((reduced ? 0 : mouseActive) - u.z) * k;

      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      unReady();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
    />
  );
}
