export function invitationMessage(name, seats, url) {
 return `Hi ${name}!\n\nWe'd love to celebrate our wedding with you on November 29, 2026.\nWe've reserved ${seats} seat${seats === 1 ? '' : 's'} for your invitation.\nPlease RSVP here:\n${url}\n\nIf the link won’t open or you have any questions, just message us!\n\nWith love,\nClive & Rubie`;
}
