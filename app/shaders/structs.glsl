// represents the current drawing context
// you usually don't need to change anything here
struct Context {
    // screen position, query position
    vec4 position;
    vec2 shape;
    float scale;
    float line_width;
    bool premultiply;
    vec2 blur;
    vec4 source;
    vec2 start_pt;
    vec2 last_pt;
};
