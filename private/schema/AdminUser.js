const mongoose = require('mongoose');
const AdminUserSchema = new mongoose.Schema({
    email: { type: String, unique: true, lowercase: true },
    password: String,
    username: String,
    phone: String,
    image: String,
    role: String,
    skils: []
});

module.exports = mongoose.model('AdminUser', AdminUserSchema);
