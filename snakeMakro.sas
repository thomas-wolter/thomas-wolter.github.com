proc format;                                                                                                                            
value $et                                                                                                                               
'1R'=1                                                                                                                                  
'2L'=2                                                                                                                                  
'2R'=3                                                                                                                                  
'3L'=4                                                                                                                                  
'3R'=5                                                                                                                                  
'4L'=6                                                                                                                                  
'4R'=7                                                                                                                                  
'5L'=8                                                                                                                                  
'5R'=9                                                                                                                                  
'6L'=10                                                                                                                                 
'6R'=11                                                                                                                                 
'7L'=12                                                                                                                                 
'7R'=13                                                                                                                                 
'8L'=14                                                                                                                                 
'8R'=15                                                                                                                                 
'9L'=16                                                                                                                                 
'9R'=17                                                                                                                                 
'10L'=18                                                                                                                                
'10R'=19                                                                                                                                
'11L'=20                                                                                                                                
'11R'=21                                                                                                                                
'12L'=22                                                                                                                                
'12R'=23                                                                                                                                
;                                                                                                                                       
value $s                                                                                                                                
'R1'=1                                                                                                                                  
'R2'=2                                                                                                                                  
'R3'=3                                                                                                                                  
'L1'=3                                                                                                                                  
'L2'=2                                                                                                                                  
'L3'=1                                                                                                                                  
;                                                                                                                                       
Run;                                                                                                                                    

%macro trans(et);
%global snake;                                                                                                                          
data _null_;                                                                                                                            
attrib p length=$4 snake length=$23;                                                                                                    
array s(23) $;                                                                                                                          
do i=1 to 23;s(i)='0';end;                                                                                                              
et=upcase("&et");
i=1;                                                                                                                                    
                                                                                                                                        
do while (scan(et,i,'-') ne '');                                                                                                        
p=scan(et,i);                                                                                                                           
c=input(put(substr(p,1,indexc(p,'RL')),$et.),3.);                                                                                       
DIR=put(substr(p,indexc(p,'RL')),$s.);                                                                                                  
s(c)=dir;                                                                                                                               
i+1;                                                                                                                                    
end;                                                                                                                                    
                                                                                                                                        
do i=1 to 23;                                                                                                                           
snake=compress(snake!!s(i));                                                                                                            
end;                                                                                                                                    
call symput('snake',snake);                                                                                                             
run;                                                                                                                                    
%mend;

