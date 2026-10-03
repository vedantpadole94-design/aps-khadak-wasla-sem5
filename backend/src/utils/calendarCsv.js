const CSV_HEADERS = [
  'title', 'description', 'category', 'startDate', 'endDate', 'startTime',
  'endTime', 'venue', 'color', 'isRecurring', 'recurrenceType', 'recurrenceEnd'
];

const parseCsv = (input) => {
  const rows = [];
  let row = [];
  let value = '';
  let quoted = false;

  for (let index = 0; index < input.length; index += 1) {
    const character = input[index];
    if (character === '"' && quoted && input[index + 1] === '"') {
      value += '"';
      index += 1;
    } else if (character === '"') {
      quoted = !quoted;
    } else if (character === ',' && !quoted) {
      row.push(value);
      value = '';
    } else if ((character === '\n' || character === '\r') && !quoted) {
      if (character === '\r' && input[index + 1] === '\n') index += 1;
      row.push(value);
      if (row.some((cell) => cell.trim())) rows.push(row);
      row = [];
      value = '';
    } else {
      value += character;
    }
  }

  if (quoted) throw new Error('CSV contains an unclosed quoted field');
  row.push(value);
  if (row.some((cell) => cell.trim())) rows.push(row);
  return rows;
};

const parseEventCsv = (input) => {
  const rows = parseCsv(input);
  if (rows.length < 2) throw new Error('CSV must include a header and at least one event');

  const headers = rows[0].map((header) => header.trim());
  if (headers.length !== CSV_HEADERS.length || CSV_HEADERS.some((header, index) => headers[index] !== header)) {
    throw new Error(`CSV headers must be: ${CSV_HEADERS.join(',')}`);
  }

  return rows.slice(1).map((cells, rowIndex) => {
    if (cells.length !== headers.length) {
      throw new Error(`CSV row ${rowIndex + 2} must have ${headers.length} columns`);
    }
    return Object.fromEntries(headers.map((header, index) => [header, cells[index].trim()]));
  });
};

const toCsv = (events) => {
  const escape = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;
  const rows = events.map((event) => [
    event.title,
    event.description,
    event.category,
    event.date?.toISOString().slice(0, 10),
    event.endDate?.toISOString().slice(0, 10),
    event.startTime,
    event.endTime,
    event.venue,
    event.color,
    event.isRecurring,
    event.recurrenceType,
    event.recurrenceEnd?.toISOString().slice(0, 10)
  ].map(escape).join(','));
  return [CSV_HEADERS.join(','), ...rows].join('\r\n');
};

module.exports = { CSV_HEADERS, parseCsv, parseEventCsv, toCsv };
