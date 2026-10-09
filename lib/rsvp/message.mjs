export function invitationMessage(name, seats, url, messageOnly=false) {
 if(messageOnly)return `Hi ${name}! 🥹💗\n\nGot a wish, a memory, or a little advice for us? We’d love to read it! Leave us a little love here:\n${url}\n\nIf the link decides to be stubborn 😂 or you have any questions, just message us here!\n\nWith love,\nClive & Rubie 💕`;

 return `Hi ${name}! 🥹💗\n\nWe’re getting married!!! 👰🏻‍♀️🤵🏻‍♂️✨ And of course, we’d LOVE to celebrate this special day with you on November 29 (SUNDAY), 2026! 🥂 💐\n\nWe’ve saved ${seats} seat${seats === 1 ? '' : 's'} just for you! 🥰 Please RSVP here so we know you’re coming:\n${url}\n\nIf the link decides to be stubborn 😂 or you have any questions, just message us here!\n\nCan’t wait to celebrate with you! 🥹💗\n\nWith love,\nClive & Rubie 💕`;
}
