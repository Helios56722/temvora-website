(() => {
  const canvas=document.getElementById('liquid-background');
  if(!canvas)return;
  const gl=canvas.getContext('webgl',{alpha:false,antialias:false,depth:false,stencil:false,powerPreference:'low-power'});
  if(!gl){canvas.hidden=true;document.documentElement.classList.add('liquid-fallback');return;}
  const vertex=`attribute vec2 aPosition;void main(){gl_Position=vec4(aPosition,0.0,1.0);}`;
  const fragment=`precision mediump float;
    uniform vec2 uResolution;uniform float uTime;
    float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
    float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
    float field(vec2 p,float t){
      vec2 drift=vec2(sin(t*.12),cos(t*.09))*.35;
      float a=noise(p*.62+drift+vec2(0,t*.025));
      float b=noise(p*.95+vec2(4.8,-t*.032));
      vec2 q=p+vec2(a,b)*2.1;
      return noise(q*.8+vec2(t*.016,2.3))*.68+noise(q*1.52+vec2(7.2,-t*.021))*.32;
    }
    vec3 caustic(vec2 p,float t){
      float f=field(p,t);
      float v=abs(sin((f*2.1+p.y*.105)*6.28318));
      return vec3(exp(-v*24.0),exp(-v*7.8),f);
    }
    void main(){
      vec2 uv=gl_FragCoord.xy/uResolution.xy;
      vec2 p=(gl_FragCoord.xy-.5*uResolution.xy)/uResolution.y*5.3;
      p=mat2(.95,-.31,.31,.95)*p;
      vec3 light=caustic(p,uTime);
      float r=caustic(p+vec2(.047,.014),uTime).y;
      float b=caustic(p-vec2(.047,.014),uTime).y;
      vec3 base=mix(vec3(.014,.008,.07),vec3(.024,.016,.105),light.z);
      vec3 tint=vec3(r*.095,light.y*.11,b*.24);
      vec3 pearl=vec3(.48,.42,.67)*(light.x*.2+light.y*.085);
      float edge=.73+.27*smoothstep(.0,.6,abs(uv.x-.5));
      gl_FragColor=vec4(base+(tint+pearl)*edge,1.0);
    }`;
  function shader(type,source){const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){gl.deleteShader(s);return null;}return s;}
  const vs=shader(gl.VERTEX_SHADER,vertex),fs=shader(gl.FRAGMENT_SHADER,fragment);
  if(!vs||!fs){canvas.hidden=true;document.documentElement.classList.add('liquid-fallback');return;}
  const program=gl.createProgram();gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);gl.deleteShader(vs);gl.deleteShader(fs);
  if(!gl.getProgramParameter(program,gl.LINK_STATUS)){canvas.hidden=true;document.documentElement.classList.add('liquid-fallback');return;}
  gl.useProgram(program);const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
  const position=gl.getAttribLocation(program,'aPosition');gl.enableVertexAttribArray(position);gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);
  const resolution=gl.getUniformLocation(program,'uResolution'),time=gl.getUniformLocation(program,'uTime');
  let raf=0,last=0,elapsed=12,drawn=0,lost=false;
  const stopped=()=>document.hidden||document.documentElement.classList.contains('motion-paused')||lost;
  function draw(){gl.uniform2f(resolution,canvas.width,canvas.height);gl.uniform1f(time,elapsed);gl.drawArrays(gl.TRIANGLE_STRIP,0,4);canvas.dataset.frames=String(++drawn);}
  function resize(){const scale=Math.min(1,1000/innerWidth,1000/innerHeight);canvas.width=Math.round(innerWidth*scale);canvas.height=Math.round(innerHeight*scale);gl.viewport(0,0,canvas.width,canvas.height);if(!lost)draw();}
  function tick(now){if(stopped())return;if(!last)last=now;if(now-last>=50){elapsed+=Math.min((now-last)/1000,.1);last=now;draw();}raf=requestAnimationFrame(tick);}
  function sync(){cancelAnimationFrame(raf);last=0;canvas.dataset.motion=stopped()?'paused':'running';if(!stopped())raf=requestAnimationFrame(tick);}
  canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();lost=true;canvas.hidden=true;document.documentElement.classList.add('liquid-fallback');sync();});
  window.addEventListener('temvora:motion',sync);document.addEventListener('visibilitychange',sync);window.addEventListener('resize',resize,{passive:true});
  canvas.dataset.renderer='webgl';resize();sync();
})();