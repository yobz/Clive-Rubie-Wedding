export function shufflePlaylist(tracks,random=Math.random){
 const shuffled=[...tracks];
 for(let i=shuffled.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[shuffled[i],shuffled[j]]=[shuffled[j],shuffled[i]];}
 return shuffled;
}
