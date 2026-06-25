import { useEffect, useRef } from "react";

const vertexSource = `
  attribute vec2 aPosition;
  varying vec2 vUv;
  void main() {
    vUv = aPosition * 0.5 + 0.5;
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`;

const fragmentSource = `
  precision highp float;
  uniform vec2 uResolution;
  uniform vec2 uCenter;
  uniform float uTime;
  uniform float uScale;
  uniform float uStreamOpacity;
  uniform sampler2D uTextMap;
  varying vec2 vUv;
  const float PI = 3.141592653589793;

  float hash21(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  vec2 hash22(vec2 p) {
    float n = sin(dot(p, vec2(41.0, 289.0)));
    return fract(vec2(262144.0, 32768.0) * n);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash21(i), hash21(i + vec2(1.0, 0.0)), u.x),
      mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p = rot * p * 2.03 + vec2(13.7, 7.1);
      a *= 0.5;
    }
    return v;
  }

  mat2 rotate2d(float a) {
    float c = cos(a);
    float s = sin(a);
    return mat2(c, -s, s, c);
  }

  float periodicFbm(float angle, float radial, float angularScale, float radialScale, float timeOffset) {
    vec2 ring = vec2(cos(angle), sin(angle));
    vec2 a = ring * angularScale + vec2(radial * radialScale + timeOffset, radial * radialScale * 0.41 - timeOffset * 0.73);
    vec2 b = ring.yx * (angularScale * 0.67) + vec2(radial * radialScale * 0.29 - timeOffset * 0.47, radial * radialScale * 0.83 + timeOffset * 0.61);
    return mix(fbm(a), fbm(b), 0.38);
  }

  float starLayer(vec2 p, float scale, float threshold, float time) {
    vec2 cell = p * scale;
    vec2 id = floor(cell);
    vec2 gv = fract(cell) - 0.5;
    vec2 jitter = (hash22(id) - 0.5) * 0.64;
    float seed = hash21(id + 19.7);
    float size = mix(0.018, 0.095, pow(seed, 10.0));
    float star = 1.0 - smoothstep(size * 0.25, size, length(gv - jitter));
    star *= step(threshold, seed);
    star *= 0.72 + 0.28 * sin(time * (0.7 + seed) + seed * 18.0);
    return star;
  }

  vec3 starField(vec2 p, float r) {
    float lens = 0.024 / (r * r + 0.032);
    vec2 lp = p * (1.0 + lens);
    float s1 = starLayer(lp + vec2(2.1, 0.7), 44.0, 0.982, uTime);
    float s2 = starLayer(lp * 1.13 - vec2(0.4, 1.8), 88.0, 0.992, uTime * 0.8);
    float s3 = starLayer(lp * 0.73 + vec2(4.0, 3.0), 23.0, 0.975, uTime * 0.6);
    float neb = smoothstep(0.52, 0.92, fbm(lp * 1.35 + vec2(uTime * 0.006, 0.0))) * 0.055;
    vec3 c = vec3(0.0035, 0.0065, 0.014);
    c += vec3(0.035, 0.065, 0.13) * neb;
    c += vec3(0.82, 0.9, 1.0) * s1;
    c += vec3(1.0, 0.82, 0.62) * s2 * 0.72;
    c += vec3(0.72, 0.84, 1.0) * s3 * 0.52;
    return c;
  }

  vec4 streamLayer(vec2 p, float horizon, float streamAngle, float phase, float widthScale, float opacity) {
    vec2 s = rotate2d(-streamAngle) * p;
    float x = s.x;
    float d = max(x - horizon, 0.0);
    float centerY = 0.12 * pow(d, 1.28) + 0.012 * sin(d * 5.4 - uTime * 0.16 + phase * 8.0) * smoothstep(horizon * 1.4, 1.3, x);
    float width = mix(0.055, 0.34 * widthScale, smoothstep(horizon * 1.45, 1.42, x));
    float across = s.y - centerY;
    float sheet = 1.0 - smoothstep(width * 0.82, width, abs(across));
    sheet *= smoothstep(horizon * 1.16, horizon * 1.55, x);
    sheet *= 1.0 - smoothstep(1.46, 2.05, x);
    sheet *= smoothstep(horizon * 1.03, horizon * 1.30, length(p));
    float v = across / max(width * 2.0, 0.001) + 0.5;
    float u = fract(d * 0.72 - uTime * 0.022 + phase);
    vec4 tex = texture2D(uTextMap, vec2(u, clamp(v, 0.003, 0.997)));
    float near = 1.0 - smoothstep(horizon * 1.55, horizon * 5.4, length(p));
    float alpha = tex.a * sheet * opacity * uStreamOpacity;
    vec3 tc = mix(tex.rgb, vec3(0.96, 0.98, 1.0), near * 0.62);
    float fibre = 0.5 + 0.5 * sin((v * 38.0 + phase * 9.0) * PI);
    fibre = pow(fibre, 22.0) * sheet * (0.018 + near * 0.055) * opacity;
    vec3 rgb = tc * alpha + vec3(0.64, 0.78, 1.0) * fibre;
    alpha = max(alpha, fibre * 0.52);
    return vec4(rgb, alpha);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution.xy;
    float aspect = uResolution.x / max(uResolution.y, 1.0);
    vec2 p = (uv - uCenter) * vec2(aspect, 1.0) / max(uScale, 0.001);
    float r = length(p);
    float horizon = 0.108;
    vec3 color = starField(p, r);
    vec4 stream = streamLayer(p, horizon, -0.035, 0.12, 1.0, 0.86);
    color += stream.rgb;
    vec2 q = rotate2d(-0.075) * p;
    float inclination = 0.178;
    vec2 ds = vec2(q.x, q.y / inclination);
    float diskR = length(ds);
    float theta = atan(ds.y, ds.x);
    float inner = 0.155;
    float outer = 0.575;
    float diskMask = smoothstep(inner - 0.012, inner + 0.015, diskR) * (1.0 - smoothstep(outer - 0.055, outer, diskR));
    float spiral = periodicFbm(theta, diskR, 2.65, 19.0, -uTime * 0.18);
    float turb = periodicFbm(theta, diskR, 6.10, 51.0, uTime * 0.24);
    float rings = 0.48 + 0.52 * sin(diskR * 154.0 - uTime * 1.7 + spiral * 7.0);
    rings = mix(0.55, 1.0, smoothstep(-0.2, 0.82, rings));
    float knots = smoothstep(0.37, 0.88, spiral * 0.78 + turb * 0.48);
    float density = diskMask * rings * (0.26 + 1.35 * knots);
    float heat = 1.0 - smoothstep(inner, outer, diskR);
    float doppler = mix(0.43, 2.15, smoothstep(-outer, outer, -q.x));
    float front = 1.0 - smoothstep(-0.018, -0.002, q.y);
    float back = 1.0 - front;
    vec3 ember = vec3(0.47, 0.018, 0.002);
    vec3 orange = vec3(1.0, 0.19, 0.015);
    vec3 gold = vec3(1.0, 0.58, 0.12);
    vec3 hot = vec3(1.0, 0.93, 0.72);
    vec3 dc = mix(ember, orange, smoothstep(0.02, 0.50, heat));
    dc = mix(dc, gold, smoothstep(0.42, 0.78, heat));
    dc = mix(dc, hot, pow(heat, 4.2));
    dc *= density * doppler * (0.82 + heat * 1.4);
    vec3 rearDc = dc * back * 0.78;
    vec3 frontDc = dc * front * (1.02 + heat * 0.22);
    float glowBand = exp(-abs(q.y) * 34.0) * (1.0 - smoothstep(outer, outer + 0.52, abs(q.x))) * smoothstep(inner * 0.55, outer + 0.05, abs(q.x));
    vec3 glow = vec3(1.0, 0.20, 0.035) * glowBand * 0.14;
    float angle = atan(p.y, p.x);
    float lr = horizon * 1.39 + 0.018 * cos(angle * 2.0);
    float larc = exp(-pow((r - lr) * 74.0, 2.0));
    float at = 0.54 + 0.46 * periodicFbm(angle, r, 3.35, 64.0, -uTime * 0.16);
    float va = smoothstep(0.06, 0.82, abs(sin(angle)));
    float ab = mix(0.56, 1.18, va) * mix(0.90, 1.08, smoothstep(-0.80, 0.80, sin(angle)));
    vec3 ac = mix(vec3(1.0, 0.19, 0.02), hot, at * 0.64) * larc * at * ab * 1.55;
    float photon = exp(-pow((r - horizon * 1.105) * 118.0, 2.0));
    float halo = exp(-abs(r - horizon * 1.24) * 22.0) * 0.22;
    vec3 pc = vec3(1.0, 0.73, 0.34) * photon * 2.25 + vec3(0.30, 0.48, 0.72) * halo;
    color += glow + rearDc + ac + pc;
    float shadow = 1.0 - smoothstep(horizon * 0.985, horizon * 1.035, r);
    color = mix(color, vec3(0.0), shadow);
    float frontBloomBand = exp(-abs(q.y) * 39.0) * front * diskMask;
    vec3 frontBloom = vec3(1.0, 0.34, 0.055) * frontBloomBand * (0.035 + heat * 0.055);
    color += frontDc + frontBloom;
    float einstein = exp(-pow((r - horizon * 1.57) * 42.0, 2.0));
    color += vec3(0.34, 0.50, 0.76) * einstein * 0.095;
    float vignette = 1.0 - smoothstep(0.18, 1.26, length((uv - 0.5) * vec2(aspect * 0.58, 1.0)));
    color *= mix(0.56, 1.0, vignette);
    color = color / (1.0 + color);
    color = pow(color, vec3(0.88));
    gl_FragColor = vec4(color, 1.0);
  }
`;

