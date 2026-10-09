export function validateResponse(input, seats, messageOnly=false) {
 if(messageOnly){
  if(typeof input?.message!=='string'||!input.message.trim()||input.message.length>2000)throw new Error('Please write a message of up to 2,000 characters.');
  return {attendance:null,names:[],message:input.message.trim()};
 }
 if (!input || !['attending','declining'].includes(input.attendance)) throw new Error('Please choose attending or declining.');
 if (typeof input.additionalNames !== 'string' || input.additionalNames.length > 2000 || typeof input.message !== 'string' || input.message.length > 2000) throw new Error('Please keep names and your message within 2,000 characters each.');
 const rawNames=input.additionalNames.trim();
 const names = input.attendance === 'declining' || !rawNames ? [] : rawNames.split(',').map(n => n.normalize('NFC').trim().replace(/\s+/gu,' '));
 if(names.some(n=>!n))throw new Error('There is a blank guest name between commas. Please enter every guest name or remove the extra comma.');
 if (names.some(n => /\p{N}/u.test(n))) throw new Error('Please enter guest names, not numbers. Example: Akali, Evelynn, Kai’Sa.');
 if (names.some(n => !/\p{L}/u.test(n))) throw new Error('Please enter a name for each additional guest.');
 if (names.some(n => (n.match(/\p{L}/gu)||[]).length < 3 || n.length > 100)) throw new Error('Please enter each guest’s full name with at least 3 letters (up to 100 characters). Separate guests with commas.');
 if(names.some(n=>!/^\p{L}[\p{L}\p{M} .’'\-]*[\p{L}\p{M}.]$/u.test(n)||/[.’'\-]{2,}/u.test(n)))throw new Error('Please use names only. Letters, spaces, apostrophes, hyphens and initials are welcome; symbols and emojis are not.');
 if(names.some(n=>/^(none|unknown|guest|tbd|test|null|undefined)$/iu.test(n)))throw new Error('Please enter the actual guest name. Leave the entire box blank if attending alone.');
 if (new Set(names.map(n => n.toLocaleLowerCase())).size !== names.length) throw new Error('Please list each additional guest only once.');
 if (input.attendance === 'attending' && names.length + 1 > seats) throw new Error(`Your invitation reserves ${seats} seat${seats === 1 ? '' : 's'}, including the main guest. Please remove additional names.`);
 return { attendance: input.attendance, names, message: input.message.trim() };
}
