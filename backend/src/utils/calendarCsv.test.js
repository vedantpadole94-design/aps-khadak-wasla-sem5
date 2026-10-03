const test = require('node:test');
const assert = require('node:assert/strict');
const { CSV_HEADERS, parseCsv, parseEventCsv, toCsv } = require('./calendarCsv');

test('parseCsv handles quoted commas, escaped quotes, and line breaks', () => {
  assert.deepEqual(parseCsv('title,description\r\n"Sports Day","Games, food and ""fun"""\r\n'), [
    ['title', 'description'],
    ['Sports Day', 'Games, food and "fun"']
  ]);
});

test('parseEventCsv requires the documented columns and complete rows', () => {
  const data = CSV_HEADERS.join(',') + '\nSports Day,Games,Sports,2026-11-10,,,,,#15803d,false,none,';
  assert.equal(parseEventCsv(data)[0].title, 'Sports Day');
  assert.throws(() => parseEventCsv('title,date\nOnly,2026-11-10'), /CSV headers must be/);
  assert.throws(() => parseEventCsv(`${CSV_HEADERS.join(',')}\nshort,row`), /must have 12 columns/);
});

test('toCsv escapes event content and emits compatible headers', () => {
  const csv = toCsv([{
    title: 'Open Day',
    description: 'Meet, greet and "learn"',
    category: 'Event',
    date: new Date('2026-11-10T00:00:00Z')
  }]);
  assert.match(csv, /^title,description,category,/);
  assert.match(csv, /"Meet, greet and ""learn"""/);
});
