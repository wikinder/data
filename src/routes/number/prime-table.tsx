let isLoaded = false;
const PRIME_TABLE = new Set([2n, 3n]);

export async function getPrimeTable(env) {
  if (isLoaded) {
    return PRIME_TABLE;
  }

  const buffer = await env.PRIME_BITMAP_KV.get('prime-bitmap', 'arrayBuffer');
  const bitmap = new Uint8Array(buffer);

  let num = 5n;
  let step = 2n;

  for (const byte of bitmap) {
    for (let mask = 0b1000_0000; mask > 0; mask >>= 1) {
      if ((byte & mask) !== 0) {
        PRIME_TABLE.add(num);
      }

      num += step;
      step = 6n - step;
    }
  }

  isLoaded = true;
  return PRIME_TABLE;
}
