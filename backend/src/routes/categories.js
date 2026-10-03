const express = require('express');
const mongoose = require('mongoose');
const Category = require('../models/Category');
const Event = require('../models/Event');
const auth = require('../middleware/auth');

const router = express.Router();

const normalizeCategory = (input, { partial = false } = {}) => {
  const body = input || {};
  const category = {};
  if (!partial || body.name !== undefined) {
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    if (!name || name.length > 40) throw new Error('Category name is required and must not exceed 40 characters');
    category.name = name;
  }
  if (!partial || body.emoji !== undefined) {
    const emoji = body.emoji === undefined ? '📅' : body.emoji;
    if (typeof emoji !== 'string' || emoji.length > 8) throw new Error('Emoji must be 8 characters or fewer');
    category.emoji = emoji;
  }
  if (!partial || body.color !== undefined) {
    const color = typeof body.color === 'string' ? body.color : '';
    if (!/^#[0-9a-fA-F]{6}$/.test(color)) throw new Error('Color must be a six-digit hex value');
    category.color = color;
  }
  if (!partial || body.order !== undefined) {
    const order = body.order === undefined ? 0 : Number(body.order);
    if (!Number.isSafeInteger(order) || order < 0) throw new Error('Order must be a non-negative integer');
    category.order = order;
  }
  return category;
};

router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({ isSystem: { $ne: true } }).sort({ order: 1, name: 1 }).lean();
    res.set('Cache-Control', 'public, max-age=300');
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const category = await Category.create(normalizeCategory(req.body));
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    res.status(error.code === 11000 ? 409 : 400).json({
      success: false,
      message: error.code === 11000 ? 'Category name already exists' : error.message
    });
  }
});

router.put('/:id', auth, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: 'Category ID is invalid' });
  try {
    const updates = normalizeCategory(req.body, { partial: true });
    const existing = await Category.findById(req.params.id).select('+isSystem');
    if (!existing) return res.status(404).json({ success: false, message: 'Category not found' });
    if (existing.isSystem) return res.status(403).json({ success: false, message: 'System category cannot be changed' });

    if (updates.name && updates.name !== existing.name) {
      if (await Category.exists({ _id: { $ne: existing._id }, name: updates.name })) {
        return res.status(409).json({ success: false, message: 'Category name already exists' });
      }
      await Event.updateMany({ category: existing.name }, { $set: { category: updates.name } });
    }

    const category = await Category.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    });
    res.json({ success: true, data: category });
  } catch (error) {
    res.status(error.code === 11000 ? 409 : 400).json({
      success: false,
      message: error.code === 11000 ? 'Category name already exists' : error.message
    });
  }
});

router.delete('/:id', auth, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: 'Category ID is invalid' });
  try {
    const category = await Category.findById(req.params.id).select('+isSystem');
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    if (category.isSystem) return res.status(403).json({ success: false, message: 'System category cannot be deleted' });
    if (await Event.exists({ category: category.name })) {
      return res.status(409).json({ success: false, message: 'Move or delete events using this category before deleting it' });
    }
    await category.deleteOne();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
