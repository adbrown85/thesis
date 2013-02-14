#version 140

// Uniforms
uniform sampler2D Texture;

// Inputs
in vec4 Coord0;

// Outputs
out vec4 FragColor;

/*
 * Computes the fragment color.
 */
void main() {
   FragColor = texture(Texture, Coord0.st);
}
