float circle(vec2 uv, vec2 origin, float radius)
{
    float d = length(uv - origin) - radius;
    return d;
}

#pragma glslify: export(circle)