/** Work around React's dev-only server timing bug without hiding application errors. */
export function installReactTimingGuard(target){
 const original=target.measure;
 if(original.__weddingReactTimingGuard)return;
 function measure(name,options,...rest){
  if(typeof name==='string'&&name.startsWith('\u200b')&&options&&typeof options==='object'&&options.detail?.devtools?.trackGroup==='Server Components ⚛'){
   const start=options.start,end=options.end;
   if(typeof start==='number'&&Number.isFinite(start)&&typeof end==='number'&&Number.isFinite(end)&&(start<0||end<0)){
    options={...options,start:Math.max(0,start),end:Math.max(0,start,end)};
   }
  }
  return original.call(target,name,options,...rest);
 }
 measure.__weddingReactTimingGuard=true;
 target.measure=measure;
}
