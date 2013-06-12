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

vec3 findNormal(in sampler3D, in vec4);
float shade(inout vec3);

/*
 * Computes the fragment color.
 */
void main() {

   // Initialize fragment color to black
   FragColor = texelFetch(AccumulationTexture, ivec2(gl_FragCoord.xy), 0);
   if (FragColor.a >= 0.95) {
      discard;
   }

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
   float t = 0;
   while ((t < tExit) && (FragColor.a < 0.95)) {

      vec4 p1 = o1 + (d1 * t);
      float s1 = texture(FirstVolumeTexture, p1.stp).r;
      if (s1 > 0) {
         vec3 normal = findNormal(FirstVolumeTexture, p1);
         float c = shade(normal);
         vec3 sampleColor = FirstColor.rgb * c * s1;
         FragColor.rgb += sampleColor * (1 - FragColor.a);
         FragColor.a += s1 * (1 - FragColor.a);
      }

      vec4 p2 = o2 + (d2 * t);
      float s2 = texture(SecondVolumeTexture, p2.stp).r;
      if (s2 > 0) {
         vec3 normal = findNormal(SecondVolumeTexture, p2);
         float c = shade(normal);
         vec3 sampleColor = SecondColor.rgb * c * s2;
         FragColor.rgb += sampleColor * (1 - FragColor.a);
         FragColor.a += s2 * (1 - FragColor.a);
      }

      t += SAMPLE_RATE;
   }
}
