#version 140

// Constants
const int SAMPLES = 100;
const float SAMPLE_RATE = 1.0 / SAMPLES;

// Uniforms
uniform sampler2D InitialColor;
uniform sampler2D BackFaceCoords;
uniform sampler3D Volume;
uniform vec4 Color = vec4(1);

// Inputs
in vec4 Coord0;

// Outputs
out vec4 FragColor;

/*
 * Computes the fragment color.
 */
void main() {

   // Initialize fragment color to that of previous pass
   FragColor = texelFetch(InitialColor, ivec2(gl_FragCoord.xy), 0);

   // Compute ray
   vec4 exit = texelFetch(BackFaceCoords, ivec2(gl_FragCoord.xy), 0);
   vec4 origin = Coord0;
   vec4 direction = normalize(exit - origin);

   // Compute times
   vec4 times = (exit - origin) / direction;
   float tExit = min(times.x, min(times.y, times.z));

   // Sample until out of volume
   float t = tExit;
   while (t > 0) {
      vec4 pos = origin + (direction * t);
      float sample = texture(Volume, pos.stp).r;
      vec4 color = vec4(Color.rgb * sample, 1.0);
      FragColor = mix(FragColor, color, sample);
      t -= SAMPLE_RATE;
   }
}
