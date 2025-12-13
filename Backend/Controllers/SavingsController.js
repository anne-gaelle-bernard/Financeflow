const SavingsModel = require('../Models/SavingsModel')

// Get all savings for a user
exports.getSavingsByUser = async (req, res) => {
  try {
    const { userId } = req.params
    const savings = await SavingsModel.find({ userId }).sort({ date: -1 })
    res.json({ success: true, data: savings })
  } catch (error) {
    console.error('❌ Error fetching savings:', error)
    res.status(500).json({ success: false, error: error.message })
  }
}

// Get total savings for a user
exports.getTotalSavings = async (req, res) => {
  try {
    const { userId } = req.params
    const savings = await SavingsModel.find({ userId })
    const total = savings.reduce((sum, s) => sum + s.amount, 0)
    res.json({ success: true, data: { total, count: savings.length } })
  } catch (error) {
    console.error('❌ Error calculating total savings:', error)
    res.status(500).json({ success: false, error: error.message })
  }
}

// Create new savings entry
exports.createSavings = async (req, res) => {
  try {
    const { userId, amount, description, date, goal } = req.body
    
    if (!userId || !amount) {
      return res.status(400).json({ 
        success: false, 
        error: 'User ID and amount are required' 
      })
    }

    const newSavings = new SavingsModel({
      userId,
      amount: Number(amount),
      description: description || '',
      date: date || Date.now(),
      goal: goal || ''
    })

    await newSavings.save()
    res.status(201).json({ 
      success: true, 
      data: newSavings,
      message: 'Savings entry created successfully' 
    })
  } catch (error) {
    console.error('❌ Error creating savings:', error)
    res.status(500).json({ success: false, error: error.message })
  }
}

// Update savings entry
exports.updateSavings = async (req, res) => {
  try {
    const { id } = req.params
    const { amount, description, date, goal } = req.body

    const updated = await SavingsModel.findByIdAndUpdate(
      id,
      { 
        amount: Number(amount), 
        description, 
        date,
        goal 
      },
      { new: true }
    )

    if (!updated) {
      return res.status(404).json({ 
        success: false, 
        error: 'Savings entry not found' 
      })
    }

    res.json({ 
      success: true, 
      data: updated,
      message: 'Savings entry updated successfully' 
    })
  } catch (error) {
    console.error('❌ Error updating savings:', error)
    res.status(500).json({ success: false, error: error.message })
  }
}

// Delete savings entry
exports.deleteSavings = async (req, res) => {
  try {
    const { id } = req.params
    const deleted = await SavingsModel.findByIdAndDelete(id)

    if (!deleted) {
      return res.status(404).json({ 
        success: false, 
        error: 'Savings entry not found' 
      })
    }

    res.json({ 
      success: true, 
      message: 'Savings entry deleted successfully' 
    })
  } catch (error) {
    console.error('❌ Error deleting savings:', error)
    res.status(500).json({ success: false, error: error.message })
  }
}
