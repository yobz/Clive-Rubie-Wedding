"use client";
import {useEffect,useRef,useState} from 'react';
import {Bell,MessageSquareText,Users,X} from 'lucide-react';
import {adminRequest,AdminRequestError} from '@/lib/rsvp/admin-request.mjs';
type Notice={key:string;householdId:string;name:string;attendance:string;submittedAt:string;kind:string};
const storageKey='wedding-admin-read-notifications-v1';
export function AdminNotifications({csrf,onReview,onSessionExpired}:{csrf:string;onReview:(view:string,name:string)=>void;onSessionExpired:()=>void}){
 const [notices,setNotices]=useState<Notice[]>([]),[open,setOpen]=useState(false),[error,setError]=useState('');
 const version=useRef(0),root=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  let disposed=false,inFlight=false;
  let legacy:string[]=[];try{const stored=JSON.parse(localStorage.getItem(storageKey)||'[]');if(Array.isArray(stored))legacy=stored.filter(value=>typeof value==='string').slice(-5000);}catch{}
  async function refresh(){if(inFlight||document.visibilityState==='hidden')return;inFlight=true;const revision=version.current;try{
   if(legacy.length){await adminRequest('/api/admin/notifications',{method:'POST',headers:{'Content-Type':'application/json','x-csrf-token':csrf},body:JSON.stringify({keys:legacy})});legacy=[];try{localStorage.removeItem(storageKey);}catch{}}
   const data=await adminRequest('/api/admin/notifications',{cache:'no-store'}) as {notifications:Notice[]};if(!disposed&&revision===version.current){setNotices(data.notifications);setError('');}
  }catch(error){if(!disposed){if(error instanceof AdminRequestError&&error.status===401){setNotices([]);onSessionExpired();}else setError('Notifications could not refresh. We’ll try again shortly.');}}finally{inFlight=false;}}
  void refresh();const timer=setInterval(()=>void refresh(),30000);const focus=()=>void refresh();window.addEventListener('focus',focus);document.addEventListener('visibilitychange',focus);
  const outside=(event:PointerEvent)=>{if(root.current&&!root.current.contains(event.target as Node))setOpen(false);};document.addEventListener('pointerdown',outside);
  return()=>{disposed=true;clearInterval(timer);window.removeEventListener('focus',focus);document.removeEventListener('visibilitychange',focus);document.removeEventListener('pointerdown',outside);};
 },[csrf,onSessionExpired]);
 async function markRead(keys:string[]){version.current++;try{await adminRequest('/api/admin/notifications',{method:'POST',headers:{'Content-Type':'application/json','x-csrf-token':csrf},body:JSON.stringify({keys})});version.current++;setNotices(current=>current.filter(item=>!keys.includes(item.key)));setError('');return true;}catch(error){if(error instanceof AdminRequestError&&error.status===401)onSessionExpired();setError('Read status could not be saved. Please try again.');return false;}}

 const rsvps=notices.filter(item=>item.kind==='rsvp').length,messages=notices.length-rsvps;
 return <div className="admin-notifications" ref={root} onKeyDown={event=>{if(event.key==='Escape')setOpen(false);}}><button className="admin-notification-toggle" aria-label={`Notifications, ${notices.length} unread`} aria-expanded={open} aria-controls="admin-notification-panel" onClick={()=>setOpen(value=>!value)}><Bell size={19}/>{notices.length>0&&<span className="admin-notification-count">{notices.length>99?'99+':notices.length}</span>}</button>{open&&<section id="admin-notification-panel" className="admin-notification-panel" aria-label="Notifications"><div className="admin-notification-heading"><h2>Notifications</h2><button aria-label="Close notifications" onClick={()=>setOpen(false)}><X size={17}/></button></div><p>{rsvps} unread RSVPs · {messages} unread messages</p>{error&&<p role="status">{error}</p>}{notices.length>0?<><button className="admin-notification-read" onClick={()=>void markRead(notices.map(item=>item.key))}>Mark all as read</button><div className="admin-notification-list">{notices.map(item=><button key={item.key} className="admin-notification-item" onClick={async()=>{if(await markRead([item.key])){setOpen(false);onReview(item.kind==='message'?'messages':'guests',item.name);}}}>{item.kind==='message'?<MessageSquareText size={18}/>:<Users size={18}/>}<span><strong>{item.name}</strong><span>{item.kind==='message'?(item.attendance==='declining'?'New private message · Declining':'New guest message'):`RSVP · ${item.attendance==='attending'?'Attending':'Declining'}`}</span><time dateTime={item.submittedAt}>{new Date(item.submittedAt).toLocaleString('en-PH',{timeZone:'Asia/Manila'})}</time></span></button>)}</div></>:<p>You’re all caught up.</p>}</section>}</div>;
}
