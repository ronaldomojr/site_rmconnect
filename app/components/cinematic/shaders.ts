/**
 * Shaders do point-cloud. O vertex interpola entre 6 alvos
 * (logo → fluxos → grid → neural → escala → logo) conforme uProgress ∈ [0,5],
 * com um "burst" radial no meio de cada transição para dar sensação de explosão.
 */

export const particleVertex = /* glsl */ `
  uniform float uProgress;
  uniform float uTime;
  uniform float uSize;
  uniform float uBurst;
  uniform float uPixelRatio;

  attribute vec3 aLogo;
  attribute vec3 aFlows;
  attribute vec3 aGrid;
  attribute vec3 aNeural;
  attribute vec3 aScale;
  attribute vec3 aColor;
  attribute vec3 aRand;

  varying vec3 vColor;
  varying float vGlow;

  // Retorna o alvo de índice i (sequência: 0 logo,1 fluxos,2 grid,3 neural,4 escala,5 logo)
  vec3 target(int i) {
    if (i <= 0) return aLogo;
    if (i == 1) return aFlows;
    if (i == 2) return aGrid;
    if (i == 3) return aNeural;
    if (i == 4) return aScale;
    return aLogo;
  }

  void main() {
    float p = clamp(uProgress, 0.0, 5.0);
    int seg = int(floor(p));
    float f = fract(p);
    if (seg >= 5) { seg = 4; f = 1.0; }

    vec3 from = target(seg);
    vec3 to = target(seg + 1);
    float e = smoothstep(0.0, 1.0, f);
    vec3 pos = mix(from, to, e);

    // Burst: deslocamento radial que pico no meio da transição
    float window = sin(f * 3.14159265);
    vec3 dir = normalize(aRand - 0.5 + 0.0001);
    pos += dir * window * uBurst * (0.6 + aRand.x);

    // Respiração sutil
    pos += dir * sin(uTime * 0.6 + aRand.y * 6.28) * 0.015;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;

    float size = uSize * (0.7 + aRand.z * 0.6);
    gl_PointSize = size * uPixelRatio * (8.0 / -mv.z);

    // Cor: paleta da MARCA (roxo/violeta → lilás, leve toque de azul).
    // Tons um pouco mais profundos p/ que mesmo nas áreas densas + bloom a
    // cor permaneça nitidamente roxa (sem estourar em branco).
    vec3 brand = vec3(0.40, 0.32, 0.92);
    vec3 lilac = vec3(0.56, 0.43, 0.96);
    vec3 blue  = vec3(0.27, 0.45, 0.95);
    vec3 col = mix(brand, lilac, aRand.x);
    col = mix(col, blue, aRand.y * 0.3);
    vColor = col;
    vGlow = 0.35 + window * 0.5;
  }
`;

export const particleFragment = /* glsl */ `
  precision highp float;
  varying vec3 vColor;
  varying float vGlow;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;
    float alpha = smoothstep(0.5, 0.06, d);
    vec3 col = vColor * (0.9 + vGlow * 0.4);
    gl_FragColor = vec4(col, alpha * 0.9);
  }
`;
