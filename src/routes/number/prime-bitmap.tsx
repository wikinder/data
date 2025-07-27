export let PRIME_BITMAP;

export async function loadPrimeBitmap(env) {
  if (PRIME_BITMAP != null) {
    return;
  }

  const buffer = await env.PRIME_BITMAP_KV.get('prime-bitmap', 'arrayBuffer');
  PRIME_BITMAP = new Uint8Array(buffer);
}
