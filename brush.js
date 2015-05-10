/* global window */

(function() {
  "use strict";
  var ceil, constrain, exp, floor;

  floor  = window.Math.floor;
  ceil   = window.Math.ceil;
  exp    = window.Math.exp;

  constrain = (function(t, min, max) {
    return (t > min ? (t < max ? t : max) : min);
  });

  window.brush = function(id) {
    var f;

    f = (function() {
      var data, f;

      data = new Uint8Array(256);
      window.crypto.getRandomValues(data);

      f = (function(x, y, z) {
        var i, u, v, w;

        u = floor(x);
        v = floor(y);
        w = floor(z);
        i = ~~floor(u + v * 17.0 + w * 43.0);

        x = x - u;
        x = x * x * (3.0 - 2.0 * x);
        u = 1.0 - x;

        y = y - v;
        y = y * y * (3.0 - 2.0 * y);
        v = 1.0 - y;

        z = z - w;
        z = z * z * (3.0 - 2.0 * z);
        w = 1.0 - z;

        return ((data[((i +  0) & 255) >> 0] * u +
                 data[((i +  1) & 255) >> 0] * x) * v +
                (data[((i + 17) & 255) >> 0] * u +
                 data[((i + 18) & 255) >> 0] * x) * y) * w +
               ((data[((i + 43) & 255) >> 0] * u +
                 data[((i + 44) & 255) >> 0] * x) * v +
                (data[((i + 60) & 255) >> 0] * u +
                 data[((i + 61) & 255) >> 0] * x) * y) * z;
      });

      return (function(x, y, z) {
        return (
          0.0612 * f(         x +  2.0,          y +  3.0,          z +  5.0) +
          0.0991 * f(0.5000 * x +  7.0, 0.5000 * y + 11.0, 0.5000 * z + 13.0) +
          0.1604 * f(0.2500 * x + 17.0, 0.2500 * y + 19.0, 0.2500 * z + 23.0) +
          0.2597 * f(0.1250 * x + 29.0, 0.1250 * y + 31.0, 0.1250 * z + 37.0) +
          0.4198 * f(0.0625 * x + 41.0, 0.0625 * y + 43.0, 0.0625 * z + 47.0)
        );
      });
    })();

    return (function(t, x, y, r) {
      var du, dv, i, max_u, max_v, min_u, min_v, sq, u, v;

      t = +t;
      x = +x;
      y = +y;
      r = +r;

      min_u = constrain(~~floor(x - 2.0 * r), 0, id.width );
      min_v = constrain(~~floor(y - 2.0 * r), 0, id.height);
      max_u = constrain(~~ ceil(x + 2.0 * r), 0, id.width );
      max_v = constrain(~~ ceil(y + 2.0 * r), 0, id.height);

      for(v = min_v; v < max_v; v++) {
        for(u = min_u; u < max_u; u++) {
          du = (u + 0.5) - x;
          dv = (v + 0.5) - y;
          sq = du * du + dv * dv;
          if(sq >= 4.0 * r * f)
            continue;

          i = ((v * id.width + u) << 2) | 3;
          if(id.data[i] >= 255)
            continue;

          if(f(du, dv, t) >= 255.0 * exp(-sq / (r * r)))
            continue;

          id.data[i] = 255;
        }
      }
    });
  };
})();
