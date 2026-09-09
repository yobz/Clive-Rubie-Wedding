export interface WeddingEvent { title:string;venue:string;address:string;time:string;start:string;end:string;query:string }
export interface RSVPInput {name:string;attendance:'attending'|'declining';dietary:string;song:string;requestId:string}
export const weddingData={date:'2027-02-20T15:00:00+08:00',deadline:'January 20, 2027',hashtag:'#IsabelFoundHerMateo',events:[
{title:'The ceremony',venue:'San Agustin Church',address:'General Luna Street, Intramuros, Manila',time:'3:00 PM',start:'20270220T070000Z',end:'20270220T080000Z',query:'San Agustin Church Intramuros Manila'},
{title:'The celebration',venue:'Casa Manila Patio',address:'Plaza San Luis Complex, Intramuros, Manila',time:'5:00 PM',start:'20270220T090000Z',end:'20270220T140000Z',query:'Casa Manila Patio Intramuros Manila'}] satisfies WeddingEvent[],story:[
{year:'2019',title:'A little serendipity',text:'A shared table, a mutual friend, and a conversation neither of us wanted to end. Our story began over coffee in Manila.'},
{year:'2022',title:'Choosing each other',text:'Through Sunday markets, long drives, and the everyday in between, friendship quietly became our favorite kind of love.'},
{year:'2025',title:'A thousand times, yes',text:'One sunset, one question, and the easiest answer. Now, we begin our next chapter with our favorite people beside us.'}]};
