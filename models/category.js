const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  parentId: { type: String }
}, { timestamps: true });

module.exports = new mongoose.model('Category', categorySchema);