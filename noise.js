(function() {
  "use strict";

  function Noise(stdlib, foreign, heap) {
    "use asm";

    var bytes = new stdlib.Uint8Array(heap),
        floor = stdlib.Math.floor;

    function value(x, y, z) {
      x = +x;
      y = +y;
      z = +z;

      var u = 0.0,
          v = 0.0,
          w = 0.0,
          i = 0;

      u = +floor(x);
      v = +floor(y);
      w = +floor(z);
      i = ~~(u + v * 17.0 + w * 43.0);

      x = x - u;
      x = x * x * (3.0 - 2.0 * x);
      u = 1.0 - x;

      y = y - v;
      y = y * y * (3.0 - 2.0 * y);
      v = 1.0 - y;

      z = z - w;
      z = z * z * (3.0 - 2.0 * z);
      w = 1.0 - z;

      return +((((+(bytes[((i +  0) & 4095) >> 0]|0)) * u +
                 (+(bytes[((i +  1) & 4095) >> 0]|0)) * x) * v +
                ((+(bytes[((i + 17) & 4095) >> 0]|0)) * u +
                 (+(bytes[((i + 18) & 4095) >> 0]|0)) * x) * y) * w +
               (((+(bytes[((i + 43) & 4095) >> 0]|0)) * u +
                 (+(bytes[((i + 44) & 4095) >> 0]|0)) * x) * v +
                ((+(bytes[((i + 60) & 4095) >> 0]|0)) * u +
                 (+(bytes[((i + 61) & 255) >> 0]|0)) * x) * y) * z);
    }

    function fractal(x, y, z) {
      x = +x;
      y = +y;
      z = +z;

      return +(
        (+value(x          +  2.0, y          +  3.0, z          +  5.0)) * 0.06125 +
        (+value(x * 0.5000 +  7.0, y * 0.5000 + 11.0, z * 0.5000 + 13.0)) * 0.09911 +
        (+value(x * 0.2500 + 17.0, y * 0.2500 + 19.0, z * 0.2500 + 23.0)) * 0.16036 +
        (+value(x * 0.1250 + 29.0, y * 0.1250 + 31.0, z * 0.1250 + 37.0)) * 0.25946 +
        (+value(x * 0.0625 + 41.0, y * 0.0625 + 43.0, z * 0.0625 + 47.0)) * 0.41982
      );
    }

    return {value: value, fractal: fractal};
  }

  window.noise = function() {
    var heap;

    heap = new Uint8Array(4096);
    window.crypto.getRandomValues(heap);

    return Noise(window, null, heap.buffer);
  };
})();
