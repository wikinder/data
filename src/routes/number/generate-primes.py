from base64 import b64encode
from itertools import cycle
from sympy import sieve

MAX_PRIME = 2**16
sieve.extend(MAX_PRIME)

bitmap = bytearray()
byte = 0
count = 0

number = 5
steps = cycle((2, 4))

while number < MAX_PRIME:
    byte = (byte << 1) | int(number in sieve)
    count += 1

    if count == 8:
        bitmap.append(byte)
        byte = 0
        count = 0

    number += next(steps)

if count > 0:
    bitmap.append(byte << (8 - count))

bitmap_base64 = b64encode(bitmap).decode("utf-8")

print(f"""export const MAX_PRIME = {MAX_PRIME}n;

const PRIME_BITMAP_BASE64 = '{bitmap_base64}';
const PRIME_BITMAP = Uint8Array.from(atob(PRIME_BITMAP_BASE64), c => c.charCodeAt(0));

export const PRIMES = new Set([2n, 3n]);

let num = 5n;
let step = 2n;

for (const byte of PRIME_BITMAP) {{
  for (let mask = 0x80; mask > 0 && num < MAX_PRIME; mask >>= 1) {{
    if (byte & mask) {{
      PRIMES.add(num);
    }}

    num += step;
    step = 6n - step;
  }}
}}""")
