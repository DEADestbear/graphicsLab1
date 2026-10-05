precision mediump float;

vec3 red = vec3(1.0, 0.0, 0.0);
vec3 green = vec3(0.0, 1.0, 0.0);
vec4 yellow = vec4(red + green, 1.0);

// A4: ADD CODE HERE

void main()
{
    // A2 & A4: MODIFY BELOW

    gl_FragColor = yellow;
}

