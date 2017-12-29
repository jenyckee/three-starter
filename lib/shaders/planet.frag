uniform vec3 color1;
uniform vec3 color2;
uniform vec3 color3;
uniform vec3 color4;
uniform vec3 color5;
uniform float alpha;
uniform float lines;
uniform float linewidth;
varying vec2 vUv;

#define M_PI 3.1415926535897932384626433832795

vec2 random2(vec2 st) {
  st = vec2( dot(st,vec2(127.1,311.7)),
            dot(st,vec2(269.5,183.3)) );
  return -1.0 + 2.0*fract(sin(st)*43758.5453123);
}

float noise(vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);

  vec2 u = f*f*(3.0-2.0*f);

  return mix( mix( dot( random2(i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ),
                    dot( random2(i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
              mix( dot( random2(i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ),
                    dot( random2(i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
}

void main() {
  float p = vUv.y * (0.1 * (2.0 * noise(vUv*4.0)+1.0) * sin(vUv.x*12.0*M_PI) + 1.0);
  if (p < .2) {
    gl_FragColor = vec4(color1, alpha);
  } else if (p < .4) {
    gl_FragColor = vec4(color2, alpha);
  } else if (p < .6) {
    gl_FragColor = vec4(color3, alpha);
  } else if (p < .8) {
    gl_FragColor = vec4(color4, alpha);
  } else {
    gl_FragColor = vec4(color5, alpha);
  }
}