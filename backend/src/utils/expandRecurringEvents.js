const occurrenceAt = (start, recurrenceType, index) => {
  if (recurrenceType === 'daily' || recurrenceType === 'weekly') {
    const date = new Date(start);
    date.setUTCDate(date.getUTCDate() + index * (recurrenceType === 'weekly' ? 7 : 1));
    return date;
  }
  const year = start.getUTCFullYear() + (recurrenceType === 'yearly' ? index : 0);
  const month = start.getUTCMonth() + (recurrenceType === 'monthly' ? index : 0);
  const firstOfMonth = new Date(Date.UTC(year, month, 1));
  const lastDay = new Date(Date.UTC(firstOfMonth.getUTCFullYear(), firstOfMonth.getUTCMonth() + 1, 0)).getUTCDate();
  firstOfMonth.setUTCDate(Math.min(start.getUTCDate(), lastDay));
  return firstOfMonth;
};

const expandRecurringEvents = (events, { from, to } = {}) => {
  const rangeStart = from ? new Date(from) : null;
  const rangeEnd = to ? new Date(to) : null;
  const expanded = [];

  for (const event of events) {
    const start = new Date(event.date);
    if (!event.isRecurring || !event.recurrenceEnd || event.recurrenceType === 'none') {
      if ((!rangeStart || start >= rangeStart) && (!rangeEnd || start < rangeEnd)) expanded.push(event);
      continue;
    }

    const recurrenceEnd = new Date(event.recurrenceEnd);
    const endOffset = event.endDate
      ? new Date(event.endDate).getTime() - start.getTime()
      : 0;
    let occurrenceCount = 0;
    let occurrence = start;
    while (occurrence <= recurrenceEnd && occurrenceCount < 1830) {
      if ((!rangeStart || occurrence >= rangeStart) && (!rangeEnd || occurrence < rangeEnd)) {
        const copy = { ...event, date: occurrence };
        if (event.endDate) copy.endDate = new Date(occurrence.getTime() + endOffset);
        copy.occurrenceId = `${event._id}_${occurrence.toISOString().slice(0, 10)}`;
        expanded.push(copy);
      }
      occurrenceCount += 1;
      occurrence = occurrenceAt(start, event.recurrenceType, occurrenceCount);
    }
  }

  return expanded.sort((first, second) => new Date(first.date) - new Date(second.date));
};

module.exports = { expandRecurringEvents };
