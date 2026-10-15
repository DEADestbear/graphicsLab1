'use strict';
// HTML5 canvas, WebGL context, and shader filenames
var canvas, gl;
const vs_file = './rotating-shape-vert.glsl';
const fs_file = './rotating-shape-frag.glsl';
const shared_file = '../shared/graphics.js';
// rotation angle, and location in shader

// buffers and attributes
var vertices, indices, colours, vertices_colours;

// C1,C2: MODIFY HERE
var num_vertices = 1000;



// C5: ADD FUNCTION HERE

function squircle(t,n){
   let x = Math.sign(Math.cos(t)) * Math.abs(Math.cos(t))**(2/n);
   let y = Math.sign(Math.sin(t)) * Math.abs(Math.sin(t))**(2/n);
   return [x,y];
}


// intialization --- called once per page load
window.onload = async function()
{
   // --- general setup ---

   // configure button to save the image
   capture_canvas_setup('gl-canvas', 'capture-button', 'capture.png');

   // prepare the GL context
   canvas = document.getElementById('gl-canvas');
   gl = canvas.getContext('webgl');
   
   // global window settings
   gl.viewport(0, 0, canvas.width, canvas.height);
   gl.clearColor(1.0, 1.0, 1.0, 1.0);
   gl.lineWidth(10.0);

   // load the shader source code into JS strings
   const vs_src = await fetch(vs_file).then(out => out.text());
   const fs_src = await fetch(fs_file).then(out => out.text());
   // make the shaders and link them together as a program
   let vs = webgl_make_shader(gl, vs_src, gl.VERTEX_SHADER);
   let fs = webgl_make_shader(gl, fs_src, gl.FRAGMENT_SHADER);
   let program = webgl_make_program(gl, vs, fs);
   gl.useProgram(program);

   // --- geometry and colour data ---

   // data for attributes
   vertices = [];
   colours = [];
   var scale = 0.99;
   // C1, C3, C4, C5: ADD CODE HERE

   

   for (let i = 0; i < num_vertices; i++) {
      let angle = 2* 16 * Math.PI * i / num_vertices; // makes a circle and divides it
      vertices.push([scale*squircle(angle, 4)[0], scale*squircle(angle, 4)[1]]);
      colours.push(rgba_wheel(angle));
      scale -= 0.001; // scale down for spiral effect
   }

   //vertices.push(vertices[0]); // close the loop by duplicating the first vertex
   colours.push([0,0,0,1]) // center vertex colour
   


   // D1 (OPTIONAL): MODIFY FOLLOWING CODE

   // --- geometry setup ---

   // create and fill vertex buffer
   let vertex_buf = gl.createBuffer();
   gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buf);
   gl.bufferData(gl.ARRAY_BUFFER, mat_float_flat(vertices), gl.STATIC_DRAW);

   // connect vertex variable in shader to vertex_buf (the current ARRAY_BUFFER)
   let vertex_loc = gl.getAttribLocation(program, 'vertex');
   gl.vertexAttribPointer(vertex_loc, 2, gl.FLOAT, false, 0, 0);
   gl.enableVertexAttribArray(vertex_loc);

   // --- colour setup ---

   // create and fill vertex colour buffer
   let colour_buf = gl.createBuffer();
   gl.bindBuffer(gl.ARRAY_BUFFER, colour_buf);
   gl.bufferData(gl.ARRAY_BUFFER, mat_float_flat(colours), gl.STATIC_DRAW);

   // connect colour variable in shader to colour_buf (the current ARRAY_BUFFER)
   let colour_loc = gl.getAttribLocation(program, 'colour');
   gl.vertexAttribPointer(colour_loc, 4, gl.FLOAT, false, 0, 0);
   gl.enableVertexAttribArray(colour_loc);

   // start drawing
   render();
};


// --- rendering function --- called once per frame

function render() {

    // clear the canvas
    gl.clear(gl.COLOR_BUFFER_BIT);

    // draw strip including the duplicated last vertex 
    gl.drawArrays(gl.LINE_STRIP, 0, num_vertices);

    // check if screen capture requested
    capture_canvas_check();

   // ask browser to call render() again, after 1/60 second
   window.setTimeout(render, 1000/60);
}