export default function BlackHoleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;

    const gl = canvas.getContext("webgl", {
      antialias: false,
      alpha: false,
      powerPreference: "high-performance",
    });

    if (!gl) {
      console.error("WebGL is not available in this browser.");
      return;
    }

    // Helper functions for shader compilation
    function compileShader(type: number, source: string): WebGLShader | null {
      const shader = gl!.createShader(type);
      if (!shader) return null;
      gl!.shaderSource(shader, source);
      gl!.compileShader(shader);
      if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
        console.error(gl!.getShaderInfoLog(shader));
        gl!.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vertexShader = compileShader(gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentSource);

    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      return;
    }

    gl.useProgram(program);

    // Quad geometry buffer
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1.0, -1.0,
         1.0, -1.0,
        -1.0,  1.0,
        -1.0,  1.0,
         1.0, -1.0,
         1.0,  1.0,
      ]),
      gl.STATIC_DRAW
    );

    const positionLoc = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    // Generate Canvas Texture for B2B Text Streams
    const rows = [
      'CLTV  •  LEADS  •  CTR  •  ',
      'CRO  •  HOOKS  •  RETENTION  •  EXPANSION  •  ',
      'ADS  •  A/B TESTING  •  BUDGET ALLOCATION  •  ',
      'DATA-DRIVEN  •  ATTRIBUTION  •  AUTOMATION  •  ',
      'FUNNEL  •  CAC  •  MER  •  ROAS  •  AOV  •  ',
      'SEO  •  AEO  •  GEO  •  AI SEARCH  •  ORGANIC GROWTH  •  '
    ];

    const tc = document.createElement("canvas");
    tc.width = 2048;
    tc.height = 1024;
    const ctx = tc.getContext("2d");
    const palette = ['#f8fafc','#ffb020','#ffd75a','#cbd5e1'];

    if (ctx) {
      const rh = tc.height / rows.length;
      ctx.textBaseline = "middle";
      rows.forEach((row, i) => {
        const fs = i % 2 === 0 ? 64 : 58;
        ctx.font = `${i % 3 === 0 ? 700 : 600} ${fs}px Inter, Arial, sans-serif`;
        ctx.fillStyle = palette[i % palette.length];
        ctx.globalAlpha = i % 3 === 2 ? 0.78 : 0.94;
        ctx.shadowColor = i % 2 === 0 ? "rgba(255,153,0,0.28)" : "rgba(190,220,255,0.20)";
        ctx.shadowBlur = 3;
        const y = rh * (i + 0.5);
        const w = ctx.measureText(row).width;
        let x = -((i * 173) % Math.max(w, 1));
        while (x < tc.width + w) {
          ctx.fillText(row, x, y);
          x += w;
        }
      });
    }

    const texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, tc);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    const aniso =
      gl.getExtension("EXT_texture_filter_anisotropic") ||
      gl.getExtension("WEBKIT_EXT_texture_filter_anisotropic") ||
      gl.getExtension("MOZ_EXT_texture_filter_anisotropic");

    if (aniso) {
      gl.texParameterf(
        gl.TEXTURE_2D,
        aniso.TEXTURE_MAX_ANISOTROPY_EXT,
        Math.min(8, gl.getParameter(aniso.MAX_TEXTURE_MAX_ANISOTROPY_EXT))
      );
    }

    gl.uniform1i(gl.getUniformLocation(program, "uTextMap"), 0);

    // Uniform Locations
    const resLoc = gl.getUniformLocation(program, "uResolution");
    const centerLoc = gl.getUniformLocation(program, "uCenter");
    const timeLoc = gl.getUniformLocation(program, "uTime");
    const scaleLoc = gl.getUniformLocation(program, "uScale");
    const opacityLoc = gl.getUniformLocation(program, "uStreamOpacity");

    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Resize Handler
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.8);
      const w = Math.max(1, Math.floor(window.innerWidth * dpr));
      const h = Math.max(1, Math.floor(window.innerHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
      gl.uniform2f(resLoc, w, h);

      const mobile = window.innerWidth < 720;
      gl.uniform2f(centerLoc, mobile ? 0.12 : 0.29, mobile ? 0.55 : 0.52);
    };

    window.addEventListener("resize", resize);
    resize();

    // Loop & Timings
    const started = performance.now();
    const dollyDuration = 6000; // 6 seconds dolly sequence
    let animationFrameId: number;

    const frame = (now: number) => {
      const elapsed = now - started;
      const progress = Math.min(elapsed / dollyDuration, 1.0);

      // Time uniform
      const timeVal = reduced ? 3.0 : (now - started) * 0.001;
      gl.uniform1f(timeLoc, timeVal);

      // Animation parameters
      const mobile = window.innerWidth < 720;
      const targetScale = mobile ? 1.64 : 1.58;
      const targetOpacity = mobile ? 0.59 : 0.82;

      let scale = targetScale;
      let opacity = targetOpacity;

      if (progress < 1.0) {
        // Easing out cubic curve for dolly-in scale
        const easedProgress = 1.0 - Math.pow(1.0 - progress, 3.0);
        // Start small (0.25) and grow to target scale
        scale = 0.25 + (targetScale - 0.25) * easedProgress;

        // Dissolve text streams near the lock point (from 75% to 100%)
        if (progress > 0.75) {
          const dissolveProgress = (progress - 0.75) / 0.25;
          opacity = targetOpacity * (1.0 - dissolveProgress);
        }
      } else {
        scale = targetScale;
        opacity = 0.0;
      }

      gl.uniform1f(scaleLoc, scale);
      gl.uniform1f(opacityLoc, opacity);

      // Draw Fullscreen Quad
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      if (!reduced) {
        animationFrameId = requestAnimationFrame(frame);
      }
    };

    animationFrameId = requestAnimationFrame(frame);

    // Unmount Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);

      gl.deleteBuffer(buffer);
      gl.deleteTexture(texture);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteProgram(program);
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full -z-10 pointer-events-none bg-[#03060d]">
      <canvas
        ref={canvasRef}
        id="blackhole"
        className="w-full h-full"
        aria-hidden="true"
      />
      {/* Dynamic dark vignette overlay to ensure maximum text contrast over the glowing black hole */}
      <div className="absolute inset-0 bg-black/22 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(3,6,13,0.74)_90%)]" />
    </div>
  );
}
