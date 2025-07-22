from base64 import b64encode
from itertools import cycle
from sympy import sieve

PRIME_LIMIT = 65536
MAX_NUMBER = 65521 # 24 * BITMAP_SIZE + 1
sieve.extend(MAX_NUMBER)

BITMAP_SIZE = (MAX_NUMBER - 1) // 24
bitmap = bytearray(BITMAP_SIZE)

number = 5
steps = cycle((2, 4))

for byte_index in range(BITMAP_SIZE):
    for bit_index in range(7, -1, -1):
        bitmap[byte_index] |= int(number in sieve) << bit_index
        number += next(steps)

bitmap_base64 = b64encode(bitmap).decode('ascii')

print(f"""export const PRIME_LIMIT = {PRIME_LIMIT}n;
export const PRIMES = new Set([2n, 3n]);

const bitmap_base64 = '{bitmap_base64}';
const bitmap = Uint8Array.from(atob(bitmap_base64), c => c.charCodeAt(0));

let num = 5n;
let step = 2n;

for (const byte of bitmap) {{
  for (let mask = 0b1000_0000; mask > 0; mask >>= 1) {{
    if ((byte & mask) !== 0) {{
      PRIMES.add(num);
    }}

    num += step;
    step = 6n - step;
  }}
}}""")
