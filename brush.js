(function() {
  "use strict";
  var constrain, noise;

  constrain = (function(t, min, max) {
    return (t > min ? (t < max ? t : max) : min);
  });

  noise = (function() {
    var p, rng;

    p = new Uint8Array(256);
    crypto.getRandomValues(p);

    rng = (function(x, y, z) {
      var i, u, v, w;

      u = Math.floor(x);
      v = Math.floor(y);
      w = Math.floor(z);
      i = ~~Math.floor(u + v * 17.0 + w * 43.0);

      x = x - u;
      x = x * x * (3.0 - 2.0 * x);
      u = 1.0 - x;

      y = y - v;
      y = y * y * (3.0 - 2.0 * y);
      v = 1.0 - y;

      z = z - w;
      z = z * z * (3.0 - 2.0 * z);
      w = 1.0 - z;

      return ((p[((i +  0) & 255) >> 0] * u +
               p[((i +  1) & 255) >> 0] * x) * v +
              (p[((i + 17) & 255) >> 0] * u +
               p[((i + 18) & 255) >> 0] * x) * y) * w +
             ((p[((i + 43) & 255) >> 0] * u +
               p[((i + 44) & 255) >> 0] * x) * v +
              (p[((i + 60) & 255) >> 0] * u +
               p[((i + 61) & 255) >> 0] * x) * y) * z;
    });

    return (function(x, y, z) {
      return (
        0.0612 * rng(         x +  2.0,          y +  3.0,          z +  5.0) +
        0.0991 * rng(0.5000 * x +  7.0, 0.5000 * y + 11.0, 0.5000 * z + 13.0) +
        0.1604 * rng(0.2500 * x + 17.0, 0.2500 * y + 19.0, 0.2500 * z + 23.0) +
        0.2597 * rng(0.1250 * x + 29.0, 0.1250 * y + 31.0, 0.1250 * z + 37.0) +
        0.4198 * rng(0.0625 * x + 41.0, 0.0625 * y + 43.0, 0.0625 * z + 47.0)
      );
    });
  })();

  window.brush = (function(id, t, x, y, r, h) {
    var du, dv, i, max_u, max_v, min_u, min_v, s, sq, u, v;

    t = +t;
    x = +x;
    y = +y;
    r = +r;
    h = h === undefined || !!h;

    s = (h ? 2.0 : 1.0) * r;

    min_u = constrain(~~Math.floor(x - s), 0, id.width );
    min_v = constrain(~~Math.floor(y - s), 0, id.height);
    max_u = constrain(~~Math.ceil (x + s), 0, id.width );
    max_v = constrain(~~Math.ceil (y + s), 0, id.height);

    for(v = min_v; v < max_v; v++) {
      for(u = min_u; u < max_u; u++) {
        du = (u + 0.5) - x;
        dv = (v + 0.5) - y;
        sq = du * du + dv * dv;
        if(sq >= s * s)
          continue;

        i = ((v * id.width + u) << 2) | 3;
        if(id.data[i] >= 255)
          continue;

        if(h && noise(du, dv, t) >= 255.0 * Math.exp(-sq / (r * r)))
          continue;

        id.data[i] = 255;
      }
    }
  });
})();
