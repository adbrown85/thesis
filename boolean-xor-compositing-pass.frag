#version 140

// Constants
const float TOLERANCE = 1.0e-6;

// Uniforms
uniform sampler2D AccumulationTexture;

// Outputs
out vec4 FragColor;

/*
 * Color the fragment either the color of the first or second pass.
 */
void main() {
    ivec2 c = ivec2(gl_FragCoord.xy);
    vec4 sample = texelFetch(AccumulationTexture, c, 0);
    FragColor = sample;
}
