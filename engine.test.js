import test from 'node:test';
import assert from 'node:assert/strict';
import { normalize, extractDate, extractTime, inferOwner, meetingKey } from './engine.js';

test('normalizes WhatsApp-style messages with stable source references',()=>{
  const c=normalize('[10/08/2026, 10:30 AM] Alex: Review moved to 3 PM.\nUnstructured continuation','Team export','upload');
  assert.equal(c.messages.length,2);
  assert.equal(c.messages[0].sender,'Alex');
  assert.match(c.messages[0].timestamp,/^2026-/);
  assert.equal(c.messages[0].conversationName,'Team export');
  assert.equal(c.messages[0].conversationId,c.id);
  assert.equal(c.messages[1].sender,null);
  assert.equal(c.messages[1].timestamp,null);
});

test('resolves tomorrow from reliable source timestamp and leaves it unknown otherwise',()=>{
  assert.equal(extractDate('Please send it tomorrow','2026-10-08T09:00:00.000Z'),'2026-10-09');
  assert.equal(extractDate('Please send it tomorrow',null),null);
});

test('resolves weekdays relative to source timestamp without inventing event time',()=>{
  assert.equal(extractDate('Review on Friday','2026-10-08T09:00:00.000Z'),'2026-10-09');
  assert.equal(extractTime('Review on Friday'),null);
  assert.equal(extractTime('Review at 3:30 PM'),'3:30 PM');
});

test('flags uncertain ownership and identifies event wording',()=>{
  assert.equal(inferOwner('Can somebody take this?'),'Unclear');
  assert.equal(inferOwner('I will send the draft'),'Speaker (self-reference; confirm identity)');
  assert.equal(inferOwner('@You, can you reply?'),'You (addressed directly)');
  assert.equal(meetingKey('Confirmed, Atlas review is now Thursday at 3 PM.'),'atlas review');
  assert.equal(meetingKey('Casual chat'),'');
});
