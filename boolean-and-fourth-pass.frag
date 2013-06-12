#version 140

// Constants
const int SAMPLES = 100;
const float SAMPLE_RATE = 1.0 / SAMPLES;
const float TOLERANCE = 1e-2;
const float OPAQUE = 0.95;

// Uniforms
uniform sampler2D InitialColor;
uniform sampler2D BackFaceCoords;
uniform sampler3D Volume;
uniform vec4 Color = vec4(1);

// Inputs
in vec4 Coord0;

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

   // Compute ray
   vec4 origin = Coord0;
   vec4 exit = texelFetch(BackFaceCoords, ivec2(gl_FragCoord.xy), 0);
   vec4 direction = normalize(exit - origin);

   // Compute times
   vec4 times = (exit - origin) / direction;
   float tExit = min(times.x, min(times.y, times.z));

   // Sample until out of volume
   float t = 0;
   while ((t < tExit) && (FragColor.a < OPAQUE)) {
      vec4 pos = origin + (direction * t);
      float sample = texture(Volume, pos.stp).r;
      if (sample > 0) {
         vec3 normal = findNormal(Volume, pos);
         float c = shade(normal);
         vec3 sampleColor = Color.rgb * c * sample;
         FragColor.rgb += sampleColor * (1 - FragColor.a);
         FragColor.a += sample * (1 - FragColor.a);
      }
      t += SAMPLE_RATE;
   }

   // Set depth
   gl_FragDepth = 0.0;
}
