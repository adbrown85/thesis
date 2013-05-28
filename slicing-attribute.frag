#version 140

uniform sampler3D FirstVolumeTexture;
uniform sampler3D SecondVolumeTexture;

in vec4 Coord0;
in float Unit;

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

    if (Unit <= 0.5) {
        FragColor = texture(FirstVolumeTexture, Coord0.stp);
    } else {
        FragColor = texture(SecondVolumeTexture, Coord0.stp);
    }
    FragColor.gba = vec3(FragColor.r);
}
