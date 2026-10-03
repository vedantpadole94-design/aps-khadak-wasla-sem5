const DEFAULT_CATEGORIES = [
  { name: 'Holiday', emoji: '🎉', color: '#c8102e', order: 0 },
  { name: 'Exam', emoji: '📚', color: '#1e40af', order: 1 },
  { name: 'Sports', emoji: '🏆', color: '#15803d', order: 2 },
  { name: 'Cultural', emoji: '🎭', color: '#d4af37', order: 3 },
  { name: 'Event', emoji: '📅', color: '#7c3aed', order: 4 },
  { name: 'Academic', emoji: '🎓', color: '#4338ca', order: 5 },
  { name: 'PTM', emoji: '👨‍👩‍👧', color: '#d97706', order: 6 }
];

const seedDefaultCategories = async (Category) => {
  const marker = '__aps_calendar_defaults_seeded__';
  if (await Category.exists({ name: marker })) return;
  await Category.bulkWrite(DEFAULT_CATEGORIES.map((category) => ({
    updateOne: {
      filter: { name: category.name },
      update: { $setOnInsert: category },
      upsert: true
    }
  })).concat([{
    updateOne: {
      filter: { name: marker },
      update: { $setOnInsert: { name: marker, color: '#000000', isSystem: true } },
      upsert: true
    }
  }]));
};

module.exports = { DEFAULT_CATEGORIES, seedDefaultCategories };
