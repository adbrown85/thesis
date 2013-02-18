#version 140

// Uniforms
uniform mat4 MVPMatrix = mat4(1.0);

// Inputs
in vec4 MCVertex;
in vec4 TexCoord0;
in vec4 TexCoord1;

// Outputs
out vec4 Coord0;
out vec4 Coord1;

/*
 * Computes position.
 */
void main() {
   gl_Position = MVPMatrix * MCVertex;
   Coord0 = TexCoord0;
   Coord1 = TexCoord1;
}
