import fs from 'node:fs';
const layouts=JSON.parse(fs.readFileSync('assets/subpages/device-layouts.json','utf8'));
export function deviceScene($,source,asset,root,alt){
 const layout=layouts[source];
 if(!layout||layout.diagram)return null;
 const d=layout.desktop,m=layout.mobile,[iw,ih]=asset.originalSize;
 const left=Math.max(0,d[0]-m[0]+12),bezel=12;
 const phoneX=left+bezel+m[0]-d[0]-12;
 const phoneY=bezel+m[1]-d[1]-18;
 const dw=d[2]+24,dh=d[3]+24,mw=m[2]+24,mh=m[3]+36;
 const width=Math.max(left+dw,phoneX+mw)+16,height=Math.max(dh+110,phoneY+mh)+18;
 const scene=$('<figure class="sb-device-scene"></figure>').attr({style:`aspect-ratio:${width}/${height};--device-unit:${100/width}cqw`,'aria-label':alt+' — 정면 PC·모바일 화면'});
 function screen(rect,label){
  const [x,y,w,h]=rect;
  const view=$('<div class="sb-device-window"></div>').attr('style',`aspect-ratio:${w}/${h}`);
  const picture=$('<picture></picture>').append($('<source type="image/webp">').attr('srcset',root+asset.file.replace(/\.png$/,'.webp')));
  picture.append($('<img class="sb-device-pixels" loading="lazy">').attr({src:root+asset.file,alt:alt+' '+label,width:asset.width,height:asset.height,style:`width:${iw/w*100}%!important;height:${ih/h*100}%!important;left:${-x/w*100}%;top:${-y/h*100}%`}));
  return view.append(picture);
 }
 const pc=$('<div class="sb-device-desktop"></div>').attr('style',`left:${left/width*100}%;width:${dw/width*100}%`);
 pc.append($('<div class="sb-device-desktop-bezel"></div>').append(screen(d,'PC'))).append('<div class="sb-device-chin"></div><div class="sb-device-neck"></div><div class="sb-device-foot"></div>');
 const phone=$('<div class="sb-device-phone"></div>').attr('style',`left:${phoneX/width*100}%;top:${phoneY/height*100}%;width:${mw/width*100}%`);
 phone.append(screen(m,'모바일'));
 scene.append(pc,phone);
 return scene;
}
export const isDeviceDiagram=source=>layouts[source]?.diagram;
