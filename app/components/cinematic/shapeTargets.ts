/**
 * Geradores de "formas-alvo" para o morphing de partículas.
 * Todas retornam Float32Array(count*3) centradas na origem, na mesma escala da
 * logo (~5 unidades de largura), para o shader interpolar suavemente entre elas.
 */

const TAU = Math.PI * 2;
const GOLDEN = Math.PI * (3 - Math.sqrt(5));

/** Amostra os pixels opacos de um PNG transparente como nuvem de pontos + cor.
 *  `bbox`: normaliza pelo retângulo do desenho (centra e escala p/ preencher a
 *  cena mesmo que a imagem tenha margens). `depth`: espessura em Z. */
export async function sampleImageToPoints(
  url: string,
  count: number,
  span = 5,
  opts: { bbox?: boolean; depth?: number; size?: number } = {},
): Promise<{ positions: Float32Array; colors: Float32Array }> {
  const img = await loadImage(url);
  const size = opts.size ?? 340; // resolução de amostragem
  const depth = opts.depth ?? 0.35;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  // Mantém proporção, centralizado
  const scale = Math.min(size / img.width, size / img.height);
  const w = img.width * scale;
  const h = img.height * scale;
  ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
  const data = ctx.getImageData(0, 0, size, size).data;

  // Coleta pixels do desenho (opacos e não-fundo-claro) + bounding box
  const opaque: number[] = [];
  let minX = size,
    minY = size,
    maxX = 0,
    maxY = 0;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      const bright = (data[i] + data[i + 1] + data[i + 2]) / 3;
      if (data[i + 3] > 50 && bright < 244) {
        opaque.push(i);
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  const cX = (minX + maxX) / 2;
  const cY = (minY + maxY) / 2;
  const bMax = Math.max(maxX - minX, maxY - minY) || size;

  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  for (let p = 0; p < count; p++) {
    const i = opaque[(Math.random() * opaque.length) | 0] ?? 0;
    const px = (i / 4) % size;
    const py = ((i / 4) / size) | 0;
    if (opts.bbox) {
      positions[p * 3] = ((px - cX) / bMax) * span;
      positions[p * 3 + 1] = -((py - cY) / bMax) * span;
    } else {
      positions[p * 3] = (px / size - 0.5) * span;
      positions[p * 3 + 1] = -(py / size - 0.5) * span;
    }
    positions[p * 3 + 2] = (Math.random() - 0.5) * depth;
    colors[p * 3] = data[i] / 255;
    colors[p * 3 + 1] = data[i + 1] / 255;
    colors[p * 3 + 2] = data[i + 2] / 255;
  }
  return { positions, colors };
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

/** Esfera de Fibonacci (distribuição uniforme) — base da "rede neural". */
export function fibonacciSphere(count: number, radius: number, jitter = 0): Float32Array {
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = GOLDEN * i;
    const j = 1 + (Math.random() - 0.5) * jitter;
    out[i * 3] = Math.cos(theta) * r * radius * j;
    out[i * 3 + 1] = y * radius * j;
    out[i * 3 + 2] = Math.sin(theta) * r * radius * j;
  }
  return out;
}

/* O cérebro (cena de IA) agora vem de uma IMAGEM real amostrada como partículas:
   sampleImageToPoints("/brain.png", …, { bbox: true }). A versão procedural antiga
   foi removida. */

/** Vários "painéis" retangulares em camadas — metáfora de dashboard/UI. */
export function dashboardGrid(count: number): Float32Array {
  const out = new Float32Array(count * 3);
  // 6 painéis dispostos em 3 colunas x 2 linhas, com profundidades alternadas
  const panels = [
    { x: -1.9, y: 1.0, w: 1.5, h: 0.9, z: 0.0 },
    { x: 0.0, y: 1.1, w: 1.6, h: 1.2, z: 0.3 },
    { x: 1.9, y: 1.0, w: 1.5, h: 0.9, z: -0.2 },
    { x: -1.6, y: -1.1, w: 1.8, h: 1.0, z: 0.2 },
    { x: 0.7, y: -1.0, w: 2.4, h: 1.1, z: -0.3 },
    { x: 2.2, y: -1.2, w: 1.0, h: 0.7, z: 0.1 },
  ];
  for (let i = 0; i < count; i++) {
    const pnl = panels[i % panels.length];
    // ponto na borda ou interior do painel (favorece bordas → "componentes")
    const edge = Math.random() < 0.55;
    let lx: number, ly: number;
    if (edge) {
      const t = Math.random();
      const side = (Math.random() * 4) | 0;
      if (side === 0) {
        lx = t - 0.5;
        ly = 0.5;
      } else if (side === 1) {
        lx = t - 0.5;
        ly = -0.5;
      } else if (side === 2) {
        lx = 0.5;
        ly = t - 0.5;
      } else {
        lx = -0.5;
        ly = t - 0.5;
      }
    } else {
      lx = Math.random() - 0.5;
      ly = Math.random() - 0.5;
    }
    out[i * 3] = pnl.x + lx * pnl.w;
    out[i * 3 + 1] = pnl.y + ly * pnl.h;
    out[i * 3 + 2] = pnl.z + (Math.random() - 0.5) * 0.1;
  }
  return out;
}

/** Linhas de fluxo horizontais com nós — metáfora de automação/conexões. */
export function flowLines(count: number): Float32Array {
  const out = new Float32Array(count * 3);
  const lines = 7;
  const spanX = 6;
  for (let i = 0; i < count; i++) {
    const line = i % lines;
    const t = Math.random();
    const baseY = (line / (lines - 1) - 0.5) * 4.2;
    // onda suave + leve profundidade
    const x = (t - 0.5) * spanX;
    const wave = Math.sin(t * TAU * 1.5 + line) * 0.35;
    out[i * 3] = x;
    out[i * 3 + 1] = baseY + wave;
    out[i * 3 + 2] = Math.sin(t * TAU + line * 1.7) * 0.6;
  }
  return out;
}

/** Rede expandida (esfera maior + dispersão) — metáfora de escala exponencial. */
export function expandedNetwork(count: number): Float32Array {
  const out = fibonacciSphere(count, 4.2, 0.85);
  for (let i = 0; i < count; i++) {
    // alonga radialmente alguns pontos → sensação de expansão
    if (Math.random() < 0.25) {
      const s = 1 + Math.random() * 0.9;
      out[i * 3] *= s;
      out[i * 3 + 1] *= s;
      out[i * 3 + 2] *= s;
    }
  }
  return out;
}
