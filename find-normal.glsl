#version 140

const float PITCH = 0.01;

/**
 * Computes the normal vector at a position in a volume.
 *
 * @param t Texture volume is stored in
 * @param p Position in local coordinates
 * @return Normal at position
 */
vec3 findNormal(in sampler3D t, in vec4 p) {

    // Find gradient by central difference

    float x1 = texture(t, vec3(p.x - PITCH, p.y, p.z)).r;
    float x2 = texture(t, vec3(p.x + PITCH, p.y, p.z)).r;

    float y1 = texture(t, vec3(p.x, p.y - PITCH, p.z)).r;
    float y2 = texture(t, vec3(p.x, p.y + PITCH, p.z)).r;

    float z1 = texture(t, vec3(p.x, p.y, p.z - PITCH)).r;
    float z2 = texture(t, vec3(p.x, p.y, p.z + PITCH)).r;

    vec3 g;
    g.x = x2 - x1;
    g.y = y2 - y1;
    g.z = z2 - z1;

    // Finish
    g *= 0.5;
    return normalize(-g);
}
