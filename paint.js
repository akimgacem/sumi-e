(function() {
  "use strict";
  var entropy, noise, fbm;

  entropy = new Uint8Array(256);
  crypto.getRandomValues(entropy);

  noise = function(x, y, z) {
    var u, v, w, i;

    u = Math.floor(x);
    v = Math.floor(y);
    w = Math.floor(z);
    i = u * 17 + v * 43 + w * 73;

    x = x - u;
    x = x * x * (3.0 - 2.0 * x);
    u = 1.0 - x;

    y = y - v;
    y = y * y * (3.0 - 2.0 * y);
    v = 1.0 - y;

    z = z - w;
    z = z * z * (3.0 - 2.0 * z);
    w = 1.0 - z;

    return (((entropy[(i +   0) & 255] * u +
              entropy[(i +  17) & 255] * x) * v +
             (entropy[(i +  43) & 255] * u +
              entropy[(i +  60) & 255] * x) * y) * w +
            ((entropy[(i +  73) & 255] * u +
              entropy[(i +  90) & 255] * x) * v +
             (entropy[(i + 116) & 255] * u +
              entropy[(i + 133) & 255] * x) * y) * z);
  };

  fbm = function(x, y, z) {
    return (
      noise(x          +  2, y          +  3, z          +  5) * 0.06125 +
      noise(x * 0.5000 +  7, y * 0.5000 + 11, z * 0.5000 + 13) * 0.09911 +
      noise(x * 0.2500 + 17, y * 0.2500 + 19, z * 0.2500 + 23) * 0.16036 +
      noise(x * 0.1250 + 29, y * 0.1250 + 31, z * 0.1250 + 37) * 0.25946 +
      noise(x * 0.0625 + 41, y * 0.0625 + 43, z * 0.0625 + 47) * 0.41982
    );
  };

  window.paint = function(id, x, y, r, t) {
    var du, dv, max_u, max_v, min_u, min_v, sq, u, v;

    min_u = Math.floor(x - 2.0 * r);
    min_v = Math.floor(y - 2.0 * r);
    max_u = Math.ceil (x + 2.0 * r);
    max_v = Math.ceil (y + 2.0 * r);

    if(max_u <= 0 ||
       max_v <= 0 ||
       min_u >= id.width ||
       min_v >= id.height)
      return;

    if(min_u < 0)
      min_u = 0;

    if(min_v < 0)
      min_v = 0;

    if(max_u > id.width)
      max_u = id.width;

    if(max_v > id.height)
      max_v = id.height;

    for(v = min_v; v < max_v; v++) {
      for(u = min_u; u < max_u; u++) {
        du = (u + 0.5) - x;
        dv = (v + 0.5) - y;
        sq = du * du + dv * dv;
        if(sq >= 4.0 * r * r)
          continue;
        if(fbm(du, dv, t) >= 255.0 * Math.exp(-(sq / (r * r))))
          continue;

        id.data[((v * id.width + u) << 2) | 3] = 255;
      }
    }
  };
})();
