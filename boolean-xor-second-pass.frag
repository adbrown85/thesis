#version 140

// Constants
const int SAMPLES = 100;
const float SAMPLE_RATE = 1.0 / SAMPLES;

// Uniforms
uniform sampler2D AccumulationTexture;
uniform sampler2D FirstBackFacesTexture;
uniform sampler2D SecondBackFacesTexture;
uniform sampler3D FirstVolumeTexture;
uniform sampler3D SecondVolumeTexture;
uniform vec4 FirstColor = vec4(1);
uniform vec4 SecondColor = vec4(1);

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
   FragColor = texelFetch(AccumulationTexture, ivec2(gl_FragCoord.xy), 0);

   // Compute first ray
   vec4 e1 = texelFetch(FirstBackFacesTexture, ivec2(gl_FragCoord.xy), 0);
   vec4 o1 = Coord0;
   vec4 d1 = normalize(e1 - o1);

   // Compute second ray
   vec4 e2 = texelFetch(SecondBackFacesTexture, ivec2(gl_FragCoord.xy), 0);
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
      float s1 = texture(FirstVolumeTexture, p1.stp).r;
      float s2 = texture(SecondVolumeTexture, p2.stp).r;
      vec4 c1 = FirstColor * s1;
      vec4 c2 = SecondColor * s2;
      FragColor = mix(FragColor, c1, s1);
      FragColor = mix(FragColor, c2, s2);
      t -= SAMPLE_RATE;
   }
}
