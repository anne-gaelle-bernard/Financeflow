const mongoose = require('mongoose')

const BudgetSchema = new mongoose.Schema({
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  limit: { type: Number, required: true },
  subcategories: [
    {
      subcategoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory' },
      limit: { type: Number }
    }
  ]
})

module.exports = mongoose.model('Budget', BudgetSchema)