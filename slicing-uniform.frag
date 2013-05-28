#version 140

uniform sampler3D VolumeTexture;

in vec4 Coord0;

out vec4 FragColor;

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

    FragColor = texture(VolumeTexture, Coord0.stp);
    FragColor.gba = vec3(FragColor.r);
}