%macro snake(navn,kode,str);
data _null_; *Creating an OFF (Object File Format);
  attrib face1-face3 length=$15;
  file "C:\Dokumenter\Stig\Snake\Viewer3D\&navn..txt";
  snake="&kode";
  startsize=&str;
  put 'OFF'; * put writes to the file;
  no_vertices=length(snake)*2+6; *Number of Vertices;
  no_face=4+3*length(snake);
  no_edge=9+5*length(snake);
  put no_vertices no_face no_edge;
  color1='0.72 0.20 0.97'; *RGB colors, two decimals only;
  color2='0.31 0.85 0.75';
  _0x=-startsize;
  _0y=-startsize;
  _0z=-startsize;
  _1x=startsize;
  _1y=-startsize;
  _1z=-startsize;
  _2x=startsize;
  _2y=startsize;
  _2z=-startsize;
  _3x=-startsize;
  _3y=startsize;
  _3z=-startsize;
  _4x=startsize;
  _4y=startsize;
  _4z=startsize;
  _5x=startsize;
  _5y=-startsize;
  _5z=startsize;
  put _0x _0y _0z;* The first 6 vertices are always the same;
  put _1x _1y _1z;
  put _2x _2y _2z;
  put _3x _3y _3z;
  put _4x _4y _4z;
  put _5x _5y _5z;
  do i=1 to length(snake);
    dum0x=_0x;dum0y=_0y;dum0z=_0z;
    dum1x=_1x;dum1y=_1y;dum1z=_1z;
    dum2x=_2x;dum2y=_2y;dum2z=_2z;
    dum3x=_3x;dum3y=_3y;dum3z=_3z;
    dum4x=_4x;dum4y=_4y;dum4z=_4z;
    dum5x=_5x;dum5y=_5y;dum5z=_5z;
    select (substr(snake,i,1)); *The next vertices depend on the twist, ie 0,1,2 or 3;
      when ('0')
        do;
          _0x=dum2x;_0y=dum2y;_0z=dum2z;
          _1x=dum4x;_1y=dum4y;_1z=dum4z;
          _2x=dum5x;_2y=dum5y;_2z=dum5z;
          _3x=dum1x;_3y=dum1y;_3z=dum1z;
          _4x=dum5x+dum1x-dum0x;
          _4y=dum5y+dum1y-dum0y;
          _4z=dum5z+dum1z-dum0z;
          _5x=dum4x+dum1x-dum0x;
          _5y=dum4y+dum1y-dum0y;
          _5z=dum4z+dum1z-dum0z;
        end;
      when ('1')
        do;
          _0x=dum1x;_0y=dum1y;_0z=dum1z;
          _1x=dum2x;_1y=dum2y;_1z=dum2z;
          _2x=dum4x;_2y=dum4y;_2z=dum4z;
          _3x=dum5x;_3y=dum5y;_3z=dum5z;
          _4x=dum4x+dum2x-dum3x;
          _4y=dum4y+dum2y-dum3y;
          _4z=dum4z+dum2z-dum3z;
          _5x=dum2x+dum2x-dum3x;
          _5y=dum2y+dum2y-dum3y;
          _5z=dum2z+dum2z-dum3z;
        end;
      when ('2')
        do;
          _0x=dum5x;_0y=dum5y;_0z=dum5z;
          _1x=dum1x;_1y=dum1y;_1z=dum1z;
          _2x=dum2x;_2y=dum2y;_2z=dum2z;
          _3x=dum4x;_3y=dum4y;_3z=dum4z;
          _5x=dum1x+dum1x-dum0x;
          _5y=dum1y+dum1y-dum0y;
          _5z=dum1z+dum1z-dum0z;
          _4x=dum2x+dum2x-dum3x;
          _4y=dum2y+dum2y-dum3y;
          _4z=dum2z+dum2z-dum3z;
        end;
      when ('3')
        do;
          _0x=dum4x;_0y=dum4y;_0z=dum4z;
          _1x=dum5x;_1y=dum5y;_1z=dum5z;
          _2x=dum1x;_2y=dum1y;_2z=dum1z;
          _3x=dum2x;_3y=dum2y;_3z=dum2z;
          _4x=dum1x+dum1x-dum0x;
          _4y=dum1y+dum1y-dum0y;
          _4z=dum1z+dum1z-dum0z;
          _5x=dum5x+dum1x-dum0x;
          _5y=dum5y+dum1y-dum0y;
          _5z=dum5z+dum1z-dum0z;
        end;
    end;
  put _4x _4y _4z;
  put _5x _5y _5z;
  end;

  index0=0; *These are used to calculate the faces;
  index1=1;
  index2=2;
  index3=3;
  index4=4;
  index5=5;
  index6=6;
  index7=7;
  put '4 0 1 2 3  ' color1;
  put '3 0 1 5  ' color1;
  put '3 2 3 4  ' color1;
  put '4 0 3 4 5  ' color1;
  do i=1 to length(snake);
    dumi0=index0;
    dumi1=index1;
    dumi2=index2;
    dumi3=index3;
    dumi4=index4;
    dumi5=index5;
    dumi6=index6;
    dumi7=index7;
    select (substr(snake,i,1));
      when ('0')
        do;
          index0=dumi2;
          index1=dumi4;
          index2=dumi5;
          index3=dumi1;
          index4=dumi6;
          index5=dumi7;
          index6=4+2*(i+1);
          index7=5+2*(i+1);
        end;
      when ('1')
        do;
          index0=dumi1;
          index1=dumi2;
          index2=dumi4;
          index3=dumi5;
          index4=dumi6;
          index5=dumi7;
          index6=4+2*(i+1);
          index7=5+2*(i+1);
        end;
      when ('2')
        do;
          index0=dumi5;
          index1=dumi1;
          index2=dumi2;
          index3=dumi4;
          index4=dumi6;
          index5=dumi7;
          index6=4+2*(i+1);
          index7=5+2*(i+1);
        end;
      when ('3')
        do;
          index0=dumi4;
          index1=dumi5;
          index2=dumi1;
          index3=dumi2;
          index4=dumi6;
          index5=dumi7;
          index6=4+2*(i+1);
          index7=5+2*(i+1);
        end;
    end;
    *Each part has 3 faces;
    face1=compress(put(3,2.))!!' '!!compress(put(index0,2.))!!' '!!compress(put(index1,2.))!!' '!!compress(put(index5,2.));
    face2=compress(put(3,2.))!!' '!!compress(put(index2,2.))!!' '!!compress(put(index3,2.))!!' '!!compress(put(index4,2.));
    face3=compress(put(4,2.))!!' '!!compress(put(index0,2.))!!' '!!compress(put(index3,2.))!!' '!!compress(put(index4,2.))!!' '!!compress(put(index5,2.));
    put face1 ' ' @;
    if mod(i,2)=0 then put color1;
    else put color2;
    put face2 ' ' @;
    if mod(i,2)=0 then put color1;
    else put ' ' color2;
    put face3 ' ' @;
    if mod(i,2)=0 then put color1;
    else put color2;
  end;
  put;
  put;
  put;
run;

data _null_ ;
  file "C:\Dokumenter\Stig\Snake\Viewer3D\&navn..html";
  put "<html>";
  put "<title>3D Viewer</title>";
  put "<script>window.focus()</script>";
  put "<applet code=Viewer3D.class name=snake width=400 height=400>";
  put "<param name=model value=&navn..txt>";
  put "</applet><br>";
  put "&navn.<br>";
  put "&kode";
  put "</html>";
run;
%mend;
