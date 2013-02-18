#version 140

// Uniforms
uniform sampler2D InitialColor;
uniform sampler2D FirstBackFaceCoords;
uniform sampler2D SecondBackFaceCoords;
uniform sampler3D FirstVolume;
uniform sampler3D SecondVolume;
uniform vec4 Color = vec4(1);

// Inputs
in vec4 Coord0;
in vec4 Coord1;

// Outputs
out vec4 FragColor;

/*
 * Computes the fragment color.
 */
void main() {

   // Initialize fragment color to black
   FragColor = texelFetch(InitialColor, ivec2(gl_FragCoord.xy), 0);

   // Compute first ray
   vec4 e1 = texelFetch(FirstBackFaceCoords, ivec2(gl_FragCoord.xy), 0);
   vec4 o1 = Coord0;
   vec4 d1 = normalize(e1 - o1);

   // Compute second ray
   vec4 e2 = texelFetch(SecondBackFaceCoords, ivec2(gl_FragCoord.xy), 0);
   vec4 o2 = Coord1;
   vec4 d2 = normalize(e2 - o2);

   // Compute times
   vec4 times = (e1 - o1) / d1;
   float tExit = min(times.x, min(times.y, times.z));

   // Sample until out of volume
   float t = tExit;
   while (t > 0) {
      vec4 p1 = o1 + (d1 * t);
      vec4 p2 = o2 + (d2 * t);
      float s1 = texture(FirstVolume, p1.stp).r;
      float s2 = texture(SecondVolume, p2.stp).r;
      vec4 c1 = Color * s1;
      vec4 c2 = Color * s2;
      FragColor = mix(FragColor, c1, s1);
      FragColor = mix(FragColor, c2, s2);
      t -= 0.01;
   }
}
