const test = require('node:test');
const assert = require('node:assert/strict');
const { expandRecurringEvents } = require('./expandRecurringEvents');

test('expands recurring events only within the requested range', () => {
  const event = {
    _id: 'event-1',
    title: 'Assembly',
    date: new Date('2026-10-01T00:00:00Z'),
    recurrenceEnd: new Date('2026-10-31T00:00:00Z'),
    recurrenceType: 'weekly',
    isRecurring: true
  };
  const occurrences = expandRecurringEvents([event], {
    from: '2026-10-10T00:00:00Z',
    to: '2026-10-31T00:00:00Z'
  });
  assert.deepEqual(occurrences.map((item) => item.date.toISOString().slice(0, 10)), [
    '2026-10-15', '2026-10-22', '2026-10-29'
  ]);
  assert.notEqual(occurrences[0].occurrenceId, occurrences[1].occurrenceId);
});

test('monthly recurrence clamps end-of-month dates and preserves event duration', () => {
  const event = {
    _id: 'event-2',
    date: new Date('2026-01-31T00:00:00Z'),
    endDate: new Date('2026-02-02T00:00:00Z'),
    recurrenceEnd: new Date('2026-04-30T00:00:00Z'),
    recurrenceType: 'monthly',
    isRecurring: true
  };
  const occurrences = expandRecurringEvents([event]);
  assert.deepEqual(occurrences.map((item) => item.date.toISOString().slice(0, 10)), [
    '2026-01-31', '2026-02-28', '2026-03-31', '2026-04-30'
  ]);
  assert.equal(occurrences[0].endDate - occurrences[0].date, 2 * 86400000);
});
