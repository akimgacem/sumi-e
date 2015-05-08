(function() {
  "use strict";
  var bezier, paint;

  paint = (function() {
    var ceil, exp, floor, noise;

    ceil  = Math.ceil;
    exp   = Math.exp;
    floor = Math.floor;

    noise = window.noise().fractal;

    return function(id, x, y, r, t) {
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

  bezier = (function() {
    var bezier, sqrt;

    sqrt = Math.sqrt;

    bezier = function(
      id,
      t, dt,
      ax, ay, az,
      bx, by, bz,
      cx, cy, cz,
      dx, dy, dz
    ) {
      var ex, ey, ez, fx, fy, fz, gx, gy, gz, hx, hy, hz, ix, iy, iz, jx, jy,
          jz, x, y, z, l;

      /* Split the bezier curve into two bezier curves, using de Casteljau's
       * algorithm. */
      ex = (ax + bx) * 0.5;
      ey = (ay + by) * 0.5;
      ez = (az + bz) * 0.5;
      fx = (bx + cx) * 0.5;
      fy = (by + cy) * 0.5;
      fz = (bz + cz) * 0.5;
      gx = (cx + dx) * 0.5;
      gy = (cy + dy) * 0.5;
      gz = (cz + dz) * 0.5;
      hx = (ex + fx) * 0.5;
      hy = (ey + fy) * 0.5;
      hz = (ez + fz) * 0.5;
      ix = (fx + gx) * 0.5;
      iy = (fy + gy) * 0.5;
      iz = (fz + gz) * 0.5;
      jx = (hx + ix) * 0.5;
      jy = (hy + iy) * 0.5;
      jz = (hz + iz) * 0.5;

      /* Recurse left. */
      x = jx - ax;
      y = jy - ay;
      z = jz - az;
      l = x * x + y * y + z * z;

      if(l <= 1.0) {
        paint(id, ax, ay, az, t);
        t += dt * Math.sqrt(l);
      }

      else {
        t = bezier(id, t, dt, ax, ay, az, ex, ey, ez, hx, hy, hz, jx, jy, jz);
      }

      /* Recurse right. */
      x = dx - jx;
      y = dy - jy;
      z = dz - jz;
      l = x * x + y * y + z * z;

      if(l <= 1.0) {
        paint(id, jx, jy, jz, t);
        t += dt * Math.sqrt(l);
      }

      else {
        t = bezier(id, t, dt, jx, jy, jz, ix, iy, iz, gx, gy, gz, dx, dy, dz);
      }

      return t;
    };

    return bezier;
  })();

  window.paint  = paint;
  window.bezier = bezier;
})();
