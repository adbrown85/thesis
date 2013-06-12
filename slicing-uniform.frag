#version 140

uniform sampler3D VolumeTexture;

in vec4 Coord0;

out vec4 FragColor;

// Prototypes
vec3 findNormal(in sampler3D, in vec4);
float shade(inout vec3 normal);


void main() {

    float s = Coord0.s;
    if (s < 0 || s > 1) {
        discard;
    }

    float t = Coord0.t;
    if (t < 0 || t > 1) {
        discard;
    }

    float p = Coord0.p;
    if (p < 0 || p > 1) {
        discard;
    }

    float sample = texture(VolumeTexture, Coord0.stp).r;
    vec3 normal = findNormal(VolumeTexture, Coord0);
    float diffuse = shade(normal);
    FragColor.rgb = vec3(diffuse);
    FragColor.a = sample;
}
