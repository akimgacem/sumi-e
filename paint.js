(function() {
  "use strict";
  var noise;

  noise = window.noise().fractal;

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
        if(noise(du, dv, t) >= 255.0 * Math.exp(-(sq / (r * r))))
          continue;

        id.data[((v * id.width + u) << 2) | 3] = 255;
      }
    }
  };
})();
