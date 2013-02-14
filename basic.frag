#version 140

// Uniforms
uniform vec4 Color = vec4(1);

// Outputs
out vec4 FragColor;

/*
 * Computes the fragment color.
 */
void main() {
   FragColor = Color;
}
