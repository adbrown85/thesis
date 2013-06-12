#version 140

// Constants
const int SAMPLES = 100;
const float SAMPLE_RATE = 1.0 / SAMPLES;
const float OPAQUE = 0.95;

// Uniforms
uniform sampler2D InitialColor;
uniform sampler2D FirstBackFaceCoords;
uniform sampler2D SecondBackFaceCoords;
uniform sampler3D FirstVolume;
uniform sampler3D SecondVolume;
uniform vec4 FirstColor = vec4(1);
uniform vec4 SecondColor = vec4(1);

// Inputs
in vec4 Coord0;
in vec4 Coord1;

// Outputs
out vec4 FragColor;

// Prototypes
vec3 findNormal(in sampler3D, in vec4);
float shade(inout vec3 normal);

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
   float t = 0;
   while ((t < tExit) && (FragColor.a < OPAQUE)) {

      vec4 p1 = o1 + (d1 * t);
      float s1 = texture(FirstVolume, p1.stp).r;
      if (s1 > 0) {
         vec3 normal = findNormal(FirstVolume, p1);
         float diffuse = shade(normal);
         vec3 sampleColor = FirstColor.rgb * diffuse * s1;
         FragColor.rgb += sampleColor * (1 - FragColor.a);
         FragColor.a += s1 * (1 - FragColor.a);
      }

      vec4 p2 = o2 + (d2 * t);
      float s2 = texture(SecondVolume, p2.stp).r;
      if (s2 > 0) {
         vec3 normal = findNormal(SecondVolume, p2);
         float diffuse = shade(normal);
         vec3 sampleColor = SecondColor.rgb * diffuse * s2;
         FragColor.rgb += sampleColor * (1 - FragColor.a);
         FragColor.a += s2 * (1 - FragColor.a);
      }

      t += SAMPLE_RATE;
   }
}
