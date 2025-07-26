from base64 import b64encode
from itertools import cycle
from sympy import sieve

MAX_NUMBER = 94906249 # 24 * BITMAP_SIZE + 1
sieve.extend(MAX_NUMBER)

BITMAP_SIZE = (MAX_NUMBER - 1) // 24
bitmap = bytearray(BITMAP_SIZE)

number = 5
steps = cycle((2, 4))

for byte_index in range(BITMAP_SIZE):
    for bit_index in range(7, -1, -1):
        bitmap[byte_index] |= int(number in sieve) << bit_index
        number += next(steps)

with open('prime-bitmap.bin', 'wb') as f:
    f.write(bitmap)
