'use client';
import {useEffect,useRef,useState} from 'react';
import {Music2,VolumeX} from 'lucide-react';
import {fadeVolume} from '@/lib/music-volume.mjs';
export const weddingPlaylist = [
 'panalangin', 'this-love', 'dilaw', 'palagi', 'forevermore',
 'sayo', 'saksi-ang-langit', 'enchanted', 'closer',
].map(song => `/invitation/music/${song}.mp3`);
export function BackgroundMusic(){
 const [volume,setVolume]=useState(25);
 const volumeLevel=useRef(.25);
 const track=useRef(0);
 const audio=useRef<HTMLAudioElement>(null);
 const fade=useRef<number|null>(null);
 const audioGraph=useRef<{context:AudioContext;gain:GainNode;source:MediaElementAudioSourceNode}|null>(null);
 function setLevel(level:number){
  const graph=audioGraph.current;
  if(graph){graph.gain.gain.setValueAtTime(level,graph.context.currentTime);}
  else if(audio.current)audio.current.volume=level;
 }
 function prepareAudio(){
  const player=audio.current;if(!player)return;
  if(!audioGraph.current){
   const Context=window.AudioContext||(window as Window&{webkitAudioContext?:typeof AudioContext}).webkitAudioContext;
   if(Context){
    const context=new Context();
    const gain=context.createGain();
    gain.gain.value=0;
    const source=context.createMediaElementSource(player);
    source.connect(gain);gain.connect(context.destination);
    audioGraph.current={context,gain,source};
    player.volume=1;
   }else{
    player.volume=volumeLevel.current;
    if(Math.abs(player.volume-volumeLevel.current)>.01)throw new Error('Volume control unavailable');
   }
  }
  // Resume inside the tap handler so iOS grants audio activation.
  const context=audioGraph.current?.context;
  return context?context.resume():Promise.resolve();
 }
 const revealed=useRef(false);
 const [playing,setPlaying]=useState(false);
 const [failed,setFailed]=useState(false);
 function stopFade(){if(fade.current!==null){cancelAnimationFrame(fade.current);fade.current=null;}}
 function fadeIn(){
  const player=audio.current;if(!player||player.paused)return;
  stopFade();const start=performance.now();
  function step(now:number){if(!player||player.paused)return;setLevel(fadeVolume(now-start) / .3 * volumeLevel.current);if(now-start<1200)fade.current=requestAnimationFrame(step);else fade.current=null;}
  fade.current=requestAnimationFrame(step);
 }
 useEffect(()=>{
  const player=audio.current;if(!player)return;
  player.volume=0;
  const begin=()=>{
   // Invoked synchronously from the seal's click, preserving user activation.
   let resumed:Promise<void>|undefined;
   try{resumed=prepareAudio();setLevel(0);}catch{setFailed(true);return;}
   const started=player.play();
   void Promise.all([resumed,started]).then(()=>{setFailed(false);if(revealed.current)fadeIn();}).catch(()=>{setFailed(true);});
  };
  const complete=()=>{revealed.current=true;fadeIn();};
  window.addEventListener('wedding:open-start',begin);
  window.addEventListener('wedding:open-complete',complete);
  return()=>{window.removeEventListener('wedding:open-start',begin);window.removeEventListener('wedding:open-complete',complete);stopFade();player.pause();};
 // The source is stable; event handlers operate on refs rather than captured UI state.
 // eslint-disable-next-line react-hooks/exhaustive-deps
 },[]);
 function nextTrack(){
  const player=audio.current;if(!player)return;
  stopFade();
  track.current=(track.current+1)%weddingPlaylist.length;
  player.src=weddingPlaylist[track.current];
  setLevel(revealed.current ? volumeLevel.current : 0);
  void player.play().then(()=>setFailed(false)).catch(()=>{setPlaying(false);setFailed(true);});
 }
 async function toggle(){const player=audio.current;if(!player)return;stopFade();if(!player.paused){player.pause();return;}try{const resumed=prepareAudio();setLevel(volumeLevel.current);await Promise.all([resumed,player.play()]);setFailed(false);}catch{setFailed(true);}}
 return <div className="background-music"><audio ref={audio} src={weddingPlaylist[0]} preload="metadata" onEnded={nextTrack} onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)} onError={()=>{setPlaying(false);setFailed(true);}}/><button type="button" onClick={toggle} aria-label={playing?'Pause background music':'Play background music'} aria-pressed={playing}>{playing?<VolumeX size={18}/>:<Music2 size={18}/>}<span>{playing?'Music on':'Play music'}</span></button><label className="music-volume">Volume <input aria-label="Music volume" type="range" min="0" max="100" value={volume} onChange={event=>{const level=Number(event.target.value);setVolume(level);volumeLevel.current=level/100;stopFade();setLevel(volumeLevel.current);}}/><output>{volume}%</output></label>{failed&&<p role="status">Music could not play. Tap to retry.</p>}</div>;
}
