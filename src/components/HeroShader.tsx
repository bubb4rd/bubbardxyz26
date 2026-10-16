"use client";

import { useEffect, useRef } from "react";

/** Halftone pitch in CSS px (the old static texture was 4px). */
const CELL = 5;
/** Device-pixel cap: the dots stay crisp, the fill rate stays sane on 3x screens. */
const MAX_DPR = 1.5;

const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

/*
 * One pass: the graphite scene (gradient, glow, drifting fog, cursor light) is
 * sampled at each halftone cell's centre, and that tone sets the cell's dot
 * size. Darker tone, bigger ink dot, so the dots swell and shrink as the fog
 * moves. Colours are the site palette (#454641 → #2c2d2a → --paper).
 */
const FRAG = `
precision highp float;

uniform vec2 u_res;      // canvas size, device px
uniform float u_time;    // seconds
uniform float u_cell;    // halftone pitch, device px
uniform vec2 u_mouse;    // cursor, 0..1 (y down)
uniform float u_mouseOn; // eased 0..1 while the cursor is over the hero

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p = m * p;
    a *= 0.5;
  }
  return v;
}

// Slow domain-warped fog, ~0..1.
float fog(vec2 uv, float aspect) {
  vec2 p = vec2(uv.x * aspect, uv.y) * 1.7;
  float t = u_time * 0.04;
  vec2 q = vec2(fbm(p + vec2(0.0, t)), fbm(p + vec2(5.2, 1.3) - t));
  return fbm(p + 1.8 * q + vec2(t * 0.7, -t * 0.4));
}

vec3 scene(vec2 uv, float aspect, float f) {
  vec3 top = vec3(0.271, 0.275, 0.255);
  vec3 mid = vec3(0.173, 0.176, 0.165);
  vec3 paper = vec3(0.106, 0.110, 0.102);
  vec3 c = uv.y < 0.42 ? mix(top, mid, uv.y / 0.42) : mix(mid, paper, (uv.y - 0.42) / 0.58);

  // Pale glow high up (was the .hero-scene radial gradient).
  vec2 d = (uv - vec2(0.5, 0.34)) / vec2(0.7, 0.45);
  c = mix(c, vec3(0.588, 0.596, 0.561), (1.0 - smoothstep(0.0, 0.7, length(d))) * 0.42);

  // Drifting fog, strongest up top (replaces the CSS orbs).
  c += (f - 0.45) * 0.45 * (1.0 - smoothstep(0.1, 0.85, uv.y));

  // Soft light that follows the cursor.
  vec2 m = (uv - u_mouse) * vec2(aspect, 1.0);
  c += vec3(0.62, 0.63, 0.59) * exp(-dot(m, m) * 14.0) * 0.12 * u_mouseOn;
  return c;
}

void main() {
  vec2 frag = vec2(gl_FragCoord.x, u_res.y - gl_FragCoord.y);
  float aspect = u_res.x / u_res.y;
  vec2 uv = frag / u_res;

  vec2 center = (floor(frag / u_cell) + 0.5) * u_cell;
  vec2 cuv = center / u_res;
  // The fog is low-frequency, so its value at the cell centre also serves the
  // smooth base: one fog evaluation per pixel.
  float f = fog(cuv, aspect);
  vec3 base = scene(uv, aspect, f);
  vec3 cell = scene(cuv, aspect, f);

  float lum = dot(cell, vec3(0.299, 0.587, 0.114));
  // Glow reads as bare paper, shadow as full dots.
  float tone = smoothstep(0.40, 0.16, lum);
  float r = u_cell * 0.46 * sqrt(tone);
  float ink = 1.0 - smoothstep(r - 0.75, r + 0.75, length(frag - center));

  // Same falloff the CSS halftone had: full at the top, gone by 90%.
  float mask = uv.y < 0.55
    ? mix(1.0, 0.55, uv.y / 0.55)
    : 0.55 * (1.0 - smoothstep(0.55, 0.9, uv.y));

  vec3 col = mix(base, base * 0.45, ink * 0.7 * mask);
  gl_FragColor = vec4(col, 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("[HeroShader]", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function link(gl: WebGLRenderingContext) {
  const vs = compile(gl, gl.VERTEX_SHADER, VERT);
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
  const program = gl.createProgram();
  if (!vs || !fs || !program) return null;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  // The linked program keeps its own copy; the shader objects aren't needed.
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("[HeroShader]", gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

/**
 * Animated halftone behind the hero. Fades in over the CSS scene once the first
 * frame is drawn; without WebGL the CSS scene simply stays. Runs only while the
 * hero is on screen, and holds a single still frame for reduced motion.
 */
export default function HeroShader() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const gl = canvas?.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      powerPreference: "low-power",
    });
    // A canvas has one context for life, so a remount (Strict Mode, HMR) gets
    // the same one back: cleanup frees what it made but never loses it.
    if (!canvas || !gl || gl.isContextLost()) return;
    const program = link(gl);
    if (!program) return;

    gl.useProgram(program);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, "a_pos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, "u_res");
    const uTime = gl.getUniformLocation(program, "u_time");
    const uCell = gl.getUniformLocation(program, "u_cell");
    const uMouse = gl.getUniformLocation(program, "u_mouse");
    const uMouseOn = gl.getUniformLocation(program, "u_mouseOn");

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let time = 12; // start mid-drift rather than on the noise origin
    let last = 0;
    let frame = 0;
    let onScreen = true;
    let lost = false;
    const mouse = { x: 0.5, y: 0.34, on: 0, tx: 0.5, ty: 0.34, ton: 0 };

    const draw = () => {
      gl.uniform1f(uTime, time);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform1f(uMouseOn, mouse.on);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      canvas.dataset.ready = "";
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uRes, w, h);
      gl.uniform1f(uCell, CELL * dpr);
      if (!frame && !lost) draw();
    };

    const tick = (now: number) => {
      frame = 0;
      // Clamp so a long pause (tab hidden, scrolled away) doesn't jump the fog.
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
      last = now;
      time += dt;
      const k = 1 - Math.exp(-dt * 4);
      mouse.x += (mouse.tx - mouse.x) * k;
      mouse.y += (mouse.ty - mouse.y) * k;
      mouse.on += (mouse.ton - mouse.on) * k;
      draw();
      schedule();
    };

    const schedule = () => {
      const run = onScreen && !reduced.matches && !lost;
      if (run && !frame) {
        frame = requestAnimationFrame(tick);
      } else if (!run && frame) {
        cancelAnimationFrame(frame);
        frame = 0;
        last = 0;
      }
    };

    const onPointer = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = canvas.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      const inside = x >= 0 && x <= 1 && y >= 0 && y <= 1;
      mouse.ton = inside ? 1 : 0;
      if (inside) {
        mouse.tx = x;
        mouse.ty = y;
      }
    };

    const onLost = (e: Event) => {
      e.preventDefault();
      lost = true;
      delete canvas.dataset.ready;
      schedule();
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      schedule();
    });
    io.observe(canvas);
    window.addEventListener("pointermove", onPointer, { passive: true });
    reduced.addEventListener("change", schedule);
    canvas.addEventListener("webglcontextlost", onLost);
    resize();
    schedule();

    return () => {
      if (frame) cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onPointer);
      reduced.removeEventListener("change", schedule);
      canvas.removeEventListener("webglcontextlost", onLost);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      delete canvas.dataset.ready;
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="hero-shader absolute inset-0 size-full" />;
}
