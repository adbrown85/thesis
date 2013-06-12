#version 140

uniform sampler3D FirstVolumeTexture;
uniform sampler3D SecondVolumeTexture;

in vec4 Coord0;
in float Unit;

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

    float sample;
    vec3 normal;
    if (Unit <= 0.5) {
        sample = texture(FirstVolumeTexture, Coord0.stp).r;
        normal = findNormal(FirstVolumeTexture, Coord0);
    } else {
        sample = texture(SecondVolumeTexture, Coord0.stp).r;
        normal = findNormal(SecondVolumeTexture, Coord0);
    }

    float diffuse = shade(normal);
    FragColor.rgb = vec3(diffuse);
    FragColor.a = sample;
}
