const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    color: {
        type: String,
        default: '#000000'
    }
}, { timestamps: true });

module.exports = mongoose.model('Category', CategorySchema);
