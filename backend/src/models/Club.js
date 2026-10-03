const mongoose = require('mongoose');

const ClubSchema = new mongoose.Schema(
  {
    wing: {
      type: String,
      enum: ['primary', 'secondary'],
      required: true,
      index: true
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 60
    },
    description: {
      type: String,
      trim: true,
      maxlength: 200,
      default: ''
    },
    category: {
      type: String,
      enum: ['Academic', 'Sports', 'Arts', 'Service', 'Other'],
      default: 'Other'
    },
    icon: {
      type: String,
      default: '🎯',
      maxlength: 8
    },
    teacher: {
      type: String,
      trim: true,
      maxlength: 60,
      default: ''
    },
    timing: {
      type: String,
      trim: true,
      maxlength: 60,
      default: ''
    },
    venue: {
      type: String,
      trim: true,
      maxlength: 60,
      default: ''
    },
    order: {
      type: Number,
      default: 0,
      index: true
    },
    active: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

ClubSchema.index({ wing: 1, order: 1 });

module.exports = mongoose.model('Club', ClubSchema);
