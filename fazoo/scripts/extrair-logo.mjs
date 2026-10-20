// Gera o logo com fundo transparente, os ícones e a imagem de compartilhamento a partir de marca/logo-original.png.
// Rode com: node scripts/extrair-logo.mjs
// Estima o degradê de fundo pixel a pixel e aplica "color to alpha", preservando letras e brilho.
import sharp from 'sharp';

const SRC = 'marca/logo-original.png';
const crop = { left: 270, top: 160, width: 1240, height: 540 };

const { data, info } = await sharp(SRC).extract(crop).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const W = info.width, H = info.height, N = W * H;

// 1) Máscara das letras (brancas e rosa), depois dilatada para cobrir o brilho.
const letter = new Float32Array(N);
for (let i = 0; i < N; i++) {
  const r = data[i * 3], g = data[i * 3 + 1];
  letter[i] = (r > 110 || g > 110) ? 1 : 0;
}

function boxBlur(src, rad) {
  const tmp = new Float32Array(N), out = new Float32Array(N);
  const w = 2 * rad + 1;
  for (let y = 0; y < H; y++) {
    let s = 0;
    for (let x = -rad; x <= rad; x++) s += src[y * W + Math.min(W - 1, Math.max(0, x))];
    for (let x = 0; x < W; x++) {
      tmp[y * W + x] = s / w;
      s += src[y * W + Math.min(W - 1, x + rad + 1)] - src[y * W + Math.max(0, x - rad)];
    }
  }
  for (let x = 0; x < W; x++) {
    let s = 0;
    for (let y = -rad; y <= rad; y++) s += tmp[Math.min(H - 1, Math.max(0, y)) * W + x];
    for (let y = 0; y < H; y++) {
      out[y * W + x] = s / w;
      s += tmp[Math.min(H - 1, y + rad + 1) * W + x] - tmp[Math.max(0, y - rad) * W + x];
    }
  }
  return out;
}

const dil = boxBlur(letter, 55);
const bgMask = new Float32Array(N);
for (let i = 0; i < N; i++) bgMask[i] = dil[i] > 0.0001 ? 0 : 1;

// 2) Fundo estimado por convolução normalizada (borra só os pixels de fundo).
let maskBlur = bgMask;
for (let k = 0; k < 4; k++) maskBlur = boxBlur(maskBlur, 45);
const bg = [0, 1, 2].map((c) => {
  let ch = new Float32Array(N);
  for (let i = 0; i < N; i++) ch[i] = data[i * 3 + c] * bgMask[i];
  for (let k = 0; k < 4; k++) ch = boxBlur(ch, 45);
  for (let i = 0; i < N; i++) ch[i] = maskBlur[i] > 1e-6 ? ch[i] / maskBlur[i] : 0;
  return ch;
});

// 3) Color to alpha contra o fundo local.
const out = Buffer.alloc(N * 4);
for (let i = 0; i < N; i++) {
  let a = 0;
  const P = [data[i * 3], data[i * 3 + 1], data[i * 3 + 2]];
  const B = [bg[0][i], bg[1][i], bg[2][i]];
  for (let c = 0; c < 3; c++) {
    const d = P[c] - B[c];
    const ac = d > 0 ? d / Math.max(1, 255 - B[c]) : 0; // o logo é sempre mais claro que o fundo
    if (ac > a) a = ac;
  }
  a = Math.min(1, a);
  a = a < 0.05 ? 0 : Math.min(1, (a - 0.05) / 0.95); // remove ruído de compressão
  for (let c = 0; c < 3; c++) {
    out[i * 4 + c] = a > 0 ? Math.round(Math.min(255, Math.max(0, B[c] + (P[c] - B[c]) / a))) : 0;
  }
  out[i * 4 + 3] = Math.round(a * 255);
}

const full = await sharp(out, { raw: { width: W, height: H, channels: 4 } }).png().toBuffer();

// Logo do site, recortado rente ao brilho.
await sharp(full).extract({ left: 30, top: 30, width: 1180, height: 480 }).resize({ width: 640 }).png({ compressionLevel: 9 }).toFile('public/logo-fazoo-web.png');

// Ícone: o rostinho "oo" sobre um quadrado marinho arredondado.
// O "z" encosta no primeiro "o", então apagamos o que estiver fora do círculo do "o" à esquerda.
const R = { left: 705, top: 110, width: 510, height: 410 };
const rostoRaw = await sharp(full).extract(R).raw().toBuffer({ resolveWithObject: true });
const cx = 848 - R.left, cy = 252 - R.top, raio = 128;
for (let y = 0; y < rostoRaw.info.height; y++) {
  for (let x = 0; x < rostoRaw.info.width; x++) {
    const foraDoO = Math.hypot(x - cx, y - cy) > raio;
    if (x < cx && y < 365 - R.top && foraDoO) rostoRaw.data[(y * rostoRaw.info.width + x) * 4 + 3] = 0;
  }
}
const rosto = await sharp(rostoRaw.data, { raw: rostoRaw.info }).resize({ width: 410 }).png().toBuffer();
const fundo = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512"><defs><radialGradient id="g" cx="80%" cy="10%" r="90%"><stop offset="0" stop-color="#3b0f9e"/><stop offset=".6" stop-color="#0a0f55"/><stop offset="1" stop-color="#070a3a"/></radialGradient></defs><rect width="512" height="512" rx="112" fill="url(#g)"/></svg>`);
await sharp(fundo).composite([{ input: rosto, gravity: 'center' }]).png().toFile('public/favicon.png');
await sharp('public/favicon.png').resize(180).png().toFile('public/apple-touch-icon.png');

// Imagem de compartilhamento (WhatsApp, Instagram, Google).
await sharp(SRC).resize(1200, 600, { fit: 'cover' }).jpeg({ quality: 86 }).toFile('public/og-fazoo.jpg');
console.log('logo, ícones e imagem de compartilhamento gerados em public/');
