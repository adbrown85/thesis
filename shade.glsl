#version 140

const vec3 LIGHT_DIRECTION = normalize(vec3(-1, -1, -1));

float shade(inout vec3 normal) {
    return max(0.0, dot(normal, LIGHT_DIRECTION));
}
