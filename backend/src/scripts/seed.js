const { connect } = require('../config/db')
const Category = require('../models/Category')
const Subcategory = require('../models/Subcategory')
const Transaction = require('../models/Transaction')

async function run() {
  await connect()

  const countCat = await Category.countDocuments()
  if (countCat === 0) {
    const cats = await Category.insertMany([
      { name: 'Food', type: 'expense', color: '#E53E3E' },
      { name: 'Transport', type: 'expense', color: '#3182CE' },
      { name: 'Salary', type: 'income', color: '#38A169' }
    ])
    const food = cats.find(c => c.name === 'Food')
    const transport = cats.find(c => c.name === 'Transport')

    await Subcategory.insertMany([
      { name: 'Groceries', categoryId: food._id },
      { name: 'Restaurant', categoryId: food._id },
      { name: 'Gas', categoryId: transport._id },
      { name: 'Public transport', categoryId: transport._id }
    ])

    await Transaction.create({
      title: 'Courses Lidl',
      amount: -45.20,
      location: 'Lidl Lyon 7',
      description: 'Achat hebdomadaire',
      categoryId: food._id
    })
    console.log('Seed inséré: catégories, sous-catégories et une transaction.')
  } else {
    console.log('Seed ignoré: catégories déjà présentes.')
  }
  process.exit(0)
}

run().catch(err => { console.error(err); process.exit(1) })