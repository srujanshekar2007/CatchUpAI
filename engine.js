const uid = () => crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export function parseDate(s){
  if(!s)return null;
  let d=new Date(s); if(!Number.isNaN(d.getTime())) return d;
  const m=s.match(/(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})/); if(m){let y=+m[3]; if(y<100)y+=2000; return new Date(y,+m[1]-1,+m[2]);}
  return null;
}
export function normalize(text,name='Conversation',source='paste'){
  const lines=text.replace(/\r/g,'').split('\n').filter(x=>x.trim());
  const conversationId=uid();
  return {id:conversationId,name,source,importedAt:new Date().toISOString(),raw:text,messages:lines.map((line,i)=>{
    let date=null,sender=null,body=line;
    let m=line.match(/^\[([^\]]+)\]\s*([^:]{1,80}):\s*(.*)$/)||line.match(/^([^\n]{1,60})\s-\s(\d{1,2}[:.]\d{2}(?:\s?[APap][Mm])?)\s-\s([^:]{1,80}):\s*(.*)$/);
    if(m){ if(m.length===4){date=parseDate(m[1]);sender=m[2].trim();body=m[3];} else {date=parseDate(`${m[1]} ${m[2]}`);sender=m[3].trim();body=m[4];} }
    return {id:`${conversationId}-${i}`,conversationId,conversationName:name,raw:line,sender,timestamp:date?.toISOString()||null,text:body.trim(),index:i};
  })};
}
export function extractDate(t,stamp){
  let explicit=t.match(/\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}(?:,?\s+\d{4})?/i);
  if(explicit){const d=new Date(explicit[0]);if(!Number.isNaN(d.getTime()))return d.toISOString().slice(0,10);}
  const numeric=t.match(/\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b/);if(numeric){const d=parseDate(numeric[0]);if(d)return d.toISOString().slice(0,10);}
  if(stamp){const base=new Date(stamp), low=t.toLowerCase(); if(/\btoday\b/.test(low))return base.toISOString().slice(0,10);if(/\btomorrow\b/.test(low)){base.setDate(base.getDate()+1);return base.toISOString().slice(0,10);}const weekdays=['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];const day=weekdays.findIndex(x=>low.includes(x));if(day>=0){let delta=(day-base.getDay()+7)%7;if(delta===0)delta=7;base.setDate(base.getDate()+delta);return base.toISOString().slice(0,10);}}
  return null;
}
export function extractTime(t){const m=t.match(/\b(1[0-2]|0?[1-9])(?::([0-5]\d))?\s?(AM|PM)\b/i);return m?`${m[1]}${m[2]?':'+m[2]:''} ${m[3].toUpperCase()}`:null;}
export function inferOwner(t){if(/\bI(?:'ll| will)\b/i.test(t))return 'Speaker (self-reference; confirm identity)';const m=t.match(/\b(?:you|@you)\b/i);return m?'You (addressed directly)':'Unclear';}
export function meetingKey(t){const m=t.match(/\b([\w-]+\s+(?:review|meeting|call|interview|appointment))\b/i);return m?m[1].toLowerCase().replace(/\s+/g,' '):'';}
