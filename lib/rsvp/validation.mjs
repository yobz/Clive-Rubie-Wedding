export function validateResponse(input, seats) {
 if (!input || !['attending','declining'].includes(input.attendance)) throw new Error('Please choose attending or declining.');
 if (typeof input.additionalNames !== 'string' || input.additionalNames.length > 2000 || typeof input.message !== 'string' || input.message.length > 2000) throw new Error('Please keep names and your message within 2,000 characters each.');
 const names = input.attendance === 'declining' ? [] : input.additionalNames.split(',').map(n => n.trim()).filter(Boolean);
 if (names.some(n => /\p{N}/u.test(n))) throw new Error('Please enter guest names, not numbers. Example: Akali, Evelynn, Kai’Sa.');
 if (names.some(n => !/\p{L}/u.test(n))) throw new Error('Please enter a name for each additional guest.');
 if (names.some(n => n.length < 2 || n.length > 100 || /[\x00-\x1f<>]/.test(n))) throw new Error('Enter each additional guest’s full name, separated by commas (2-100 characters per name).');
 if (new Set(names.map(n => n.toLocaleLowerCase())).size !== names.length) throw new Error('Please list each additional guest only once.');
 if (input.attendance === 'attending' && names.length + 1 > seats) throw new Error(`Your invitation reserves ${seats} seat${seats === 1 ? '' : 's'}, including the main guest. Please remove additional names.`);
 return { attendance: input.attendance, names, message: input.message.trim() };
}
