const test = require('node:test');
const assert = require('node:assert/strict');
const { normalizeEventInput, parsePagination } = require('./events');

test('normalizeEventInput accepts legacy fields and strict calendar fields', () => {
  const legacy = normalizeEventInput({
    title: ' Sports Day ',
    date: '2026-11-10',
    category: 'Sports',
    description: 'Annual sports event'
  });
  assert.equal(legacy.title, 'Sports Day');
  assert.equal(legacy.date.toISOString().slice(0, 10), '2026-11-10');
  assert.equal(legacy.showOnPublic, true);

  const full = normalizeEventInput({
    title: 'Open Day',
    startDate: '2026-11-10',
    endDate: '2026-11-11',
    category: 'Event',
    startTime: '08:00',
    endTime: '12:00',
    venue: 'Main Ground',
    color: '#123abc',
    recurrenceType: 'none',
    isActive: 'true'
  });
  assert.equal(full.startTime, '08:00');
  assert.equal(full.venue, 'Main Ground');
  assert.equal(full.color, '#123abc');
  assert.equal(full.isActive, true);
});

test('normalizeEventInput rejects invalid values and end dates before start dates', () => {
  const baseEvent = { title: 'Exam', date: '2026-11-10', category: 'Exam' };
  assert.throws(() => normalizeEventInput({ ...baseEvent, title: 'x'.repeat(101) }), /100 characters/);
  assert.throws(() => normalizeEventInput({ ...baseEvent, endDate: '2026-11-09' }), /End date cannot be before start date/);
  assert.throws(() => normalizeEventInput({ ...baseEvent, startTime: '25:00' }), /24-hour HH:MM/);
  assert.throws(() => normalizeEventInput({ ...baseEvent, color: 'red' }), /six-digit hex/);
  assert.throws(() => normalizeEventInput({
    ...baseEvent,
    isRecurring: 'true',
    recurrenceType: 'weekly'
  }), /require a recurrence type and end date/);
  assert.equal(normalizeEventInput({
    ...baseEvent,
    isRecurring: 'true',
    recurrenceType: 'weekly',
    recurrenceEnd: '2026-12-31'
  }).isRecurring, true);
});

test('normalizeEventInput ignores unknown properties and supports clearing end date', () => {
  const event = normalizeEventInput({
    title: 'Exam',
    date: '2026-11-10',
    category: 'Exam',
    isAdmin: true
  });
  assert.equal(Object.hasOwn(event, 'isAdmin'), false);
  assert.equal(normalizeEventInput({ endDate: '' }, { partial: true }).endDate, null);
});

test('parsePagination validates bounds and caps requested page size', () => {
  assert.deepEqual(parsePagination({ page: '2', limit: '500' }), { page: 2, limit: 100, skip: 100 });
  assert.throws(() => parsePagination({ page: '0' }), /positive integer/);
  assert.throws(() => parsePagination({ page: '9007199254740991', limit: '100' }), /out of range/);
});
