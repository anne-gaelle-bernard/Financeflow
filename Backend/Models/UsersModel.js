const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const becrypt = require('bcrypt');

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
}, { timestamps: true });

UserSchema.pre('save', async function() {           
    if (this.isModified('password') || this.isNew) {
            const salt = await becrypt.genSalt(10);
            this.password = await becrypt.hash(this.password, salt);
        };
});

module.exports = mongoose.model('User', UserSchema);