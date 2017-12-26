uniform vec3 color1;
uniform float alpha1;
uniform vec3 color2;
uniform float alpha2;
uniform float lines;
uniform float linewidth;
varying vec2 vUv;

#define M_PI 3.1415926535897932384626433832795

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
  float p = fract(2.0*vUv.y) * (0.2*sin(vUv.x*8.0*M_PI)+1.0);
  if (p < linewidth / 100.0) {
    gl_FragColor = vec4(color1, alpha1);
  } else if (p > linewidth / 100.0) {
    gl_FragColor = vec4(color2, alpha2);
  }
}