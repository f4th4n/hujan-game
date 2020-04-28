// http://www.cocos2d-iphone.org

#ifdef GL_ES
precision lowp float;
#endif

varying vec2 v_texCoord;

vec4 getColorByCoord(int y){
  if (y < 5){
    if (y == 0){
      return vec4(1,0,0,1);
    } else if (y == 1){
      return vec4(0,1,0,1);
    } else if (y == 2){
      return vec4(0,0,1,1);
    } else if (y == 3){
      return vec4(0,1,1,1);
    } else{
      return vec4(1,0,1,1);
    }
  } else {
    if (y == 5){
      return vec4(1,1,0,1);
    } else if (y == 6){
      return vec4(1,1,1,1);
    } else if (y == 7){
      return vec4(1,0.5,0,1);
    } else if (y == 8){
      return vec4(1,0.5,0.5,1);
    } else {
      return vec4(0.5,0.5,1,1);
    }
  }
}

void main(void) {

  float alpha = texture2D(CC_Texture0, vec2(v_texCoord.x, v_texCoord.y)).a;
  int y = int( mod(gl_FragCoord.y / 10.0, 10.0 ) );
  //gl_FragColor = getColorByCoord(y) * texture2D(CC_Texture0, v_texCoord);
  gl_FragColor = getColorByCoord(y) * alpha;
}