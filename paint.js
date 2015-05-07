(function() {
  "use strict";
  var ceil, exp, floor, noise;

  ceil  = Math.ceil;
  exp   = Math.exp;
  floor = Math.floor;

  noise = window.noise().fractal;

  window.paint = function(id, x, y, r, t) {
    var du, dv, k, max_u, max_v, min_u, min_v, sq, u, v;

    min_u = floor(x - 2.0 * r);
    min_v = floor(y - 2.0 * r);
    max_u = ceil (x + 2.0 * r);
    max_v = ceil (y + 2.0 * r);

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

    k = -1.0 / (r * r);

    for(v = min_v; v < max_v; v++) {
      dv = (v + 0.5) - y;

      for(u = min_u; u < max_u; u++) {
        du = (u + 0.5) - x;
        sq = k * (du * du + dv * dv);
        if(sq <= -4.0)
          continue;
        if(noise(du, dv, t) >= 255.0 * exp(sq))
          continue;

        id.data[((v * id.width + u) << 2) | 3] = 255;
      }
    }
  };
})();
