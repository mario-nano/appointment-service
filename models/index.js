const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.appointment = require('./appointment.model')(mongoose);

module.exports = db;
